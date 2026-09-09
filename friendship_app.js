(() => {
  const get = id => document.getElementById('friendship-' + id);
  const labels = { pages: '绘本页', gifts: '赠礼图片', scenes: '场景与界面' };
  const items = friendshipCatalog.items.slice().sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
  const assetUrl = item => '../' + item.path.split('/').map(encodeURIComponent).join('/');
  const node = (tag, text, css) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; if (css) el.className = css; return el; };
  const authors = friendshipCatalog.authors || [];
  let category = 'pages', author = authors[0]?.id || null, visible = [], current = 0, shelf = true;
  const authorName = () => authors.find(row => row.id === author)?.name || labels.pages;
  const ownershipLabel = item => ({ obtained: '已获得', not_obtained: '未获得' }[item.ownership] || '获得状态未知');
  const progress = friendshipCatalog.page_ownership;
  get('summary').textContent = progress ? `绘本已获得 ${progress.obtained} / ${progress.total} 页` : '绘本页与相关素材 · 个人收集状态未知';
  get('total').textContent = items.length + ' 个图片条目已保存';
  for (const [target, resource] of [['backdrop', 'back_picture_book_png'], ['title', 'picture_book_png']]) {
    const item = items.find(row => row.id === resource);
    if (item) { get(target).src = assetUrl(item); get(target).dataset.resourceId = resource; }
  }
  const galleryHash = () => category === 'pages' ? '#friendship-author-' + author : '#friendship-category-' + category;
  function openShelf() {
    shelf = true; category = 'pages'; get('search').value = ''; updateTabs(); render();
  }
  function openAuthor(id) {
    shelf = false; category = 'pages'; author = id; get('search').value = ''; updateTabs(); render();
    history.replaceState(null, '', galleryHash());
    get('detail-header').scrollIntoView({ block: 'start' });
  }
  function render() {
    get('shelf').hidden = !shelf; get('detail-header').hidden = shelf; get('layout').hidden = shelf;
    get('view').classList.toggle('shelf-open', shelf);
    const query = get('search').value.trim().toLowerCase();
    get('authors').hidden = category !== 'pages' || !authors.length;
    get('layout').classList.toggle('without-authors', get('authors').hidden);
    get('note').textContent = category === 'pages' && progress
      ? '获得情况由本人确认；正式标题与故事文字尚未取得。'
      : '正式标题、文字与个人获得状态尚未取得；图片以原始资源编号标记。';
    get('authors').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.friendshipAuthor === author)));
    visible = items.filter(item => item.category === category && (category !== 'pages' || !author || item.author_id === author) && [item.id, item.title, item.description, item.author].filter(Boolean).join(' ').toLowerCase().includes(query));
    get('heading').textContent = (category === 'pages' ? authorName() + '的绘本' : labels[category]) + ' · ' + visible.length;
    get('empty').hidden = visible.length > 0;
    get('gallery').replaceChildren();
    visible.forEach((item, index) => {
      const card = node('article', undefined, 'photo'); card.dataset.category = item.category; card.dataset.resourceId = item.id;
      const button = node('button', undefined, 'photo-open'); button.setAttribute('aria-label', '查看 ' + item.id);
      const image = node('img'); image.src = assetUrl(item); image.alt = item.id; image.loading = 'lazy';
      button.append(image); button.onclick = () => show(index);
      const caption = node('div', undefined, 'caption');
      caption.append(node('strong', item.title || item.id.replace(/_png$/, ''), 'image-title'), node('div', labels[item.category] + ' · ' + item.width + ' × ' + item.height, 'muted'));
      if (item.category === 'pages') {
        const status = node('div', ownershipLabel(item), 'friendship-ownership'); status.dataset.ownership = item.ownership || 'unknown'; caption.append(status);
      }
      card.append(button, caption); get('gallery').append(card);
    });
  }
  function show(index) {
    if (!visible.length) return;
    current = (index + visible.length) % visible.length;
    const item = visible[current];
    get('image').src = assetUrl(item); get('image').alt = item.id;
    get('position').textContent = (item.author ? item.author + '的绘本' : labels[category]) + ' · ' + (current + 1) + ' / ' + visible.length;
    const info = get('info'); info.replaceChildren(node('h2', item.title || item.id.replace(/_png$/, '')));
    const fields = node('dl');
    if (item.author) fields.append(node('dt', '绘本作者'), node('dd', item.author));
    for (const [label, value] of [['收集状态', ownershipLabel(item)], ['正式标题', item.title || '未取得'], ['故事文字', item.description || '未取得'], ['原始编号', item.id],
      ['图片尺寸', item.width + ' × ' + item.height], ['资源版本', item.resource_version], ['来源', item.source_kind === 'bundled_apk' ? '系统备份中的安装包' : '系统备份中的热更新图片'], ['SHA-256', item.sha256]]) {
      fields.append(node('dt', label), node('dd', String(value)));
    }
    info.append(fields);
    if (item.ownership_source === 'user_confirmed') info.append(node('p', '获得情况由本人确认。', 'muted'));
    const original = node('a', '打开原图'); original.href = assetUrl(item); original.target = '_blank'; original.rel = 'noopener'; info.append(original);
    if (!get('dialog').open) get('dialog').showModal();
    history.replaceState(null, '', '#friendship-' + encodeURIComponent(item.id)); info.scrollTop = 0;
  }
  for (const row of authors) {
    const button = node('button'); button.dataset.friendshipAuthor = row.id;
    const pages = items.filter(item => item.category === 'pages' && item.author_id === row.id);
    const known = pages.some(item => item.ownership_source === 'user_confirmed');
    const obtained = pages.filter(item => item.ownership === 'obtained').length;
    button.setAttribute('aria-label', row.name + (known ? `，已获得 ${obtained} / ${pages.length} 页` : `，${pages.length} 页`));
    button.title = row.name;
    const cover = items.find(item => item.id === row.cover_resource);
    if (cover) {
      const image = node('img', undefined, 'friendship-author-cover'); image.src = assetUrl(cover); image.alt = ''; image.dataset.resourceId = cover.id;
      button.append(image);
    }
    const label = node('span', undefined, 'friendship-author-label');
    label.append(node('span', row.name), node('span', known ? `${obtained}/${pages.length}` : String(pages.length), 'friendship-author-progress'));
    button.append(label);
    button.onclick = () => openAuthor(row.id);
    get('authors').append(button);
    const book = node('button'); book.dataset.friendshipBook = row.id;
    book.setAttribute('aria-label', button.getAttribute('aria-label')); book.title = button.getAttribute('aria-label');
    if (cover) { const image = node('img'); image.src = assetUrl(cover); image.alt = ''; image.dataset.resourceId = cover.id; book.append(image); }
    book.append(node('span', row.name + (known ? ` ${obtained}/${pages.length}` : ''), 'friendship-book-label'));
    book.onclick = () => openAuthor(row.id); get('books').append(book);
  }
  for (const [key, label] of Object.entries(labels)) {
    const button = node('button', label); button.dataset.friendshipCategory = key;
    button.append(node('span', String(friendshipCatalog.categories[key] || 0)));
    button.setAttribute('aria-pressed', String(key === category));
    button.onclick = () => {
      if (key === 'pages') { openShelf(); history.replaceState(null, '', '#friendship'); }
      else { shelf = false; category = key; get('search').value = ''; updateTabs(); render(); history.replaceState(null, '', galleryHash()); }
    };
    get('tabs').append(button);
  }
  function updateTabs() { get('tabs').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.friendshipCategory === category))); }
  get('search').oninput = render;
  get('prev').onclick = () => show(current - 1); get('next').onclick = () => show(current + 1);
  get('close').onclick = () => get('dialog').close();
  get('dialog').addEventListener('close', () => { if (items.some(item => location.hash === '#friendship-' + encodeURIComponent(item.id))) history.replaceState(null, '', galleryHash()); });
  get('dialog').addEventListener('keydown', event => {
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); show(current + (event.key === 'ArrowLeft' ? -1 : 1)); }
  });
  function route() {
    if (location.hash === '#friendship' || location.hash === '#view-friendship') { selectView('friendship'); openShelf(); }
    const linkedAuthor = authors.find(row => location.hash === '#friendship-author-' + row.id);
    if (linkedAuthor) { selectView('friendship'); openAuthor(linkedAuthor.id); return; }
    const linkedCategory = ['gifts', 'scenes'].find(key => location.hash === '#friendship-category-' + key);
    if (linkedCategory) { selectView('friendship'); shelf = false; category = linkedCategory; updateTabs(); render(); return; }
    if (location.hash.startsWith('#friendship-')) {
      const item = items.find(item => '#friendship-' + encodeURIComponent(item.id) === location.hash);
      if (!item) return;
      selectView('friendship'); shelf = false; category = item.category; if (item.author_id) author = item.author_id; get('search').value = ''; updateTabs(); render(); show(visible.findIndex(row => row.id === item.id));
    }
  }
  document.querySelector('[data-view="friendship"]').addEventListener('click', openShelf);
  document.querySelector('.friendship-shelf-return').onclick = event => { event.preventDefault(); document.querySelector('[data-view="postcards"]').click(); };
  render(); window.addEventListener('hashchange', route); route();
})();
