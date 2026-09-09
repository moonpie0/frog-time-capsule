(() => {
  const get = id => document.getElementById('tumbler-' + id);
  const groups = { base: '底图', eye: '眼睛', adorn: '装饰', down: '底部', mid: '中部' };
  const palette = ['#c96e78', '#67a795', '#79aaca', '#dcb85a', '#a68aba', '#d89163'];
  const assets = new Map(tumblerAssets.items.map(item => [item.id, item]));
  const byGroup = group => tumblerAssets.items.filter(item => item.group === group).sort((a, b) => a.number - b.number);
  const images = new Map();
  const canvas = get('canvas'), ctx = canvas.getContext('2d');
  const paint = document.createElement('canvas'); paint.width = paint.height = 800;
  const pctx = paint.getContext('2d');
  const copy = value => JSON.parse(JSON.stringify(value));
  const defaultTransform = () => ({ x: 0, y: 0, scale: 100, angle: 0, flip: false });
  const defaults = () => ({ base: 'bdw_1_base', eye: 'bdw_eye_1', adorn: 'bdw_adorn_1', down: null, mid: null,
    tint: false, color: palette[0], transforms: Object.fromEntries(['eye', 'adorn', 'down', 'mid'].map(group => [group, defaultTransform()])) });
  let state = defaults(), active = 'base', ready = false, history = [], redo = [], dragStart = null, wobble = null;
  const storageKey = 'frog-tumbler-composition-v1';
  function valid(value) {
    if (!value || !value.transforms || typeof value.tint !== 'boolean' || !/^#[\da-f]{6}$/i.test(value.color)) return false;
    return Object.keys(groups).every(group => {
      if (!(value[group] === null && group !== 'base') && assets.get(value[group])?.group !== group) return false;
      if (group === 'base') return true;
      const t = value.transforms[group];
      return t && Number.isFinite(t.x) && Math.abs(t.x) <= 40 && Number.isFinite(t.y) && Math.abs(t.y) <= 40 &&
        Number.isFinite(t.scale) && t.scale >= 60 && t.scale <= 140 && Number.isFinite(t.angle) && Math.abs(t.angle) <= 45 && typeof t.flip === 'boolean';
    });
  }
  try { const stored = JSON.parse(localStorage.getItem(storageKey)); if (valid(stored)) state = stored; } catch {}
  function remember() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { get('result').textContent = '浏览器未能保存当前组合，关闭后将不会保留。'; }
  }
  function button(text, title) {
    const element = document.createElement('button'); element.type = 'button'; element.textContent = text;
    if (title) { element.title = title; element.setAttribute('aria-label', title); }
    return element;
  }
  function snapshot(before) {
    if (JSON.stringify(before) === JSON.stringify(state)) return;
    history.push(before); if (history.length > 40) history.shift(); redo = [];
  }
  function change(update) {
    if (!ready) return;
    const before = copy(state); update(); snapshot(before); refresh(); remember();
  }
  // The client centers bases and masks on a 120px workspace, then exports a 200px region.
  function layer(target, id, transform = null) {
    if (!id) return;
    const item = assets.get(id), image = images.get(id);
    target.save();
    target.translate(100 + (transform?.x || 0), 100 + (transform?.y || 0));
    target.rotate((transform?.angle || 0) * Math.PI / 180);
    const scale = (transform?.scale || 100) / 100;
    target.scale(scale * (transform?.flip ? -1 : 1), scale);
    target.drawImage(image, -item.width / 2, -item.height / 2);
    target.restore();
  }
  function draw() {
    if (!ready) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 800, 800); ctx.setTransform(4, 0, 0, 4, 0, 0);
    layer(ctx, state.base);
    pctx.setTransform(1, 0, 0, 1, 0, 0); pctx.clearRect(0, 0, 800, 800); pctx.setTransform(4, 0, 0, 4, 0, 0);
    if (state.tint) { pctx.globalAlpha = .48; pctx.fillStyle = state.color; pctx.fillRect(0, 0, 200, 200); pctx.globalAlpha = 1; }
    for (const group of ['down', 'mid', 'eye']) layer(pctx, state[group], state.transforms[group]);
    pctx.globalCompositeOperation = 'destination-in';
    const maskId = 'bdw_' + assets.get(state.base).number + '_mask';
    layer(pctx, maskId); pctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(paint, 0, 0, 200, 200);
    layer(ctx, state.adorn, state.transforms.adorn);
    canvas.dataset.base = state.base; canvas.dataset.mask = maskId;
    canvas.dataset.composition = JSON.stringify(state);
  }
  function refreshParts() {
    get('parts').replaceChildren();
    const options = active === 'base' ? byGroup(active) : [null, ...byGroup(active)];
    for (const item of options) {
      const selected = state[active] === (item?.id || null);
      const option = button('', item ? item.id : '不使用' + groups[active]);
      option.className = 'tumbler-part'; option.dataset.part = item?.id || 'none'; option.disabled = !ready;
      option.setAttribute('aria-pressed', String(selected));
      if (item) { const image = document.createElement('img'); image.src = item.data_url; image.alt = item.id; option.append(image); }
      else { const empty = document.createElement('span'); empty.className = 'tumbler-none'; empty.textContent = '∅'; option.append(empty); }
      const label = document.createElement('span'); label.className = 'tumbler-part-label'; label.textContent = item ? String(item.number).padStart(2, '0') : '无';
      option.append(label);
      option.onclick = () => change(() => { state[active] = item?.id || null; if (active !== 'base') state.transforms[active] = defaultTransform(); });
      get('parts').append(option);
    }
    get('adjust').hidden = active === 'base' || !state[active];
    if (active !== 'base') {
      for (const property of ['x', 'y', 'scale', 'angle']) {
        get(property).value = state.transforms[active][property];
        get(property + '-value').textContent = state.transforms[active][property] + (property === 'scale' ? '%' : property === 'angle' ? '°' : '');
      }
      get('flip').checked = state.transforms[active].flip;
    }
  }
  function refresh() {
    draw(); refreshParts();
    get('undo').disabled = !history.length; get('redo').disabled = !redo.length;
    get('tint').checked = state.tint;
    get('color').value = state.color;
    document.querySelectorAll('.tumbler-swatch').forEach(swatch => swatch.setAttribute('aria-pressed', String(state.tint && swatch.dataset.color === state.color)));
  }
  for (const [group, title] of Object.entries(groups)) {
    const tab = button(title); tab.dataset.tumblerGroup = group; tab.setAttribute('aria-pressed', String(group === active));
    const count = document.createElement('span'); count.textContent = byGroup(group).length; tab.append(count);
    tab.onclick = () => { active = group; get('tabs').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === tab))); refreshParts(); };
    get('tabs').append(tab);
  }
  for (const color of palette) {
    const swatch = button('', '底色 ' + color); swatch.className = 'tumbler-swatch'; swatch.dataset.color = color;
    swatch.style.setProperty('--swatch', color); swatch.disabled = true;
    swatch.onclick = () => change(() => { state.color = color; state.tint = true; }); get('swatches').append(swatch);
  }
  const custom = document.createElement('input'); custom.type = 'color'; custom.id = 'tumbler-color'; custom.title = '自定义底色';
  custom.setAttribute('aria-label', '自定义底色'); custom.value = state.color; custom.disabled = true;
  custom.onchange = () => change(() => { state.color = custom.value; state.tint = true; }); get('swatches').append(custom);
  get('tint').onchange = () => change(() => { state.tint = get('tint').checked; });
  for (const property of ['x', 'y', 'scale', 'angle']) {
    get(property).oninput = () => {
      if (!ready || active === 'base') return;
      if (!dragStart) dragStart = copy(state);
      state.transforms[active][property] = Number(get(property).value); draw();
      get(property + '-value').textContent = get(property).value + (property === 'scale' ? '%' : property === 'angle' ? '°' : '');
    };
    get(property).onchange = () => { if (dragStart) { snapshot(dragStart); dragStart = null; refresh(); remember(); } };
  }
  get('flip').onchange = () => change(() => { state.transforms[active].flip = get('flip').checked; });
  const pick = list => list[Math.floor(Math.random() * list.length)];
  get('random').onclick = () => { change(() => {
    const previous = state.base;
    state.base = pick(byGroup('base').filter(item => item.id !== previous)).id;
    for (const group of ['eye', 'adorn', 'down', 'mid']) { state[group] = pick(byGroup(group)).id; state.transforms[group] = defaultTransform(); }
    state.tint = false;
  }); shake(); };
  get('undo').onclick = () => { if (history.length) { redo.push(copy(state)); state = history.pop(); refresh(); remember(); } };
  get('redo').onclick = () => { if (redo.length) { history.push(copy(state)); state = redo.pop(); refresh(); remember(); } };
  get('reset').onclick = () => change(() => { state = defaults(); });
  get('save').onclick = () => {
    if (!ready) return;
    try {
      const link = document.createElement('a'); link.download = 'tumbler-' + new Date().toISOString().replace(/[:.]/g, '-') + '.png';
      link.href = canvas.toDataURL('image/png'); document.body.append(link); link.click(); link.remove();
      get('result').textContent = '已生成 800 × 800 透明 PNG。';
    } catch { get('result').textContent = '图片导出失败，请重新打开本地页面后重试。'; }
  };
  function shake() {
    if (!ready || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    wobble?.cancel();
    wobble = canvas.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-9deg)' }, { transform: 'rotate(7deg)' },
      { transform: 'rotate(-4deg)' }, { transform: 'rotate(2deg)' }, { transform: 'rotate(0deg)' }], { duration: 1000, easing: 'ease-in-out' });
  }
  canvas.onclick = shake;
  canvas.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); shake(); } };
  function hashRoute() { if (location.hash === '#tumbler' || location.hash === '#view-tumbler') selectView('tumbler'); }
  window.addEventListener('hashchange', hashRoute); hashRoute(); refreshParts();
  Promise.all(tumblerAssets.items.map(async item => {
    const image = new Image(); image.src = item.data_url; await image.decode();
    if (image.naturalWidth !== item.width || image.naturalHeight !== item.height) throw Error('Asset dimensions differ');
    images.set(item.id, image);
  })).then(() => {
    ready = true; get('loading').hidden = true;
    for (const id of ['random', 'save', 'reset', 'tint', 'color']) get(id).disabled = false;
    document.querySelectorAll('.tumbler-swatch').forEach(swatch => { swatch.disabled = false; });
    canvas.dataset.assetsReady = String(images.size); refresh();
  }).catch(() => { get('loading').textContent = '部件图片未能完整载入，请重新生成档案后重试。'; });
})();
