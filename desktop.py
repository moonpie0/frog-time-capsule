"""Small desktop front end; all device work stays on the computer."""

import queue
import threading
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import webbrowser

from capsule import Adb, Capsule


def launch(output):
    root = tk.Tk()
    root.title("旅行青蛙 · 本地备份")
    root.geometry("820x640")
    root.minsize(640, 520)
    root.configure(bg="#f5f7f6")
    style = ttk.Style()
    if "clam" in style.theme_names():
        style.theme_use("clam")
    style.configure("TFrame", background="#f5f7f6")
    style.configure("TLabel", background="#f5f7f6", font=("Microsoft YaHei UI", 10))
    style.configure("TButton", padding=(12, 9), font=("Microsoft YaHei UI", 10))
    style.configure("Title.TLabel", font=("Microsoft YaHei UI", 19, "bold"))
    outer = ttk.Frame(root, padding=24)
    outer.pack(fill="both", expand=True)
    ttk.Label(outer, text="旅行青蛙 · 中国之旅", style="Title.TLabel").pack(anchor="w")
    ttk.Label(outer, text="个人数据本地备份", foreground="#65706b").pack(anchor="w", pady=(6, 20))
    ttk.Label(outer, text="保存位置：" + str(output), wraplength=710).pack(anchor="w")
    status = tk.StringVar(value="手机尚未检查")
    ttk.Label(outer, textvariable=status, foreground="#21674d", wraplength=710).pack(anchor="w", pady=(12, 16))
    controls = ttk.Frame(outer)
    controls.pack(fill="x")
    events = queue.Queue()
    busy = False
    capsule = Capsule(output, log=lambda line: events.put(("log", line)))
    buttons = []

    def start(action, success):
        nonlocal busy
        if busy:
            return
        busy = True
        for button in buttons:
            button.configure(state="disabled")
        status.set("处理中……")
        def worker():
            try:
                value = action()
                events.put(("done", success(value)))
            except Exception as exc:
                events.put(("error", str(exc)))
        threading.Thread(target=worker, daemon=True).start()

    def inspect():
        def action():
            env = Adb().inspect()
            capsule.record_environment(env)
            return env
        start(action, lambda env: f"已连接 {env['device_model']} · Android {env['os_version']} · 游戏 {env['game_version']} · 私有存档未读取")

    def backup():
        start(lambda: capsule.backup(Adb()), lambda result: f"备份完成：档案共 {result['archived_files']} 个文件，本次失败 {result['failures']} 个")

    def imports():
        if not messagebox.askokcancel("选择截图范围", "请选择你自己的游戏截图。请排除登录二维码、密码、Token、支付凭证及其他认证信息。", parent=root):
            return
        paths = filedialog.askopenfilenames(title="选择本人游戏截图", filetypes=[("图片", "*.png *.jpg *.jpeg *.webp")])
        if paths:
            category = category_var.get()
            start(lambda: capsule.import_images(paths, category), lambda _: f"已处理 {len(paths)} 个选定图片，原样保存")

    commands = [("检查", inspect), ("开始备份", backup), ("导入截图", imports),
                ("生成时光胶囊", lambda: start(capsule.generate, lambda _: "离线档案已生成"))]
    for index, (label, command) in enumerate(commands):
        controls.columnconfigure(index, weight=1)
        button = ttk.Button(controls, text=label, command=command)
        button.grid(row=0, column=index, sticky="ew", padx=(0, 8) if index < 3 else 0)
        buttons.append(button)
    options = ttk.Frame(outer)
    options.pack(fill="x", pady=14)
    ttk.Label(options, text="导入分类").pack(side="left", padx=(0, 10))
    category_var = tk.StringVar(value="截图")
    ttk.Combobox(options, textvariable=category_var, state="readonly", width=12,
                 values=["截图", "资料", "明信片", "图鉴", "收藏", "道具", "贴纸分享", "扭蛋记录", "旅行记录", "活动", "其他图片"]).pack(side="left")

    def open_viewer():
        path = capsule.root / "viewer/index.html"
        if path.exists():
            webbrowser.open(path.as_uri())
        else:
            messagebox.showinfo("尚未生成", "尚未生成离线档案。", parent=root)

    ttk.Button(options, text="打开离线档案", command=open_viewer).pack(side="right")
    def verification_status(result):
        return f"校验：{result['passed']} 通过，{result['failed']} 失败，{len(result['untracked_files'])} 未登记"
    verify = ttk.Button(options, text="校验文件", command=lambda: start(capsule.verify, verification_status))
    verify.pack(side="right", padx=8)
    buttons.append(verify)
    extra = ttk.Frame(outer)
    extra.pack(fill="x", pady=(0, 12))

    def organize():
        def action():
            from organize import ocr_images, annotate_images
            capsule.log("合并完全相同的图片并保留来源记录……")
            capsule.deduplicate()
            capsule.log("识别图片文字，已有本人补充信息会保留……")
            ocr_images(capsule)
            annotate_images(capsule)
        start(action, lambda _: "图片去重与文字整理完成")

    def edit_images():
        from capsule import read_json
        capsule.manifest = read_json(capsule.root / "manifest.json", capsule.manifest)
        entries = capsule.manifest["file_list"]
        if not entries:
            messagebox.showinfo("尚无图片", "档案中尚无图片。", parent=root)
            return
        dialog = tk.Toplevel(root)
        dialog.title("图片资料")
        dialog.geometry("940x680")
        dialog.minsize(760, 560)
        dialog.transient(root)
        dialog.grab_set()
        panel = ttk.Frame(dialog, padding=18)
        panel.pack(fill="both", expand=True)
        panel.columnconfigure(1, weight=1)
        panel.rowconfigure(0, weight=1)
        listing = tk.Listbox(panel, width=32, font=("Microsoft YaHei UI", 10), exportselection=False)
        listing.grid(row=0, column=0, rowspan=8, sticky="nsew", padx=(0, 18))
        preview = ttk.Label(panel, text="", anchor="center")
        preview.grid(row=0, column=1, columnspan=2, sticky="nsew")
        categories = ["明信片", "图鉴", "收藏", "道具", "贴纸分享", "扭蛋记录", "旅行记录", "活动", "其他图片", "截图", "资料", "图片缓存", "待分类"]
        fields = {}
        for index, (key, label) in enumerate((("title", "标题"), ("category", "分类"), ("displayed_date", "图片日期 YYYY-MM-DD"),
                                                ("location", "图片地点"), ("caption", "图片署名")), 1):
            ttk.Label(panel, text=label).grid(row=index, column=1, sticky="w", pady=7)
            value = tk.StringVar()
            fields[key] = value
            widget = ttk.Combobox(panel, textvariable=value, values=categories, state="readonly") if key == "category" else ttk.Entry(panel, textvariable=value)
            widget.grid(row=index, column=2, sticky="ew", padx=(15, 0), pady=7)
        panel.columnconfigure(2, weight=2)

        def label_for(entry):
            data = entry.get("content", {})
            return f"{entry['category']} · {data.get('title') or entry['path'].split('/')[-1][:12]}"
        for entry in entries:
            listing.insert("end", label_for(entry))

        def select(_=None):
            selection = listing.curselection()
            if not selection:
                return
            entry = entries[selection[0]]
            data = entry.get("content", {})
            for key, value in fields.items():
                value.set((entry["category"] if key == "category" else data.get(key)) or "")
            try:
                from PIL import Image, ImageTk
                with Image.open(capsule.image_path(entry["path"])) as image:
                    image.thumbnail((420, 290))
                    preview.image = ImageTk.PhotoImage(image.copy())
                preview.configure(image=preview.image, text="")
            except ImportError:
                preview.configure(text=entry["path"], wraplength=420)

        def save_image():
            selection = listing.curselection()
            if not selection:
                return
            index = selection[0]
            entry = entries[index]
            try:
                capsule.edit_image(entry["sha256"], {key: value.get() for key, value in fields.items()})
                entries[index] = next(item for item in capsule.manifest["file_list"] if item["sha256"] == entry["sha256"])
                listing.delete(index)
                listing.insert(index, label_for(entries[index]))
                listing.selection_set(index)
                status.set("图片资料已保存，离线档案已更新")
            except Exception as exc:
                messagebox.showerror("未保存", str(exc), parent=dialog)

        ttk.Button(panel, text="打开原图", command=lambda: webbrowser.open(capsule.image_path(entries[listing.curselection()[0]]["path"]).as_uri()) if listing.curselection() else None).grid(row=6, column=1, sticky="w", pady=15)
        ttk.Button(panel, text="保存资料", command=save_image).grid(row=6, column=2, sticky="e", pady=15)
        listing.bind("<<ListboxSelect>>", select)
        listing.selection_set(0)
        select()

    for label, action in (("去重并整理文字", organize), ("编辑图片资料", edit_images)):
        button = ttk.Button(extra, text=label, command=action)
        button.pack(side="left", padx=(0, 10))
        buttons.append(button)
    text = tk.Text(outer, wrap="word", height=16, relief="flat", padx=12, pady=12,
                   font=("Microsoft YaHei UI", 10), bg="white", fg="#303b34", state="disabled")
    text.pack(fill="both", expand=True)
    ttk.Label(outer, text="部分媒体备份 · 私有存档无法安全读取 · 无云端上传", foreground="#7b6429").pack(anchor="w", pady=(12, 0))

    def drain():
        nonlocal busy
        while not events.empty():
            kind, value = events.get_nowait()
            text.configure(state="normal")
            text.insert("end", value + "\n")
            text.see("end")
            text.configure(state="disabled")
            if kind in {"done", "error"}:
                busy = False
                for button in buttons:
                    button.configure(state="normal")
                status.set(value if kind == "done" else "操作未完成")
                if kind == "error":
                    messagebox.showerror("操作未完成", value, parent=root)
        root.after(120, drain)

    def close():
        if busy:
            messagebox.showinfo("备份进行中", "当前操作完成后可关闭窗口。", parent=root)
        else:
            root.destroy()
    root.protocol("WM_DELETE_WINDOW", close)
    drain()
    root.mainloop()
