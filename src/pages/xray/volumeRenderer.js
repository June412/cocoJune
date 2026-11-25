// The original Unity retrospective’s attenuation volume, region windows and ray integration.
const volumeMeta = {
    "dimensionsXYZ": [
        340,
        152,
        866
    ],
    "spacingMmXYZ": [
        2.0,
        2.0,
        2.0
    ],
    "originLpsMmXYZ": [
        -339.257532,
        -251.257532,
        -83.257532
    ],
    "pivotLpsMmXYZ": [
        -0.6470000000000198,
        -100.76769999999999,
        781.6243999999999
    ],
    "voxelBoundaryMinLpsMm": [
        -340.257532,
        -252.257532,
        -84.257532
    ],
    "voxelBoundaryMaxLpsMm": [
        339.742468,
        51.742468,
        1647.742468
    ],
    "rawLength": 44754880,
    "muScalePerMm": 0.0814922535660821,
    "attenuationPerCode": 0.00031957746496502783
};
function decodeXrayVolume(base64, expectedLength) {
    const encoded = atob(base64);
    const voxels = new Uint8Array(expectedLength);
    let input = 0;
    let output = 0;
    while (input < encoded.length) {
        let header = 0;
        let weight = 1;
        let byte;
        do {
            if (input >= encoded.length || weight > 268435456)
                throw new Error('损坏的 X 光体数据段头');
            byte = encoded.charCodeAt(input++);
            header += (byte & 127) * weight;
            weight *= 128;
        } while (byte >= 128);
        const end = output + Math.floor(header / 2) + 1;
        if (end > expectedLength)
            throw new Error('X 光体数据超过声明尺寸');
        if (header % 2) {
            if (input >= encoded.length)
                throw new Error('缺少 X 光体数据重复值');
            voxels.fill(encoded.charCodeAt(input++), output, end);
            output = end;
        }
        else {
            if (end - output > encoded.length - input)
                throw new Error('X 光体数据段不完整');
            while (output < end)
                voxels[output++] = encoded.charCodeAt(input++);
        }
    }
    if (output !== expectedLength)
        throw new Error('X 光体数据尺寸不符');
    return voxels;
}
const size = volumeMeta.dimensionsXYZ, spacing = volumeMeta.spacingMmXYZ, lower = volumeMeta.voxelBoundaryMinLpsMm, upper = volumeMeta.voxelBoundaryMaxLpsMm, pivot = volumeMeta.pivotLpsMmXYZ;
const tanFov = Math.tan(38 * Math.PI / 360);
const regions = { whole: { lift: 0, distance: 3200, black: .5, white: 10, gamma: .7 }, torso: { lift: 420, distance: 1650, black: 1, white: 10, gamma: .65 }, legs: { lift: -420, distance: 1650, black: .6, white: 5.5, gamma: .6 } };
function orientation(v) {
    const cfg = regions[v.region], k = Math.PI / 180, y = v.yaw * k, p = v.pitch * k, cy = Math.cos(y), sy = Math.sin(y), cp = Math.cos(p), sp = Math.sin(p);
    const f = [sy * cp, cy * cp, sp], right = [cy, -sy, 0], up = [-sy * sp, -cy * sp, cp];
    const focus = [pivot[0], pivot[1], pivot[2] + cfg.lift], source = focus.map((x, i) => x - f[i] * cfg.distance);
    return { source, f, right, up, cfg };
}
const vert = `#version 300 es
 void main(){
   vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));
   gl_Position=vec4(p*2.-1.,0.,1.);
 }`;
