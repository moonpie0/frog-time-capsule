"""Render an offline composer using verified, already-decoded static PNG assets."""

import base64
from collections import Counter
import hashlib
import json
from pathlib import Path
import re


def load_tumbler_assets(root):
    root = Path(root).resolve()
    manifest = root / "parsed/tumbler-catalog.json"
    if not manifest.exists():
        return None
    catalog = json.loads(manifest.read_text(encoding="utf-8"))
    items = catalog["items"]
    expected = {"base": 12, "mask": 12, "eye": 23, "adorn": 8, "down": 2, "mid": 1}
    if Counter(item["group"] for item in items) != expected or len({item["id"] for item in items}) != 58:
        raise ValueError("Incomplete or duplicate tumbler assets")
    if {i["number"] for i in items if i["group"] == "base"} != {i["number"] for i in items if i["group"] == "mask"}:
        raise ValueError("Mismatched tumbler masks")
    prepared = []
    for item in items:
        if not re.fullmatch(r"bdw_[a-z0-9_]+", item["id"]) or item["path"] != "media/tumbler/" + item["id"] + ".png":
            raise ValueError("Unexpected tumbler asset path")
        path = (root / item["path"]).resolve()
        if not path.is_relative_to(root / "media/tumbler"):
            raise ValueError("Tumbler asset outside media directory")
        data = path.read_bytes()
        if len(data) != item["file_size"] or hashlib.sha256(data).hexdigest() != item["sha256"] or not data.startswith(b"\x89PNG\r\n\x1a\n"):
            raise ValueError("Tumbler image integrity mismatch")
        # Data URLs keep canvas export available when the HTML is opened via file://.
        prepared.append({**item, "data_url": "data:image/png;base64," + base64.b64encode(data).decode("ascii")})
    return dict(items=prepared, asset_count=58)


STYLE = """
#tumbler-view{margin-top:26px}#tumbler-view .top{align-items:center}
.tumbler-actions{display:flex;gap:8px;flex-wrap:wrap}.tumbler-actions button{padding:9px 13px;border:1px solid #c5d1ca;background:#fff;border-radius:4px;font-size:13px}
.tumbler-actions .primary{background:#27634d;color:white;border-color:#27634d}
#tumbler-view button:disabled{opacity:.4;cursor:default}
.tumbler-workspace{display:grid;grid-template-columns:minmax(250px,360px) minmax(0,1fr);gap:28px;margin-top:22px;align-items:start}
.tumbler-stage{position:sticky;top:22px;min-width:0}.tumbler-preview{background:#e8efef;aspect-ratio:1;display:grid;place-items:center;overflow:hidden}
#tumbler-canvas{display:block;width:100%;height:auto;aspect-ratio:1;transform-origin:50% 80%;touch-action:manipulation;cursor:pointer}
.tumbler-history{display:flex;justify-content:center;gap:8px;margin:14px 0}.tumbler-history button{font-size:22px}
.tumbler-colors{border-top:1px solid #dce2df;padding-top:15px}.tumbler-colors label{font-size:13px;display:flex;gap:8px;align-items:center;margin-bottom:12px}
.tumbler-swatches{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.tumbler-swatch{width:29px;height:29px;flex:none;border:2px solid #fff;box-shadow:0 0 0 1px #b6c4bb;border-radius:50%;background:var(--swatch)}
.tumbler-swatch[aria-pressed=true]{outline:2px solid #264f40;outline-offset:3px}#tumbler-color{width:34px;height:32px;padding:2px;border:1px solid #b6c4bb;background:white}
.tumbler-tabs{display:flex;gap:4px;flex-wrap:wrap;border-bottom:1px solid #dce2df;padding-bottom:10px;margin-bottom:14px}
.tumbler-tabs button{padding:9px 11px;border:0;background:transparent;border-bottom:2px solid transparent;font-size:14px}
.tumbler-tabs button[aria-pressed=true]{color:#21593e;background:#e5efe9;border-bottom-color:#21674d}
.tumbler-tabs span{font-size:11px;margin-left:5px;color:#68756e}
.tumbler-parts{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:10px;max-height:420px;overflow:auto;padding:3px}
.tumbler-part{border:1px solid #d4dfd8;border-radius:4px;background:white;padding:5px;min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px}
.tumbler-part[aria-pressed=true]{outline:2px solid #397358;outline-offset:0;background:#f0f7f2}
.tumbler-part img,.tumbler-none{display:block;width:100%;aspect-ratio:1;object-fit:contain;min-height:0}.tumbler-none{display:grid;place-items:center;font-size:28px;color:#8e9a94}
.tumbler-part-label{line-height:22px;height:22px}.tumbler-adjust{margin-top:20px;border-top:1px solid #dce2df;padding-top:15px}
.tumbler-adjust h3{margin:0 0 12px;font-size:14px}.tumbler-adjust label{display:grid;grid-template-columns:48px minmax(70px,1fr) 38px;align-items:center;gap:10px;font-size:12px;margin:10px 0}
.tumbler-adjust input[type=range]{width:100%;accent-color:#397358;margin:0}.tumbler-adjust output{text-align:right;font-variant-numeric:tabular-nums}
.tumbler-flip{font-size:13px;display:flex;gap:7px;align-items:center;margin-top:12px}#tumbler-result{font-size:12px;min-height:22px;color:#596d61;margin:10px 0 0;line-height:1.7}
#tumbler-loading{font-size:13px;color:#63766c;margin:10px 0}#tumbler-view .check{white-space:normal}
@media(max-width:1000px){.tumbler-workspace{grid-template-columns:minmax(230px,300px) minmax(0,1fr);gap:18px}}
@media(max-width:760px){.tumbler-workspace{grid-template-columns:minmax(0,1fr)}.tumbler-stage{position:static}.tumbler-preview{max-width:360px;margin:0 auto}.tumbler-actions{margin-top:12px}.tumbler-parts{grid-template-columns:repeat(4,minmax(0,1fr));max-height:330px}.tumbler-tabs button{padding:9px 8px}.tumbler-workspace{gap:22px}}
"""


