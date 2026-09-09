"""Local, read-only Android game media archival. Python 3.10+, optional Pillow."""

from __future__ import annotations

import argparse
import copy
import filecmp
from functools import wraps
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone

VERSION = "1.1.0"
PACKAGE = "com.aligames.lxqw.hhb"
GAME = "旅行青蛙·中国之旅"
REMOTE = f"/sdcard/Android/data/{PACKAGE}"
IMAGE_DIR = REMOTE + "/files/umeng_cache"
ROOT = Path(__file__).resolve().parent
DEFAULT_ARCHIVE = ROOT / "GameTimeCapsule"
SAFE_IMAGE = re.compile(re.escape(IMAGE_DIR) + r"/[0-9a-f]{16,64}\.jpg$")
SECTIONS = ("raw", "parsed", "screenshots", "media", "reports", "viewer")


def now():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def digest(path):
    h = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def write_json(path, value):
    path = Path(path)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(path)


def read_json(path, fallback):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else fallback


def archive_operation(function):
    @wraps(function)
    def wrapped(self, *args, **kwargs):
        if self._in_operation:
            return function(self, *args, **kwargs)
        lock = self.root / ".operation-lock"
        try:
            lock.mkdir()
        except FileExistsError:
            raise RuntimeError("该档案正在被另一个操作使用。若上次异常退出，请确认没有备份进程，再移除空的 .operation-lock 目录。") from None
        self._in_operation = True
        try:
            self.manifest = read_json(self.root / "manifest.json", self.manifest)
            return function(self, *args, **kwargs)
        finally:
            self._in_operation = False
            lock.rmdir()
    return wrapped


def locate_adb():
    candidates = [os.environ.get("ADB_PATH"), shutil.which("adb")]
    for key in ("ANDROID_HOME", "ANDROID_SDK_ROOT"):
        if os.environ.get(key):
            candidates.append(str(Path(os.environ[key]) / "platform-tools" / ("adb.exe" if os.name == "nt" else "adb")))
    candidates += [str(Path.home() / "AppData/Local/Android/Sdk/platform-tools/adb.exe"),
                   str(Path.home() / "Library/Android/sdk/platform-tools/adb"),
                   str(ROOT / "platform-tools" / ("adb.exe" if os.name == "nt" else "adb"))]
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return candidate
    raise RuntimeError("未找到 ADB。请安装 Google Android SDK Platform-Tools，或设置 ADB_PATH。")


