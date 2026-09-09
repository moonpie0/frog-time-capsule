import base64
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from tumbler_viewer import load_tumbler_assets


class TumblerAssetsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / "parsed").mkdir()
        (self.root / "media/tumbler").mkdir(parents=True)
        self.data = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==")
        self.items = []
        for group, count in {"base": 12, "mask": 12, "eye": 23, "adorn": 8, "down": 2, "mid": 1}.items():
            for number in range(1, count + 1):
                key = f"bdw_{number}_{group}" if group in ("base", "mask") else f"bdw_{group}_{number}"
                path = "media/tumbler/" + key + ".png"
                (self.root / path).write_bytes(self.data)
                self.items.append(dict(id=key, group=group, number=number, path=path,
                                       file_size=len(self.data), sha256=hashlib.sha256(self.data).hexdigest()))

    def write_manifest(self):
        (self.root / "parsed/tumbler-catalog.json").write_text(json.dumps(dict(items=self.items)), encoding="utf-8")

    def test_optional_and_embedded_assets(self):
        self.assertIsNone(load_tumbler_assets(self.root))
        self.write_manifest()
        result = load_tumbler_assets(self.root)
        self.assertEqual(result["asset_count"], 58)
        self.assertEqual(base64.b64decode(result["items"][0]["data_url"].split(",")[1]), self.data)

    def test_corruption_rejected(self):
        self.write_manifest()
        (self.root / self.items[0]["path"]).write_bytes(b"broken")
        with self.assertRaisesRegex(ValueError, "integrity"):
            load_tumbler_assets(self.root)

    def test_missing_and_mismatched_pair_rejected(self):
        self.items.pop()
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "Incomplete"):
            load_tumbler_assets(self.root)

    def test_bad_mask_number_rejected(self):
        self.items[12]["number"] = 99
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "Mismatched"):
            load_tumbler_assets(self.root)

    def test_path_escape_rejected(self):
        self.items[0]["path"] = "../private.png"
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "path"):
            load_tumbler_assets(self.root)


if __name__ == "__main__":
    unittest.main()