def panel():
    return '''<section id="tumbler-view" hidden>
<div class="top"><div><h2>不倒翁</h2><p class="muted">自由拼装 · 58 个原始部件 · 非账号拥有记录</p></div>
<div class="tumbler-actions"><button id="tumbler-random" class="primary" disabled>随机组合</button><button id="tumbler-save" disabled>保存 PNG</button></div></div>
<p id="tumbler-loading" role="status">正在载入部件...</p>
<div class="tumbler-workspace"><div class="tumbler-stage"><div class="tumbler-preview"><canvas id="tumbler-canvas" width="800" height="800" tabindex="0" role="img" aria-label="不倒翁组合预览"></canvas></div>
<div class="tumbler-history"><button class="icon" id="tumbler-undo" title="撤销" aria-label="撤销" disabled>&#8630;</button><button class="icon" id="tumbler-redo" title="重做" aria-label="重做" disabled>&#8631;</button><button class="icon" id="tumbler-reset" title="恢复初始组合" aria-label="恢复初始组合" disabled>&#8634;</button></div>
<div class="tumbler-colors"><label><input id="tumbler-tint" type="checkbox" disabled>底色</label><div class="tumbler-swatches" id="tumbler-swatches"></div></div>
<p id="tumbler-result" role="status" aria-live="polite"></p></div>
<div class="tumbler-picker"><div class="tumbler-tabs" role="group" aria-label="部件分类" id="tumbler-tabs"></div><div class="tumbler-parts" id="tumbler-parts" role="group" aria-label="部件选项"></div>
<div class="tumbler-adjust" id="tumbler-adjust" hidden><h3>部件位置</h3>
<label>横向<input type="range" id="tumbler-x" min="-40" max="40" value="0"><output id="tumbler-x-value">0</output></label>
<label>纵向<input type="range" id="tumbler-y" min="-40" max="40" value="0"><output id="tumbler-y-value">0</output></label>
<label>大小<input type="range" id="tumbler-scale" min="60" max="140" value="100"><output id="tumbler-scale-value">100%</output></label>
<label>旋转<input type="range" id="tumbler-angle" min="-45" max="45" value="0"><output id="tumbler-angle-value">0°</output></label>
<div class="tumbler-flip"><input type="checkbox" id="tumbler-flip"><label for="tumbler-flip">左右翻转</label></div></div></div></div></section>'''


def script(assets):
    from viewer_template import safe_json
    return "const tumblerAssets=" + safe_json(assets) + ";\n" + Path(__file__).with_name("tumbler_app.js").read_text(encoding="utf-8")