class Adb:
    def __init__(self, executable=None):
        self.executable = executable or locate_adb()
        self.serial = None

    def run(self, *args, timeout=40, check=True):
        command = [self.executable]
        if self.serial:
            command += ["-s", self.serial]
        result = subprocess.run(command + list(args), stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                timeout=timeout, creationflags=0x08000000 if os.name == "nt" else 0)
        output = result.stdout.decode("utf-8", errors="replace").strip()
        error = result.stderr.decode("utf-8", errors="replace").strip()
        if check and result.returncode:
            raise RuntimeError(error or output or "ADB 命令失败")
        return output, result.returncode, error

    def shell(self, *args, check=True):
        # adb shell joins its arguments; quote each argument for the Android shell.
        return self.run("shell", " ".join(shlex.quote(str(arg)) for arg in args), check=check)

    def connect(self):
        listing = self.run("devices")[0]
        lines = [line.split() for line in listing.splitlines()[1:] if line.strip()]
        ready = [row[0] for row in lines if len(row) >= 2 and row[1] == "device"]
        if len(ready) != 1:
            raise RuntimeError("请只连接一台手机，并解锁、开启 USB 调试、允许此电脑调试。当前已授权设备数：" + str(len(ready)))
        self.serial = ready[0]

    def inspect(self):
        self.connect()
        def prop(key):
            return self.shell("getprop", key)[0]
        packages = self.shell("pm", "list", "packages", PACKAGE)[0].splitlines()
        if "package:" + PACKAGE not in packages:
            raise RuntimeError("当前手机未发现目标游戏包 " + PACKAGE + "。其他渠道版本需要单独核实包名。")
        package = self.shell("dumpsys", "package", PACKAGE)[0]
        def match(pattern):
            m = re.search(pattern, package)
            return m.group(1).strip() if m else None
        flags = match(r"pkgFlags=\[([^\]]*)\]") or ""
        private = self.shell("ls", "-ld", "/data/user/0/" + PACKAGE, check=False)
        external = self.shell("ls", "-ld", REMOTE, check=False)
        env = {
            "checked_at": now(), "computer_system": sys.platform,
            "manufacturer": prop("ro.product.manufacturer"), "device_model": prop("ro.product.model"),
            "operating_system": "Android", "os_version": prop("ro.build.version.release"),
            "api_level": prop("ro.build.version.sdk"), "vendor_os": prop("ro.mi.os.version.name"),
            "game_name": GAME, "package_name": PACKAGE,
            "game_version": match(r"versionName=([^\r\n]+)"), "version_code": match(r"versionCode=(\d+)"),
            "target_sdk": match(r"targetSdk=(\d+)"),
            "developer_mode": self.shell("settings", "get", "global", "development_settings_enabled")[0] == "1",
            "adb_authorized": True,
            "usb_debugging": self.shell("settings", "get", "global", "adb_enabled")[0] == "1",
            "allow_backup": "ALLOW_BACKUP" in flags.split(), "debuggable": "DEBUGGABLE" in flags.split(),
            "system_backup_enabled": self.shell("settings", "get", "secure", "backup_enabled")[0] == "1",
            "private_directory_access": "metadata_only" if private[1] == 0 else "denied",
            "external_directory_access": "metadata_only" if external[1] == 0 else "denied",
            "privacy": "仅保存设备基本信息和游戏目录元数据，不保存设备序列号、账户认证信息或其他应用清单。",
        }
        return env

    def inventory(self):
        listing = self.shell("find", REMOTE, "-type", "f")[0]
        records = []
        for path in listing.splitlines():
            if not path.startswith(REMOTE + "/") or ".." in path.split("/"):
                raise RuntimeError("目录清单包含非预期路径，已停止。")
            safe = bool(SAFE_IMAGE.fullmatch(path))
            records.append({"path": path, "eligible": safe,
                            "decision": "游戏分享图片候选" if safe else "仅记录文件名；未知、广告或性能文件不读取内容"})
        return records

    def image_metadata(self, paths):
        metadata = {}
        for offset in range(0, len(paths), 30):
            batch = paths[offset:offset + 30]
            if not all(SAFE_IMAGE.fullmatch(path) for path in batch):
                raise RuntimeError("路径未通过图片白名单检查")
            hashes = self.shell("sha256sum", *batch)[0]
            stats = self.shell("stat", "-c", "%Y %s %n", *batch)[0]
            for line in hashes.splitlines():
                h, path = line.split(None, 1)
                if not re.fullmatch(r"[a-f0-9]{64}", h) or path not in batch:
                    raise RuntimeError("手机端 SHA-256 输出异常")
                metadata[path] = {"sha256": h}
            for line in stats.splitlines():
                epoch, size, path = line.split(" ", 2)
                metadata[path].update(size=int(size), mtime=int(epoch))
        return metadata


