"""Build and verify an offline catalog from unencrypted static sprite sheets."""

from collections import Counter
import io
import json
from pathlib import Path
import re

from capsule import digest, now, write_json

SHEETS = {"icon3_sheet": "收藏物", "icon3_sheet-1": "收藏物", "icon2_sheet": "道具",
          "furniture_xw1": "家具", "furniture_xw1-1": "家具"}


def crop_frame(image, frame):
    from PIL import Image
    keys = ("x", "y", "w", "h", "offX", "offY", "sourceW", "sourceH")
    if any(type(frame.get(key)) is not int for key in keys):
        raise ValueError("Invalid sprite coordinates")
    x, y, w, h, dx, dy, sw, sh = (frame[key] for key in keys)
    if (min(x, y, dx, dy) < 0 or min(w, h, sw, sh) <= 0 or max(sw, sh) > 4096
            or x + w > image.width or y + h > image.height or dx + w > sw or dy + h > sh
            or frame.get("rotated")):
        raise ValueError("Sprite rectangle or orientation is unsupported")
    canvas = Image.new("RGBA", (sw, sh))
    canvas.paste(image.crop((x, y, x + w, y + h)).convert("RGBA"), (dx, dy))
    return canvas


def build_catalog(audit, root):
    from PIL import Image
    audit, root = Path(audit).resolve(), Path(root).resolve()
    records = json.loads((audit / "resource-manifest.json").read_text(encoding="utf-8"))
    source_map = {row["resource"]: row for row in records if row["status"] == "preserved"}
    catalog_path = root / "parsed/resource-catalog.json"
    previous = json.loads(catalog_path.read_text(encoding="utf-8")) if catalog_path.exists() else {}
    previous_items = {item["id"]: item for item in previous.get("items", [])}
    files, items = {}, []

    def preserve(data, suffix, kind, source=None):
        import hashlib
        sha = hashlib.sha256(data).hexdigest()
        relative = "media/resource-catalog/" + kind + "/" + sha + suffix
        target = root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            if digest(target) != sha:
                raise ValueError("Catalog file integrity mismatch")
        else:
            with target.open("xb") as stream:
                stream.write(data)
        if relative not in files:
            files[relative] = dict(path=relative, file_size=len(data), sha256=sha, kind=kind, sources=[])
        if source and source not in files[relative]["sources"]:
            files[relative]["sources"].append(source)
        return relative

    def source_bytes(record):
        target = (audit / record["path"]).resolve()
        if not target.is_relative_to(audit / "raw/resources") or digest(target) != record["sha256"]:
            raise ValueError("Unverified source resource")
        return target.read_bytes()

    for sheet, category in SHEETS.items():
        index_record = source_map.get("sheet/" + sheet + ".json")
        image_record = source_map.get("sheet/" + sheet + ".png")
        if not index_record or not image_record:
            continue
        if index_record["resource_version"] != image_record["resource_version"]:
            raise ValueError("Sprite sheet and index versions differ")
        index_data, image_data = source_bytes(index_record), source_bytes(image_record)
        index = json.loads(index_data)
        if index["file"] != sheet + ".png":
            raise ValueError("Unexpected sprite sheet reference")
        index_path = preserve(index_data, ".json", "raw", index_record)
        image_path = preserve(image_data, ".png", "raw", image_record)
        with Image.open(io.BytesIO(image_data)) as image:
            image.load()
            for key, frame in index["frames"].items():
                if not re.fullmatch(r"[A-Za-z0-9_]+_png", key):
                    raise ValueError("Unexpected resource key")
                sprite = crop_frame(image, frame)
                buffer = io.BytesIO()
                sprite.save(buffer, format="PNG", compress_level=9)
                relative = preserve(buffer.getvalue(), ".png", "images")
                old = previous_items.get(key, {})
                items.append(dict(id=key, category=category, label=category + " " + key.removesuffix("_png"),
                                  official_name=old.get("official_name"), description=old.get("description"),
                                  location=old.get("location"), annotation_source=old.get("annotation_source"),
                                  ownership="unknown", image_path=relative, width=sprite.width, height=sprite.height,
                                  hidden_reason="transparent_placeholder" if sprite.getbbox() is None else None,
                                  resource_key=key, resource_version=index_record["resource_version"],
                                  source_image=image_path, source_index=index_path, source_frame=frame,
                                  linked_photos=old.get("linked_photos", [])))
    if len({item["id"] for item in items}) != len(items):
        raise ValueError("Duplicate resource keys need explicit resolution")
    catalog = dict(schema_version=1, generated_at=now(), source="MIUI system backup: unencrypted static sprite sheets",
                   ownership_status="unknown", names_status="unavailable_encrypted_config",
                   notes="通用素材不表示本人拥有或解锁。编号为原始资源标识；未解密名称配置，未猜测正式名称。",
                   categories=dict(Counter(item["category"] for item in items if not item["hidden_reason"])), items=items,
                   file_list=list(files.values()))
    write_json(catalog_path, catalog)
    return catalog


