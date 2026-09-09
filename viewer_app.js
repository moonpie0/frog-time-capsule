const $ = id => document.getElementById(id);
const files = manifest.file_list;
const meta = file => file.content || {};
const sourceTime = file => file.source_created_at || file.source_modified_at || '';
const pictureDate = file => meta(file).displayed_date || '';
const reviewLabel = status => status === 'visually_reviewed' ? '（已核对）' : status === 'user_confirmed' ? '（本人确认）' : '';
const titleOf = file => meta(file).title || file.category;
const url = path => '../' + path.split('/').map(encodeURIComponent).join('/');
const fileUrl = file => url(file.path);
const displayDate = value => value ? new Date(value).toLocaleString('zh-CN', {hour12: false}) : '未确认';
const sizeText = size => size >= 1048576 ? (size / 1048576).toFixed(1) + ' MB' : (size / 1024).toFixed(1) + ' KB';
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
function link(text, path) {
  const anchor = element('a', text);
  anchor.href = url(path);
  anchor.target = '_blank';
  anchor.rel = 'noopener';
  return anchor;
}
function sourcesOf(file) { return file.sources || [file]; }
const predicates = {
  all: () => true,
  postcards: file => file.category === '明信片',
  collections: file => ['图鉴', '收藏', '扭蛋记录'].includes(file.category),
  inventory: file => file.category === '道具',
  stickers: file => file.category === '贴纸分享',
  activities: file => file.category === '活动',
  travel: file => file.category === '旅行记录',
  timeline: file => Boolean(pictureDate(file)),
  other: file => ['其他图片', '图片缓存', '待分类'].includes(file.category),
  screenshots: file => file.path.startsWith('screenshots/') || sourcesOf(file).some(source => (source.path || '').startsWith('screenshots/'))
};
const titles = {all:'全部图片', postcards:'明信片', collections:'图鉴与收藏', inventory:'道具资料', stickers:'贴纸分享',
  activities:'活动图片', travel:'旅行汇总', timeline:'图片日期时间线', other:'其他图片', screenshots:'补充截图'};
