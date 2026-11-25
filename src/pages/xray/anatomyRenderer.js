// Mesh decoding, transparent skin compositing and CPU rasterization from the project retrospective.
const decode = text => {
    const raw = atob(text), bytes = Uint8Array.from(raw, c => c.charCodeAt(0)), header = new DataView(bytes.buffer);
    const count = header.getUint32(0, true), faces = header.getUint32(4, true);
    const packed = new Int16Array(bytes.buffer, 8, 3 * count), pos = Float32Array.from(packed, n => n / 28000);
    const ids = new Uint16Array(bytes.buffer, 8 + 6 * count, 3 * faces), norm = new Float32Array(count * 3);
    for (let j = 0; j < ids.length; j += 3) {
        const a = 3 * ids[j], b = 3 * ids[j + 1], c = 3 * ids[j + 2], ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2], vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
        const x = uy * vz - uz * vy, y = uz * vx - ux * vz, z = ux * vy - uy * vx;
        for (const k of [a, b, c]) {
            norm[k] += x;
            norm[k + 1] += y;
            norm[k + 2] += z;
        }
    }
    for (let k = 0; k < norm.length; k += 3) {
        const v = Math.hypot(norm[k], norm[k + 1], norm[k + 2]) || 1;
        norm[k] /= v;
        norm[k + 1] /= v;
        norm[k + 2] /= v;
    }
    return { pos, norm, ids };
};
export function prepareAnatomy(packed) {
    const models = packed.map(decode);
    return function createRenderer(canvas, software) {
        let yaw, pitch, zoomed, alpha;
        const basis = () => [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch)];
        const scale = () => {
            const aspect = canvas.width / canvas.height;
            return (zoomed ? 2.24 : .93) * Math.min(1, aspect / (zoomed ? .95 : .49));
        };
        const target = () => zoomed ? .425 : 0;
        function makeGPU(gl) {
            const vert = `
                attribute vec3 p, n;
                uniform vec4 b;
                uniform vec3 s;
                varying vec3 N;
                vec3 rotate(vec3 point) {
                    vec3 t = vec3(b.x * point.x + b.y * point.z, point.y, -b.y * point.x + b.x * point.z);
                    return vec3(t.x, b.z * t.y - b.w * t.z, b.w * t.y + b.z * t.z);
                }
                void main() {
                    vec3 q = rotate(vec3(p.x, p.y - s.z, p.z));
                    N = rotate(n);
                    gl_Position = vec4(s.x * q.x, s.y * q.y, -q.z * .53, 1.);
                }`;
            const frag = `
                precision mediump float;
                varying vec3 N;
                uniform float shell, opacity;
                void main() {
                    vec3 normal = normalize(N);
                    if (normal.z < 0.) normal = -normal;
                    float light = max(dot(normal, vec3(-.42, .56, .714)), 0.);
                    float edge = pow(1. - abs(normal.z), 1.6);
                    vec3 bone = vec3(.80, .69, .49) * (.41 + .59 * light);
                    vec3 skin = mix(vec3(.34, .62, .54) * (.62 + .38 * light), vec3(.67, .94, .80), edge * .67);
                    gl_FragColor = vec4(mix(bone, skin, shell), mix(1., opacity, shell));
                }`;
            const program = gl.createProgram();
            for (const [stage, src] of [[gl.VERTEX_SHADER, vert], [gl.FRAGMENT_SHADER, frag]]) {
                const sh = gl.createShader(stage);
                gl.shaderSource(sh, src);
                gl.compileShader(sh);
                if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
                    throw new Error(gl.getShaderInfoLog(sh));
                gl.attachShader(program, sh);
                gl.deleteShader(sh);
            }
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS))
                throw new Error(gl.getProgramInfoLog(program));
            gl.useProgram(program);
            const attrib = k => gl.getAttribLocation(program, k), uniform = k => gl.getUniformLocation(program, k);
            const pa = attrib('p'), na = attrib('n'), b = uniform('b'), s = uniform('s'), shell = uniform('shell'), opacity = uniform('opacity');
            function buffer(target, data) {
                const handle = gl.createBuffer();
                gl.bindBuffer(target, handle);
                gl.bufferData(target, data, gl.STATIC_DRAW);
                return handle;
            }
            const meshes = models.map(model => ({
                position: buffer(gl.ARRAY_BUFFER, model.pos),
                normal: buffer(gl.ARRAY_BUFFER, model.norm),
                index: buffer(gl.ELEMENT_ARRAY_BUFFER, model.ids),
                count: model.ids.length,
            }));
            function draw(index) {
                const mesh = meshes[index];
                for (const [attribute, handle] of [[pa, mesh.position], [na, mesh.normal]]) {
                    gl.enableVertexAttribArray(attribute);
                    gl.bindBuffer(gl.ARRAY_BUFFER, handle);
                    gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
                }
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.index);
                gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
            }
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.clearColor(0, 0, 0, 0);
            return () => {
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.depthMask(true);
                gl.depthFunc(gl.LESS);
                gl.colorMask(true, true, true, true);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.disable(gl.BLEND);
                gl.uniform4fv(b, basis());
                gl.uniform3f(s, scale() * canvas.height / canvas.width, scale(), target());
                gl.uniform1f(shell, 0);
                gl.uniform1f(opacity, alpha);
                draw(0);
                if (alpha <= 0)
                    return;
                gl.uniform1f(shell, 1);
                // Resolve the nearest skin layer in depth before blending it over the bones.
                gl.colorMask(false, false, false, false);
                draw(1);
                gl.colorMask(true, true, true, true);
                gl.depthFunc(gl.EQUAL);
                gl.depthMask(false);
                gl.enable(gl.BLEND);
                gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                draw(1);
                gl.depthMask(true);
                gl.depthFunc(gl.LESS);
            };
        }
        function makeCPU(ctx) {
            const frames = models.map(m => new Float32Array(m.pos.length / 3 * 5));
            let w = 0, h = 0, image, depth, boneDepth, skinDepth, skinTone, skinEdge;
            function draw() {
                if (w !== canvas.width || h !== canvas.height) {
                    w = canvas.width;
                    h = canvas.height;
                    image = ctx.createImageData(w, h);
                    boneDepth = new Float32Array(w * h);
                    skinDepth = new Float32Array(w * h);
                    skinTone = new Float32Array(w * h);
                    skinEdge = new Float32Array(w * h);
                }
                const pixel = image.data;
                pixel.fill(0);
                boneDepth.fill(-5);
                skinDepth.fill(-5);
                const [cy, sy, cp, sp] = basis(), k = scale() * h * .5, center = target();
                for (let pass = 0; pass < 2; pass++) {
                    if (pass === 1 && alpha === 0)
                        continue;
                    const { pos, norm, ids } = models[pass], v = frames[pass];
                    depth = pass === 0 ? boneDepth : skinDepth;
                    for (let j = 0, q = 0; j < pos.length; j += 3, q += 5) {
                        const x = pos[j], y = pos[j + 1] - center, z = pos[j + 2], zr = -sy * x + cy * z;
                        v[q] = w * .5 + k * (cy * x + sy * z);
                        v[q + 1] = h * .5 - k * (cp * y - sp * zr);
                        v[q + 2] = sp * y + cp * zr;
                        const nx = norm[j], ny = norm[j + 1], nz = norm[j + 2], rz = -sy * nx + cy * nz;
                        let xx = cy * nx + sy * nz, yy = cp * ny - sp * rz, zz = sp * ny + cp * rz;
                        if (zz < 0) {
                            xx = -xx;
                            yy = -yy;
                            zz = -zz;
                        }
                        v[q + 3] = Math.max(0, -.42 * xx + .56 * yy + .714 * zz);
                        v[q + 4] = Math.pow(Math.max(0, 1 - zz), 1.6);
                    }
                    for (let t = 0; t < ids.length; t += 3) {
                        const a = ids[t] * 5, b = ids[t + 1] * 5, c = ids[t + 2] * 5, ax = v[a], ay = v[a + 1], bx = v[b], by = v[b + 1], cx = v[c], cy2 = v[c + 1];
                        const den = (by - cy2) * (ax - cx) + (cx - bx) * (ay - cy2);
                        if (Math.abs(den) < .004)
                            continue;
                        const x0 = Math.max(0, Math.ceil(Math.min(ax, bx, cx) - .5)), x1 = Math.min(w - 1, Math.floor(Math.max(ax, bx, cx) - .5)), y0 = Math.max(0, Math.ceil(Math.min(ay, by, cy2) - .5)), y1 = Math.min(h - 1, Math.floor(Math.max(ay, by, cy2) - .5));
                        if (x1 < x0 || y1 < y0)
                            continue;
                        const ux = (by - cy2) / den, uy = (cx - bx) / den, vx = (cy2 - ay) / den, vy = (ax - cx) / den;
                        for (let py = y0; py <= y1; py++) {
                            const row = py * w;
                            let u = ux * (x0 + .5 - cx) + uy * (py + .5 - cy2), bary = vx * (x0 + .5 - cx) + vy * (py + .5 - cy2);
                            for (let px = x0; px <= x1; px++, u += ux, bary += vx) {
                                const rem = 1 - u - bary;
                                if (u < 0 || bary < 0 || rem < 0)
                                    continue;
                                const z = u * v[a + 2] + bary * v[b + 2] + rem * v[c + 2], i = row + px;
                                if (z <= depth[i] || (pass === 1 && z <= boneDepth[i]))
                                    continue;
                                depth[i] = z;
                                const shade = u * v[a + 3] + bary * v[b + 3] + rem * v[c + 3];
                                if (pass === 0) {
                                    const l = .41 + .59 * shade, p = 4 * i;
                                    pixel[p] = 204 * l;
                                    pixel[p + 1] = 176 * l;
                                    pixel[p + 2] = 125 * l;
                                    pixel[p + 3] = 255;
                                }
                                else {
                                    skinTone[i] = shade;
                                    skinEdge[i] = u * v[a + 4] + bary * v[b + 4] + rem * v[c + 4];
                                }
                            }
                        }
                    }
                }
                if (alpha > 0) {
                    for (let i = 0; i < w * h; i++) {
                        if (skinDepth[i] === -5)
                            continue;
                        const j = i * 4, l = .62 + .38 * skinTone[i], e = .67 * skinEdge[i], r = 87 * l * (1 - e) + 171 * e, g = 158 * l * (1 - e) + 240 * e, b = 138 * l * (1 - e) + 204 * e, has = pixel[j + 3] > 0;
                        if (has) {
                            pixel[j] = pixel[j] * (1 - alpha) + r * alpha;
                            pixel[j + 1] = pixel[j + 1] * (1 - alpha) + g * alpha;
                            pixel[j + 2] = pixel[j + 2] * (1 - alpha) + b * alpha;
                        }
                        else {
                            pixel[j] = r;
                            pixel[j + 1] = g;
                            pixel[j + 2] = b;
                            pixel[j + 3] = 255 * alpha;
                        }
                    }
                }
                ctx.putImageData(image, 0, 0);
            }
            return draw;
        }
        let renderer;
        if (software) {
            const ctx = canvas.getContext('2d', { alpha: true });
            if (!ctx)
                throw new Error('2D mesh rendering is unavailable');
            renderer = makeCPU(ctx);
        }
        else {
            const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true, depth: true, preserveDrawingBuffer: true });
            if (!gl)
                throw new Error('WebGL is unavailable');
            renderer = makeGPU(gl);
        }
        return (view, moving) => {
            yaw = view.yaw * Math.PI / 180;
            pitch = view.pitch * Math.PI / 180;
            zoomed = view.region === 'torso';
            alpha = view.opacity / 100;
            const bounds = canvas.getBoundingClientRect();
            if (!bounds.width || !bounds.height)
                return;
            const scale = Math.min(window.devicePixelRatio || 1, software ? (moving ? .75 : .98) : 1.6);
            const width = Math.max(1, Math.round(bounds.width * scale));
            const height = Math.max(1, Math.round(bounds.height * scale));
            if (canvas.width !== width)
                canvas.width = width;
            if (canvas.height !== height)
                canvas.height = height;
            renderer();
        };
    };
}
