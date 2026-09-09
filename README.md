# 旅行青蛙个人游戏数据存档

这是运行在电脑上的本地工具。当前版本针对 Android 游戏包 `com.aligames.lxqw.hhb`，优先保存本人设备上经系统授权可访问的游戏分享图片。

## 打开

Windows 双击 `start.cmd`。当前电脑已找到 Python 和 ADB。macOS 安装 Python 3.10+（含 Tk）及 Google Android SDK Platform-Tools 后，在本目录执行 `python3 capsule.py`。macOS 代码路径已提供，未进行真机验证。

1. 连接并解锁自己的 Android 手机，授权 USB 调试。
2. 点击“检查”。
3. 点击“开始备份”。
4. 在游戏内手动截图，将所选游戏截图通过 USB 复制到电脑，在工具中选择分类并点击“导入截图”。
5. 点击“生成时光胶囊”，再点击“打开离线档案”。

“去重并整理文字”会合并完全相同的图片，并调用 Windows 已安装的简体中文 OCR，在电脑上识别图片文字。“编辑图片资料”可以修改图片标题、分类、图片日期、地点和署名，保存后同步更新离线档案。只有本人确认的图片信息才填入这些字段，不要填入登录或支付信息。

备份保存在本目录的 `GameTimeCapsule/`。`viewer/index.html` 与 `reports/backup-report.html` 可以直接双击打开，无需服务器。复制档案时请复制整个 `GameTimeCapsule` 文件夹，保留相对目录结构。

## 保存范围

- 设备基本信息、游戏版本及游戏专属外部目录文件清单。
- `/sdcard/Android/data/com.aligames.lxqw.hhb/files/umeng_cache/` 内严格匹配十六进制文件名的 JPG 图片。
- 用户手动选定的 PNG、JPG 和 WebP 游戏截图。
- 原件 SHA-256、源文件修改时间、可用时的截图来源文件创建时间，以及从临时副本解析的图像尺寸和格式。

这是部分媒体备份，不是完整存档，不支持恢复账号或继续游玩。图片缓存不能证明明信片、图鉴或账号记录完整。图片文字结果标记 `partial_image_evidence`，不等同于游戏数据库字段。未取得的结构化存档保持 `not_available`，不会编造 UID、昵称或旅行历史。

不读取私有存档、未知配置文件、数据库、广告缓存、性能日志、登录密码、Cookie、Token 或支付凭证。未知文件只登记文件名。没有 Root、Hook、注入、解密、抓包、上传或自动云备份操作。不能以“先全量复制再过滤”代替认证信息排除。

iPhone 不使用 ADB。本工具当前不解析 iPhone 整机备份；整机备份可能包含认证信息，不能直接当作满足本项目排除要求的游戏档案。后续 iPhone 支持需要单独检查 Apple Devices/Finder 的系统授权与可排除范围。

## 原件保护与校验

原图不转码、不压缩。复制前对手机白名单图片计算 SHA-256，传输后在电脑重新计算并比较。内容相同的已有原件跳过，源文件变化时用带哈希的新文件名保存。解析在临时副本上进行。

`manifest.json` 是可更新的索引；保留的 `raw/` 原件不会由工具覆盖。应用户要求，去重会删除 SHA-256 与逐字节比较都一致的副本，每组保留一份原文件，并将所有原始路径、来源、时间合并进 `sources`。去重前清单与删除记录仅保存为 JSON，不额外复制原图。不同日期、文字、边框或压缩结果的相似图片不自动合并。后续备份不会重新下载已保留的相同内容。

请勿手动改写已登记原件。离线页面展示最近一次校验结果，并不会自动证明之后未发生修改。随时点击“校验文件”重算哈希，再“生成时光胶囊”更新 HTML。

Android 通常提供的是修改时间，不是原始图片生成时间。来源文件创建时间可能随文件复制改变，不能等同于游玩日期。`displayed_date` 单独保存图片上印出的日期，不擅自解释为出发、抵达、收件或服务器时间。

图片信息保存在 `parsed/image-metadata/<SHA-256>.json`，识别原文及文字坐标在 `parsed/ocr/`；明信片、道具、收藏等另有分类 JSON。OCR 会识别错字，核对后的字段值与 OCR 原文分开保留。当前批次的分类及明信片日期、地点已通过图像区域核对，依据见 `reports/contact-sheets/`、`reports/date-proofs/`、`reports/location-proofs/`。图片署名的具体角色仍未确认，没有当作 UID 或账号昵称。

本次整理完全使用本地 Windows OCR，手机可以拔掉。macOS 暂无自动 OCR 实现，仍可进行备份、导入和手工编辑；未进行 macOS 真机验证。

## 命令行

```text
python capsule.py inspect
python capsule.py backup
python capsule.py generate
python capsule.py verify
python capsule.py import --files screenshot1.png screenshot2.jpg
python capsule.py deduplicate
python organize.py enrich
```

可使用 `--adb` 指定 ADB 可执行文件，`--output` 指定独立档案目录。更换手机或账号时应使用新目录，避免将不同来源混入当前档案。工具仅支持同一时间连接一台已授权设备。

Python 标准库即可执行；已安装 Pillow 时会进一步验证图片可解码性并读取尺寸。未安装 Pillow 时仅验证文件头。测试使用临时目录，不接触手机数据。

## 资源图鉴

个人档案左侧的“资源图鉴”在 `GameTimeCapsule/viewer/index.html` 内直接切换，可分类、搜索、预览素材并查看关联分享图片。`resources.html` 保留供旧链接使用。通用收藏物、道具和家具素材单独展示，不计入个人照片或已拥有物品数量。名称和说明只有经分享图片核对后才填写，其余保留原始资源编号；拥有状态保持未知。

图集原件、裁切索引和无损 PNG 位于 `media/resource-catalog/`，来源与 SHA-256 在 `parsed/resource-catalog.json`；生成页面时会重新校验并输出 `reports/resource-integrity.json`。完全一致的导出图片共用一份文件，透明占位图不展示。构建图集需要 Pillow，已经生成的 HTML 无需 Python、Pillow 或服务器即可查看。

名称配置及不倒翁相关资源存在加密限制，本次没有解密。系统备份整包和本地检查工作文件不随网页发布。
