"""Self-contained HTML renderer: no remote fonts, scripts, analytics, or fetch."""

import html
import json
from collections import Counter
from pathlib import Path


def safe_json(value):
    return json.dumps(value, ensure_ascii=False).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")


STYLE = """
:root{font-family:'Segoe UI','Microsoft YaHei',sans-serif;color:#262b2a;background:#f5f7f6;letter-spacing:0;color-scheme:light}
*{box-sizing:border-box}body{margin:0}button,input,select{font:inherit}button,a,input,select{touch-action:manipulation}
button,a{color:inherit}button{cursor:pointer}a{color:#21674d}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #c28b26;outline-offset:3px}
.shell{display:grid;grid-template-columns:224px minmax(0,1fr);min-height:100vh}.sidebar{background:#fff;border-right:1px solid #dce2df;padding:30px 20px;position:sticky;top:0;height:100vh}
.brand{font-size:19px;font-weight:700;margin:0 0 8px}.muted{color:#65706b;font-size:13px;line-height:1.7}.status{display:inline-block;color:#936111;background:#fbf1d7;padding:4px 8px;font-size:12px;border-radius:3px;margin:18px 0}
nav{display:grid;gap:5px;margin-top:14px}nav button{text-align:left;border:0;background:none;padding:11px 12px;border-radius:4px;font-size:14px}nav button[aria-current=true]{background:#e5efe9;color:#21593e;font-weight:600}nav button:hover{background:#edf2ef}
.side-links{display:grid;gap:12px;border-top:1px solid #e0e5e2;margin-top:30px;padding-top:22px;font-size:13px}.main{padding:32px 38px;min-width:0}.top{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;border-bottom:1px solid #dce2df;padding-bottom:22px}
h1{font-size:25px;line-height:1.45;margin:0 0 7px}h2{font-size:18px;margin:0 0 16px}h3{font-size:15px}p{line-height:1.7}.top p{margin:0}.check{font-size:13px;color:#28634a;padding-top:8px;white-space:nowrap}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-bottom:1px solid #dce2df;margin-bottom:22px;padding:22px 0;gap:16px}.stat strong{font-size:25px;font-weight:600;display:block}.stat span{font-size:12px;color:#65706b}
.toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:20px}.toolbar h2{margin:0 auto 0 0}input[type=search]{width:220px;max-width:100%;padding:9px 12px;border:1px solid #ccd5d0;border-radius:4px;background:white}select{max-width:100%;padding:9px;border:1px solid #ccd5d0;border-radius:4px;background:white}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:18px}.photo{background:#fff;border:1px solid #dae1dd;border-radius:6px;overflow:hidden;min-width:0}.photo-open{display:block;padding:0;width:100%;border:0;background:#e9eeeb;aspect-ratio:3/4}.photo img{width:100%;height:100%;display:block;object-fit:contain}.caption{padding:12px;font-size:12px;line-height:1.6;overflow-wrap:anywhere}.caption strong{display:block;font-weight:600;margin-bottom:4px}.caption a{display:inline-block;margin-top:7px}
.empty{border-top:1px solid #dce2df;padding:32px 0;color:#65706b}.empty h3{font-size:17px;color:#353c38}.note{font-size:13px;color:#766126;background:#faf3df;border-left:3px solid #b99037;padding:11px 14px;margin-bottom:22px;line-height:1.7}
.table-scroll{overflow:auto;max-width:100%}table{width:100%;border-collapse:collapse;font-size:13px;background:#fff}th,td{padding:12px 14px;text-align:left;border-bottom:1px solid #e0e5e2;vertical-align:top;line-height:1.65}th{background:#edf2ef;font-weight:600;white-space:nowrap}td.path{word-break:break-all;min-width:190px}code{font:12px Consolas,monospace;overflow-wrap:anywhere}.file-table{min-width:850px}.data-table{min-width:760px}.data-table td:last-child{min-width:230px}
.section{margin:26px 0}.summary-list{padding-left:22px;font-size:14px;line-height:1.9}.report{max-width:1120px;margin:auto;padding:32px 24px}.report header{border-bottom:1px solid #dce2df;padding-bottom:20px}.report .stats{grid-template-columns:repeat(3,minmax(0,1fr))}
dialog{border:1px solid #bdc8c0;border-radius:6px;padding:0;width:min(1080px,96vw);max-height:95vh;background:#f4f6f4;color:#252b28}dialog::backdrop{background:rgba(18,24,21,.78)}.light-head{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid #d9e0db}.light-head strong{margin-right:auto;overflow-wrap:anywhere;font-size:13px}.icon{width:36px;height:36px;flex:none;border:1px solid #ccd4ce;background:#fff;border-radius:4px;font-size:21px}.light-image{display:block;width:100%;height:calc(88vh - 105px);object-fit:contain}.light-foot{font-size:12px;padding:10px 16px;overflow-wrap:anywhere}
[hidden]{display:none!important}@media(max-width:760px){.shell{display:block}.sidebar{position:static;height:auto;border-right:0;border-bottom:1px solid #dce2df;padding:18px}.sidebar .muted,.sidebar .status,.side-links{display:none}.brand{font-size:17px}nav{display:flex;overflow:auto;margin-top:12px;gap:4px}nav button{white-space:nowrap;padding:8px 10px;flex:none}.main{padding:22px 16px}.top{display:block}h1{font-size:21px}.check{margin-top:8px}.stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.gallery{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.caption{padding:9px}.toolbar{gap:9px}.toolbar h2{width:100%;margin-bottom:4px}.toolbar input{width:100%;flex:1;min-width:140px}.report{padding:22px 16px}.report .stats{grid-template-columns:repeat(3,minmax(0,1fr))}.stat strong{font-size:23px}.light-head{padding:8px;gap:6px}}
@media print{.sidebar,.toolbar,dialog{display:none}.shell{display:block}.main{padding:0}.gallery{grid-template-columns:repeat(3,1fr)}.photo{break-inside:avoid}}
.sidebar{overflow-y:auto}nav button{display:flex;justify-content:space-between;gap:10px}nav button span{font-size:12px;color:#65706b;font-weight:400}.caption .image-title{font-size:14px;min-height:23px;line-height:1.65}.caption .kind{color:#32684a}.light-layout{display:grid;grid-template-columns:minmax(0,1fr) 310px}.light-layout .light-image{height:calc(90vh - 100px)}.light-info{background:white;border-left:1px solid #dce2df;padding:20px;overflow:auto;max-height:calc(90vh - 100px);font-size:13px}.light-info h2{font-size:17px;line-height:1.6}.light-info dl{margin:0}.light-info dt{color:#68736c;font-size:12px;margin-top:15px}.light-info dd{margin:4px 0 0;line-height:1.7;overflow-wrap:anywhere}.light-info pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.8 'Microsoft YaHei',sans-serif}.light-info details{margin-top:18px}.light-info summary{cursor:pointer}.light-info a{display:inline-block;margin:8px 8px 0 0}.source-item{border-top:1px solid #e1e7e3;margin-top:10px;padding-top:10px;overflow-wrap:anywhere;font-size:12px}.count-label{font-size:13px;color:#65706b;margin-left:8px}.toolbar select{max-width:210px}#profile-note{max-width:720px}.stat strong{overflow-wrap:anywhere}
@media(max-width:760px){.light-layout{display:block}.light-layout .light-image{height:48vh}.light-info{max-height:none;border-left:0;border-top:1px solid #dce2df;padding:16px}.sidebar{overflow:visible}.toolbar select{flex:1;min-width:140px}.light-head strong{max-width:calc(100% - 135px)}nav button span{display:none}}
"""