let view = files.some(predicates.postcards) ? 'postcards' : 'all';
let visible = [], active = 0;
$('device').textContent = `${manifest.device_model || '型号待确认'} · Android ${manifest.os_version || '待确认'} · 游戏 ${manifest.game_version || '待确认'}`;
$('integrity').textContent = verification.failed || verification.untracked_files.length ? '校验存在异常' : `${verification.passed} 个原件校验通过`;
$('image-count').textContent = files.length;
$('screen-count').textContent = files.filter(predicates.screenshots).length;
$('size').textContent = sizeText(files.reduce((size, file) => size + file.file_size, 0));
$('day').textContent = manifest.backup_time.slice(0, 10);
$('verified-at').textContent = '校验时间：' + displayDate(verification.checked_at) + '。此处显示生成页面时的结果；后续变化需要重新校验。';
const checkMap = new Map(verification.checks.map(check => [check.path, check.ok]));
for (const file of files) {
  const tr = element('tr'), path = element('td', undefined, 'path');
  path.append(link(file.path, file.path));
  tr.append(path);
  for (const value of [sizeText(file.file_size), file.sha256, checkMap.get(file.path) ? '通过' : '失败']) {
    const cell = element('td');
    cell.append(element('code', value));
    tr.append(cell);
  }
  $('files-body').append(tr);
}
const captions = [...new Set(files.map(file => meta(file).caption).filter(Boolean))];
const profile = element('table');
for (const [label, value] of [['游戏', manifest.game_name], ['版本', manifest.game_version], ['UID', '未取得'], ['账号昵称', '未确认'],
  ['图片署名（OCR，字段含义未确认）', captions.join('、') || '未确认'], ['设备', manifest.device_model], ['备份日期', displayDate(manifest.backup_time)]]) {
  const tr = element('tr');
  tr.append(element('td', label), element('td', value || '未确认'));
  profile.append(tr);
}
$('profile-table').append(profile);
for (const year of [...new Set(files.map(file => pictureDate(file).slice(0, 4)).filter(Boolean))].sort().reverse()) {
  const option = element('option', year + ' 年'); option.value = year; $('year-filter').append(option);
}
function searchable(file) {
  const data = meta(file);
  return [file.path, data.title, data.location, data.caption, data.displayed_date, data.ocr_text,
    ...sourcesOf(file).map(source => source.data_source)].filter(Boolean).join('\n').toLowerCase();
}
function render() {
  const query = $('search').value.trim().toLowerCase(), kind = $('kind-filter').value, year = $('year-filter').value;
  visible = files.filter(file => predicates[view](file) && searchable(file).includes(query) &&
    (!kind || meta(file).subcategory === kind) && (!year || pictureDate(file).startsWith(year)));
  const order = $('sort').value;
  visible.sort((a, b) => {
    if (order === 'name') return titleOf(a).localeCompare(titleOf(b), 'zh-CN');
    if (order === 'source') return sourceTime(b).localeCompare(sourceTime(a));
    const left = pictureDate(a), right = pictureDate(b);
    if (!left && right) return 1;
    if (left && !right) return -1;
    return (left.localeCompare(right) || sourceTime(a).localeCompare(sourceTime(b))) * (order === 'new' ? -1 : 1);
  });
  $('gallery').replaceChildren();
  $('view-title').replaceChildren(document.createTextNode(titles[view]), element('span', String(visible.length), 'count-label'));
  $('empty').hidden = visible.length > 0;
  $('kind-filter').hidden = !['postcards', 'all'].includes(view);
  visible.forEach((file, index) => {
    const data = meta(file), article = element('article', undefined, 'photo');
    const open = element('button', undefined, 'photo-open');
    open.setAttribute('aria-label', '查看图片 ' + (index + 1) + ' ' + titleOf(file));
    const img = element('img');
    img.src = fileUrl(file); img.alt = titleOf(file); img.loading = 'lazy'; img.decoding = 'async';
    open.append(img); open.onclick = () => show(index);
    const caption = element('div', undefined, 'caption');
    caption.append(element('strong', titleOf(file), 'image-title'));
    caption.append(element('div', '图片日期 · ' + (pictureDate(file) || '未确认'), 'muted'));
    const state = data.classification_status === 'visually_reviewed' ? '已核对分类' : (data.edited_by === 'user' ? '本人补充' : '未核对分类');
    caption.append(element('div', `${data.subcategory || file.category} · ${state}`, 'kind'));
    caption.append(element('div', `${file.image.width || '?'} × ${file.image.height || '?'} · ${sourcesOf(file).length} 条来源`, 'muted'));
    caption.append(link('原图', file.path));
    article.append(open, caption); $('gallery').append(article);
  });
}
function show(index) {
  if (!visible.length) return;
  active = (index + visible.length) % visible.length;
  const file = visible[active], data = meta(file), info = $('light-info');
  $('light-image').src = fileUrl(file); $('light-image').alt = titleOf(file);
  $('light-title').textContent = `${active + 1} / ${visible.length} · ${file.category}`;
  info.replaceChildren(element('h2', titleOf(file)));
  const list = element('dl');
  const fields = [
    ['分类', (data.subcategory || file.category) + reviewLabel(data.classification_status)],
    ['图片上的日期', (data.displayed_date || '未确认') + reviewLabel(data.date_status)],
    ['图片上的地点', (data.location || '未印出或尚未确认') + (reviewLabel(data.location_status) || (data.location_status === 'ocr_unverified' ? '（OCR，待核对）' : ''))],
    ['图片署名', data.caption ? data.caption + (data.caption_status === 'user_confirmed' ? '（本人确认；字段含义未确认）' : '（OCR；字段含义未确认）') : '未确认'],
    ['来源文件修改时间', displayDate(file.source_modified_at)],
    ['原图格式与尺寸', `${file.image.format} · ${file.image.width || '?'} × ${file.image.height || '?'} · ${sizeText(file.file_size)}`],
    ['SHA-256', file.sha256]
  ];
  for (const [label, value] of fields) list.append(element('dt', label), element('dd', value));
  info.append(list, link('打开原图', file.path));
  if (file.content) info.append(link('图片信息 JSON', 'parsed/image-metadata/' + file.sha256 + '.json'));
  if (data.ocr_file) info.append(link('OCR 原始结果', data.ocr_file));
  info.append(element('p', '图片日期仅表示图中文字，不推断为出发、收件或服务器时间。', 'muted'));
  if (data.ocr_text) {
    const disclosure = element('details');
    disclosure.append(element('summary', '识别原文（未校正文稿）'), element('pre', data.ocr_text));
    info.append(disclosure);
  }
  const sources = element('details');
  sources.append(element('summary', `全部来源 · ${sourcesOf(file).length} 条`));
  for (const origin of sourcesOf(file)) {
    const item = element('div', undefined, 'source-item');
    item.append(element('div', origin.data_source || origin.path || '未知来源'),
      element('div', '原路径：' + (origin.path || '与保留原件合并')),
      element('div', '修改时间：' + displayDate(origin.source_modified_at)));
    sources.append(item);
  }
  info.append(sources);
  if (!$('lightbox').open) $('lightbox').showModal();
  info.scrollTop = 0;
}
function selectView(next) {
  view = next;
  document.querySelectorAll('nav button').forEach(button => button.setAttribute('aria-current', String(button.dataset.view === view)));
  $('media-view').hidden = !predicates[view];
  for (const name of ['profile', 'map', 'files']) $(name + '-view').hidden = view !== name;
  $('search').value = ''; $('kind-filter').value = ''; $('year-filter').value = '';
  if (predicates[view]) render();
}
document.querySelectorAll('nav button').forEach(button => {
  if (predicates[button.dataset.view]) button.append(element('span', String(files.filter(predicates[button.dataset.view]).length)));
  button.onclick = () => selectView(button.dataset.view);
});
$('search').oninput = render;
for (const id of ['sort', 'kind-filter', 'year-filter']) $(id).onchange = render;
$('prev').onclick = () => show(active - 1); $('next').onclick = () => show(active + 1);
$('close').onclick = () => $('lightbox').close();
$('lightbox').addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); show(active + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});
selectView(view);
