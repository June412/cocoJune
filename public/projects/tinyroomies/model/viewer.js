/* Production FBX geometry with the material palette used for the portfolio tool renders.
   The hand drill includes DrillCrank at the runtime offset of 0.087 metres.
   Meshes are projected into a depth buffer on demand. No GPU, server, or external library is required. */
(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src);
  const cache = new Map();
  const loading = new Map();
  const textures = new Map();

  function featuredTool(id) {
    return id === 'plane' || id === 'mallet' || id === 'drill';
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

  // The printed model doubles as its turntable. Geometry is only needed on interaction.
  function setup(stage) {
    const { model: id, kind } = stage.dataset;
    const furniture = kind === 'furniture';
    const portrait = kind === 'resident';
    const poster = stage.querySelector('img');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.setAttribute('aria-hidden', 'true');
    stage.append(canvas);
    stage.tabIndex = 0;
    stage.setAttribute('role', 'group');
    stage.setAttribute('aria-label', poster.alt + '. Drag to rotate, or use the arrow keys. Home resets the view.');
    stage.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight ArrowUp ArrowDown Home');
    let mesh, sheet, pending, pointer, projected, pixels, depths, frame;
    let rotation = 0, tilt = 0;

    function draw() {
      frame = 0;
      if (sheet) {
        const index = ((Math.round(rotation * 24 / (2 * Math.PI)) % 24) + 24) % 24;
        if (!canvas.width || canvas.width !== 270) { canvas.width = 270; canvas.height = 360; }
        context.clearRect(0, 0, 270, 360);
        context.drawImage(sheet, index % 6 * 270, Math.floor(index / 6) * 360, 270, 360, 0, 0, 270, 360);
      } else if (mesh && stage.clientWidth && stage.clientHeight) {
        const density = Math.min(window.devicePixelRatio || 1, 2, 640 / stage.clientWidth);
        const w = Math.max(1, Math.round(stage.clientWidth * density));
        const h = Math.max(1, Math.round(stage.clientHeight * density));
        if (!pixels || pixels.width !== w || pixels.height !== h) {
          canvas.width = w;
          canvas.height = h;
          pixels = context.createImageData(w, h);
          depths = new Float32Array(w * h);
        }
        const yaw = (mesh.yaw ?? (furniture ? .51 : .89)) + rotation;
        const flat = ['palette-leaf', 'painting-mat', 'transfer-paper', 'test-swatch'].includes(id);
        const pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, (mesh.pitch ?? (furniture ? .32 : flat ? 1.02 : .57)) + tilt));
        const scale = furniture ? furnitureScale(mesh, yaw, pitch, w, h) : Math.min(w, h) * .46;
        project(mesh.vertices, projected, yaw, pitch, w, h, scale);
        rasterize(mesh, projected, pixels, depths);
        context.putImageData(pixels, 0, 0);
      } else return;
      stage.classList.add('is-turned');
    }

    function queue() {
      if ((sheet || mesh) && !frame) frame = requestAnimationFrame(draw);
    }
    async function activate() {
      if (pending || sheet || mesh) return;
      pending = true;
      try {
        if (portrait) {
          const sprite = new Image();
          sprite.src = new URL('../media/' + id + '-360.webp', base).href;
          await sprite.decode();
          sheet = sprite;
        } else {
          mesh = meshFor(id, await loadGeometry(id, furniture));
          projected = new Float32Array(mesh.vertices.length / 11 * 6);
        }
        new ResizeObserver(queue).observe(stage);
        queue();
      } catch {
        // Retain the authored render. A later drag or keypress retries loading.
      } finally { pending = false; }
    }
    stage.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      stage.setPointerCapture(event.pointerId);
      activate();
    });
    stage.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      rotation += (event.clientX - pointer.x) * .025;
      tilt = Math.min(2, Math.max(-2, tilt + (event.clientY - pointer.y) * .014));
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      queue();
    });
    stage.addEventListener('lostpointercapture', () => { pointer = null; });
    stage.addEventListener('keydown', event => {
      const keys = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1], Home: [0, 0] };
      const direction = keys[event.key];
      if (!direction || (portrait && direction[1])) return;
      event.preventDefault();
      if (event.key === 'Home') { rotation = 0; tilt = 0; }
      else { rotation += direction[0] * Math.PI / 8; tilt = Math.min(2, Math.max(-2, tilt + direction[1] * Math.PI / 8)); }
      activate();
      queue();
    });
  }
  document.querySelectorAll('[data-model]').forEach(setup);
})();
