"""Display verified friendship images and explicitly confirmed personal annotations."""

from collections import Counter
import hashlib
import json
from pathlib import Path
import re


def apply_annotations(root, catalog):
    path = Path(root) / "parsed/friendship-authors.json"
    annotations = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {"authors": []}
    if annotations["authors"]:
        catalog["authors"] = annotations["authors"]
    ownership_path = Path(root) / "parsed/friendship-ownership.json"
    ownership = json.loads(ownership_path.read_text(encoding="utf-8")) if ownership_path.exists() else {"pages": {}}
    if any(value not in ("obtained", "not_obtained", "unknown") for value in ownership["pages"].values()):
        raise ValueError("Invalid friendship ownership state")
    for item in catalog["items"]:
        if item["category"] != "pages":
            continue
        if item["id"] in ownership["pages"]:
            item.update(ownership=ownership["pages"][item["id"]], ownership_source=ownership["source"])
        match = re.fullmatch(r"draw_paper_(\d+)_png", item["id"])
        if not match:
            continue
        number = int(match[1])
        author = next((row for row in annotations["authors"] if row["min_number"] <= number <= row["max_number"]), None)
        if author:
            item.update(author_id=author["id"], author=author["name"], author_source=annotations["source"])
    if ownership["pages"]:
        pages = [item for item in catalog["items"] if item["category"] == "pages"]
        catalog["page_ownership"] = dict(source=ownership["source"], total=len(pages),
            obtained=sum(item.get("ownership") == "obtained" for item in pages),
            not_obtained=sum(item.get("ownership") == "not_obtained" for item in pages),
            unknown=sum(item.get("ownership", "unknown") == "unknown" for item in pages))
        if "personal_data" in catalog:
            catalog["personal_data"].update(status="partial_user_confirmed", notes="绘本获得状态由本人确认；其他账号记录尚未取得，未请求或读取账号响应。")
    return catalog


def load_friendship(root):
    root = Path(root).resolve()
    manifest = root / "parsed/friendship-catalog.json"
    if not manifest.exists():
        return None
    catalog = json.loads(manifest.read_text(encoding="utf-8"))
    if catalog.get("status") != "complete":
        raise ValueError("Friendship collection is incomplete")
    seen = set()
    for item in catalog["items"]:
        if item["id"] in seen or item["category"] not in ("pages", "gifts", "scenes"):
            raise ValueError("Invalid friendship item")
        seen.add(item["id"])
        if not re.fullmatch(r"media/friendship/[a-f0-9]{64}\.png", item["path"]):
            raise ValueError("Invalid friendship image path")
        path = (root / item["path"]).resolve()
        if not path.is_relative_to(root / "media/friendship"):
            raise ValueError("Friendship image outside media directory")
        data = path.read_bytes()
        if len(data) != item["file_size"] or hashlib.sha256(data).hexdigest() != item["sha256"]:
            raise ValueError("Friendship image integrity mismatch")
    if dict(Counter(item["category"] for item in catalog["items"])) != catalog["categories"]:
        raise ValueError("Friendship category counts mismatch")
    return apply_annotations(root, catalog)


