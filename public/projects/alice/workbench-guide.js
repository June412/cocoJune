/* Coordinates measured on the unaltered, 2880 × 1812 Unity workbench capture. */
(() => {
    const regions = [
        {file:'model', box:[8.6,.4,12.4,3.8], size:[357,69],
            title:['模型','Model'], text:['点模型名称，切换物件，或导入一个可独立编辑的副本。','Click the model name to switch objects or import a working copy.']},
        {file:'tabs', box:[.3,5,20.1,4.6], size:[579,83],
            title:['资源库、图层与外观','Library, Layers, Looks'], text:['从库里选工艺，到图层里改针脚，或载入保存的外观。','Choose a craft, edit an existing layer or load a saved appearance.']},
        {file:'presets', box:[.3,10.8,20.2,81.9], size:[581,1484],
            title:['工艺与预设','Crafts & presets'], text:['打开包边工具，选择锁边针。预设小样展示针脚的样子。','Open Edging and choose Blanket stitch. The tiles preview the seam.']},
        {file:'extras', box:[.3,93.5,20.2,5.9], size:[581,107],
            title:['作品库与像素织机','Showcase & Pixel Loom'], text:['打开案例，或把一张色格图做成串珠与针织。','Open an example or turn a colour chart into beadwork or knitting.']},
        {file:'toolbar', box:[21.2,5,53.9,3.7], size:[1552,67],
            title:['画布工具栏','Canvas toolbar'], text:['选择工具拾取图层，绘制工具画路径。自由视图调整机位。','Select picks a layer. Draw makes a path. Free view changes the camera.']},
        {file:'commands', box:[57.8,.4,41.3,3.8], size:[1189,69],
            title:['项目操作','Project commands'], text:['在这里调整输入辅助与展示效果、撤销修改、保存和导出。','Adjust accessibility and lighting, undo a change, save or export the prop.']},
        {file:'inspector', box:[76.2,5.6,22.7,56.6], size:[653,1026],
            title:['参数面板','Inspector'], text:['选定缝边的区域和针法，再调针距、线径与宽度。','Choose the region and stitch, then adjust spacing, thread diameter and width.']},
        {file:'canvas', box:[21.2,9.9,54,83.3], size:[1555,1510],
            title:['模型画布','Model canvas'], text:['沿毛毡边缘拖出路径，松开完成当前线迹。Esc 可取消这一笔。','Trace the felt edge and release to finish the stroke. Esc cancels it.']}
    ];
    const examples = [
        ['choose-stitch',559,377,['选一道针法','Choose a stitch'],['在包边库里并排比较锁边针和卷边针。','Compare blanket stitch with whipstitch in the Edging library.']],
        ['find-layer',570,324,['找到要改的图层','Find a layer'],['分别选中一片绣叶和它下面的毛毡。','Pick a named leaf or the felt patch underneath it.']],
        ['save-look',665,137,['保存外观方案','Save a look'],['为这个版本命名，保存可再次编辑的外观。','Name this version and choose Save editable look.']]
    ];
    const asset = name => 'assets/story-tool/guide-'+name+'.webp';
    const escape = s => s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const img = (name,w,h,alt) => `<img src="${asset(name)}" width="${w}" height="${h}" alt="${escape(alt)}" loading="lazy" decoding="async">`;
    function render(lang){
        const text = pair => pair[lang==='en'?1:0];
        const title = text(['工作台界面图','Workbench guide']);
        const inspect = text(['放大','Enlarge']);
        const note = (region,i) => {
            const num=i+1, side=i<4?'left':'right', label=text(region.title);
            return `<button type="button" class="wg-note wg-${side}" data-guide-item="${num}" style="--wg-row:${i%4+1}" data-story-image="${asset(region.file)}" data-image-group="workbench-regions" data-image-index="${i}" data-caption="${escape(label)}" aria-label="${escape(inspect+' · '+label)}" aria-describedby="wg-text-${num}">
                <span class="wg-sample">${img(region.file,...region.size,'')}</span>
                <span class="wg-copy"><span class="wg-label"><span class="wg-number">${num}.</span> ${escape(label)}</span><span class="wg-text" id="wg-text-${num}">${escape(text(region.text))}</span></span></button>`;
        };
        const hotspots=regions.map((region,i)=>{
            const [x,y,w,h]=region.box, label=text(region.title);
            return `<button type="button" class="wg-region" data-guide-item="${i+1}" data-story-image="${asset(region.file)}" data-image-group="workbench-regions" data-image-index="${i}" data-caption="${escape(label)}" aria-label="${escape(inspect+' · '+label)}" tabindex="-1" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></button>`;
        }).join('');
        const full=text(['抱枕工作台中的锁边工具','The Edging tool on the botanical cushion']);
        const fullImage=`data-story-image="${asset('workbench')}" data-caption="${escape(full)}"`;
        return `<alice-workbench-guide class="wg-guide">
            <div class="wg-diagram" role="group" aria-label="${title}">
                <div class="wg-board"><button type="button" class="wg-whole" ${fullImage} aria-label="${escape(inspect+' · '+full)}">${img('overview',1480,931,full)}</button>${hotspots}</div>
                <svg class="wg-wires" aria-hidden="true">${regions.map((r,i)=>`<path data-guide-item="${i+1}" />`).join('')}</svg>
                ${regions.map(note).join('')}
            </div>
            <div class="wg-enlarge"><button type="button" ${fullImage}>${text(['放大完整工作台','Enlarge full workbench'])} <span aria-hidden="true">↗</span></button></div>
        </alice-workbench-guide>
        <div class="wg-examples">${examples.map(([file,w,h,heading,copy])=>`<figure><button type="button" data-story-image="${asset(file)}" data-caption="${escape(text(heading))}" aria-label="${escape(inspect+' · '+text(heading))}">${img(file,w,h,text(heading))}</button><figcaption><h3>${text(heading)}</h3><p>${text(copy)}</p></figcaption></figure>`).join('')}</div>`;
    }

    class WorkbenchGuide extends HTMLElement {
        connectedCallback(){
            this.board=this.querySelector('.wg-board');
            this.diagram=this.querySelector('.wg-diagram');
            if(!this.board)return;
            this.notes=[...this.querySelectorAll('.wg-note')];
            this.paths=[...this.querySelectorAll('.wg-wires path')];
            this.observer=new ResizeObserver(()=>this.drawWires());
            this.observer.observe(this.diagram);
            this.observer.observe(this.board);
            this.notes.forEach(note=>this.observer.observe(note));
            this.events=new AbortController();
            const listen=(event,handler)=>this.addEventListener(event,handler,{signal:this.events.signal});
            const highlight=event=>this.highlight(event.target.closest('button[data-guide-item]')?.dataset.guideItem);
            listen('pointerover',highlight);
            listen('focusin',highlight);
            listen('pointerleave',()=>this.highlight(this.querySelector('button:focus-visible')?.dataset.guideItem));
            listen('focusout',event=>{if(!this.contains(event.relatedTarget))this.highlight();});
            this.drawWires();
        }
        disconnectedCallback(){this.events?.abort();this.observer?.disconnect();}
        highlight(id){
            this.querySelectorAll('[data-guide-item]').forEach(item=>item.classList.toggle('wg-active',item.dataset.guideItem===id));
        }
        drawWires(){
            if(!this.querySelector('.wg-wires').getClientRects().length)return;
            const frame=this.diagram.getBoundingClientRect(),board=this.board.getBoundingClientRect();
            if(!frame.width||!board.width)return;
            const bx=board.left-frame.left,by=board.top-frame.top;
            this.notes.forEach((note,i)=>{
                const label=note.querySelector('.wg-label').getBoundingClientRect();
                const [x,y,w,h]=regions[i].box, left=i<4, labelY=label.top-frame.top+Math.min(label.height/2,12);
                const end=left?label.right-frame.left+4:label.left-frame.left-4;
                const lane=left?bx-7-(i%3)*4:bx+board.width+7+(i%3)*4;
                const rx=bx+(x+(left?0:w))*board.width/100,ry=by+(y+h/2)*board.height/100;
                let d=`M ${end} ${labelY} H ${lane} V ${ry} H ${rx}`;
                if(i===4||i===7){
                    const outside=i===4?by-10:by+board.height+10;
                    const targetX=bx+(x+w*(i===4?.27:.78))*board.width/100;
                    const targetY=by+(y+(i===4?0:h))*board.height/100;
                    d=`M ${end} ${labelY} H ${lane} V ${outside} H ${targetX} V ${targetY}`;
                }
                this.paths[i].setAttribute('d',d);
            });
        }
    }
    customElements.define('alice-workbench-guide',WorkbenchGuide);
    window.AliceWorkbenchGuide={render};
})();
