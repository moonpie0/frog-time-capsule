"""Backup safety tests use temporary files and a fake device, never a real phone."""

import hashlib
import json
from pathlib import Path
import shutil
import tempfile
import unittest

from PIL import Image

from capsule import Adb, Capsule, IMAGE_DIR, PACKAGE, SAFE_IMAGE, digest
from viewer_template import render_viewer


class FakeDevice:
    def __init__(self, image):
        self.image = image
        self.path = IMAGE_DIR + "/" + "a" * 32 + ".jpg"
        self.pulls = 0
        self.corrupt = False

    def inspect(self):
        return dict(operating_system="Android", device_model="Test", os_version="14", game_name="Test game",
                    game_version="1.0", package_name=PACKAGE, allow_backup=False)

    def inventory(self):
        return [dict(path=self.path, eligible=True), dict(path=IMAGE_DIR + "/token.json", eligible=False)]

    def image_metadata(self, paths):
        return {path: dict(sha256=digest(self.image), size=self.image.stat().st_size, mtime=1700000000) for path in paths}

    def run(self, *args, **kwargs):
        assert args[:3] == ("pull", "-a", self.path)
        self.pulls += 1
        if self.corrupt:
            Path(args[3]).write_bytes(b"broken transmission")
        else:
            shutil.copy2(self.image, args[3])
        return "", 0, ""


class ArchiveTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.source = self.root / "test.jpg"
        Image.new("RGB", (20, 30), (35, 90, 70)).save(self.source)
        self.archive = Capsule(self.root / "capsule", log=lambda _: None)
        self.device = FakeDevice(self.source)

    def tearDown(self):
        self.temp.cleanup()

    def test_backup_whitelist_original_hash_and_repeat(self):
        result = self.archive.backup(self.device)
        self.assertEqual(result["failures"], 0)
        self.assertEqual(self.device.pulls, 1)
        entry = self.archive.manifest["file_list"][0]
        original = self.archive.root / entry["path"]
        self.assertEqual(original.read_bytes(), self.source.read_bytes())
        self.assertEqual(entry["sha256"], hashlib.sha256(self.source.read_bytes()).hexdigest())
        self.assertEqual(entry["image"]["width"], 20)
        self.archive.backup(self.device)
        self.assertEqual(self.device.pulls, 1)
        self.assertEqual(len(self.archive.manifest["file_list"]), 1)
        self.assertFalse(any(p.name == "token.json" for p in self.archive.root.rglob("*")))

    def test_changed_source_preserves_prior_raw(self):
        self.archive.backup(self.device)
        entry = self.archive.manifest["file_list"][0]
        original = self.archive.root / entry["path"]
        old = original.read_bytes()
        Image.new("RGB", (30, 40), (220, 90, 20)).save(self.source)
        self.archive.backup(self.device)
        self.assertEqual(original.read_bytes(), old)
        self.assertEqual(len(self.archive.manifest["file_list"]), 2)
        self.assertEqual(self.archive.verify()["passed"], 2)

    def test_corrupted_raw_is_reported_not_rebaselined(self):
        self.archive.backup(self.device)
        entry = self.archive.manifest["file_list"][0]
        original = self.archive.root / entry["path"]
        original.write_bytes(b"corrupt local file")
        self.archive.backup(self.device)
        self.assertEqual(original.read_bytes(), b"corrupt local file")
        self.assertEqual(self.archive.verify()["failed"], 1)
        self.assertEqual(self.archive.manifest["file_list"][0]["sha256"], entry["sha256"])

    def test_bad_transfer_is_not_archived(self):
        self.device.corrupt = True
        result = self.archive.backup(self.device)
        self.assertEqual(result["failures"], 1)
        self.assertEqual(self.archive.manifest["file_list"], [])
        self.assertFalse(list((self.archive.root / "raw").rglob("*.jpg")))
        self.assertFalse(list((self.archive.root / "media").iterdir()))

    def test_import_reclassification_and_hash(self):
        self.archive.import_images([self.source], "截图")
        self.archive.import_images([self.source], "明信片")
        self.assertEqual(len(self.archive.manifest["file_list"]), 1)
        entry = self.archive.manifest["file_list"][0]
        self.assertEqual(entry["category"], "明信片")
        self.assertEqual(digest(self.archive.root / entry["path"]), digest(self.source))

    def test_exclusive_lock_and_stale_instance_reload(self):
        second = Capsule(self.archive.root, log=lambda _: None)
        self.archive.import_images([self.source])
        second.generate()
        self.assertEqual(len(second.manifest["file_list"]), 1)
        lock = self.archive.root / ".operation-lock"
        lock.mkdir()
        with self.assertRaisesRegex(RuntimeError, "另一个操作"):
            second.generate()
        lock.rmdir()

    def test_nonimage_import_rejected(self):
        fake = self.root / "bad.jpg"
        fake.write_bytes(b"not an image")
        with self.assertRaises((ValueError, OSError)):
            self.archive.import_images([fake])
        self.assertEqual(self.archive.manifest["file_list"], [])

    def test_inventory_excludes_unknown_and_outside_paths(self):
        adb = Adb(executable="fake")
        adb.shell = lambda *a, **k: ("\n".join([self.device.path, IMAGE_DIR + "/token.json", IMAGE_DIR + "/../secret.jpg"]), 0, "")
        with self.assertRaisesRegex(RuntimeError, "非预期路径"):
            adb.inventory()
        for suffix in ("token.jpg", "a.jpg", "../secret.jpg", "a" * 32 + ".jpg/evil", "a" * 32 + ".json"):
            self.assertIsNone(SAFE_IMAGE.fullmatch(IMAGE_DIR + "/" + suffix))

    def test_untracked_and_missing_files_reported(self):
        self.archive.backup(self.device)
        entry = self.archive.manifest["file_list"][0]
        (self.archive.root / entry["path"]).unlink()
        (self.archive.root / "raw/untracked.txt").write_text("test")
        result = self.archive.verify()
        self.assertEqual(result["failed"], 1)
        self.assertEqual(result["untracked_files"], ["raw/untracked.txt"])

    def test_html_data_cannot_close_script(self):
        self.archive.backup(self.device)
        self.archive.manifest["game_name"] = "</script><script>alert('x')</script>"
        output = render_viewer(self.archive.manifest, self.archive.data_map(), self.archive.verify())
        self.assertNotIn("</script><script>alert", output)
        self.assertIn("connect-src 'none'", output)
        profile = json.loads((self.archive.root / "parsed/profile.json").read_text(encoding="utf-8"))
        self.assertEqual(profile["status"], "not_available")

    def add_duplicate(self):
        self.archive.backup(self.device)
        target = self.archive.root / "raw/duplicate.jpg"
        shutil.copy2(self.source, target)
        self.archive.add_file(target, "second_source", "图片缓存", "2024-01-01T00:00:00Z")
        return target

    def test_deduplicate_retains_sources_and_original(self):
        duplicate = self.add_duplicate()
        original = self.archive.root / self.archive.manifest["file_list"][0]["path"]
        result = self.archive.deduplicate()
        self.assertEqual(result["removed_count"], 1)
        self.assertFalse(duplicate.exists())
        self.assertEqual(original.read_bytes(), self.source.read_bytes())
        self.assertEqual(len(self.archive.manifest["file_list"]), 1)
        self.assertEqual(len(self.archive.manifest["file_list"][0]["sources"]), 2)
        self.assertEqual(self.archive.verify()["passed"], 1)
        self.assertEqual(self.archive.deduplicate()["removed_count"], 0)

    def test_deduplicate_refuses_any_corruption(self):
        duplicate = self.add_duplicate()
        duplicate.write_bytes(b"changed")
        with self.assertRaisesRegex(ValueError, "校验存在异常"):
            self.archive.deduplicate()
        self.assertTrue(duplicate.exists())
        self.assertEqual(len(self.archive.manifest["file_list"]), 2)

    def test_deduplication_recovery_before_manifest_update(self):
        duplicate = self.add_duplicate()
        entries = self.archive.manifest["file_list"]
        plan = dict(status="pending_deletion", duplicates=[dict(removed_path="raw/duplicate.jpg",
                    kept_path=entries[0]["path"], sha256=entries[0]["sha256"])])
        from capsule import write_json
        write_json(self.archive.root / "reports/deduplication.json", plan)
        self.archive.deduplicate()
        self.assertFalse(duplicate.exists())
        self.assertEqual(len(self.archive.manifest["file_list"][0]["sources"]), 2)
        self.assertEqual(self.archive.verify()["failed"], 0)

    def test_deduplicate_does_not_retrieve_same_image_again(self):
        self.add_duplicate()
        self.archive.deduplicate()
        self.archive.backup(self.device)
        self.assertEqual(self.device.pulls, 1)
        self.assertEqual(len(self.archive.manifest["file_list"]), 1)

    def test_deduplication_cannot_remove_outside_archive(self):
        self.archive.backup(self.device)
        entry = self.archive.manifest["file_list"][0]
        with self.assertRaisesRegex(ValueError, "原图路径"):
            self.archive.finish_deduplication(dict(duplicates=[dict(removed_path="../test.jpg", kept_path=entry["path"], sha256=entry["sha256"])]))
        self.assertTrue(self.source.exists())

    def test_ocr_date_not_guessed_and_original_text_kept(self):
        from organize import visible_fields
        entry = dict(sha256="a" * 64, category="明信片", image=dict(width=768, height=1138))
        ocr = dict(lines=[dict(text="202 钅 / OS / 01", words=[dict(x=472, y=695)])])
        result = visible_fields(entry, ocr)
        self.assertIsNone(result["displayed_date"])
        self.assertEqual(result["ocr_text"], "202钅/OS/01")
        reviewed = visible_fields(entry, ocr, dict(category="明信片", date="2024-05-01"))
        self.assertEqual(reviewed["displayed_date"], "2024-05-01")
        self.assertEqual(reviewed["date_status"], "visually_reviewed")
        self.assertEqual(reviewed["ocr_text"], result["ocr_text"])

    def test_edit_metadata_preserves_original_and_validates_date(self):
        self.archive.backup(self.device)
        entry = self.archive.manifest["file_list"][0]
        values = dict(title="Test title", category="明信片", displayed_date="2024-05-01", location="Test location", caption="Test caption")
        self.archive.edit_image(entry["sha256"], values)
        content = self.archive.manifest["file_list"][0]["content"]
        self.assertEqual(content["edited_by"], "user")
        self.assertEqual(content["displayed_date"], "2024-05-01")
        self.assertEqual(digest(self.archive.root / entry["path"]), entry["sha256"])
        with self.assertRaises(ValueError):
            self.archive.edit_image(entry["sha256"], dict(values, displayed_date="2024-02-31"))


if __name__ == "__main__":
    unittest.main()