STYLE = '''
#friendship-view{margin-top:26px}#friendship-view .photo-open{aspect-ratio:2/3;background:#f1f4f2}
.main.friendship-active>header,.main.friendship-active>.stats,.main.friendship-active>.note{display:none}
.main.friendship-active #friendship-view{margin-top:0}
.friendship-shelf{position:relative;width:min(100%,560px,calc((100svh - 120px)*854/1420));aspect-ratio:854/1420;margin:0 auto;background:#d9e69f;isolation:isolate}
.friendship-backdrop{position:absolute;inset:0;width:100%;height:100%;z-index:-1}
.friendship-shelf h2{position:absolute;top:5%;left:34%;width:32%;margin:0}.friendship-shelf h2 img{display:block;width:100%;height:auto}
.friendship-books button{position:absolute;width:30%;padding:0;border:0;background:none;color:#3f4933;border-radius:0}
.friendship-books button[data-friendship-book=kunkun]{left:14%;top:19%}
.friendship-books button[data-friendship-book=pangpang]{left:55%;top:37%}
.friendship-books button[data-friendship-book=tiaotiao]{left:14%;top:54%}
.friendship-books img{width:100%;aspect-ratio:260/450;object-fit:contain;display:block;transition:transform .15s}
.friendship-books button:hover img{transform:translateY(-3px)}
.friendship-book-label{display:block;font-size:13px;line-height:22px;text-align:center;white-space:nowrap}
.friendship-back{display:flex;align-items:center;gap:8px;width:max-content;margin-bottom:18px;text-decoration:none;font-size:14px}
.friendship-shelf-return{position:absolute;top:4%;left:13%;margin:0;display:grid;place-items:center;text-decoration:none}
#friendship-view.shelf-open>.friendship-tabs{justify-content:center;margin-bottom:0}
@media(prefers-reduced-motion:reduce){.friendship-books img{transition:none}}
@media(max-width:760px){.friendship-shelf{width:min(100%,calc((100svh - 180px)*854/1420))}.friendship-book-label{font-size:12px}}
#friendship-view .photo[data-category=gifts] .photo-open,#friendship-view .photo[data-category=scenes] .photo-open{aspect-ratio:1}
#friendship-view .toolbar{margin-top:18px}.friendship-tabs{display:flex;flex-wrap:wrap;gap:5px;margin:18px 0}
.friendship-tabs button{padding:10px 12px;border:0;border-bottom:2px solid transparent;background:transparent;font-size:14px}
.friendship-tabs button[aria-pressed=true]{background:#e5efe9;border-color:#21674d;color:#21593e}.friendship-tabs span{font-size:12px;margin-left:6px;color:#66776d}
#friendship-view .check{white-space:normal}#friendship-info h2{overflow-wrap:anywhere}
.friendship-layout{display:grid;grid-template-columns:116px minmax(0,1fr);gap:22px;align-items:start}
.friendship-layout.without-authors{grid-template-columns:minmax(0,1fr)}
.friendship-authors{display:grid;gap:12px;border-right:1px solid #dce2df;padding-right:12px;margin-top:18px}
.friendship-authors button{display:flex;flex-direction:column;gap:6px;align-items:center;border:2px solid transparent;background:transparent;border-radius:4px;padding:8px 6px;font-size:14px;width:100%}
.friendship-authors button[aria-pressed=true]{background:#e5efe9;border-color:#66947c;color:#21593e;font-weight:600}
.friendship-author-cover{display:block;width:78px;max-width:100%;height:135px;object-fit:contain}
.friendship-author-label{display:flex;justify-content:space-between;gap:5px;width:100%;align-items:center;line-height:22px}
.friendship-author-progress{font-size:12px;font-weight:400;color:#66776d;font-variant-numeric:tabular-nums}
.friendship-ownership{font-size:12px;margin-top:6px;line-height:20px}.friendship-ownership[data-ownership=obtained]{color:#28634a}.friendship-ownership[data-ownership=not_obtained]{color:#996219}
.friendship-content{min-width:0}
@media(max-width:760px){.friendship-layout{grid-template-columns:minmax(0,1fr);gap:0}.friendship-authors{grid-template-columns:repeat(3,minmax(0,1fr));border-right:0;border-bottom:1px solid #dce2df;margin:0;padding:0 0 10px;gap:8px}.friendship-authors button{min-width:0}.friendship-author-cover{width:65px;height:113px}}
'''


def panel():
    return '''<section id="friendship-view" hidden>
<div id="friendship-shelf" class="friendship-shelf" aria-label="友情绘本选书页">
<img id="friendship-backdrop" class="friendship-backdrop" alt="">
<a class="friendship-shelf-return icon" href="#view-postcards" title="返回明信片" aria-label="返回明信片">&#8592;</a>
<h2><img id="friendship-title" alt="友情绘本"></h2><div id="friendship-books" class="friendship-books"></div></div>
<div id="friendship-detail-header" hidden><a class="friendship-back" href="#friendship"><span aria-hidden="true">&#8592;</span>返回选书</a>
<div class="top"><div><h2>友情绘本</h2><p class="muted" id="friendship-summary">绘本页与相关素材</p></div><span class="check" id="friendship-total"></span></div></div>
<div id="friendship-tabs" class="friendship-tabs" role="group" aria-label="绘本分类"></div>
<div id="friendship-layout" class="friendship-layout"><aside id="friendship-authors" class="friendship-authors" role="group" aria-label="绘本作者"></aside><div class="friendship-content">
<div class="toolbar"><h2 id="friendship-heading">绘本页</h2><input id="friendship-search" type="search" aria-label="搜索绘本资源编号" placeholder="搜索资源编号"></div>
<div id="friendship-gallery" class="gallery"></div><p class="empty" id="friendship-empty" hidden>没有符合条件的图片</p>
<p class="muted" id="friendship-note">正式标题与故事文字尚未取得；图片以原始资源编号标记。</p></div></div></section>'''


def dialog():
    return '''<dialog id="friendship-dialog"><div class="light-head"><strong id="friendship-position"></strong>
<button class="icon" id="friendship-prev" title="上一张" aria-label="上一张">&#8592;</button><button class="icon" id="friendship-next" title="下一张" aria-label="下一张">&#8594;</button><button class="icon" id="friendship-close" title="关闭" aria-label="关闭">&#215;</button></div>
<div class="light-layout"><img class="light-image" id="friendship-image" alt=""><aside class="light-info" id="friendship-info"></aside></div></dialog>'''


def script(catalog):
    from viewer_template import safe_json
    return "const friendshipCatalog=" + safe_json(catalog) + ";\n" + Path(__file__).with_name("friendship_app.js").read_text(encoding="utf-8")
