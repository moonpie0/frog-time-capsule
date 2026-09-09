(() => {
const embedded = Boolean(document.querySelector('[data-view="resources"]'));
const get = id => document.getElementById(id);
const node = (tag, text, className) => {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (className) item.className = className;
  return item;
};
const assetUrl = path => '../' + path.split('/').map(encodeURIComponent).join('/');
const title = item => item.official_name || item.label;
const allItems = catalog.items.filter(item => !item.hidden_reason).sort((a, b) =>
  Number(Boolean(b.official_name || b.linked_photos.length)) - Number(Boolean(a.official_name || a.linked_photos.length)) ||
  a.resource_key.localeCompare(b.resource_key, 'en', { numeric: true }));
let category = '', visible = [], current = 0;
get('catalog-total').textContent = allItems.length;
for (const [id, name] of [['count-collections', '收藏物'], ['count-items', '道具'], ['count-furniture', '家具']]) {
  get(id).textContent = catalog.categories[name] || 0;
}
get('catalog-integrity').textContent = catalogChecks.failed
  ? `${catalogChecks.failed} 个素材文件校验失败`
  : `${catalogChecks.passed} 个素材文件校验通过`;
if (catalogChecks.untracked_files.length) {
  get('catalog-integrity').textContent += `；另有 ${catalogChecks.untracked_files.length} 个未登记文件`;
}
function anchor(text, href) {
  const link = node('a', text); link.href = href; return link;
}
function render() {
  const query = get('catalog-search').value.trim().toLowerCase();
  visible = allItems.filter(item => (!category || item.category === category) &&
    (!get('catalog-linked').checked || item.linked_photos.length) &&
    [item.official_name, item.label, item.description, item.location, item.resource_key].filter(Boolean).join(' ').toLowerCase().includes(query));
  get('catalog-heading').textContent = `${category || '全部素材'} · ${visible.length}`;
  get('catalog-empty').hidden = visible.length !== 0;
  get('catalog-gallery').replaceChildren();
  for (const [index, item] of visible.entries()) {
    const article = node('article', undefined, 'photo');
    const button = node('button', undefined, 'photo-open');
    button.setAttribute('aria-label', '查看 ' + title(item));
    const image = node('img'); image.src = assetUrl(item.image_path); image.alt = title(item); image.loading = 'lazy';
    button.append(image); button.onclick = () => show(index);
    const caption = node('div', undefined, 'caption');
    caption.append(node('strong', title(item), 'image-title'), node('div', item.category + ' · 拥有状态未知', 'muted'));
    if (item.description) caption.append(node('div', item.description, 'catalog-desc'));
    if (item.linked_photos.length) caption.append(node('div', `${item.linked_photos.length} 张分享图关联`, 'kind'));
    article.append(button, caption); get('catalog-gallery').append(article);
  }
}
function show(index) {
  if (!visible.length) return;
  current = (index + visible.length) % visible.length;
  const item = visible[current], info = get('resource-info');
  get('resource-title').textContent = `${current + 1} / ${visible.length} · ${item.category}`;
  get('resource-image').src = assetUrl(item.image_path); get('resource-image').alt = title(item);
  info.replaceChildren(node('h2', title(item)));
  const fields = node('dl');
  for (const [label, value] of [['名称', item.official_name || '未解析'], ['图片说明', item.description || '未取得'],
    ['图片地点标注', item.location || '未取得'], ['拥有状态', '未知'], ['原始资源编号', item.resource_key],
    ['尺寸', `${item.width} × ${item.height}`], ['资源版本', item.resource_version],
    ['名称与说明依据', item.annotation_source ? '分享图片可见文字，已核对' : '未取得明文配置']]) {
    fields.append(node('dt', label), node('dd', String(value)));
  }
  info.append(fields, anchor('打开独立图片', assetUrl(item.image_path)), anchor('原始图集', assetUrl(item.source_image)),
    anchor('裁切坐标 JSON', assetUrl(item.source_index)));
  if (item.linked_photos.length) {
    info.append(node('h3', '关联分享图'));
    for (const photo of item.linked_photos) {
      const link = anchor(photo.label, (embedded ? '' : 'index.html') + '#photo-' + photo.sha256);
      if (embedded) link.onclick = event => {
        event.preventDefault();
        get('resource-dialog').close();
        window.openPhotoBySha(photo.sha256);
      };
      info.append(link);
    }
    info.append(node('p', '图像对应关系已核对；分享图不代表当前仍持有该物品。', 'muted'));
  }
  const file = catalog.file_list.find(file => file.path === item.image_path);
  info.append(node('p', 'SHA-256', 'muted'), node('code', file.sha256));
  if (!get('resource-dialog').open) get('resource-dialog').showModal();
  history.replaceState(null, '', '#resource-' + encodeURIComponent(item.id));
  info.scrollTop = 0;
}
document.querySelectorAll('[data-category]').forEach(button => {
  button.onclick = () => {
    category = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  };
});
get('catalog-search').oninput = render;
get('catalog-linked').onchange = render;
get('resource-prev').onclick = () => show(current - 1);
get('resource-next').onclick = () => show(current + 1);
get('resource-close').onclick = () => get('resource-dialog').close();
get('resource-dialog').addEventListener('close', () => {
  if (location.hash.startsWith('#resource-')) history.replaceState(null, '', embedded ? '#resources' : location.href.split('#')[0]);
});
get('resource-dialog').addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(current + (event.key === 'ArrowLeft' ? -1 : 1)); }
});
function openResource(id) {
  if (!allItems.some(item => item.id === id)) return;
  if (embedded) selectView('resources');
  category = '';
  get('catalog-search').value = '';
  get('catalog-linked').checked = false;
  document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === '')));
  render();
  const index = visible.findIndex(item => item.id === id);
  if (index >= 0) show(index);
}
window.openCatalogResource = openResource;
function openHash() {
  if (embedded && location.hash === '#resources') selectView('resources');
  if (location.hash.startsWith('#resource-')) openResource(decodeURIComponent(location.hash.slice(10)));
}
render();
window.addEventListener('hashchange', openHash);
openHash();
})();
