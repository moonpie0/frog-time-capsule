import tempfile
import unittest
from pathlib import Path
from PIL import Image
from resource_catalog import crop_frame, verify_catalog, render_catalog
from capsule import digest


class ResourceCatalogTests(unittest.TestCase):
    def test_crop_preserves_alpha_and_original_offset(self):
        image = Image.new("RGBA", (6, 5), (20, 30, 40, 128))
        frame = dict(x=1, y=1, w=3, h=2, offX=2, offY=3, sourceW=7, sourceH=7)
        output = crop_frame(image, frame)
        self.assertEqual(output.getpixel((2, 3)), (20, 30, 40, 128))
        self.assertEqual(output.getpixel((0, 0)), (0, 0, 0, 0))
        self.assertEqual(output.size, (7, 7))
        with self.assertRaises(ValueError):
            crop_frame(image, {**frame, "x": 5})
        with self.assertRaises(ValueError):
            crop_frame(image, {**frame, "offY": 6})

    def test_integrity_detects_corruption_and_unregistered_files(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            path = root / "media/resource-catalog/raw/test.png"
            path.parent.mkdir(parents=True)
            path.write_bytes(b"original")
            catalog = dict(file_list=[dict(path=path.relative_to(root).as_posix(), file_size=8, sha256=digest(path))])
            self.assertEqual(verify_catalog(root, catalog)["passed"], 1)
            path.write_bytes(b"modified")
            (path.parent / "extra.png").write_bytes(b"extra")
            result = verify_catalog(root, catalog)
            self.assertEqual(result["failed"], 1)
            self.assertEqual(len(result["untracked_files"]), 1)

    def test_embedded_catalog_cannot_inject_script(self):
        result = render_catalog(dict(items=[], notes="</script><script>alert(1)</script>"), {})
        self.assertNotIn("</script><script>alert", result)
        self.assertIn("\\u003c/script\\u003e", result)


if __name__ == "__main__":
    unittest.main()