def document(title, body, script=""):
    return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src \'self\' file: data:; style-src \'unsafe-inline\'; script-src \'unsafe-inline\'; connect-src \'none\'; base-uri \'none\'; form-action \'none\'"><title>' + html.escape(title) + '</title><style>' + STYLE + '</style></head><body>' + body + ('<script>' + script + '</script>' if script else '') + '</body></html>'


def table(rows):
    headings = ("数据项", "是否发现", "保存位置", "是否成功备份", "获取方式", "风险 / 备注")
    keys = ("item", "found", "location", "backup", "classification", "note")
    return '<div class="table-scroll"><table class="data-table"><thead><tr>' + ''.join('<th>' + h + '</th>' for h in headings) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join('<td class="path">' + html.escape(str(row[k])) + '</td>' for k in keys) + '</tr>' for row in rows) + '</tbody></table></div>'


def render_viewer(manifest, rows, checks):
    body = """
<div class="shell"><aside class="sidebar"><p class="brand">游戏时光胶囊</p><div class="muted">个人游戏纪念档案</div><span class="status">部分保存</span>
<nav aria-label="档案视图"><button data-view="postcards" aria-current="true">明信片</button><button data-view="collections">图鉴与收藏</button><button data-view="inventory">道具资料</button><button data-view="stickers">贴纸分享</button><button data-view="activities">活动图片</button><button data-view="travel">旅行汇总</button><button data-view="timeline">图片日期时间线</button><button data-view="other">其他图片</button><button data-view="all">全部图片</button><button data-view="screenshots">补充截图</button><button data-view="profile">我的资料</button><button data-view="map">数据地图</button><button data-view="files">原件与校验</button></nav>
<div class="side-links"><a href="../reports/backup-report.html">完整备份报告</a><a href="../reports/manual-checklist.md">人工保存清单</a><a href="../manifest.json">备份清单 JSON</a></div></aside>
<main class="main"><header class="top"><div><h1>旅行青蛙 · 中国之旅</h1><p class="muted" id="device"></p></div><div class="check" id="integrity"></div></header>
<section class="stats" aria-label="档案概况"><div class="stat"><strong id="image-count"></strong><span>已保存图片</span></div><div class="stat"><strong id="screen-count"></strong><span>补充截图</span></div><div class="stat"><strong id="size"></strong><span>原件体积</span></div><div class="stat"><strong id="day"></strong><span>备份日期</span></div></section>
<div class="note">图片分类及可见文字已归档。图片日期不等于已取得游戏旅行记录；私有存档、账号状态与收藏完整性仍未验证。</div>
<section id="media-view"><div class="toolbar"><h2 id="view-title">明信片</h2><input type="search" id="search" aria-label="搜索地点、日期或文字" placeholder="地点 / 日期 / 文字"><select id="kind-filter" aria-label="明信片类型"><option value="">全部明信片</option><option value="地点明信片">地点明信片</option><option value="日常明信片">日常明信片</option></select><select id="year-filter" aria-label="图片年份"><option value="">所有年份</option></select><select id="sort" aria-label="图片排序"><option value="new">日期：新到旧</option><option value="old">日期：旧到新</option><option value="name">标题</option><option value="source">文件修改时间</option></select></div><div class="gallery" id="gallery"></div><div class="empty" id="empty" hidden><h3>暂无符合条件的图片</h3><p>尚未归档的类别为空，不表示游戏中没有相关记录。</p></div><p class="muted" id="media-note">日期和地点来自图片可见文字；未印出或无法确认的字段保持为空。</p></section>
<section id="profile-view" class="section" hidden><h2>我的游戏资料</h2><div id="profile-table"></div><p class="muted" id="profile-note">图片署名的字段含义尚未确认；UID 与账号昵称仍未取得。</p></section>
<section id="map-view" class="section" hidden><h2>数据地图</h2>__MAP__</section>
<section id="files-view" class="section" hidden><h2>原件与 SHA-256 校验</h2><p class="muted" id="verified-at"></p><div class="table-scroll"><table class="file-table"><thead><tr><th>原始文件</th><th>大小</th><th>SHA-256</th><th>最近校验</th></tr></thead><tbody id="files-body"></tbody></table></div></section>
</main></div><dialog id="lightbox"><div class="light-head"><strong id="light-title"></strong><button class="icon" id="prev" aria-label="上一张" title="上一张">&#8592;</button><button class="icon" id="next" aria-label="下一张" title="下一张">&#8594;</button><button class="icon" id="close" aria-label="关闭" title="关闭">&#215;</button></div><div class="light-layout"><img class="light-image" id="light-image" alt=""><aside class="light-info" id="light-info"></aside></div></dialog>
""".replace("__MAP__", table(rows))
    script = "const manifest=" + safe_json(manifest) + ";const verification=" + safe_json(checks) + ";\n"
    script += Path(__file__).with_name("viewer_app.js").read_text(encoding="utf-8")
    return document("旅行青蛙 · 个人时光胶囊", body, script)