const frag = `#version 300 es
 precision highp float;
 precision highp sampler3D;
 uniform sampler3D uVolume;
 uniform vec3 uSource,uForward,uRight,uUp,uMin,uMax,uWindow;
 uniform vec2 uSize;
 uniform float uTan,uStep,uScale;
 out vec4 outColor;
 float encodeSRGB(float v){return v<=0.0031308?12.92*v:1.055*pow(v,1.0/2.4)-0.055;}
 void main(){
   vec2 uv=(2.*gl_FragCoord.xy/uSize-1.)*uTan;
   vec3 d=normalize(uForward+(uv.x*uSize.x/uSize.y)*uRight+uv.y*uUp);
   vec3 safe=vec3(d.x<0.?min(-1e-12,d.x):max(1e-12,d.x),d.y<0.?min(-1e-12,d.y):max(1e-12,d.y),d.z<0.?min(-1e-12,d.z):max(1e-12,d.z));
   vec3 a=(uMin-uSource)/safe,b=(uMax-uSource)/safe,l=min(a,b),h=max(a,b);
   float entry=max(0.,max(l.x,max(l.y,l.z))),end=min(h.x,min(h.y,h.z));
   float tau=0.;
   if(end>entry){
     vec3 inv=1./(uMax-uMin);
     for(int i=0;i<4096;i++){
       float start=entry+float(i)*uStep;if(start>=end)break;
       float dl=min(uStep,end-start);vec3 pos=uSource+(start+.5*dl)*d;
       tau+=texture(uVolume,(pos-uMin)*inv).r*(uScale*dl);
     }
   }
   // Human presentation maps raw tau. Its accompanying ideal primary transmission is exp(-tau).
   float gray=pow(clamp((tau-uWindow.x)/(uWindow.y-uWindow.x),0.,1.),1./uWindow.z);
   float code=encodeSRGB(gray);outColor=vec4(vec3(code),1.);
 }`;