class Capsule:
    def __init__(self, root=DEFAULT_ARCHIVE, log=print):
        self.root = Path(root).resolve()
        self.log = log
        self._in_operation = False
        for folder in SECTIONS:
            (self.root / folder).mkdir(parents=True, exist_ok=True)
        self.manifest = read_json(self.root / "manifest.json", {
            "backup_time": now(), "backup_tool_version": VERSION, "game_name": GAME,
            "package_name": PACKAGE, "file_list": [], "data_source": "authorized_adb_and_user_selected_images",
            "notes": ["这是媒体与可验证信息的部分备份，不是可恢复的完整游戏存档。",
                      "不读取私有存档、认证文件、广告缓存或性能日志。",
                      "Android 修改时间不等于图片生成时间或实际旅行时间。"],
        })

    def save(self):
        self.manifest["backup_tool_version"] = VERSION
        self.manifest["updated_at"] = now()
        write_json(self.root / "manifest.json", self.manifest)

    def image_path(self, relative):
        path = (self.root / relative).resolve()
        if not path.is_relative_to(self.root) or path.relative_to(self.root).parts[0] not in {"raw", "screenshots"}:
            raise ValueError("原图路径不在此档案的 raw 或 screenshots 目录内")
        return path

    @staticmethod
    def sources(entry):
        if entry.get("sources"):
            return copy.deepcopy(entry["sources"])
        keys = ("path", "data_source", "source_modified_at", "source_created_at", "backed_up_at", "category")
        return [{key: entry.get(key) for key in keys}]

    def append_source(self, entry, source):
        records = self.sources(entry)
        if not any(all(record.get(k) == source.get(k) for k in ("data_source", "source_modified_at")) for record in records):
            records.append(source)
        entry["sources"] = records

    def finish_deduplication(self, plan):
        by_path = {entry["path"]: entry for entry in self.manifest["file_list"]}
        removed = set()
        for item in plan["duplicates"]:
            canonical = by_path.get(item["kept_path"])
            duplicate = by_path.get(item["removed_path"])
            if not canonical or canonical["sha256"] != item["sha256"]:
                raise ValueError("去重保留记录已变化，停止操作")
            if duplicate:
                if duplicate["sha256"] != item["sha256"]:
                    raise ValueError("去重待删除记录已变化，停止操作")
                for record in self.sources(duplicate):
                    self.append_source(canonical, record)
                removed.add(duplicate["path"])
        if removed:
            self.manifest["file_list"] = [entry for entry in self.manifest["file_list"] if entry["path"] not in removed]
            self.manifest["deduplication_policy"] = "exact_sha256"
            self.save()
        for item in plan["duplicates"]:
            duplicate = self.image_path(item["removed_path"])
            keeper = self.image_path(item["kept_path"])
            if duplicate == keeper:
                raise ValueError("去重计划中的保留与删除路径相同")
            if not keeper.is_file() or digest(keeper) != item["sha256"]:
                raise ValueError("保留原件校验失败，已停止删除重复文件")
            if duplicate.exists():
                if digest(duplicate) != item["sha256"] or not filecmp.cmp(duplicate, keeper, shallow=False):
                    raise ValueError("重复原件发生变化，已停止删除")
                duplicate.unlink()
        plan["status"] = "complete"
        plan["completed_at"] = now()
        write_json(self.root / "reports/deduplication.json", plan)
        return plan

    @archive_operation
    def deduplicate(self):
        pending_path = self.root / "reports/deduplication.json"
        previous = read_json(pending_path, {})
        if previous.get("status") == "pending_deletion":
            result = self.finish_deduplication(previous)
            self.generate()
            return result
        checks = self.verify()
        if checks["failed"] or checks["untracked_files"]:
            raise ValueError("档案校验存在异常，先修复后再去重；没有删除文件")
        kept = {}
        duplicates = []
        for entry in self.manifest["file_list"]:
            h = entry["sha256"]
            if h not in kept:
                kept[h] = copy.deepcopy(entry)
                kept[h]["sources"] = self.sources(entry)
            else:
                canonical = kept[h]
                if not filecmp.cmp(self.image_path(entry["path"]), self.image_path(canonical["path"]), shallow=False):
                    raise ValueError("哈希相同但文件内容不同，已停止")
                canonical["sources"].extend(record for record in self.sources(entry) if record not in canonical["sources"])
                if entry.get("category_source") == "user_selected":
                    canonical["category"] = entry["category"]
                    canonical["category_source"] = "user_selected"
                    if entry.get("content", {}).get("edited_by") == "user":
                        canonical["content"] = copy.deepcopy(entry["content"])
                    elif canonical.get("content"):
                        canonical["content"]["category"] = entry["category"]
                        canonical["content"]["subcategory"] = entry["category"]
                        canonical["content"]["classification_status"] = "user_confirmed"
                duplicates.append(dict(removed_path=entry["path"], kept_path=canonical["path"], sha256=h, file_size=entry["file_size"]))
        plan = dict(status="pending_deletion", prepared_at=now(), duplicates=duplicates,
                    removed_count=len(duplicates), bytes_reclaimed=sum(row["file_size"] for row in duplicates),
                    original_file_count=len(self.manifest["file_list"]), retained_file_count=len(kept),
                    method="SHA-256 plus byte-for-byte comparison; only exact duplicates")
        if duplicates:
            backup_path = self.root / "reports" / ("manifest-before-dedup-" + datetime.now().strftime("%Y%m%d-%H%M%S-%f") + ".json")
            write_json(backup_path, self.manifest)
            # The plan and consolidated provenance are durable before any duplicate is removed.
            write_json(pending_path, plan)
        self.manifest["file_list"] = list(kept.values())
        self.manifest["deduplication_policy"] = "exact_sha256"
        self.save()
        if duplicates:
            self.finish_deduplication(plan)
        else:
            plan["status"] = "complete"
        self.generate()
        return plan

    @archive_operation
    def record_environment(self, env):
        for key in ("operating_system", "device_model", "os_version", "game_name", "game_version", "package_name"):
            self.manifest[key] = env[key]
        write_json(self.root / "reports/environment.json", env)
        self.save()

    def image_info(self, path):
        # Parse a disposable copy so raw originals never become parser inputs.
        with tempfile.TemporaryDirectory(dir=self.root / "parsed") as temp:
            copy = Path(temp) / path.name
            shutil.copy2(path, copy)
            try:
                from PIL import Image
                with Image.open(copy) as im:
                    info = {"format": im.format, "width": im.width, "height": im.height}
                    if im.format not in {"JPEG", "PNG", "WEBP"}:
                        raise ValueError("不支持的图片类型")
                    im.verify()
                with Image.open(copy) as im:
                    im.load()
                return info
            except ImportError:
                signature = copy.read_bytes()[:12]
                if not (signature.startswith(b"\xff\xd8\xff") or signature.startswith(b"\x89PNG\r\n\x1a\n") or
                        (signature.startswith(b"RIFF") and signature[8:12] == b"WEBP")):
                    raise ValueError("文件不是支持的图片格式")
                return {"format": "header_only", "width": None, "height": None}

    def add_file(self, path, source, category, source_mtime=None, expected_hash=None, notes="", image_info=None):
        h = digest(path)
        if expected_hash and h != expected_hash:
            raise ValueError("文件 SHA-256 与手机端不一致")
        relative = path.relative_to(self.root).as_posix()
        entry = {"path": relative, "file_size": path.stat().st_size, "sha256": h,
                 "data_source": source, "category": category, "backed_up_at": now(),
                 "source_modified_at": source_mtime, "notes": notes,
                 "image": image_info or self.image_info(path)}
        existing = next((item for item in self.manifest["file_list"] if item["path"] == relative), None)
        if existing:
            if existing["sha256"] != h:
                raise ValueError("已登记原文件发生变化，停止更新清单")
            return existing
        self.manifest["file_list"].append(entry)
        self.save()
        return entry

    @archive_operation
    def backup(self, adb):
        self.log("检查手机与目标游戏……")
        env = adb.inspect()
        self.record_environment(env)
        inventory = adb.inventory()
        write_json(self.root / "reports/source-inventory.json", {"listed_at": now(), "files": inventory})
        paths = [row["path"] for row in inventory if row["eligible"]]
        self.log(f"发现 {len(paths)} 张候选图片，计算手机端 SHA-256……")
        metadata = adb.image_metadata(paths)
        errors = []
        for index, source in enumerate(paths, 1):
            path = self.root / "raw" / PACKAGE / "files/umeng_cache" / Path(source).name
            path.parent.mkdir(parents=True, exist_ok=True)
            meta = metadata[source]
            if path.exists() and digest(path) != meta["sha256"]:
                path = path.with_name(path.stem + "_" + meta["sha256"] + path.suffix)
            temp = None
            try:
                if self.manifest.get("deduplication_policy") == "exact_sha256":
                    canonical = next((f for f in self.manifest["file_list"] if f["sha256"] == meta["sha256"]), None)
                    if canonical:
                        if digest(self.image_path(canonical["path"])) != meta["sha256"]:
                            raise ValueError("保留原件校验失败；未覆盖")
                        self.append_source(canonical, dict(path=None, data_source=source,
                            source_modified_at=datetime.fromtimestamp(meta["mtime"], timezone.utc).isoformat(),
                            backed_up_at=now(), category="图片缓存"))
                        self.save()
                        continue
                if path.exists():
                    if digest(path) != meta["sha256"]:
                        raise ValueError("已有原件校验失败；未覆盖")
                    info = self.image_info(path)
                else:
                    handle, temp_name = tempfile.mkstemp(suffix=".jpg", dir=self.root / "media")
                    os.close(handle)
                    temp = Path(temp_name)
                    adb.run("pull", "-a", source, str(temp), timeout=90)
                    if temp.stat().st_size != meta["size"] or digest(temp) != meta["sha256"]:
                        raise ValueError("复制时源文件变化或传输不完整")
                    info = self.image_info(temp)
                    temp.rename(path)
                self.add_file(path, source, "图片缓存", datetime.fromtimestamp(meta["mtime"], timezone.utc).isoformat(),
                              meta["sha256"], "从游戏 umeng_cache 原样复制；未自动认定为明信片或完整收藏记录。手机与电脑 SHA-256 一致。", info)
            except (OSError, ValueError, RuntimeError, subprocess.TimeoutExpired) as exc:
                errors.append({"source": source, "error": str(exc)})
            finally:
                if temp and temp.exists():
                    temp.unlink()
            if index % 20 == 0 or index == len(paths):
                self.log(f"已处理 {index}/{len(paths)} 张图片，失败 {len(errors)} 张")
        write_json(self.root / "reports/backup-errors.json", errors)
        self.manifest["last_backup_attempt"] = {"time": now(), "eligible_images": len(paths), "failures": len(errors)}
        self.save()
        self.generate()
        return {"eligible_images": len(paths), "failures": len(errors), "archived_files": len(self.manifest["file_list"])}

    @archive_operation
    def import_images(self, paths, category="截图"):
        for selected in paths:
            source = Path(selected).resolve()
            if source.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
                raise ValueError("只接受用户选择的 JPG、PNG 或 WebP 图片")
            # Use an opaque local name; preserve the selected filename as user-facing metadata only.
            h = digest(source)
            target = self.root / "screenshots" / (h + source.suffix.lower())
            info = self.image_info(source)
            if target.exists() and digest(target) != h:
                raise ValueError("已有截图校验失败；未覆盖")
            if not target.exists():
                shutil.copy2(source, target)
            modified = datetime.fromtimestamp(source.stat().st_mtime, timezone.utc).isoformat()
            entry = self.add_file(target, "user_selected_image:" + source.name, category, modified, h,
                                 "用户手动选取；原样复制，无有损压缩。", info)
            entry["category"] = category
            entry["category_source"] = "user_selected"
            if os.name == "nt":
                entry["source_created_at"] = datetime.fromtimestamp(source.stat().st_ctime, timezone.utc).isoformat()
            else:
                birth = getattr(source.stat(), "st_birthtime", None)
                entry["source_created_at"] = datetime.fromtimestamp(birth, timezone.utc).isoformat() if birth else None
            self.save()
        if self.manifest.get("deduplication_policy") == "exact_sha256":
            self.deduplicate()
        self.generate()

    @archive_operation
    def verify(self):
        checks = []
        for entry in self.manifest["file_list"]:
            path = (self.root / entry["path"]).resolve()
            if not path.is_relative_to(self.root):
                checks.append({"path": entry["path"], "ok": False, "error": "路径越界"})
                continue
            exists = path.is_file()
            h = digest(path) if exists else None
            checks.append({"path": entry["path"], "ok": exists and h == entry["sha256"] and path.stat().st_size == entry["file_size"],
                           "actual_sha256": h})
        registered = {entry["path"] for entry in self.manifest["file_list"]}
        untracked = [p.relative_to(self.root).as_posix() for folder in ("raw", "screenshots")
                     for p in (self.root / folder).rglob("*") if p.is_file() and p.relative_to(self.root).as_posix() not in registered]
        report = {"checked_at": now(), "passed": sum(row["ok"] for row in checks),
                  "failed": sum(not row["ok"] for row in checks), "untracked_files": untracked, "checks": checks}
        write_json(self.root / "reports/integrity.json", report)
        return report

    def data_map(self):
        rows = []
        def row(name, found, location, result, classification, note):
            rows.append(dict(item=name, found=found, location=location, backup=result, classification=classification, note=note))
        env = read_json(self.root / "reports/environment.json", {})
        for name in ("手机型号与系统版本", "游戏版本"):
            row(name, "是" if env else "未检查", "reports/environment.json", "已保存" if env else "未保存", "本地可访问", "系统包管理器及指定系统属性")
        for name in ("用户 UID", "昵称", "明信片记录", "图鉴状态", "已解锁地点", "道具记录", "货币数量", "称号", "任务状态", "活动状态", "旅行历史"):
            row(name, "未验证", "游戏内页面（待人工确认）", "未保存", "当前无法判断", "私有存档未读取；若游戏内可见，可截图补全。不能由缓存图片推断解锁状态或服务端记录。")
        for name, categories in (("明信片记录", {"明信片"}), ("道具记录", {"道具"}),
                                 ("活动状态", {"活动"}), ("旅行历史", {"旅行记录"})):
            count = sum(entry["category"] in categories and bool(entry.get("content")) for entry in self.manifest["file_list"])
            if count:
                item = next(item for item in rows if item["item"] == name)
                item.update(found=f"{count} 张已分类图片", location="parsed/image-metadata/", backup="部分保存",
                            classification="图片中的可见信息", note="分类与图片上的日期、地点已归档；这不是结构化存档，不证明账号状态、数量或记录完整性。")
        for name in ("本地配置", "SharedPreferences / XML", "SQLite 数据库", "JSON 文件", "本地存档文件", "缓存索引"):
            row(name, "未确认", "/data/user/0/" + PACKAGE + "（可能位置）", "无法安全读取", "当前无法判断", "正常系统权限无法继续，这部分数据当前无法安全读取。未读取外部目录中的未知 SDK 文件。")
        images = [entry for entry in self.manifest["file_list"] if entry["path"].startswith("raw/")]
        screenshots = [entry for entry in self.manifest["file_list"] if entry["path"].startswith("screenshots/")]
        row("游戏生成的图片", f"{len(images)} 个图片文件", "raw/" + PACKAGE + "/files/umeng_cache/", "部分保存" if images else "未保存", "本地可访问", "按原图归档；图片分类与可见信息另有索引，不能据此确认游戏收藏覆盖范围。")
        row("本地媒体文件", f"{len(images)} 个图片文件", "raw/" + PACKAGE + "/files/umeng_cache/", "部分保存" if images else "未保存", "本地可访问", "仅目标目录白名单图片；未扫描其他应用、相册或全部共享存储。与上项为同一批文件，勿重复计算。")
        row("游戏截图", f"{len(screenshots)} 个用户选取文件", "screenshots/", "部分保存" if screenshots else "待人工补全", "用户手动截图", "未自动读取整台手机相册；请只导入本人游戏截图，排除登录及支付页面。")
        row("时间戳", "有源文件修改时间" if images else "未确认", "manifest.json", "部分保存" if images else "未保存", "本地可访问", "文件修改时间不是旅行发生时间；Android 图片创建时间未知。截图创建时间仅在文件系统提供时记录。")
        row("系统本地备份", "应用未允许标准备份" if env.get("allow_backup") is False else "未验证", "无", "无法取得", "系统备份可获得性未确认", "检测到系统备份服务关闭；未开启云备份，未执行 adb backup。厂商备份能否包含本游戏尚未验证，且完整备份可能包含认证信息。")
        row("仅服务端数据", "无法判断", "服务器（未访问）", "未保存", "可能仅存在服务器端", "未拦截通信、请求服务端或读取 Token，不能确认哪些记录仅在服务端。")
        metadata = [entry.get("content", {}) for entry in self.manifest["file_list"] if entry.get("content")]
        if metadata:
            row("图片对应信息", f"{len(metadata)} 份图片信息", "parsed/image-metadata/", "部分保存", "本地 OCR 与图像核对",
                "保留分类、图片日期、地点、署名、识别原文与来源。图片没有写出的字段不推测。")
            row("重复文件来源", "已合并", "manifest.json / reports/deduplication.json", "已保存", "本地文件比较",
                "只删除 SHA-256 与逐字节比较均一致的副本；保留不同日期、边框或分享内容的相似图片，以及所有原始来源记录。")
        return rows

    def write_image_indexes(self):
        records = []
        output = self.root / "parsed/image-metadata"
        output.mkdir(exist_ok=True)
        for entry in self.manifest["file_list"]:
            if not entry.get("content"):
                continue
            record = dict(sha256=entry["sha256"], image_path=entry["path"], image=entry["image"], file_size=entry["file_size"],
                          sources=self.sources(entry), **entry["content"])
            write_json(output / (entry["sha256"] + ".json"), record)
            records.append(record)
        if not records:
            return
        from collections import Counter
        summary = dict(updated_at=now(), categories=dict(Counter(record["category"] for record in records)),
                       records=len(records), displayed_dates=sum(bool(record.get("displayed_date")) for record in records),
                       locations=sum(bool(record.get("location")) for record in records),
                       ocr_unverified_note="OCR 原文保留识别错误；核对值与 OCR 值分开记录。")
        write_json(self.root / "reports/image-metadata-summary.json", summary)
        groups = {"postcards": [record for record in records if record["category"] == "明信片"],
                  "collections": [record for record in records if record["category"] in {"收藏", "图鉴", "扭蛋记录", "贴纸分享"}],
                  "inventory": [record for record in records if record["category"] == "道具"],
                  "activities": [record for record in records if record["category"] == "活动"],
                  "travel_history": [record for record in records if record.get("displayed_date")]}
        for name, group in groups.items():
            path = self.root / "parsed" / (name + ".json")
            existing = read_json(path, {})
            if existing.get("status") not in (None, "not_available") and existing.get("generated_by") != "image_metadata":
                continue
            write_json(path, dict(status="partial_image_evidence", generated_by="image_metadata", source="image_visible_text",
                                  records=group, notes="仅图片证据。日期是图片上的印刷日期，不等于已取得游戏数据库中的完整旅行或收藏记录。"))
        path = self.root / "parsed/profile.json"
        existing = read_json(path, {})
        if existing.get("status") in (None, "not_available") or existing.get("generated_by") == "image_metadata":
            captions = sorted({record["caption"] for record in records if record.get("caption")})
            write_json(path, dict(status="partial_image_evidence", generated_by="image_metadata", uid=None, nickname=None,
                                  visible_captions=captions, caption_role=None,
                                  notes="图片署名来自 OCR。它属于账户昵称、青蛙名字还是其他字段，未确认。"))

    @archive_operation
    def edit_image(self, sha256, values):
        from datetime import date
        entry = next((file for file in self.manifest["file_list"] if file["sha256"] == sha256), None)
        if entry is None:
            raise ValueError("没有找到对应图片")
        if digest(self.image_path(entry["path"])) != sha256:
            raise ValueError("原图校验失败；未更新资料")
        allowed = {"title", "category", "displayed_date", "location", "caption"}
        if set(values) - allowed:
            raise ValueError("图片信息包含不支持的字段")
        updates = {key: value.strip() or None for key, value in values.items()}
        if updates.get("displayed_date"):
            date.fromisoformat(updates["displayed_date"])
        if not updates.get("category"):
            raise ValueError("请选择分类")
        entry.setdefault("content", {}).update(updates)
        content = entry["content"]
        entry["category"] = content["category"]
        entry["category_source"] = "user_selected"
        content.update(edited_by="user", edited_at=now(), classification_status="user_confirmed",
                       date_status="user_confirmed" if content.get("displayed_date") else "not_confirmed",
                       location_status="user_confirmed" if content.get("location") else "not_visible_or_unconfirmed",
                       caption_status="user_confirmed" if content.get("caption") else "not_confirmed")
        content["subcategory"] = ("地点明信片" if content.get("location") else "日常明信片") if entry["category"] == "明信片" else entry["category"]
        self.save()
        self.generate()

    @archive_operation
    def generate(self):
        self.save()
        for name in ("profile", "collections", "postcards", "inventory", "travel_history"):
            path = self.root / "parsed" / (name + ".json")
            if not path.exists():
                write_json(path, {"status": "not_available", "source": None, "records": [],
                                  "notes": "未取得可安全解析的结构化存档。空列表不表示游戏中没有记录。"})
        write_json(self.root / "parsed/media.json", {"status": "partial", "records": self.manifest["file_list"]})
        self.write_image_indexes()
        rows = self.data_map()
        write_json(self.root / "reports/data-map.json", rows)
        checks = self.verify()
        (self.root / "reports/manual-checklist.md").write_text(MANUAL_CHECKLIST, encoding="utf-8")
        from viewer_template import render_viewer, render_report
        catalog = read_json(self.root / "parsed/resource-catalog.json", None)
        resource_checks = None
        if catalog:
            from resource_catalog import verify_catalog, render_catalog
            resource_checks = verify_catalog(self.root, catalog)
            write_json(self.root / "reports/resource-integrity.json", resource_checks)
            (self.root / "viewer/resources.html").write_text(render_catalog(catalog, resource_checks), encoding="utf-8")
        from tumbler_viewer import load_tumbler_assets
        tumbler = load_tumbler_assets(self.root)
        (self.root / "viewer/index.html").write_text(render_viewer(self.manifest, rows, checks, catalog, resource_checks, tumbler), encoding="utf-8")
        (self.root / "reports/backup-report.html").write_text(render_report(self.manifest, rows, checks), encoding="utf-8")
        self.log(f"离线档案已生成：{self.root / 'viewer/index.html'}")


