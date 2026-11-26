/* Production FBX geometry with the material palette used for the portfolio tool renders.
   The hand drill includes DrillCrank at the runtime offset of 0.087 metres.
   Meshes are projected into a depth buffer on demand. No GPU, server, or external library is required. */
(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src);
  const tools = [
    { id: "mallet", asset: "JoineryMallet", name: "Joinery Mallet", group: "Joinery & assembly", step: "assembly-aligned", stepAlt: "A long rail aligned with the leg on the rotating work surface", action: "Seat fitted joints and drive repair pegs with controlled taps." },
    { id: "driver", asset: "Driver", name: "Slotted Screwdriver", group: "Joinery & assembly", step: "assembly-fastened", stepAlt: "A fitted rail and leg shown on the green work surface", action: "Turn clockwise to secure hardware and tighten the workholding clamp." },
    { id: "bench-clamp", asset: "BenchClamp", name: "Padded Clamp", group: "Structural repairs", step: "repair-clamp", stepAlt: "The wooden workpiece held in a clamp on the workshop turntable", action: "Support the workpiece during structural repairs and steady finishing." },
    { id: "marking-gauge", asset: "MarkingGauge", name: "Marking Gauge", group: "Structural repairs", step: "repair-mark", stepAlt: "A marking gauge at the wooden repair surface", action: "Trace the marked repair strip before drilling or shallow chiselling." },
    { id: "drill", asset: "HandDrill", name: "Hand-cranked Drill", group: "Structural repairs", step: "repair-drill", stepAlt: "The hand-cranked drill standing at a marked repair site", action: "Seat the bit, then turn the crank to open each repair hole." },
    { id: "dowel", asset: "Dowel", name: "Wooden Peg", group: "Structural repairs", step: "repair-peg", stepAlt: "A wooden peg at the repair site by the parts tray", action: "Lower each peg into its drilled repair hole." },
    { id: "flush-saw", asset: "FlushSaw", name: "Flush-cut Saw", group: "Structural repairs", step: "repair-saw", stepAlt: "A flush-cut saw crossing the wooden workpiece", action: "Saw the protruding repair peg level with the surrounding wood." },
    { id: "chisel", asset: "Chisel", name: "Flat Chisel", group: "Structural repairs", step: "repair-chisel", stepAlt: "A chisel aligned along the groove in a wooden panel", action: "Support the chisel neck and make shallow passes through the marked groove." },
    { id: "glue-bottle", asset: "GlueBottle", name: "Wood Glue", group: "Structural repairs", step: "repair-glue", stepAlt: "The glue nozzle over the workpiece on the turntable", action: "Apply a thin bead across the prepared groove." },
    { id: "inlay-strip", asset: "InlayStrip", name: "Old-wood Inlay", group: "Structural repairs", step: "repair-inlay", stepAlt: "The old-wood strip in the clamped repair surface", action: "Press the old wood strip into the glued repair groove." },
    { id: "plane", asset: "Plane", name: "Hand Plane", group: "Surface & carving", step: "repair-plane", stepAlt: "A hand plane on the wooden repair surface", action: "Move the sole across the repair strip to level the surface." },
    { id: "sanding-block", asset: "SandingBlock", name: "Sanding Block", group: "Surface & carving", step: "repair-sand", stepAlt: "A sanding block touching the wooden workpiece", action: "Rub the surface, then refine the edges of the carved decoration." },
    { id: "dust-brush", asset: "DustBrush", name: "Dust Brush", group: "Surface & carving", step: "repair-clean", stepAlt: "A small brush sweeping the top of the workpiece", action: "Sweep the prepared surface and clear debris from the carved areas." },
    { id: "transfer-paper", asset: "TransferPaper", name: "Transfer Sheet", group: "Surface & carving", step: "relief-transfer", stepAlt: "A transfer sheet positioned on the wooden surface", action: "Place the pattern over the highlighted area and press to transfer." },
    { id: "carving-gouge", asset: "CarvingGouge", name: "Carving Gouge", group: "Surface & carving", step: "relief-outline", stepAlt: "The carving gouge tracing the transferred motif", action: "Trace the outline, then clear the shallow relief within each region." },
    { id: "brush", asset: "Brush", name: "Flat Brush", group: "Colour & finish", step: "paint-stroke", stepAlt: "Brush applying pigment to a carved motif on the workpiece", action: "Fill the carved colour regions with broad, controlled strokes." },
    { id: "detail-brush", asset: "DetailBrush", name: "Detail Brush", group: "Colour & finish", step: "paint-stroke", stepAlt: "Brush applying pigment to a carved motif on the workpiece", action: "Use a narrower brush for small regions and close edges." },
    { id: "dry-brush", asset: "DryBrush", name: "Dry Brush", group: "Colour & finish", step: "paint-workspace", stepAlt: "The practice offcut beside the working palette", action: "Use the wider bristles and reduced paint flow for textured marks." },
    { id: "palette-leaf", asset: "PaletteLeaf", name: "Paint Palette", group: "Colour & finish", step: "paint-workspace", stepAlt: "The painting station with a palette, instruction board and practice offcut", action: "Select numbered pigments and mix colours in the central well." },
    { id: "test-swatch", asset: "TestSwatch", name: "Practice Offcut", group: "Colour & finish", step: "paint-workspace", stepAlt: "The practice offcut beside the working palette", action: "Try the brush colour, width and texture before painting the furniture." },
    { id: "painting-mat", asset: "PaintingMat", name: "Painting Mat", group: "Colour & finish", step: "paint-workspace", stepAlt: "The painting station with a palette, instruction board and practice offcut", action: "The work area changes from a clamped repair surface to a painting station." },
    { id: "wax-pad", asset: "WaxPad", name: "Wax Pad", group: "Colour & finish", step: "paint-wax", stepAlt: "The workshop turntable during the final surface treatment", action: "Rub a thin final coat across the completed Reading Table." }
  ];
  const benchViews = [
    { id: 'bench', name: 'Assembled', alt: 'The Keeper Bench with its removable wedges and through-tenon stretcher.' },
    { id: 'exploded', name: 'Exploded', alt: 'Six bench parts separated along their assembly paths.' }
  ];
  const furnitureIds = new Set(['bench', 'record-player', 'cabinet', 'shelf', 'desk', 'table',
    'stool', 'collection-cabinet', 'folding-workdesk', 'plant-reading-rack']);
  const initialYaw = .89;
  const initialPitch = .57;
  const turn = Math.PI / 8;
  const cache = new Map();
  const loading = new Map();
  const textures = new Map();

  function featuredTool(id) {
    return id === 'plane' || id === 'mallet' || id === 'drill';
  }

  function posterFor(id) {
    return new URL((featuredTool(id) || id === 'bench' ? '' : 'catalog/') + id + '.webp', base);
  }

  function isBenchView(id) {
    return id === 'bench' || id === 'exploded';
  }

  async function loadScript(key, read) {
    if (read()) return read();
    if (!loading.has(key)) {
      loading.set(key, new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = new URL(key, base);
        script.onload = resolve;
        script.onerror = () => reject(new Error('Preview file unavailable'));
        document.head.append(script);
      }));
    }
    try {
      await loading.get(key);
      const value = read();
      if (!value) throw new Error('Preview data missing');
      return value;
    } finally {
      loading.delete(key);
    }
  }

  function woodTexture() {
    return window.TinyRoomiesFurnitureGrain || window.TinyRoomiesBenchGeometry?.tex;
  }

  async function loadGeometry(id, furniture) {
    let packed;
    if (furniture && isBenchView(id)) {
      packed = await loadScript('bench-geometry.js', () => window.TinyRoomiesBenchGeometry);
    } else if (furniture) {
      packed = await loadScript('furniture/' + id + '.js', () => window.TinyRoomiesFurnitureGeometry?.[id]);
    } else {
      const file = featuredTool(id) ? 'geometry.js' : 'catalog/' + id + '.js';
      packed = await loadScript(file, () => window.TinyRoomiesToolGeometry?.[id]);
    }
    if (packed.tex === 'wood') await loadScript('furniture/wood.js', woodTexture);
    return packed;
  }

  function bytes(data) {
    if (Uint8Array.fromBase64) return Uint8Array.fromBase64(data);
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < array.length; i++) array[i] = binary.charCodeAt(i);
    return array;
  }

  function meshFor(id, packed) {
    if (cache.has(id)) return cache.get(id);
    const stride = packed.tex ? 18 : 14;
    const buffer = bytes(packed.v);
    const view = new DataView(buffer.buffer);
    const count = buffer.byteLength / stride;
    if (!Number.isInteger(count) || !count) throw new Error('Invalid vertex data');
    const vertices = new Float32Array(count * 11);
    const uvs = packed.tex ? new Float32Array(count * 2) : null;
    const halfSize = [0, 0, 0];
    let group = 0;
    for (let i = 0, j = 0; i < buffer.length; i += stride, j += 11) {
      for (let axis = 0; axis < 3; axis++) {
        vertices[j + axis] = view.getInt16(i + axis * 2, true) / 32767;
        vertices[j + 3 + axis] = view.getInt8(i + 6 + axis) / 127;
      }
      if (uvs) {
        const vertex = i / stride;
        uvs[vertex * 2] = view.getInt16(i + 14, true) / 4096;
        uvs[vertex * 2 + 1] = view.getInt16(i + 16, true) / 4096;
        if (id === 'exploded') {
          if (vertex >= packed.runs[group][0]) group++;
          const shift = packed.runs[group][1];
          for (let axis = 0; axis < 3; axis++)
            vertices[j + axis] = vertices[j + axis] * packed.assembledToExploded + shift[axis];
        }
      }
      for (let axis = 0; axis < 3; axis++) halfSize[axis] = Math.max(halfSize[axis], Math.abs(vertices[j + axis]));
      for (let channel = 0; channel < 5; channel++) vertices[j + 6 + channel] = buffer[i + 9 + channel] / 255;
    }
    const indexData = bytes(packed.i).buffer;
    const indices = packed.wide ? new Uint32Array(indexData) : new Uint16Array(indexData);
    if (!indices.length || indices.length % 3) throw new Error('Invalid triangle data');
    const grain = packed.tex === 'wood' ? woodTexture() : packed.tex;
    if (grain && !textures.has(grain)) {
      const decoded = bytes(grain);
      if (decoded.length !== 256 * 256) throw new Error('Invalid wood texture');
      textures.set(grain, decoded);
    }
    const texture = textures.get(grain);
    const mesh = { vertices, indices, uvs, texture, halfSize, yaw: packed.yaw, pitch: packed.pitch };
    cache.set(id, mesh);
    return mesh;
  }

  // Maintain a consistent viewing distance. Only pull back if an extreme angle would clip the object.
  function furnitureScale(mesh, yaw, pitch, width, height) {
    const [x, y, z] = mesh.halfSize;
    function fit(azimuth, elevation, margin) {
      const c = Math.abs(Math.cos(azimuth)), s = Math.abs(Math.sin(azimuth));
      const horizontal = c * x + s * z;
      const vertical = Math.abs(Math.cos(elevation)) * y + Math.abs(Math.sin(elevation)) * (s * x + c * z);
      return Math.min(width / horizontal, height / vertical) * margin;
    }
    return Math.min(fit(mesh.yaw ?? .51, mesh.pitch ?? .32, .41), fit(yaw, pitch, .475));
  }

  function project(vertices, projected, yaw, pitch, width, height, scale) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    for (let i = 0, j = 0; i < vertices.length; i += 11, j += 6) {
      const x = vertices[i], y = vertices[i + 1], z = vertices[i + 2];
      const depth = sy * x + cy * z;
      projected[j] = width * .5 + (cy * x - sy * z) * scale;
      projected[j + 1] = height * .5 - (cp * y - sp * depth) * scale;
      projected[j + 2] = cp * depth + sp * y;
      const xNormal = vertices[i + 3], yNormal = vertices[i + 4], zNormal = vertices[i + 5];
      const nx = cy * xNormal - sy * zNormal;
      const nz = sy * xNormal + cy * zNormal;
      const ny = cp * yNormal - sp * nz;
      const facing = cp * nz + sp * yNormal;
      const metallic = vertices[i + 9], gloss = vertices[i + 10];
      const diffuse = Math.max(0, -.35 * nx + .8 * ny + .49 * facing);
      const reflection = Math.pow(Math.max(0, -.2 * nx + .46 * ny + .86 * facing), 8 + gloss * 40);
      const rim = Math.pow(1 - Math.abs(Math.min(1, Math.max(-1, facing))), 3);
      const light = .69 + .36 * diffuse + .14 * Math.max(0, ny) - metallic * .10;
      const highlight = reflection * (.07 + metallic * .24) + rim * (.025 + metallic * .07);
      for (let c = 0; c < 3; c++) projected[j + 3 + c] = 255 * (vertices[i + 6 + c] * light + highlight);
    }
  }

  // Interpolated vertex lighting and a per-pixel depth test preserve overlapping handles, teeth and joints.
  function rasterize(mesh, points, pixels, depths) {
    const { width, height, data } = pixels;
    const { indices: ids, texture, uvs } = mesh;
    depths.fill(-Infinity);
    data.fill(0);
    for (let t = 0; t < ids.length; t += 3) {
      const a = ids[t] * 6, b = ids[t + 1] * 6, c = ids[t + 2] * 6;
      const ax = points[a], ay = points[a + 1];
      const bx = points[b], by = points[b + 1];
      const cx = points[c], cy = points[c + 1];
      const area = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
      if (Math.abs(area) < .01) continue;
      const startX = Math.max(0, Math.ceil(Math.min(ax, bx, cx) - .5));
      const endX = Math.min(width - 1, Math.floor(Math.max(ax, bx, cx) - .5));
      const startY = Math.max(0, Math.ceil(Math.min(ay, by, cy) - .5));
      const endY = Math.min(height - 1, Math.floor(Math.max(ay, by, cy) - .5));
      const ta = ids[t] * 2, tb = ids[t + 1] * 2, tc = ids[t + 2] * 2;
      const stepA = (by - cy) / area, stepB = (cy - ay) / area;
      for (let y = startY; y <= endY; y++) {
        let u = ((by - cy) * (startX + .5 - cx) + (cx - bx) * (y + .5 - cy)) / area;
        let v = ((cy - ay) * (startX + .5 - cx) + (ax - cx) * (y + .5 - cy)) / area;
        for (let x = startX; x <= endX; x++, u += stepA, v += stepB) {
          const w = 1 - u - v;
          if (u < 0 || v < 0 || w < 0) continue;
          const offset = y * width + x;
          const z = u * points[a + 2] + v * points[b + 2] + w * points[c + 2];
          if (z < depths[offset]) continue;
          depths[offset] = z;
          const p = offset * 4;
          let grain = 1;
          if (texture) {
            const tx = Math.floor((u * uvs[ta] + v * uvs[tb] + w * uvs[tc]) * 256) & 255;
            const ty = Math.floor((1 - u * uvs[ta + 1] - v * uvs[tb + 1] - w * uvs[tc + 1]) * 256) & 255;
            grain = texture[ty * 256 + tx] / 128;
          }
          for (let ch = 0; ch < 3; ch++)
            data[p + ch] = grain * (u * points[a + 3 + ch] + v * points[b + 3 + ch] + w * points[c + 3 + ch]);
          data[p + 3] = 255;
        }
      }
    }
  }

  function setup(root) {
    const sharedFurniture = root.dataset.toolViewer === 'furniture';
    const furniture = sharedFurniture || root.dataset.toolViewer === 'bench';
    const options = furniture ? benchViews : tools;
    function homeYaw() {
      return mesh?.yaw ?? (furniture ? .51 : initialYaw);
    }
    function homePitch() {
      if (furniture) return mesh?.pitch ?? .32;
      if (['palette-leaf', 'painting-mat', 'transfer-paper', 'test-swatch'].includes(selected.id)) return 1.02;
      return initialPitch;
    }
    const poster = root.querySelector('img') || document.createElement('img');
    const picks = document.createElement('div');
    picks.className = 'tool-picks';
    picks.setAttribute('role', 'group');
    picks.setAttribute('aria-label', furniture ? 'Bench assembly view' : 'Choose a workshop tool');
    const library = document.createElement('div');
    const groupMenu = document.createElement('select');
    const caption = document.createElement('div');
    const title = document.createElement('h4');
    const description = document.createElement('p');
    caption.className = 'tool-description';
    caption.setAttribute('aria-live', 'polite');
    caption.setAttribute('aria-atomic', 'true');
    const capture = document.createElement('img');
    capture.loading = 'lazy';
    capture.width = 880;
    capture.height = 550;
    const step = document.createElement('a');
    step.className = 'tool-step';
    step.dataset.artLink = '';
    step.append(capture);
    caption.append(title, description);
    const stage = document.createElement('div');
    stage.className = 'tool-view-stage';
    const canvas = document.createElement('canvas');
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight ArrowUp ArrowDown Home');
    const controls = document.createElement('div');
    controls.className = 'tool-controls';
    const hint = document.createElement('p');
    hint.textContent = 'Drag to rotate';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.hidden = true;
    retry.className = 'tool-retry';
    retry.textContent = 'Retry 3D view';
    retry.addEventListener('click', start);
    const directions = document.createElement('div');
    directions.setAttribute('role', 'group');
    directions.setAttribute('aria-label', 'Model view');
    const actions = {
      left: ['Turn left', -turn, 0], right: ['Turn right', turn, 0],
      up: ['View from above', 0, turn], down: ['View from below', 0, -turn],
      reset: ['Reset view', 0, 0]
    };
    let selected, yaw, pitch, mesh, projected, pixels, depths, frame, pointer;
    let activated = false;
    const context = canvas.getContext('2d');
    const arrowAngle = { left: -90, right: 90, up: 0, down: 180 };

    function draw() {
      frame = 0;
      if (!mesh || !context || !stage.clientWidth) return;
      const maxDensity = pointer && furniture ? 1 : 2;
      const density = Math.min(maxDensity, Math.max(1.5, window.devicePixelRatio || 1), 1200 / stage.clientWidth);
      const w = Math.max(1, Math.round(stage.clientWidth * density));
      const h = Math.max(1, Math.round(stage.clientHeight * density));
      if (!pixels || w !== pixels.width || h !== pixels.height) {
        canvas.width = w;
        canvas.height = h;
        pixels = context.createImageData(w, h);
        depths = new Float32Array(w * h);
      }
      const scale = furniture ? furnitureScale(mesh, yaw, pitch, w, h) : Math.min(w, h) * .449;
      project(mesh.vertices, projected, yaw, pitch, w, h, scale);
      rasterize(mesh, projected, pixels, depths);
      context.putImageData(pixels, 0, 0);
      stage.classList.add('is-ready');
    }
    function update() {
      if (!frame && mesh) frame = requestAnimationFrame(draw);
    }
    function setControls(enabled) {
      for (const button of directions.children) button.disabled = !enabled;
      canvas.tabIndex = enabled ? 0 : -1;
    }
    async function start() {
      if (!context) { hint.textContent = 'Studio render'; return; }
      retry.hidden = true;
      hint.textContent = 'Loading 3D view…';
      const item = selected;
      try {
        const packed = await loadGeometry(item.id, furniture);
        if (item !== selected) return;
        mesh = meshFor(item.id, packed);
        yaw = homeYaw();
        pitch = homePitch();
        projected = new Float32Array(mesh.vertices.length / 11 * 6);
        setControls(true);
        hint.textContent = 'Drag to rotate';
        update();
      } catch {
        if (item !== selected) return;
        setControls(false);
        hint.textContent = 'Studio render';
        retry.hidden = false;
      }
    }
    function select(tool) {
      selected = tool;
      mesh = null;
      yaw = homeYaw();
      pitch = homePitch();
      for (const button of picks.children) button.setAttribute('aria-pressed', String(button.dataset.id === tool.id));
      const bench = furniture && isBenchView(tool.id);
      if (sharedFurniture) {
        picks.hidden = !bench;
        root.dataset.selectedFurniture = bench ? 'bench' : tool.id;
      }
      retry.hidden = true;
      hint.textContent = 'Loading 3D view…';
      poster.src = tool.poster || posterFor(bench ? 'bench' : tool.id);
      poster.alt = bench ? benchViews[0].alt : tool.alt || tool.name;
      canvas.setAttribute('aria-label', (tool.alt || tool.name) + ' Interactive 3D view. Use the arrow keys to rotate. Home resets the view.');
      if (!furniture) {
        title.textContent = tool.name;
        description.textContent = tool.action;
        capture.src = new URL('../recipe/stages/' + tool.step + '.webp', base).href;
        capture.alt = tool.stepAlt;
        step.href = capture.src;
      }
      stage.classList.remove('is-ready');
      setControls(false);
      if (!activated) {
        const bounds = root.getBoundingClientRect();
        activated = bounds.bottom >= -250 && bounds.top <= window.innerHeight + 250;
      }
      if (activated) start();
    }
    function orbit(dx, dy) {
      yaw += dx;
      pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch + dy));
      update();
    }
    function act(action) {
      if (!mesh) return;
      if (action === 'reset') { yaw = homeYaw(); pitch = homePitch(); update(); }
      else orbit(actions[action][1], actions[action][2]);
    }

    if (!furniture) {
      root.classList.add('tool-catalog');
      library.className = 'tool-library';
      const groupLabel = document.createElement('label');
      groupLabel.className = 'tool-group';
      groupLabel.append('Craft stage', groupMenu);
      const all = document.createElement('option');
      all.value = '';
      all.text = 'All ' + tools.length + ' objects';
      groupMenu.add(all);
      for (const group of new Set(tools.map(item => item.group))) {
        const option = document.createElement('option');
        option.value = group;
        option.text = group + ' (' + tools.filter(item => item.group === group).length + ')';
        groupMenu.add(option);
      }
      function chooseFromGroup(tool, group) {
        groupMenu.value = group;
        for (const button of picks.children) button.hidden = Boolean(group) && button.dataset.group !== group;
        picks.scrollTop = 0;
        select(tool);
      }
      groupMenu.addEventListener('change', () => {
        const group = groupMenu.value;
        chooseFromGroup(tools.find(item => !group || item.group === group), group);
      });
      root.addEventListener('portfolio:inspect-tool', event => {
        const tool = tools.find(item => item.asset === event.detail?.id);
        if (tool) chooseFromGroup(tool, tool.group);
      });
      groupMenu.value = tools[0].group;
      library.append(groupLabel, picks);
    }
    for (const tool of options) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.id = tool.id;
      if (furniture) button.textContent = tool.name;
      else {
        button.dataset.group = tool.group;
        button.dataset.asset = tool.asset;
        button.hidden = Boolean(groupMenu.value) && tool.group !== groupMenu.value;
        const thumbnail = document.createElement('img');
        thumbnail.src = posterFor(tool.id);
        thumbnail.alt = '';
        thumbnail.width = 120;
        thumbnail.height = 76;
        thumbnail.loading = 'lazy';
        const label = document.createElement('span');
        label.textContent = tool.name;
        button.append(thumbnail, label);
      }
      button.addEventListener('click', () => select(tool));
      picks.append(button);
    }
    for (const [key, [label]] of Object.entries(actions)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.action = key;
      button.title = label;
      button.setAttribute('aria-label', label);
      if (key === 'reset') button.textContent = 'Reset';
      else button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><g transform="rotate(' + arrowAngle[key] + ' 12 12)" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 13.5L12 8l5.5 5.5"/></g></svg>';
      button.addEventListener('click', () => act(key));
      directions.append(button);
    }
    canvas.addEventListener('keydown', event => {
      const action = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', Home: 'reset' }[event.key];
      if (!action || !mesh) return;
      event.preventDefault();
      act(action);
    });
    canvas.addEventListener('pointerdown', event => {
      if (!mesh || pointer || event.button !== 0 || !event.isPrimary) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
      stage.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      orbit((pointer.x - event.clientX) * .011, (event.clientY - pointer.y) * .011);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    });
    function release(event) {
      if (!pointer || (event.pointerId !== undefined && pointer.id !== event.pointerId)) return;
      pointer = null;
      stage.classList.remove('is-dragging');
      update();
    }
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    canvas.addEventListener('lostpointercapture', event => {
      if (!event.buttons) release(event);
    });

    stage.append(poster, canvas);
    controls.append(hint, retry, directions);
    if (sharedFurniture) {
      root.replaceChildren(stage, picks, controls);
      root.addEventListener('portfolio:inspect-furniture', event => {
        const item = event.detail;
        if (furnitureIds.has(item?.id)) select(item);
      });
    } else if (furniture) root.replaceChildren(picks, stage, controls);
    else {
      const showcase = document.createElement('div');
      showcase.className = 'tool-showcase';
      showcase.append(caption, stage, controls, step);
      root.replaceChildren(library, showcase);
    }
    select(options[0]);
    if (window.ResizeObserver) new ResizeObserver(update).observe(stage);
    else window.addEventListener('resize', update);
    if (activated) return;
    if (!window.IntersectionObserver) {
      activated = true;
      start();
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (activated) return;
      activated = true;
      start();
    }, { rootMargin: '250px' });
    observer.observe(root);
  }
  document.querySelectorAll('[data-tool-viewer]').forEach(setup);
})();
