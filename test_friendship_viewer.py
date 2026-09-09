import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from friendship_viewer import load_friendship


class FriendshipValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / "parsed").mkdir()
        (self.root / "media/friendship").mkdir(parents=True)
        self.data = b"test image bytes for hash verification"
        sha = hashlib.sha256(self.data).hexdigest()
        self.image_path = "media/friendship/" + sha + ".png"
        (self.root / self.image_path).write_bytes(self.data)
        self.catalog = dict(status="complete", categories=dict(pages=1), items=[dict(
            id="draw_paper_1_png", category="pages", path=self.image_path, file_size=len(self.data), sha256=sha)])

    def save(self):
        (self.root / "parsed/friendship-catalog.json").write_text(json.dumps(self.catalog), encoding="utf-8")

    def test_optional_and_valid_catalog(self):
        self.assertIsNone(load_friendship(self.root))
        self.save()
        self.assertEqual(load_friendship(self.root), self.catalog)

    def test_incomplete_collection_rejected(self):
        self.catalog["status"] = "in_progress"
        self.save()
        with self.assertRaisesRegex(ValueError, "incomplete"):
            load_friendship(self.root)

    def test_corrupted_image_rejected(self):
        self.save()
        (self.root / self.image_path).write_bytes(b"changed")
        with self.assertRaisesRegex(ValueError, "integrity"):
            load_friendship(self.root)

    def test_outside_path_rejected(self):
        self.catalog["items"][0]["path"] = "../private.png"
        self.save()
        with self.assertRaisesRegex(ValueError, "path"):
            load_friendship(self.root)

    def test_duplicate_id_rejected(self):
        self.catalog["items"].append(self.catalog["items"][0])
        self.save()
        with self.assertRaisesRegex(ValueError, "Invalid friendship item"):
            load_friendship(self.root)

    def test_confirmed_ownership_only_applies_to_named_pages(self):
        page = self.catalog['items'][0]
        self.catalog['items'].extend([dict(page, id='draw_paper_2_png'), dict(page, id='gift_1_png', category='gifts')])
        self.catalog['categories'] = dict(pages=2, gifts=1)
        (self.root / 'parsed/friendship-ownership.json').write_text(json.dumps(dict(
            source='user_confirmed', pages={'draw_paper_1_png': 'not_obtained', 'gift_1_png': 'obtained'})), encoding='utf-8')
        self.save()
        for _ in range(2):
            result = load_friendship(self.root)
            self.assertEqual(result['items'][0]['ownership'], 'not_obtained')
            self.assertNotIn('ownership', result['items'][1])
            self.assertNotIn('ownership', result['items'][2])
            self.assertEqual(result['page_ownership'], dict(source='user_confirmed', total=2, obtained=0, not_obtained=1, unknown=1))


if __name__ == "__main__":
    unittest.main()