def render_report(manifest, rows, checks):
    counts = Counter(row["backup"] for row in rows)
    complete = counts["已保存"]
    partial = counts["部分保存"]
    other = len(rows) - complete - partial
    files = manifest["file_list"]
    total = sum(f["file_size"] for f in files)
    categories = Counter(file["category"] for file in files)
    content = [file["content"] for file in files if file.get("content")]
    sources = sum(len(file.get("sources", [file])) for file in files)
    category_summary = "、".join(html.escape(category) + " " + str(count) + " 张" for category, count in categories.items())
    metadata_section = f'''<section class="section"><h2>图片分类与可见信息</h2><p>{category_summary}。</p>
<p>已保存 {len(content)} 份图片信息，包含 {sum(bool(item.get('displayed_date')) for item in content)} 个图片日期、{sum(bool(item.get('location')) for item in content)} 个地点标注。
分类、日期与地点的核对依据保存在图像核对表中；OCR 原始文字单独保存，未识别字段保持为空。</p>
<p>目前 {len(files)} 个图片文件对应 {sources} 条来源。完全一致的副本已按 SHA-256 和逐字节比较合并，保留原始路径与时间。
日期、边框、文字不同的相似图片分别保留。</p><a href="image-metadata-summary.json">图片信息统计</a> · <a href="deduplication.json">去重明细</a></section>''' if content else ''
    def esc(value):
        return html.escape(str(value))
    body = f'''<main class="report"><header><h1>旅行青蛙 · 备份报告</h1><p class="muted">备份日期：{esc(manifest['backup_time'])} · 工具版本：{esc(manifest['backup_tool_version'])}</p><a href="../viewer/index.html">打开离线档案</a></header>
<div class="stats"><div class="stat"><strong>{complete}</strong><span>已保存的数据项</span></div><div class="stat"><strong>{partial}</strong><span>部分保存的数据项</span></div><div class="stat"><strong>{other}</strong><span>未取得 / 待补全 / 无法验证</span></div></div>
<div class="note">总体结果：部分媒体保存。不是完整游戏存档，不承诺可以恢复账号、继续游玩或重建游戏服务。分类统计按数据地图行计数，图片相关行存在重叠。</div>
<section class="section"><h2>已成功保存</h2><p>{len(files)} 个原始图片文件，共 {total / 1048576:.2f} MB。已记录文件大小、来源和 SHA-256。设备与游戏版本见环境报告。</p><p>本地完整性检查：{checks['passed']} 个通过，{checks['failed']} 个失败，{len(checks['untracked_files'])} 个文件未登记。检查时间：{esc(checks['checked_at'])}。</p></section>
{metadata_section}
<section class="section"><h2>部分保存</h2><p>游戏外部目录中的分享图片及其可见文字、源文件修改时间。图片不证明明信片、图鉴或收藏的完整性。图片日期没有被解释为出发、收件或服务器时间。复制失败项见 backup-errors.json。</p></section>
<section class="section"><h2>需人工截图补全</h2><p>UID、昵称、明信片、图鉴、道具、货币、称号、任务、活动与旅行记录。是否存在对应可见页面，需要在游戏内确认。现有缓存不等于已完成这些项目的截图保存。</p><a href="manual-checklist.md">停服前保存清单</a></section>
<section class="section"><h2>无法取得的数据</h2><p>游戏私有目录被系统权限阻止。正常系统权限无法继续，这部分数据当前无法安全读取。没有读取 SharedPreferences、SQLite 或私有存档，也未尝试 Root、沙盒绕过或解密。</p><p>本次检测中应用未声明 ALLOW_BACKUP，Android 备份服务关闭。未执行完整系统备份；厂商本地备份的覆盖范围未验证。</p></section>
<section class="section"><h2>疑似仅服务器保存的数据</h2><p>当前无法判定哪些账号、任务或活动记录仅在服务端。未访问游戏服务器或拦截通信，也没有提取任何认证信息。</p></section>
<section class="section"><h2>存在但未解析的数据</h2><p>发现广告 SDK 缓存与性能文件，仅保留目录清单，未读取或导出其内容。结构化游戏存档尚未取得，parsed 中的空记录明确标记为 not_available，不表示游戏内数据为空。未知字段仅在取得安全的结构化数据后才能记录。</p></section>
<section class="section"><h2>数据地图</h2>{table(rows)}</section>
<section class="section"><h2>清单与证据</h2><ul class="summary-list"><li><a href="../manifest.json">manifest.json：原件清单与 SHA-256</a></li><li><a href="environment.json">设备与环境检查</a></li><li><a href="source-inventory.json">目标游戏外部目录清单</a></li><li><a href="integrity.json">完整性检查明细</a></li><li><a href="backup-errors.json">备份失败项</a></li></ul></section>
<p class="muted">桌面备份与 OCR 流程不上传数据；离线页面不引用远程脚本、图片、字体或服务。保留原件不转码，只删除经核对完全一致的副本。图片信息整理不访问手机。</p></main>'''
    return document("旅行青蛙 · 备份报告", body)
