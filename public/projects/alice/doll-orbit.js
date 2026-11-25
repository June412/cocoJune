/* Interactive views of the authored Unity models. Works over HTTP and file URLs. */
(function dollViewer(){
    'use strict';
    const count=72;
    const basePitch={alice:4.004,panda:2.291};
    const saved=new Map(), scripts=new Map();
    const radians=Math.PI/180;
    const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
    const wrap=angle=>(angle%360+360)%360;

    function getMesh(id){
        if(window.AliceDollMeshes?.[id])return Promise.resolve(window.AliceDollMeshes[id]);
        if(!scripts.has(id)){
            const ready=new Promise((resolve,reject)=>{
                const script=document.createElement('script');
                script.src=`assets/turntable-${id}/mesh.js`;
                script.onload=()=>{
                    const mesh=window.AliceDollMeshes?.[id];
                    if(mesh)resolve(mesh);else reject(new Error('Missing mesh'));
                };
                script.onerror=()=>reject(new Error('Mesh file unavailable'));
                document.head.append(script);
            });
            scripts.set(id,ready);
        }
        return scripts.get(id);
    }
    function asBytes(encoded){
        const bytes=atob(encoded), buffer=new Uint8Array(bytes.length);
        for(let i=0;i<buffer.length;i++)buffer[i]=bytes.charCodeAt(i);
        return buffer;
    }
    function shader(gl,type,source){
        const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
        if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));
        return s;
    }
    async function meshRenderer(canvas,id,isActive,registerContext){
        const options={alpha:true,antialias:true,preserveDrawingBuffer:false};
        const gl=canvas.getContext('webgl2',options)||canvas.getContext('webgl',options);
        if(!gl)throw new Error('No graphics context');
        registerContext(gl);
        const modern=typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext;
        if(!modern&&!gl.getExtension('OES_element_index_uint'))throw new Error('No 32-bit indices');
        const mesh=await getMesh(id);
        if(!isActive())return;
        const atlas=new Image();atlas.src=mesh.atlas;await atlas.decode();
        if(!isActive())return;
        const max=gl.getParameter(gl.MAX_TEXTURE_SIZE);
        let textureSource=atlas;
        if(atlas.width>max||atlas.height>max){
            const scale=max/Math.max(atlas.width,atlas.height);
            textureSource=document.createElement('canvas');
            textureSource.width=Math.max(1,Math.floor(atlas.width*scale));
            textureSource.height=Math.max(1,Math.floor(atlas.height*scale));
            textureSource.getContext('2d').drawImage(atlas,0,0,textureSource.width,textureSource.height);
        }
        const prefix=modern?'#version 300 es\n':'';
        const input=modern?'in':'attribute';
        const uvPrecision=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT)?.precision?'highp':'mediump';
        const vert=shader(gl,gl.VERTEX_SHADER, prefix+`
            precision highp float;
            ${input} vec3 position;
            ${input} vec2 uv;
            uniform vec3 right, up, front;
            uniform vec2 scale;
            ${modern?'out':'varying'} ${uvPrecision} vec2 texcoord;
            void main(){
                gl_Position=vec4(vec2(dot(position,right),dot(position,up))*scale,-dot(position,front)*0.50,1.0);
                texcoord=uv;
            }`);
        const frag=shader(gl,gl.FRAGMENT_SHADER,prefix+`
            precision ${uvPrecision} float;
            ${modern?'in':'varying'} ${uvPrecision} vec2 texcoord;
            uniform sampler2D atlas;
            ${modern?'out vec4 pixel;':''}
            void main(){${modern?'pixel=texture':'gl_FragColor=texture2D'}(atlas,texcoord);}`);
        const prog=gl.createProgram();gl.attachShader(prog,vert);gl.attachShader(prog,frag);gl.linkProgram(prog);
        gl.deleteShader(vert);gl.deleteShader(frag);
        if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));
        gl.useProgram(prog);
        const vertices=gl.createBuffer(),indices=gl.createBuffer(),tex=gl.createTexture();
        gl.bindBuffer(gl.ARRAY_BUFFER,vertices);gl.bufferData(gl.ARRAY_BUFFER,asBytes(mesh.vertices),gl.STATIC_DRAW);
        const pos=gl.getAttribLocation(prog,'position'),uv=gl.getAttribLocation(prog,'uv');
        gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.SHORT,true,10,0);
        gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(uv,2,gl.UNSIGNED_SHORT,true,10,6);
        const elements=asBytes(mesh.indices);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,elements,gl.STATIC_DRAW);
        gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,textureSource);
        const locations=['right','up','front','scale'].map(k=>gl.getUniformLocation(prog,k));
        gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
        const total=elements.byteLength/4;
        return {
            draw(yaw,pitch,zoom){
                const bounds=canvas.getBoundingClientRect();
                if(!bounds.width||!bounds.height)return;
                const ratio=Math.min(devicePixelRatio||1,2);
                const w=Math.max(1,Math.round(bounds.width*ratio)),h=Math.max(1,Math.round(bounds.height*ratio));
                if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
                gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
                const y=yaw*radians,p=pitch*radians,s=Math.sin(y),c=Math.cos(y),sp=Math.sin(p),cp=Math.cos(p);
                gl.uniform3f(locations[0],c,0,-s);
                gl.uniform3f(locations[1],-s*sp,cp,-c*sp);
                gl.uniform3f(locations[2],s*cp,sp,c*cp);
                gl.uniform2f(locations[3],zoom*Math.min(1,h/w),zoom*Math.min(1,w/h));
                gl.drawElements(gl.TRIANGLES,total,gl.UNSIGNED_INT,0);
            },
            dispose(){
                gl.deleteTexture(tex);gl.deleteBuffer(vertices);gl.deleteBuffer(indices);gl.deleteProgram(prog);
            }
        };
    }
    class DollOrbit extends HTMLElement{
        connectedCallback(){
            this.idKey=this.dataset.doll;
            if(!Object.prototype.hasOwnProperty.call(basePitch,this.idKey))return;
            this.state=saved.get(this.idKey)||{yaw:0,pitch:basePitch[this.idKey],zoom:1};
            saved.set(this.idKey,this.state);
            this.life=new AbortController();
            const signal=this.life.signal;
            this.frameId=0;this.lastFrame=-1;
            this.pointers=new Map();
            this.surface=this.querySelector('.doll-stage');
            this.poster=this.querySelector('.doll-poster');
            this.canvas=this.querySelector('canvas');
            this.status=this.querySelector('[role=status]');
            this.english=this.closest('[lang]')?.lang?.startsWith('en');
            const on=(el,type,fn)=>el.addEventListener(type,fn,{signal});
            on(this.surface,'pointerdown',e=>{
                if(e.button!==0)return;
                this.surface.focus({preventScroll:true});
                this.surface.setPointerCapture(e.pointerId);
                this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
                this.surface.classList.add('is-dragging');
            });
            on(this.surface,'pointermove',e=>{
                const prev=this.pointers.get(e.pointerId);
                if(!prev)return;
                const other=[...this.pointers.entries()].find(([id])=>id!==e.pointerId)?.[1];
                const next={x:e.clientX,y:e.clientY};
                this.pointers.set(e.pointerId,next);
                if(other){
                    const oldDist=Math.hypot(prev.x-other.x,prev.y-other.y);
                    const newDist=Math.hypot(next.x-other.x,next.y-other.y);
                    if(oldDist>2)this.change(0,0,newDist/oldDist);
                }else{
                    const angular=290/Math.max(150,this.surface.clientWidth);
                    this.change(-(next.x-prev.x)*angular,(next.y-prev.y)*angular);
                }
            });
            const release=e=>{this.pointers.delete(e.pointerId);if(!this.pointers.size)this.surface.classList.remove('is-dragging');};
            for(const name of ['pointerup','pointercancel','lostpointercapture'])on(this.surface,name,release);
            on(this.surface,'keydown',e=>{
                const action={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',Home:'reset','+':'in','=':'in','-':'out'}[e.key];
                if(!action)return;e.preventDefault();this.action(action);
            });
            on(this,'click',e=>{const button=e.target.closest('[data-orbit-action]');if(button)this.action(button.dataset.orbitAction);});
            on(this.canvas,'webglcontextlost',e=>{
                e.preventDefault();this.renderer=null;this.dataset.mode='turntable';this.draw();
            });
            on(this.canvas,'webglcontextrestored',()=>this.initialize());
            this.sizeObserver=new ResizeObserver(()=>this.schedule());
            this.sizeObserver.observe(this.surface);
            this.visibility=new IntersectionObserver(entries=>{
                if(entries.some(e=>e.isIntersecting)){
                    this.visibility.disconnect();this.initialize();
                }
            },{rootMargin:'100px'});
            this.visibility.observe(this.surface);
            this.draw();
        }
        disconnectedCallback(){
            this.life?.abort();this.visibility?.disconnect();this.sizeObserver?.disconnect();
            cancelAnimationFrame(this.frameId);
            this.renderer?.dispose();this.renderer=null;
            // Release both contexts on a language change instead of relying on the
            // browser's context limit while the new pair is being created.
            this.context?.getExtension('WEBGL_lose_context')?.loseContext();
        }
        async initialize(){
            const life=this.life;
            try{
                const ready=await meshRenderer(this.canvas,this.idKey,()=>!life.signal.aborted,gl=>{this.context=gl;});
                if(!ready||life.signal.aborted)return;
                this.renderer=ready;
                this.dataset.mode='mesh';this.draw();
            }catch{
                if(!life.signal.aborted){this.dataset.mode='turntable';this.draw();}
            }
        }
        change(yaw,pitch,zoom=1){
            this.state.yaw=wrap(this.state.yaw+yaw);
            this.state.pitch=clamp(this.state.pitch+pitch,-89,89);
            this.state.zoom=clamp(this.state.zoom*zoom,.7,2.2);
            this.schedule();
        }
        action(type){
            if(type==='reset')Object.assign(this.state,{yaw:0,pitch:basePitch[this.idKey],zoom:1});
            else{
                const options={left:[-15,0],right:[15,0],up:[0,15],down:[0,-15],in:[0,0,1.15],out:[0,0,1/1.15]};
                if(options[type])this.change(...options[type]);
            }
            this.schedule();
            this.status.textContent=this.english?`Rotation ${Math.round(this.state.yaw)} degrees, zoom ${Math.round(this.state.zoom*100)} percent.`:`旋转 ${Math.round(this.state.yaw)} 度，缩放 ${Math.round(this.state.zoom*100)}%。`;
        }
        schedule(){
            if(!this.frameId)this.frameId=requestAnimationFrame(()=>{this.frameId=0;this.draw();});
        }
        draw(){
            const {yaw,pitch,zoom}=this.state;
            if(this.renderer){this.renderer.draw(yaw,pitch,zoom);return;}
            // The Unity turntable camera orbits along negative X for positive angles.
            const frame=(count-Math.round(yaw*count/360)%count)%count;
            if(this.lastFrame!==frame){
                this.poster.src=`assets/turntable-${this.idKey}/${String(frame).padStart(3,'0')}.webp`;
                this.lastFrame=frame;
            }
            this.poster.style.transform=`scale(${zoom})`;
        }
    }
    function gallery(language){
        const english=language==='en';
        const tr=(zh,en)=>english?en:zh;
        const hint=tr('拖动可旋转，双指可缩放。','Drag to rotate. Pinch to zoom.');
        const actions=[
            ['left','←','向左旋转','Rotate left'], ['right','→','向右旋转','Rotate right'],
            ['out','−','缩小','Zoom out'], ['in','+','放大','Zoom in'],
            ['reset',tr('复位','Reset'),'恢复正面视角','Reset front view']
        ];
        const viewers=['alice','panda'].map(id=>{
            const label=id==='alice'?tr('Alice 布偶','Alice'):tr('皇冠熊猫','Crowned Panda');
            const controls=actions.map(([action,symbol,zh,en])=>
                `<button type="button" data-orbit-action="${action}" title="${tr(zh,en)}" aria-label="${tr(zh,en)}">${symbol}</button>`
            ).join('');
            return `<alice-doll-viewer data-doll="${id}">
                <figure class="doll-figure">
                    <div class="doll-stage" tabindex="0" role="group" aria-label="${label} · ${tr('可旋转模型','interactive model')}" aria-describedby="doll-gesture doll-keys">
                        <img class="doll-poster" src="assets/turntable-${id}/000.webp" width="800" height="800" alt="${label}" draggable="false" loading="lazy">
                        <canvas aria-hidden="true"></canvas>
                    </div>
                    <figcaption class="doll-caption"><span class="doll-name">${label}</span><span class="doll-actions">${controls}</span></figcaption>
                </figure>
                <span class="orbit-sr" role="status"></span>
            </alice-doll-viewer>`;
        }).join('');
        return `<div id="model-view-panel" class="doll-models"><div class="doll-pair">${viewers}</div>
            <p class="doll-hint" id="doll-gesture">${hint}</p><span class="orbit-sr" id="doll-keys">${tr('方向键旋转，加减号缩放，Home 键复位。','Use the arrow keys to rotate, plus or minus to zoom, and Home to reset.')}</span></div>`;
    }
    window.AliceDollOrbit={gallery};
    customElements.define('alice-doll-viewer',DollOrbit);
})();
