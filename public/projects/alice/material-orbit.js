/* Offline two-axis preview of the studio's Unity material swatches. */
(function () {
  'use strict';

  const base = new URL('assets/', document.currentScript.src);
  const pending = new Map();
  const viewers = new Map();
  const elevations = [-75, -45, -15, 0, 15, 45, 75];
  const radians = Math.PI / 180;
  let nextId = 0;

  function decodeImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function receive(id, surface, lighting) {
    const entry = pending.get(id);
    if (entry) Promise.all([decodeImage(surface), decodeImage(lighting)]).then(entry.resolve, entry.reject);
  }

  function loadMaterial(id) {
    if (pending.has(id)) return pending.get(id).promise;
    const entry = {};
    entry.promise = new Promise((resolve, reject) => {
      entry.resolve = resolve;
      entry.reject = reject;
    });
    pending.set(id, entry);
    const script = document.createElement('script');
    script.src = new URL('swatch-orbit-' + encodeURIComponent(id) + '.js', base).href;
    script.onload = () => script.remove();
    script.onerror = () => {
      script.remove();
      pending.delete(id);
      entry.reject(new Error('Material capture unavailable'));
    };
    document.head.append(script);
    return entry.promise;
  }

  function lightBands(pitch) {
    let hi = elevations.findIndex(value => value >= pitch);
    if (hi < 0) hi = elevations.length - 1;
    const lo = Math.max(0, hi - 1);
    const step = elevations[hi] - elevations[lo];
    return [lo, hi, step ? Math.min(1, Math.max(0, (pitch - elevations[lo]) / step)) : 0];
  }

  // Render an orthographic ray/sphere intersection. The world normal retrieves
  // a point on the entire photographed surface. A second texture carries the
  // studio shader's lighting, measured from seven camera elevations.
  const vertexSource = [
    'attribute vec2 position;',
    'varying vec2 plane;',
    'void main(){plane=position;gl_Position=vec4(position,0.0,1.0);}'
  ].join('\n');
  const fragmentSource = [
    'precision highp float;',
    'varying vec2 plane;',
    'uniform sampler2D surface, lighting;',
    'uniform vec4 orbit;',
    'uniform vec3 bands;',
    'uniform float feather;',
    'vec3 lamp(vec2 point,float index){',
    '  vec2 st=clamp(point,vec2(0.5/192.0),vec2(1.0-0.5/192.0));',
    '  return texture2D(lighting,vec2((index+st.x)/7.0,st.y)).rgb;',
    '}',
    'void main(){',
    '  vec2 xy=plane/0.75;',
    '  float radius=length(xy);',
    '  if(radius>1.0){gl_FragColor=vec4(0.0);return;}',
    '  float z=sqrt(max(0.0,1.0-dot(xy,xy)));',
    '  float depth=orbit.w*z-orbit.z*xy.y;',
    '  vec3 normal=vec3(orbit.x*xy.x-orbit.y*depth,orbit.w*xy.y+orbit.z*z,orbit.y*xy.x+orbit.x*depth);',
    '  vec2 uv=vec2(fract(atan(normal.x,normal.z)/6.28318530718+0.5),0.5-asin(clamp(normal.y,-1.0,1.0))/3.14159265359);',
    '  vec3 weave=texture2D(surface,uv).rgb*2.0;',
    '  vec2 st=vec2(xy.x,-xy.y)*min(1.0,0.99/max(radius,0.001))*0.5+0.5;',
    '  vec3 light=mix(lamp(st,bands.x),lamp(st,bands.y),bands.z);',
    '  float coverage=smoothstep(0.0,feather,1.0-radius);',
    '  gl_FragColor=vec4(min(weave*light,vec3(1.0))*coverage,coverage);',
    '}'
  ].join('\n');

  function gpuRenderer(canvas, images) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: false });
    if (!gl) throw new Error('WebGL unavailable');
    const program = gl.createProgram();
    const buffers = [];
    const textures = [];
    const shaders = [];
    function dispose() {
      for (const t of textures) gl.deleteTexture(t);
      for (const b of buffers) gl.deleteBuffer(b);
      for (const s of shaders) gl.deleteShader(s);
      gl.deleteProgram(program);
      const control = gl.getExtension('WEBGL_lose_context');
      if (control) control.loseContext();
    }
    try {
      for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
        const shader = gl.createShader(type);
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      buffers.push(buffer);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      images.forEach((image, i) => {
        const texture = gl.createTexture();
        textures.push(texture);
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, i === 0 ? gl.REPEAT : gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, i === 0 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        if (i === 0) gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(gl.getUniformLocation(program, i === 0 ? 'surface' : 'lighting'), i);
      });
      if (gl.getError() !== gl.NO_ERROR) throw new Error('Texture upload unavailable');
      const orbit = gl.getUniformLocation(program, 'orbit');
      const bands = gl.getUniformLocation(program, 'bands');
      const feather = gl.getUniformLocation(program, 'feather');
      return {
        name: 'webgl',
        dispose,
        draw(width, yaw, pitch) {
          const size = Math.min(960, Math.max(32, Math.round(width * Math.min(2, window.devicePixelRatio || 1))));
          if (canvas.width !== size || canvas.height !== size) canvas.width = canvas.height = size;
          gl.viewport(0, 0, size, size);
          gl.uniform4f(orbit, Math.cos(yaw * radians), Math.sin(yaw * radians), Math.sin(pitch * radians), Math.cos(pitch * radians));
          gl.uniform3fv(bands, lightBands(pitch));
          gl.uniform1f(feather, 2.4 / size);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
      };
    } catch (error) {
      dispose();
      throw error;
    }
  }

  function readPixels(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  // Use the same sphere and textures when WebGL is disabled or its context is lost.
  function cpuRenderer(canvas, images) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    const [surface, lighting] = images.map(readPixels);
    let output;
    return {
      name: 'canvas2d',
      dispose() {},
      draw(width, yaw, pitch) {
        const size = Math.max(32, Math.min(440, Math.round(width)));
        if (!output || output.width !== size) {
          canvas.width = canvas.height = size;
          output = ctx.createImageData(size, size);
        }
        const pixels = output.data;
        const ca = Math.cos(yaw * radians), sa = Math.sin(yaw * radians);
        const ce = Math.cos(pitch * radians), se = Math.sin(pitch * radians);
        const [low, high, mix] = lightBands(pitch);
        const tile = lighting.height;
        const image = surface.data, light = lighting.data;
        for (let row = 0; row < size; row++) {
          const y = (size / 2 - row - 0.5) / (size * 0.375);
          for (let col = 0; col < size; col++) {
            const x = (col + 0.5 - size / 2) / (size * 0.375);
            const square = x * x + y * y;
            const dst = 4 * (row * size + col);
            if (square >= 1) {
              pixels[dst + 3] = 0;
              continue;
            }
            const z = Math.sqrt(1 - square);
            const depth = ce * z - se * y;
            const u = Math.atan2(sa * -depth + ca * x, ca * depth + sa * x) / (2 * Math.PI) + 0.5;
            const v = 0.5 - Math.asin(Math.max(-1, Math.min(1, ce * y + se * z))) / Math.PI;
            const sx = Math.floor(u * surface.width) % surface.width;
            const sy = Math.min(surface.height - 1, Math.floor(v * surface.height));
            const weave = 4 * (sy * surface.width + sx);
            const radius = Math.sqrt(square);
            const scale = 0.5 * Math.min(1, 0.99 / Math.max(radius, 0.001));
            const lx = Math.floor((0.5 + x * scale) * tile);
            const ly = Math.floor((0.5 - y * scale) * tile);
            const a = 4 * (ly * lighting.width + low * tile + lx);
            const b = 4 * (ly * lighting.width + high * tile + lx);
            const coverage = Math.min(1, (1 - radius) * size / 2.4);
            pixels[dst + 3] = 255 * coverage * coverage * (3 - 2 * coverage);
            for (let c = 0; c < 3; c++) {
              const shade = light[a + c] * (1 - mix) + light[b + c] * mix;
              pixels[dst + c] = image[weave + c] / 127.5 * shade;
            }
          }
        }
        ctx.putImageData(output, 0, 0);
      }
    };
  }

  function element(tag, className) {
    const node = document.createElement(tag);
    node.className = className;
    return node;
  }

  function mount(stage, material, label, lang) {
    if (viewers.has(stage)) viewers.get(stage)();
    const chinese = String(lang || document.documentElement.lang).toLowerCase().startsWith('zh');
    const tr = (zh, en) => chinese ? zh : en;
    const name = label || material.label;
    const wrap = element('div', 'swatch-orbit');
    const picture = element('div', 'swatch-orbit-picture');
    const poster = element('img', 'swatch-orbit-poster');
    poster.src = material.image.src;
    poster.alt = name;
    const controls = element('div', 'swatch-orbit-controls');
    controls.hidden = true;
    const hint = element('span', 'swatch-orbit-hint');
    hint.id = 'swatch-orbit-help-' + ++nextId;
    hint.textContent = tr('拖动旋转', 'Drag to rotate');
    const group = element('div', 'swatch-orbit-actions');
    const status = element('span', 'swatch-orbit-status');
    status.setAttribute('role', 'status');
    let yaw = 0, pitch = 0, renderer = null, pendingFrame = 0, dead = false, drag = null, canvas, images;
    const lifetime = new AbortController();
    const on = (target, event, callback) => target.addEventListener(event, callback, { signal: lifetime.signal });
    let observer;

    function draw() {
      pendingFrame = 0;
      if (!renderer || dead) return;
      const width = picture.clientWidth;
      if (!width) return;
      renderer.draw(width, yaw, pitch);
      picture.dataset.yaw = String(Math.round(yaw));
      picture.dataset.pitch = String(Math.round(pitch));
    }
    function requestDraw() {
      if (!pendingFrame) pendingFrame = requestAnimationFrame(draw);
    }
    function move(toYaw, toPitch, announce) {
      yaw = ((toYaw % 360) + 360) % 360;
      pitch = Math.max(-90, Math.min(90, toPitch));
      requestDraw();
      if (announce) status.textContent = tr('水平 ' + Math.round(yaw) + '°，俯仰 ' + Math.round(pitch) + '°', 'Rotation ' + Math.round(yaw) + '°, elevation ' + Math.round(pitch) + '°');
    }
    function button(text, title, callback) {
      const b = element('button', 'swatch-orbit-button');
      b.type = 'button';
      b.textContent = text;
      b.setAttribute('aria-label', title);
      b.title = title;
      on(b, 'click', callback);
      group.append(b);
    }
    button('←', tr('向左旋转', 'Rotate left'), () => move(yaw - 15, pitch, true));
    button('→', tr('向右旋转', 'Rotate right'), () => move(yaw + 15, pitch, true));
    button('↑', tr('从上方查看', 'Orbit up'), () => move(yaw, pitch + 15, true));
    button('↓', tr('从下方查看', 'Orbit down'), () => move(yaw, pitch - 15, true));
    button(tr('复位', 'Reset'), tr('恢复正面视角', 'Reset front view'), () => move(0, 0, true));
    controls.append(hint, group, status);
    picture.append(poster);
    wrap.append(picture, controls);
    stage.replaceChildren(wrap);

    on(picture, 'pointerdown', e => {
      if (!renderer || !e.isPrimary || e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw, pitch };
      picture.focus({ preventScroll: true });
      picture.setPointerCapture(e.pointerId);
      picture.classList.add('is-dragging');
    });
    on(picture, 'pointermove', e => {
      if (!drag || drag.id !== e.pointerId) return;
      const ratio = 280 / Math.max(160, picture.clientWidth);
      move(drag.yaw + (e.clientX - drag.x) * ratio, drag.pitch + (e.clientY - drag.y) * ratio, false);
    });
    function endDrag(e) {
      if (drag && drag.id === e.pointerId) drag = null;
      picture.classList.remove('is-dragging');
    }
    on(picture, 'lostpointercapture', endDrag);
    on(picture, 'pointerup', endDrag);
    on(picture, 'pointercancel', endDrag);
    on(picture, 'keydown', e => {
      const step = e.shiftKey ? 30 : 5;
      const targets = {
        ArrowLeft: [yaw - step, pitch], ArrowRight: [yaw + step, pitch],
        ArrowUp: [yaw, pitch + step], ArrowDown: [yaw, pitch - step], Home: [0, 0]
      };
      if (!renderer || !targets[e.key]) return;
      e.preventDefault();
      move(...targets[e.key], true);
    });
    function showPoster() {
      if (canvas) canvas.remove();
      controls.hidden = true;
      picture.removeAttribute('tabindex');
      picture.removeAttribute('aria-describedby');
      picture.classList.remove('is-interactive');
      picture.dataset.renderer = 'poster';
      poster.hidden = false;
    }
    function start(cpuOnly) {
      if (dead) return;
      if (canvas) canvas.remove();
      canvas = element('canvas', 'swatch-orbit-canvas');
      canvas.setAttribute('aria-hidden', 'true');
      try {
        renderer = cpuOnly ? cpuRenderer(canvas, images) : gpuRenderer(canvas, images);
      } catch (_) {
        renderer = null;
        if (!cpuOnly) { start(true); return; }
        showPoster();
        return;
      }
      if (!cpuOnly) on(canvas, 'webglcontextlost', event => {
        event.preventDefault();
        if (!dead && canvas === event.target) start(true);
      });
      picture.append(canvas);
      picture.tabIndex = 0;
      picture.setAttribute('role', 'group');
      picture.setAttribute('aria-label', name + tr('，360° 材质球', ', 360° material sphere'));
      picture.setAttribute('aria-describedby', hint.id);
      picture.classList.add('is-interactive');
      picture.dataset.renderer = renderer.name;
      poster.hidden = true;
      controls.hidden = false;
      draw();
    }
    function dispose() {
      dead = true;
      lifetime.abort();
      if (observer) observer.disconnect();
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      if (renderer) renderer.dispose();
      viewers.delete(stage);
    }
    viewers.set(stage, dispose);
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(requestDraw);
      observer.observe(picture);
    } else on(window, 'resize', requestDraw);
    loadMaterial(material.id).then(loaded => {
      if (dead) return;
      images = loaded;
      start(false);
    }).catch(() => { if (!dead) showPoster(); });
    return dispose;
  }

  // Chapters and language switches can replace a stage before a texture resolves.
  new MutationObserver(() => {
    for (const [stage, dispose] of viewers) if (!stage.isConnected || !stage.firstElementChild?.classList.contains('swatch-orbit')) dispose();
  }).observe(document.documentElement, { childList: true, subtree: true });
  window.AliceMaterialOrbit = { mount, receive };
})();
