(() => {
  const { lessons, parts } = window.JoineryModels;
  const get = id => document.getElementById(id);
  const phrases = {
    piece: ['Furniture drawing', '家具图纸'],
    gesture: ['Drag or use the arrow keys to rotate', '拖动模型或用方向键旋转'],
    focus: ['Joint detail', '接头特写'], xray: ['X-ray', '透视'], opacity: ['Opacity', '不透明度'],
    previous: ['Previous', '上一步'], next: ['Next', '下一步'], replay: ['Replay', '重播'], pause: ['Pause', '暂停'],
    whole: ['Finished furniture', '家具成品'], detail: ['Current connection', '当前接头'],
    travel: ['Insertion progress', '装配行程'], in: ['Zoom in', '放大'], out: ['Zoom out', '缩小']
  };
  const home = { yaw: -1.88, pitch: .38, zoom: 1 };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const views = ['whole', 'detail'].map(id => ({ canvas: get(id), ...home }));
  let language = Number(new URLSearchParams(location.search).get('lang') === 'zh');
  let lesson = lessons.find(item => item.id === '04_LeafShelf');
  let index = 2, travel = .4, animation = 0;
  let focused = false, xray = false;

  function localize() {
    document.documentElement.lang = language ? 'zh-CN' : 'en';
    document.title = language ? '工坊图纸 · TinyRoomies' : 'Workshop manual · TinyRoomies';
    for (const el of document.querySelectorAll('[data-copy]')) el.textContent = phrases[el.dataset.copy][language];
    for (const id of ['whole', 'detail', 'travel']) get(id).setAttribute('aria-label', phrases[id][language]);
    for (const button of document.querySelectorAll('[data-zoom]')) {
      const target = button.parentElement.dataset.view;
      button.setAttribute('aria-label', phrases[button.dataset.zoom][language] + ' · ' + phrases[target][language]);
    }
    get('piece').replaceChildren(...lessons.map(item => new Option(item.name[language], item.id, false, item === lesson)));
    update();
  }

  function update() {
    const count = value => String(value).padStart(2, '0');
    get('count').textContent = (language ? '步骤 ' : 'Step ') + count(index + 1) + ' / ' + count(lesson.steps.length);
    get('step').textContent = lesson.steps[index].title[language];
    get('previous').disabled = index === 0;
    get('next').disabled = index === lesson.steps.length - 1;
    get('focus').setAttribute('aria-pressed', focused);
    get('xray').setAttribute('aria-pressed', xray);
    get('opacity-row').hidden = !xray;
    get('replay').textContent = phrases[animation ? 'pause' : 'replay'][language];
    get('travel').value = Math.round(travel * 100);
    views.forEach(draw);
  }

  // Fit both ends of the authored insertion path so scrubbing never moves the camera.
  function draw(view) {
    const { canvas, yaw, pitch, zoom } = view;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const full = canvas.id === 'whole';
    const step = lesson.steps[index];
    let ids = full ? lesson.parts : [...new Set([...step.fixed, ...step.moving])];
    if (!full && focused) ids = ids.filter(id => step.contact.includes(id) || step.moving.includes(id));
    const sy = Math.sin(yaw), cy = Math.cos(yaw), sp = Math.sin(pitch), cp = Math.cos(pitch);
    const project = ([x, y, z]) => [-x * sy + y * cy, (x * cy + y * sy) * sp - z * cp, (x * cy + y * sy) * cp + z * sp];
    let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
    const faces = [];
    for (const id of ids) {
      const part = parts[id];
      const moving = !full && step.moving.includes(id);
      const from = moving ? project(step.start) : [0, 0, 0];
      const to = moving ? project(step.end) : from;
      const offset = from.map((n, i) => n + (to[i] - n) * travel);
      const points = part.v.map(vertex => {
        const [x, y, z] = project(vertex);
        left = Math.min(left, x + from[0], x + to[0]);
        right = Math.max(right, x + from[0], x + to[0]);
        top = Math.min(top, y + from[1], y + to[1]);
        bottom = Math.max(bottom, y + from[1], y + to[1]);
        return [x + offset[0], y + offset[1], z + offset[2]];
      });
      const throughWood = !full && xray && !moving;
      const alpha = throughWood ? Number(get('opacity').value) / 100 : 1;
      const color = throughWood ? [150, 149, 140] : part.color.map((v, i) => [45, 27, 19][i] + v * [345, 315, 300][i]);
      for (const [i, j, k] of part.t) {
        const a = points[i], b = points[j], c = points[k];
        const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
        const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
        const nz = ux * vy - uy * vx;
        if (nz >= 0) continue;
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz;
        const shade = .89 + .3 * (nx * .25 + ny * .7 - nz * .65) / Math.hypot(nx, ny, nz);
        const rgb = color.map(v => Math.min(255, Math.round(v * shade)));
        faces.push({ a, b, c, depth: a[2] + b[2] + c[2], fill: 'rgba(' + [...rgb, alpha].join(',') + ')', solid: !throughWood });
      }
    }
    let scale = Math.min(width * .87 / (right - left || 1), height * .83 / (bottom - top || 1)) * zoom;
    let center = [(left + right) / 2, (top + bottom) / 2];
    if (!full && focused) {
      const joint = project(step.focusPoint);
      center = center.map((n, i) => n * .2 + joint[i] * .8);
      scale *= 1.55;
    }
    ctx.translate(width / 2 - center[0] * scale, height / 2 - center[1] * scale);
    ctx.scale(scale, scale);
    ctx.lineWidth = .45 / scale;
    ctx.lineJoin = 'round';
    for (const face of faces.sort((a, b) => a.depth - b.depth)) {
      ctx.fillStyle = face.fill;
      ctx.beginPath();
      ctx.moveTo(face.a[0], face.a[1]);
      ctx.lineTo(face.b[0], face.b[1]);
      ctx.lineTo(face.c[0], face.c[1]);
      ctx.closePath();
      ctx.fill();
      if (face.solid) { ctx.strokeStyle = face.fill; ctx.stroke(); }
    }
  }

  function stop() { cancelAnimationFrame(animation); animation = 0; }
  function go(next) { stop(); index = next; travel = 0; update(); }
  function zoomView(view, factor) {
    view.zoom = Math.min(2.8, Math.max(.55, view.zoom * factor));
    draw(view);
  }
  for (const view of views) {
    const canvas = view.canvas;
    const tools = document.querySelector('[data-view="' + canvas.id + '"]');
    for (const button of tools.querySelectorAll('[data-zoom]')) {
      button.onclick = () => zoomView(view, button.dataset.zoom === 'in' ? 1.2 : 1 / 1.2);
    }
    let pointer;
    canvas.onpointerdown = event => {
      if (!event.isPrimary || event.button !== 0) return;
      pointer = [event.clientX, event.clientY];
      canvas.setPointerCapture(event.pointerId);
    };
    canvas.onpointermove = event => {
      if (!pointer || !canvas.hasPointerCapture(event.pointerId)) return;
      view.yaw -= (event.clientX - pointer[0]) * .012;
      view.pitch = Math.min(1.5, Math.max(-1.5, view.pitch + (event.clientY - pointer[1]) * .01));
      pointer = [event.clientX, event.clientY];
      draw(view);
    };
    canvas.onlostpointercapture = () => { pointer = null; };
    canvas.addEventListener('wheel', event => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoomView(view, Math.exp(-event.deltaY * .005));
    }, { passive: false });
    canvas.onkeydown = event => {
      const key = event.key;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(key)) return;
      event.preventDefault();
      if (['+', '=', '-'].includes(key)) { zoomView(view, key === '-' ? 1 / 1.2 : 1.2); return; }
      if (key === 'Home') Object.assign(view, home);
      else if (key === 'ArrowLeft' || key === 'ArrowRight') view.yaw += key === 'ArrowLeft' ? -.13 : .13;
      else view.pitch = Math.min(1.5, Math.max(-1.5, view.pitch + (key === 'ArrowUp' ? .12 : -.12)));
      draw(view);
    };
    new ResizeObserver(() => draw(view)).observe(canvas);
  }
  get('piece').onchange = event => {
    lesson = lessons.find(item => item.id === event.target.value);
    focused = xray = false;
    views.forEach(view => Object.assign(view, home));
    go(0);
  };
  get('previous').onclick = () => go(index - 1);
  get('next').onclick = () => go(index + 1);
  get('focus').onclick = () => { focused = !focused; update(); };
  get('xray').onclick = () => { xray = !xray; update(); };
  get('opacity').oninput = () => draw(views[1]);
  get('travel').oninput = event => { stop(); travel = event.target.value / 100; update(); };
  get('replay').onclick = () => {
    if (animation) { stop(); update(); return; }
    if (reducedMotion.matches) { travel = 1; update(); return; }
    travel = 0;
    const start = performance.now();
    function advance(now) {
      travel = Math.min(1, (now - start) / 1800);
      get('travel').value = Math.round(travel * 100);
      draw(views[1]);
      if (travel < 1) animation = requestAnimationFrame(advance);
      else { animation = 0; update(); }
    }
    animation = requestAnimationFrame(advance);
    update();
  };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); update(); } });
  window.addEventListener('message', event => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'tinyroomies-language') return;
    language = Number(event.data.language === 'zh');
    localize();
  });
  localize();
  const book = document.querySelector('main');
  new ResizeObserver(() => {
    if (parent !== window) parent.postMessage({ type: 'tinyroomies-guide-size', height: book.offsetHeight }, location.origin === 'null' ? '*' : location.origin);
  }).observe(book);
})();