export function prepareVolume(packed) {
    const voxels = decodeXrayVolume(packed[0], volumeMeta.rawLength);
    return function createRenderer(canvas, software) {
        let gl, ctx, program, texture, vao, locations;
        function buildGpu() {
            gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true });
            if (!gl || Math.max(...size) > gl.getParameter(gl.MAX_3D_TEXTURE_SIZE))
                return false;
            function compile(type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    throw new Error(gl.getShaderInfoLog(shader));
                }
                return shader;
            }
            const vs = compile(gl.VERTEX_SHADER, vert), fs = compile(gl.FRAGMENT_SHADER, frag);
            program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS))
                throw new Error(gl.getProgramInfoLog(program));
            vao = gl.createVertexArray();
            gl.bindVertexArray(vao);
            gl.useProgram(program);
            gl.disable(gl.DITHER);
            locations = {};
            for (const name of ['uVolume', 'uSource', 'uForward', 'uRight', 'uUp', 'uMin', 'uMax', 'uWindow', 'uSize', 'uTan', 'uStep', 'uScale'])
                locations[name] = gl.getUniformLocation(program, name);
            texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_3D, texture);
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            for (const type of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T, gl.TEXTURE_WRAP_R])
                gl.texParameteri(gl.TEXTURE_3D, type, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage3D(gl.TEXTURE_3D, 0, gl.R8, ...size, 0, gl.RED, gl.UNSIGNED_BYTE, voxels);
            if (gl.getError() !== gl.NO_ERROR)
                return false;
            gl.uniform1i(locations.uVolume, 0);
            gl.uniform3fv(locations.uMin, lower);
            gl.uniform3fv(locations.uMax, upper);
            gl.uniform1f(locations.uScale, volumeMeta.muScalePerMm);
            gl.uniform1f(locations.uTan, tanFov);
            return true;
        }
        function gpuDraw(w, h, step, o) {
            gl.viewport(0, 0, w, h);
            gl.uniform2f(locations.uSize, w, h);
            gl.uniform1f(locations.uStep, step);
            for (const [name, vec] of [['uSource', o.source], ['uForward', o.f], ['uRight', o.right], ['uUp', o.up]])
                gl.uniform3fv(locations[name], vec);
            gl.uniform3f(locations.uWindow, o.cfg.black, o.cfg.white, o.cfg.gamma);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        function cpuRay(sx, sy, sz, dx, dy, dz, step) {
            const ix = 1 / (dx === 0 ? 1e-12 : dx), iy = 1 / (dy === 0 ? 1e-12 : dy), iz = 1 / (dz === 0 ? 1e-12 : dz);
            const ax = (lower[0] - sx) * ix, bx = (upper[0] - sx) * ix, ay = (lower[1] - sy) * iy, by = (upper[1] - sy) * iy, az = (lower[2] - sz) * iz, bz = (upper[2] - sz) * iz;
            const start = Math.max(0, Math.min(ax, bx), Math.min(ay, by), Math.min(az, bz)), end = Math.min(Math.max(ax, bx), Math.max(ay, by), Math.max(az, bz));
            if (end <= start)
                return 0;
            const [nx, ny, nz] = size, plane = nx * ny, cx = (sx - volumeMeta.originLpsMmXYZ[0]) / spacing[0], cy = (sy - volumeMeta.originLpsMmXYZ[1]) / spacing[1], cz = (sz - volumeMeta.originLpsMmXYZ[2]) / spacing[2];
            dx /= spacing[0];
            dy /= spacing[1];
            dz /= spacing[2];
            let sum = 0;
            for (let p = start; p < end; p += step) {
                const dl = Math.min(step, end - p), mid = p + dl * .5;
                const x = Math.max(0, Math.min(nx - 1, cx + dx * mid)), y = Math.max(0, Math.min(ny - 1, cy + dy * mid)), z = Math.max(0, Math.min(nz - 1, cz + dz * mid));
                const x0 = x | 0, y0 = y | 0, z0 = z | 0, fx = x - x0, fy = y - y0, fz = z - z0, base = x0 + y0 * nx + z0 * plane;
                const ox = x0 + 1 < nx ? 1 : 0, oy = y0 + 1 < ny ? nx : 0, oz = z0 + 1 < nz ? plane : 0;
                // Trilinear sampling matches the GPU texture and weights the last partial step.
                const v0 = voxels[base] * (1 - fx) + voxels[base + ox] * fx, v1 = voxels[base + oy] * (1 - fx) + voxels[base + oy + ox] * fx;
                const v2 = voxels[base + oz] * (1 - fx) + voxels[base + oz + ox] * fx, v3 = voxels[base + oz + oy] * (1 - fx) + voxels[base + oz + oy + ox] * fx;
                sum += ((v0 * (1 - fy) + v1 * fy) * (1 - fz) + (v2 * (1 - fy) + v3 * fy) * fz) * dl;
            }
            return sum * volumeMeta.attenuationPerCode;
        }
        async function cpuDraw(w, h, step, o, current) {
            const im = ctx.createImageData(w, h), a = im.data, aspect = w / h, cfg = o.cfg;
            let clock = performance.now();
            for (let y = 0; y < h; y++) {
                const up = (1 - 2 * (y + .5) / h) * tanFov, fx = o.f[0] + o.up[0] * up, fy = o.f[1] + o.up[1] * up, fz = o.f[2] + o.up[2] * up;
                for (let x = 0; x < w; x++) {
                    const right = (2 * (x + .5) / w - 1) * aspect * tanFov;
                    let dx = fx + right * o.right[0], dy = fy + right * o.right[1], dz = fz + right * o.right[2];
                    const k = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);
                    dx *= k;
                    dy *= k;
                    dz *= k;
                    const tau = cpuRay(o.source[0], o.source[1], o.source[2], dx, dy, dz, step), l = Math.pow(Math.max(0, Math.min(1, (tau - cfg.black) / (cfg.white - cfg.black))), 1 / cfg.gamma);
                    const gray = Math.round(255 * (l <= .0031308 ? 12.92 * l : 1.055 * Math.pow(l, 1 / 2.4) - .055)), idx = (y * w + x) * 4;
                    a[idx] = a[idx + 1] = a[idx + 2] = gray;
                    a[idx + 3] = 255;
                }
                if (y % 4 === 0 && performance.now() - clock > 12) {
                    await new Promise(done => setTimeout(done, 0));
                    if (!current())
                        return;
                    clock = performance.now();
                }
            }
            if (current())
                ctx.putImageData(im, 0, 0);
        }
        if (software) {
            ctx = canvas.getContext('2d', { alpha: false });
            if (!ctx)
                throw new Error('2D projection is unavailable');
        }
        else if (!buildGpu()) {
            throw new Error('3D texture rendering is unavailable');
        }
        return (view, moving, current) => {
            const maxSize = software ? (moving ? 175 : 370) : (moving ? 410 : 730);
            const bounds = canvas.getBoundingClientRect();
            if (!bounds.width || !bounds.height)
                return;
            const scale = Math.min(window.devicePixelRatio || 1, 1.7, maxSize / Math.max(bounds.width, bounds.height));
            const width = Math.max(1, Math.round(bounds.width * scale));
            const height = Math.max(1, Math.round(bounds.height * scale));
            if (canvas.width !== width)
                canvas.width = width;
            if (canvas.height !== height)
                canvas.height = height;
            const camera = orientation(view);
            if (software)
                return cpuDraw(width, height, moving ? 5 : 2, camera, current);
            gpuDraw(width, height, moving ? 3 : 1, camera);
        };
    };
}