MANUAL_CHECKLIST = """# 停服前保存清单

当前档案为部分媒体备份，不是能恢复游戏的完整存档。

- [ ] 个人主页、昵称、UID（避开手机号、登录二维码和认证信息）
- [ ] 明信片总览与逐张详情，长列表分屏保存并留少量重叠
- [ ] 图鉴总览、各分类、已解锁地点
- [ ] 道具、特产、护身符、货币数量
- [ ] 称号与成就
- [ ] 旅行历史、日期、伙伴来访记录
- [ ] 任务与活动页面、活动奖励及收藏
- [ ] 其他收藏、游戏内帮助及停服公告

在手机上手动截图，或用游戏自带的保存图片功能。用 USB 文件传输将自己选定的游戏图片复制到电脑，再在桌面工具中点击“导入截图”。不会扫描整个相册。

不要导入登录页面、登录二维码、Cookie、Token、支付凭证或其他认证信息。分享卡片中的分享码与登录二维码不同，但不确定用途的图片应先人工确认。

导入后点击“生成时光胶囊”。图片不做有损压缩，原文件保留并记录 SHA-256。

时间线优先使用截图来源文件的创建时间；没有可靠创建时间则使用文件修改时间。复制到电脑可能改变创建时间，它不能证明实际游玩日期。

若没有某个游戏页面，标记“游戏内不可见／尚未确认”，不要推测数据已丢失或仅存在服务器。
"""