def verify_catalog(root, catalog):
    root = Path(root).resolve()
    checks = []
    for record in catalog.get("file_list", []):
        target = (root / record["path"]).resolve()
        allowed = target.is_relative_to(root / "media/resource-catalog")
        ok = allowed and target.is_file() and target.stat().st_size == record["file_size"] and digest(target) == record["sha256"]
        checks.append(dict(path=record["path"], ok=ok))
    registered = {record["path"] for record in catalog.get("file_list", [])}
    untracked = [p.relative_to(root).as_posix() for p in (root / "media/resource-catalog").rglob("*")
                 if p.is_file() and p.relative_to(root).as_posix() not in registered]
    return dict(checked_at=now(), passed=sum(row["ok"] for row in checks), failed=sum(not row["ok"] for row in checks),
                checks=checks, untracked_files=untracked)


CATALOG_STYLE = '''
#resources-view .photo-open{aspect-ratio:1;background:#fff}
#resources-view .photo img{padding:12px}
#resources-view .photo-open:hover{background:#f0f4f1}
.catalog-categories{display:flex;flex-wrap:wrap;gap:6px;margin:18px 0}
.catalog-categories button{border:0;border-bottom:2px solid transparent;background:transparent;padding:10px 12px;font-size:14px}
.catalog-categories button[aria-pressed=true]{border-bottom-color:#21674d;background:#e5efe9;color:#21593e}
.catalog-categories span{font-size:12px;margin-left:6px;color:#65706b}
.catalog-desc{min-height:20px;white-space:pre-line}
'''


def catalog_panel(hidden=False):
    return ('''<section id="resources-view"''' + (' hidden' if hidden else '') + '''>
<div class="top"><div><h2>资源图鉴</h2><p class="muted">通用图片素材 · 个人拥有状态未知</p></div><span class="check" id="catalog-integrity"></span></div>
<div class="catalog-categories" role="group" aria-label="资源分类"><button data-category="" aria-pressed="true">全部素材 <span id="catalog-total"></span></button>
<button data-category="收藏物" aria-pressed="false">收藏物 <span id="count-collections"></span></button>
<button data-category="道具" aria-pressed="false">道具 <span id="count-items"></span></button>
<button data-category="家具" aria-pressed="false">家具 <span id="count-furniture"></span></button></div>
<p class="muted">已保存图集中的部分素材。未确认的名称以资源编号列出；有分享图依据的资料单独标注。</p>
<div class="toolbar"><h2 id="catalog-heading">全部素材</h2><input id="catalog-search" type="search" placeholder="名称 / 编号 / 图片说明" aria-label="搜索素材">
<label><input id="catalog-linked" type="checkbox"> 有分享图关联</label></div>
<div id="catalog-gallery" class="gallery"></div><p id="catalog-empty" class="empty" hidden>没有符合条件的素材</p>
<p class="muted">不倒翁的图片索引指向加密素材，本次未取得可展示的图片。</p>
<p class="muted"><a href="../parsed/resource-catalog.json">素材资料 JSON</a> · <a href="../reports/resource-integrity.json">素材校验结果</a></p></section>''')


def catalog_dialog():
    return '''<dialog id="resource-dialog"><div class="light-head"><strong id="resource-title"></strong>
<button class="icon" id="resource-prev" aria-label="上一项" title="上一项">&#8592;</button><button class="icon" id="resource-next" aria-label="下一项" title="下一项">&#8594;</button>
<button class="icon" id="resource-close" aria-label="关闭" title="关闭">&#215;</button></div>
<div class="light-layout"><img id="resource-image" class="light-image" alt=""><aside id="resource-info" class="light-info"></aside></div></dialog>'''


def catalog_script(catalog, checks):
    from viewer_template import safe_json
    script = "const catalog=" + safe_json(catalog) + ";const catalogChecks=" + safe_json(checks) + ";\n"
    script += Path(__file__).with_name("resource_viewer.js").read_text(encoding="utf-8")
    return script


def render_catalog(catalog, checks):
    from viewer_template import document
    body = '<main class="main"><p><a href="index.html#resources">&#8592; 返回个人档案</a></p>' + catalog_panel() + '</main>' + catalog_dialog()
    script = catalog_script(catalog, checks)
    page = document("资源图鉴 · 旅行青蛙", body, script)
    return page.replace("</style>", CATALOG_STYLE + "</style>")
