"""Offline image indexing, OCR and preservation of visible card information."""

import argparse
from collections import Counter
from datetime import date
import json
import re
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

from capsule import Capsule, DEFAULT_ARCHIVE, ROOT, digest, write_json, read_json, now, archive_operation


def location_line(ocr, image):
    candidates = []
    for line in ocr.get("lines", []):
        words = line.get("words", [])
        if not words:
            continue
        text = re.sub(r"\s+", "", line["text"])
        if (.56 * image["height"] < words[0]["y"] < .66 * image["height"]
                and words[0]["x"] < .55 * image["width"] and re.search(r"[\u4e00-\u9fff]{2}.*[．·，.]", text)):
            candidates.append(line)
    return candidates[0] if len(candidates) == 1 else None


def unique_entries(capsule):
    by_hash = {}
    for entry in capsule.manifest["file_list"]:
        by_hash.setdefault(entry["sha256"], entry)
    return list(by_hash.values())


def contact_sheets(capsule):
    from PIL import Image, ImageDraw, ImageFont
    entries = unique_entries(capsule)
    output = capsule.root / "reports/contact-sheets"
    output.mkdir(exist_ok=True)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 15)
    for offset in range(0, len(entries), 35):
        sheet = Image.new("RGB", (1100, 7 * 324), "#ffffff")
        drawing = ImageDraw.Draw(sheet)
        for n, entry in enumerate(entries[offset:offset + 35]):
            x, y = (n % 5) * 220, (n // 5) * 324
            with Image.open(capsule.root / entry["path"]) as im:
                im.thumbnail((208, 294))
                sheet.paste(im, (x + (220 - im.width) // 2, y))
            drawing.text((x + 6, y + 297), f"{offset + n + 1:03}  {entry['sha256'][:10]}", font=font, fill="#162d22")
        sheet.save(output / f"contact-{offset // 35 + 1:02}.png")
    write_json(output / "index.json", [dict(number=i+1, **entry) for i, entry in enumerate(entries)])
    print(f"Contact sheets: {len(entries)} unique images", flush=True)


def date_proofs(capsule):
    from PIL import Image, ImageDraw, ImageFont
    entries = unique_entries(capsule)
    output = capsule.root / "reports/date-proofs"
    output.mkdir(exist_ok=True)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 20)
    for offset in range(0, len(entries), 40):
        sheet = Image.new("RGB", (2000, 8 * 136), "white")
        draw = ImageDraw.Draw(sheet)
        for n, entry in enumerate(entries[offset:offset + 40]):
            x, y = (n % 5) * 400, (n // 5) * 136
            with Image.open(capsule.root / entry["path"]) as image:
                crop = image.crop((int(image.width * .58), int(image.height * .595), int(image.width * .84), int(image.height * .64)))
                crop.thumbnail((384, 88))
                crop = crop.resize((384, int(crop.height * 384 / crop.width)))
                sheet.paste(crop, (x, y + 31))
            draw.text((x + 4, y + 2), f"{offset+n+1:03}  {entry['sha256'][:10]}", font=font, fill="#202020")
        sheet.save(output / f"dates-{offset // 40 + 1:02}.png")
    extras = [entries[number - 1] for number in (61, 117, 118, 154, 155, 158, 159) if number <= len(entries)]
    sheet = Image.new("RGB", (1500, ((len(extras) + 2) // 3) * 150), "white")
    draw = ImageDraw.Draw(sheet)
    for n, entry in enumerate(extras):
        number = entries.index(entry) + 1
        x, y = (n % 3) * 500, (n // 3) * 150
        with Image.open(capsule.root / entry["path"]) as image:
            crop = image.crop((390, 650, 575, 695)).resize((490, 120))
            sheet.paste(crop, (x, y + 30))
        draw.text((x, y), str(number), font=font, fill="#202020")
    sheet.save(output / "dates-extra.png")


def location_proofs(capsule):
    from PIL import Image, ImageDraw, ImageFont
    entries = read_json(capsule.root / "reports/contact-sheets/index.json", [])
    regions = []
    for entry in entries:
        ocr = read_json(capsule.root / "parsed/ocr" / (entry["sha256"] + ".json"), {})
        line = location_line(ocr, entry["image"])
        if line:
            regions.append((entry, line))
    output = capsule.root / "reports/location-proofs"
    output.mkdir(exist_ok=True)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 20)
    for offset in range(0, len(regions), 24):
        sheet = Image.new("RGB", (2000, 6 * 112), "white")
        draw = ImageDraw.Draw(sheet)
        for n, (entry, line) in enumerate(regions[offset:offset + 24]):
            x, y = (n % 4) * 500, (n // 4) * 112
            words = line["words"]
            box = (min(w["x"] for w in words)-5, min(w["y"] for w in words)-5,
                   max(w["x"]+w["width"] for w in words)+5, max(w["y"]+w["height"] for w in words)+5)
            with Image.open(capsule.root / entry["path"]) as image:
                crop = image.crop(box)
                crop = crop.resize((480, int(crop.height * 480 / crop.width)))
                sheet.paste(crop, (x, y+30))
            draw.text((x, y), str(entry["number"]), font=font, fill="#202020")
        sheet.save(output / f"locations-{offset // 24 + 1:02}.png")


def ocr_images(capsule, limit=None, detail=False):
    if sys.platform != "win32":
        raise RuntimeError("当前离线中文 OCR 使用 Windows 系统组件；此平台可导入图片和手动编辑资料。")
    output = capsule.root / ("parsed/ocr-details" if detail else "parsed/ocr")
    output.mkdir(exist_ok=True)
    work = Path(tempfile.mkdtemp(prefix="ocr-work-", dir=capsule.root / "parsed"))
    jobs = []
    for entry in unique_entries(capsule)[:limit]:
        target = output / (entry["sha256"] + ".json")
        if target.exists() and not json.loads(target.read_text(encoding="utf-8")).get("error"):
            continue
        source = (capsule.root / entry["path"]).resolve()
        if not source.is_relative_to(capsule.root) or digest(source) != entry["sha256"]:
            raise ValueError("Original image integrity failed")
        copy = work / (entry["sha256"] + source.suffix)
        shutil.copy2(source, copy)
        if detail:
            from PIL import Image
            with Image.open(copy) as image:
                band = image.crop((0, int(image.height * .58), image.width, int(image.height * .65)))
                band = band.resize((image.width * 3, band.height * 3), Image.Resampling.LANCZOS)
                copy = copy.with_suffix(".png")
                band.save(copy)
        jobs.append(dict(input=str(copy), output=str(target), sha256=entry["sha256"]))
    if jobs:
        jobs_path = work / "jobs.json"
        write_json(jobs_path, jobs)
        result = subprocess.run(["C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe", "-NoProfile",
                                 "-File", str(ROOT / "windows_ocr.ps1"), "-JobsPath", str(jobs_path)],
                                creationflags=0x08000000 if sys.platform == "win32" else 0)
        if result.returncode:
            raise RuntimeError("Offline OCR failed; source images were not modified")
    # Only remove the uniquely created work directory, which contains derived copies.
    for child in work.iterdir():
        child.unlink()
    work.rmdir()


def visible_fields(entry, ocr, review=None):
    review = review or {}
    lines = ocr.get("lines", [])
    text = "\n".join(re.sub(r"\s+", "", line["text"]) for line in lines)
    category = review.get("category", entry.get("category", "待分类"))
    location = review.get("location")
    candidate = location_line(ocr, entry["image"]) if category == "明信片" else None
    if not location and candidate:
        location = re.sub(r"\s+", "", candidate["text"])
    displayed_date = review.get("date")
    if displayed_date:
        date.fromisoformat(displayed_date)
    caption = None
    if category == "明信片":
        for line in lines:
            words = line.get("words", [])
            if words and .21 * entry["image"]["height"] < words[0]["y"] < .29 * entry["image"]["height"]:
                caption = re.sub(r"\s+", "", line["text"])
                break
    subcategory = "地点明信片" if category == "明信片" and location else ("日常明信片" if category == "明信片" else category)
    title = review.get("title") or location or subcategory
    return dict(title=title, category=category, subcategory=subcategory,
                classification_status="visually_reviewed" if review else "unreviewed",
                displayed_date=displayed_date, date_status="visually_reviewed" if displayed_date else "not_confirmed",
                date_meaning="图片上印刷的日期；不推断为出发、抵达、收件或服务器时间",
                location=location, location_status="visually_reviewed" if review.get("location") else ("ocr_unverified" if location else "not_visible_or_unconfirmed"),
                caption=caption, caption_status="ocr_unverified" if caption else "not_confirmed",
                unknown_field_caption_role=caption, ocr_text=text, ocr_status="error" if ocr.get("error") else "unverified",
                ocr_error=ocr.get("error"), ocr_file="parsed/ocr/" + entry["sha256"] + ".json",
                review=review, notes="文字来源为图片，不是游戏数据库。画面中没有写出的物品名称、地点或状态不推测。")


def load_visual_review(capsule):
    frozen_index = read_json(capsule.root / "reports/contact-sheets/index.json", [])
    notes = read_json(capsule.root / "parsed/visual-review-notes.json", {})
    reviewed = {}
    if not notes:
        return reviewed
    categories = {number: category for category, numbers in notes["special_categories"].items() for number in numbers}
    for item in frozen_index:
        number = item["number"]
        key = str(number)
        reviewed[item["sha256"]] = dict(number=number, category=categories.get(number, notes["default_category"]),
            title=notes.get("titles", {}).get(key), date=notes.get("dates", {}).get(key), location=notes.get("locations", {}).get(key),
            method="visual_review_of_original_image_regions", reviewed_at=now(),
            classification_evidence=f"reports/contact-sheets/contact-{(number - 1) // 35 + 1:02}.png",
            date_evidence=("reports/date-proofs/dates-extra.png" if number in (61,117,118,154,155,158,159)
                           else f"reports/date-proofs/dates-{(number - 1) // 40 + 1:02}.png"))
    return reviewed


@archive_operation
def annotate_images(capsule):
    checks = capsule.verify()
    if checks["failed"]:
        raise ValueError("原件校验失败，停止更新图片信息")
    reviews = load_visual_review(capsule)
    for entry in capsule.manifest["file_list"]:
        ocr = read_json(capsule.root / "parsed/ocr" / (entry["sha256"] + ".json"), None)
        if ocr is None:
            continue
        if ocr.get("sha256") != entry["sha256"]:
            raise ValueError("OCR 与原图哈希不匹配")
        # Never erase a correction explicitly entered by the user.
        if entry.get("content", {}).get("edited_by") == "user":
            continue
        content = visible_fields(entry, ocr, reviews.get(entry["sha256"]))
        if entry.get("category_source") != "user_selected":
            entry["category"] = content["category"]
            entry["category_source"] = content["classification_status"]
        else:
            content["category"] = entry["category"]
        entry["content"] = content
    capsule.save()
    capsule.generate()
    print(json.dumps(dict(categories=Counter(e["category"] for e in capsule.manifest["file_list"]),
        reviewed_dates=sum(bool(e.get("content", {}).get("displayed_date")) for e in capsule.manifest["file_list"]),
        reviewed_locations=sum(e.get("content", {}).get("location_status") == "visually_reviewed" for e in capsule.manifest["file_list"])), ensure_ascii=False), flush=True)


def cleanup_ocr_copies(capsule):
    directory = capsule.root / "parsed/ocr-copies"
    if directory.exists():
        for path in directory.iterdir():
            if path.is_file() and re.fullmatch(r"[a-f0-9]{64}\.jpg", path.name) and digest(path) == path.stem:
                path.unlink()
        if not list(directory.iterdir()):
            directory.rmdir()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["contacts", "ocr", "details", "dates", "locations", "annotate", "enrich"])
    parser.add_argument("--output", type=Path, default=DEFAULT_ARCHIVE)
    parser.add_argument("--limit", type=int)
    args = parser.parse_args()
    capsule = Capsule(args.output)
    if args.command == "contacts":
        contact_sheets(capsule)
    elif args.command == "dates":
        date_proofs(capsule)
    elif args.command == "locations":
        location_proofs(capsule)
    elif args.command == "annotate":
        annotate_images(capsule)
        cleanup_ocr_copies(capsule)
    elif args.command == "enrich":
        ocr_images(capsule, args.limit)
        annotate_images(capsule)
        cleanup_ocr_copies(capsule)
    else:
        ocr_images(capsule, args.limit, args.command == "details")


if __name__ == "__main__":
    main()