def main():
    parser = argparse.ArgumentParser(description="旅行青蛙本地媒体备份")
    parser.add_argument("command", nargs="?", default="gui", choices=["gui", "inspect", "backup", "generate", "verify", "import", "deduplicate"])
    parser.add_argument("--output", type=Path, default=DEFAULT_ARCHIVE)
    parser.add_argument("--adb")
    parser.add_argument("--files", nargs="*", default=[])
    args = parser.parse_args()
    if args.command == "gui":
        from desktop import launch
        launch(args.output)
        return
    capsule = Capsule(args.output)
    if args.command == "inspect":
        env = Adb(args.adb).inspect()
        capsule.record_environment(env)
        print(json.dumps(env, ensure_ascii=False, indent=2))
    elif args.command == "backup":
        print(json.dumps(capsule.backup(Adb(args.adb)), ensure_ascii=False))
    elif args.command == "generate":
        capsule.generate()
    elif args.command == "verify":
        result = capsule.verify()
        print(json.dumps({k: v for k, v in result.items() if k != "checks"}, ensure_ascii=False, indent=2))
        raise SystemExit(1 if result["failed"] or result["untracked_files"] else 0)
    elif args.command == "import":
        capsule.import_images(args.files)
    elif args.command == "deduplicate":
        result = capsule.deduplicate()
        print(json.dumps({k: v for k, v in result.items() if k != "duplicates"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, ValueError, subprocess.SubprocessError) as exc:
        print("操作未完成：" + str(exc), file=sys.stderr)
        raise SystemExit(1)
