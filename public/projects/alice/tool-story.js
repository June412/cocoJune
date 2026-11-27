/* All comparison images are Unity captures of the authored models. */
(() => {
  'use strict';
  const directory = 'assets/story-tool/';
  const selected = { design: 0, night: 0, timing: 0, loom: 0, fabric: 0 };
  const splits = [50, 50, 50, 50, 50];
  const tr = (lang, zh, en) => lang === 'en' ? en : zh;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const path = name => directory + name + '.webp';
  const image = (name, alt) => `<img src="${path(name)}" alt="${escape(alt)}" loading="lazy" decoding="async">`;
  function zoom(name, caption, group='', index=0) {
    const series=group?` data-image-group="${group}" data-image-index="${index}"`:'';
    return `<button type="button" class="ts-image" data-story-image="${path(name)}"${series} data-caption="${escape(caption)}" aria-label="${escape(caption)}"> ${image(name, caption)}</button>`;
  }
  function buttons(key, words, label) {
    return `<div class="ts-choices" role="group" aria-label="${escape(label)}">${words.map((word, i) =>
      `<button type="button" data-ts-choice="${key}" data-ts-index="${i}" aria-controls="ts-${key}-${i}" aria-pressed="${selected[key] === i}">${escape(word)}</button>`).join('')}</div>`;
  }
  function panel(key, i, content, lang, word) {
    const name = tr(lang, '选项', 'View');
    return `<div id="ts-${key}-${i}" class="ts-panel" data-ts-panel="${key}" data-ts-index="${i}" role="region" aria-label="${escape(word || name)}" ${selected[key] === i ? '' : 'hidden'}>${content}</div>`;
  }
  function browseImage(key, index, labels, lang, controls, visual, protectSurface=false) {
    const previous = labels[(index + labels.length - 1) % labels.length];
    const next = labels[(index + 1) % labels.length];
    const arrows = window.AliceBrowse.arrows(tr(lang,'上一项','Previous')+' · '+previous, tr(lang,'下一项','Next')+' · '+next, controls);
    const current=escape(`${labels[index]} · ${index+1} / ${labels.length}`);
    return `<div class="browse-frame ts-browse-frame${protectSurface?' ts-browse-gutters':''}" data-ts-browse="${key}" role="group" aria-label="${current}">${visual}${arrows}</div>`;
  }

  const translator = lang => (zh,en) => tr(lang,zh,en);
  function plateFigure(asset,caption) {
    return `<figure>${zoom(asset,caption)}<figcaption>${escape(caption)}</figcaption></figure>`;
  }
  function suzanne(lang) {
    const t=translator(lang);
    const looks=[
      ['suzanne-02-look-a',t('A · 青蓝针织，三件配饰','A · Blue knit, three attachments')],
      ['suzanne-04-look-b',t('B · 陶土色毛毡，两件配饰','B · Terracotta felt, two attachments')]
    ];
    const images=looks.map(([id,label])=>{
      const {images:[photo]}=window.ALICE_MEDIA.works.find(work=>work.id===id);
      return `<figure><button class="ts-image" type="button" data-story-image="${photo.src}" data-caption="${label}" aria-label="${t('放大','Enlarge')} · ${label}"><img src="${photo.thumb}" alt="${label}" width="${photo.width}" height="${photo.height}" loading="lazy"></button><figcaption>${label}</figcaption></figure>`;
    }).join('');
    return `<article class="ts-selection-study" id="suzanne-selection"><h3>${t('给身体换布，为什么纽扣也变了色？','Why did changing the fabric recolour a button?')}</h3>
      <ol class="ts-path-flow">
      <li><b>${t('目的','Goal')}</b><span>${t('给导入的 Suzanne 更换主体布料。','Change the body fabric on an imported Suzanne mesh.')}</span></li>
      <li><b>${t('问题','Problem')}</b><span>${t('选中模型时，额头上的纽扣也被选中了。','Selecting the model also selected the button on its forehead.')}</span></li>
      <li><b>${t('修改','Change')}</b><span>${t('按原模型的部件名称选布面，配饰单独选择。','Choose a region by its original mesh name. Select attachments separately.')}</span></li></ol>
      <div class="ts-suzanne-looks">${images}</div>
      <p class="ts-case-source">${t('Blender 提供基础网格。两图是修改后分别保存、重开的两套造型。','Base mesh by Blender. Both looks were saved and reopened after the selection fix.')}
      <a href="${directory}suzanne-selection-before.json" download>${t('原始问题记录','Original issue log')}</a> · <a href="${directory}suzanne-validation.json" download>${t('开发验证','Developer checks')}</a></p>
      </article>`;
  }

  function fabricBreakdown(lang) {
    const t=translator(lang);
    const stages=[
      ['shaderBase',t('底色','Base colour'),t('只看布面的底色与弧度。','Base colour follows the curved cloth.')],
      ['shaderWeave',t('经纬','Weave'),t('交错的经纬线让颜色按织纹交替。','Crossing yarns introduce a pattern of light and dark.')],
      ['shaderNormal',t('起伏','Relief'),t('织纹斜面改变受光方向，纱线边缘从底色中显出。','Tilting the surface normal gives the yarn edges relief.')],
      ['shaderFinal',t('纤维反光','Fibre sheen'),t('沿纱线补入柔和反光，织纹仍清晰可见。','Fibre sheen softens the highlights while the weave stays visible.')]
    ];
    return `<article class="ts-fabric-breakdown" id="fabric-breakdown"><div><h3>${t('一块平纹布怎样接住光','How a woven surface catches light')}</h3><p>${t('同一块布，同一近景机位。切换层级看经纬的变化。','One swatch under the same light. Switch stages to follow the weave.')}</p>
      ${buttons('fabric',stages.map(stage=>stage[1]),t('选择渲染层级','Choose a rendering stage'))}</div>
      <div id="ts-fabric-views">${stages.map(([key,label,caption],i)=>{
        const asset=window.ALICE_MEDIA.media[key];
        const visual=`<button type="button" class="ts-cloth-crop" data-story-image="${asset.src}" data-image-group="ts-fabric" data-image-index="${i}" data-caption="${caption}" aria-label="${t('查看完整实拍','View the full Unity capture')} · ${label}"><img src="${asset.src}" width="${asset.width}" height="${asset.height}" alt="${caption}" loading="lazy"></button>`;
        return panel('fabric',i,`<figure>${browseImage('fabric',i,stages.map(stage=>stage[1]),lang,'ts-fabric-views',visual)}<figcaption>${caption}</figcaption></figure>`,lang,label);
      }).join('')}</div></article>`;
  }

  function ellipse(lang) {
    const t=translator(lang);
    return `<article class="ts-ellipse-study" id="ellipse-input"><div><h3>${t('同一块椭圆，两种画法','Two gestures for one oval')}</h3><p>${t('按住鼠标不方便时，也可以分次指定两个角。试着从第一个标记画到第二个。','A sustained press is optional. Try drawing from the first marker to the second.')}</p></div>
      <alice-ellipse-demo lang="${lang}"><div class="ts-choices" role="group" aria-label="${t('选择绘图方式','Choose an input method')}">
      <button type="button" data-ellipse-mode="drag" aria-pressed="true">${t('按住拖动','Hold and drag')}</button>
      <button type="button" data-ellipse-mode="points" aria-pressed="false">${t('两次点击','Two clicks')}</button></div>
      <div class="ts-ellipse-board" role="group" aria-label="${t('椭圆手势示意','Oval gesture diagram')}">
      <i class="ts-target" aria-hidden="true"></i><i class="ts-drawn" hidden aria-hidden="true"></i>
      <button type="button" data-corner="start" class="ts-corner" aria-label="${t('指定起点','Set the first corner')}">1</button>
      <button type="button" data-corner="end" class="ts-corner" aria-label="${t('指定对角','Set the opposite corner')}">2</button></div>
      <div class="ts-ellipse-tools"><output aria-live="polite"></output><div><button type="button" data-ellipse-finish hidden>${t('确认','Confirm')}</button><button type="button" data-ellipse-reset>${t('重画','Clear')}</button></div></div>
      </alice-ellipse-demo></article>`;
  }

  class EllipseDemo extends HTMLElement {
    connectedCallback() {
      if(this.querySelector('.ts-ellipse-board')) this.setup();
    }
    setup() {
      const t=translator(this.lang);
      const board=this.querySelector('.ts-ellipse-board'), shape=this.querySelector('.ts-drawn');
      const finish=this.querySelector('[data-ellipse-finish]'), reset=this.querySelector('[data-ellipse-reset]');
      const output=this.querySelector('output'), modes=[...this.querySelectorAll('[data-ellipse-mode]')];
      const start=this.querySelector('[data-corner=start]'), end=this.querySelector('[data-corner=end]');
      const first=[24,24],second=[76,76];
      let mode='drag', phase='idle', pointer=null;
      const messages={
        idleDrag:t('按住 1，拖向 2 再松手。','Hold 1, drag to 2 and release.'),
        idlePoints:t('先点 1，再点 2。','Choose 1, then 2.'),
        start:t('已指定起点。接着选对角。','First corner set. Choose the opposite corner.'),
        ready:t('按 Enter 或点击确认。','Press Enter or choose Confirm.'),
        done:t('椭圆贴布已完成。','Oval patch complete.')
      };
      function stage(next) {
        phase=next;
        board.dataset.phase=phase;
        shape.hidden=phase==='idle' || phase==='start';
        finish.hidden=mode!=='points';
        finish.disabled=phase!=='ready';
        reset.disabled=phase==='idle';
        start.setAttribute('aria-pressed',String(phase!=='idle'));
        end.setAttribute('aria-pressed',String(phase==='ready'||phase==='done'));
        output.textContent=messages[phase==='idle'?(mode==='drag'?'idleDrag':'idlePoints'):phase] || '';
      }
      function draw(x,y) {
        shape.style.left=Math.min(first[0],x)+'%';
        shape.style.top=Math.min(first[1],y)+'%';
        shape.style.width=Math.abs(first[0]-x)+'%';
        shape.style.height=Math.abs(first[1]-y)+'%';
      }
      function release() {
        if(pointer!==null && board.hasPointerCapture(pointer)) board.releasePointerCapture(pointer);
        pointer=null;
      }
      modes.forEach(button=>button.onclick=()=>{
        release(); mode=button.dataset.ellipseMode;
        modes.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
        stage('idle');
      });
      function locate(event) {
        const r=board.getBoundingClientRect();
        return [Math.max(0,Math.min(100,(event.clientX-r.left)*100/r.width)), Math.max(0,Math.min(100,(event.clientY-r.top)*100/r.height))];
      }
      start.onpointerdown=event=>{
        if(mode!=='drag'||!event.isPrimary||event.button!==0)return;
        pointer=event.pointerId;
        board.setPointerCapture(pointer);
        draw(...first); stage('dragging');
        output.textContent=messages.idleDrag;
      };
      board.onpointermove=event=>{if(pointer===event.pointerId)draw(...locate(event));};
      board.onpointerup=event=>{
        if(pointer!==event.pointerId)return;
        const [x,y]=locate(event);
        release();
        if(Math.abs(x-first[0])<3 || Math.abs(y-first[1])<3) {stage('idle');return;}
        // Match the guide exactly when released on its second marker.
        const bounds=end.getBoundingClientRect();
        const onEnd=event.clientX>=bounds.left && event.clientX<=bounds.right && event.clientY>=bounds.top && event.clientY<=bounds.bottom;
        draw(...(onEnd?second:[x,y]));stage('done');
      };
      board.onpointercancel=()=>{release();stage('idle');};
      board.onclick=event=>{
        const button=event.target.closest('[data-corner]');
        if(!button || (mode==='drag'&&event.detail!==0))return;
        if(button===start)stage('start');
        else if(phase==='start'||phase==='ready'){draw(...second);stage(mode==='drag'?'done':'ready');}
      };
      this.onkeydown=event=>{
        if(event.key==='Escape'){event.preventDefault();release();stage('idle');}
        if(event.key==='Backspace'&&mode==='points'&&phase==='ready'){event.preventDefault();stage('start');end.focus();}
        if(event.key==='Enter'&&mode==='points'&&phase==='ready'&&board.contains(event.target)){event.preventDefault();stage('done');}
      };
      finish.onclick=()=>{if(phase==='ready'){stage('done');reset.focus();}};
      reset.onclick=()=>{release();stage('idle');start.focus();};
      stage('idle');
    }
  }
  customElements.define('alice-ellipse-demo',EllipseDemo);

  function cushionRoute(lang, sketch) {
    const t=translator(lang);
    const groups=[
      [t('铺设底布与毛毡','Building the cushion'), [
        ['blank-cushion',t('导入白模','Import the mesh')], ['set-scale',t('标定尺寸','Set its size')],
        ['woven-swatch',t('织出底布','Weave the base')], ['felt-patch',t('铺上毛毡','Lay the felt')]
      ]],
      [t('刺绣、封边与交付','Stitching and export'), [
        ['embroidered-sprig',t('绣出枝叶','Stitch the sprig')], ['bound-edge',t('缝合两道边','Finish both edges')],
        ['save-layers',t('保存图层','Save the layers')], ['export-sheet',t('导出道具','Export the prop')]
      ]]
    ];
    return `<nav class="ts-route" aria-label="${t('抱枕制作步骤','Cushion making steps')}">${groups.map(([title,steps],group)=>{
      const asset=window.ALICE_MEDIA.media[group?'cushionComplete':'cushionPatch'];
      const links=steps.map(([icon,label],i)=>`<li><a href="#cushion-step-${group*4+i+1}">${sketch(icon)}${label}</a></li>`).join('');
      return `<div><h3>${title}</h3><div class="ts-route-phase"><button type="button" class="ts-image" data-story-image="${asset.src}" data-caption="${escape(title)}" aria-label="${escape(t('放大','Enlarge')+' · '+title)}"><img loading="lazy" width="${asset.width}" height="${asset.height}" src="${asset.thumb||asset.src}" alt="${escape(title)}"></button><ol start="${group*4+1}">${links}</ol></div></div>`;
    }).join('')}</nav>`;
  }
  function construction(lang) {
    const t=translator(lang);
    const gestures=[
      [t('描出一块自由贴布','Trace a freeform patch'),t('松手时，缝线沿手绘轮廓闭合。','Release to sew along the freehand edge.'),[
        ['gesture-trace',t('按住描边','Trace while holding')],['gesture-close',t('回到起点附近','Approach the start')],['gesture-release',t('松开成形','Release to sew')]]],
      [t('把手绘环收成圆','Round a hand-drawn loop'),t('在起点停留 0.7 秒，松手裁圆。','Pause at the start for 0.7 s to snap the loop to a circle.'),[
        ['circle-draw',t('自由画环','Draw the loop')],['circle-hold',t('停住吸附','Hold to snap')],['circle-release',t('得到圆形贴布','Release the circle')]]],
      [t('约束一道直包边','Constrain a straight edging'),t('Shift 以 45° 为一档约束拖动方向。','Hold Shift to snap the line in 45° steps.'),[
        ['line-draw',t('自由角度','Drag freely')],['line-constrain',t('按住 Shift','Hold Shift')],['line-release',t('确认包边','Commit the binding')]]],
      [t('让相邻的布片共用一道缝','Join two patches with one seam'),t('两边相距 0.8 mm 以内时共用缝线，移开后恢复各自锁边。','Edges within 0.8 mm share a seam. Separate the patches to restore both edges.'),[
        ['seam-approach',t('相隔 2 mm','2 mm apart')],['seam-shared',t('接触时共缝','A shared seam')],['seam-apart',t('移开 6 mm','6 mm apart')]]]
    ];
    return `<div class="ts-gesture-atlas">${gestures.map(([title,copy,steps])=>`<article class="ts-gesture"><div><h3>${title}</h3><p>${copy}</p></div><div class="ts-filmstrip">${steps.map(([asset,caption])=>plateFigure(asset,caption)).join('')}</div></article>`).join('')}</div>`;
  }
  function reuse(lang) {
    const t=translator(lang);
    return `<article class="ts-reuse"><div><h3>${t('把徽章移到另一只抱枕','Carry the badge to another cushion')}</h3><p>${t('15 层贴布、绣线与珠子一起转过 −12°、缩至 0.83 倍，仍可逐层改。','Rotate the 15-layer motif −12° and scale it to 0.83×. Each layer stays editable.')}</p></div><div class="ts-filmstrip">${plateFigure('motif-source',t('原始图案','Original motif'))}${plateFigure('motif-reused',t('在新布面上重新投射','Reprojected onto the second surface'))}</div></article>
      <div class="ts-iterations"><div><h4>${t('拖动时只看预览','Preview while dragging')}</h4><p>${t('拖动时移动轮廓，松手后更新相邻缝线。','Move the outline while dragging. Rebuild adjacent seams on release.')}</p></div><div><h4>${t('改颜色时复用网格','Reuse the meshes for colour edits')}</h4><p>${t('26 层作品的保存时间从 8.63 秒降至 0.51 秒，新增网格为零。','Saving 26 layers fell from 8.63 s to 0.51 s, with zero new meshes.')}</p></div></div>`;
  }

  function wipe(lang,i,v,editLabels) {
    const t=translator(lang);
    const visual=`<div class="ts-wipe"><div class="ts-wipe-image ts-after">${image(v.after,v.alt2)}</div><div class="ts-wipe-image ts-before">${image(v.before,v.alt1)}</div><i aria-hidden="true"></i>
          <input type="range" min="0" max="100" value="${splits[i]}" aria-label="${escape(t('拖动分界线对照','Drag the comparison divider')+' · '+v.tab)}"></div>`;
    const captureStyle = editLabels ? `; --capture-ratio:${v.ratio}; --capture-width:${v.width}` : '';
    return `<div class="ts-comparison" style="--ts-split:${splits[i]}%${captureStyle}" data-ts-diff="${i}">
        ${editLabels?browseImage('design',i,editLabels,lang,'editing-sewn-piece',visual,true):visual}
        <div class="ts-wipe-labels">${[[v.before,v.a,v.alt1],[v.after,v.b,v.alt2]].map(([src,label,alt],j)=>`<button type="button" data-story-image="${path(src)}" data-image-group="ts-wipe-${i}" data-image-index="${j}" data-caption="${escape(alt)}" aria-label="${escape(t('放大','Enlarge')+' · '+label)}">${label} <span aria-hidden="true">↗</span></button>`).join('')}</div></div>`;
  }

  function design(lang) {
    const t = (zh, en) => tr(lang, zh, en);
    const items = [
      {
        tab: t('移动贴布', 'Move the felt'),
        title: t('挪动毛毡，整枝刺绣跟着走', 'Move the felt and the sprig follows'),
        body: t('毛毡左移 12 mm，七个附着层一起移动。外圈包边的 96 个点留在原处。','Seven layers travel 12 mm with the felt. The outer binding’s 96 points stay put.'),
        ratio: '1486 / 1300', width: '436px',
        before: 'felt-before', after: 'felt-after', a: t('原位置', 'Original position'), b: t('左移 12 mm', '12 mm left'),
        alt1: t('原位置的植物刺绣抱枕', 'Botanical cushion before moving the felt'), alt2: t('同一机位，毛毡和绣叶左移，外圈包边留在原处', 'Same view after the felt and leaves move left, with the outer binding in its original position')
      },
      {
        tab: t('抬起珠子', 'Lift a bead'),
        title: t('抬起中间一颗，线跟着穿过去', 'Lift the middle bead and its thread follows'),
        body: t('抬高中珠 3 mm，线仍穿过珠孔，两端留在原处。','Raise the middle bead 3 mm. The thread follows through its opening, with both ends fixed.'),
        ratio: '1550 / 794', width: '740px',
        before:'bead-before', after:'bead-after', a:t('三颗成行', 'Straight strand'), b:t('中珠抬高 3 mm', 'Middle bead raised 3 mm'),
        alt1:t('三颗绿珠沿直线串联', 'Three green beads threaded in a straight line'),alt2:t('中珠被抬高，两端与中间的连线倾斜', 'The thread angles upwards to pass through the raised middle bead')
      },
      {
        tab:t('改变针线精度', 'Change stitch detail'),
        title:t('按镜头距离选针线精度','Stitch detail by camera distance'),
        body:t('同样 15 针。近景 87,236 个顶点，编辑预览 11,928 个，游戏中 3,240 个。','One 15-stitch path. Close-up uses 87,236 vertices, the editor 11,928 and the game 3,240.'),
        ratio: '630 / 350', width: '630px',
        before:'stitch-near',after:'stitch-game',a:t('三股绞线', 'Three plies'),b:t('游戏网格', 'Game mesh'),
        alt1:t('橙色交叉针的三股捻线细节', 'Twisted orange plies at the crossing of two stitches'),alt2:t('相同路径上的光滑管状针线', 'Smooth tubular yarn follows the same stitch path')
      }
    ];
    const labels=items.map(v=>v.tab);
    return `<div class="ts-design" id="editing-sewn-piece"><h3>${t('调整已经缝好的局部','Editing the sewn piece')}</h3>${buttons('design', labels, t('选择一项编辑操作','Choose a textile edit'))}
      ${items.map((v,i)=>panel('design',i,`<h3>${v.title}</h3><p class="ts-copy">${v.body}</p>
      ${wipe(lang,i,v,labels)}`,lang,v.title)).join('')}
      </div>`;
  }

  function trial(lang) {
    const t = (zh,en) => tr(lang,zh,en);
    const parts = [
      { short:t('船帆','Sails'), pos:[26,45], img:'crossing-sails', title:t('两片帆分别裁', 'Cut the sails separately'), body:t('移动或重裁任意一片帆，另一片留在原位。','Move or reshape one sail independently of the other.') },
      { short:t('星纹','Stars'), pos:[76,19], img:'crossing-stars', title:t('星光织在底布上','Repeat the stars across the linen'), body:t('移动船帆，规律重复的星纹仍随底布排列。','The repeating stars stay on the linen when a sail moves.') },
      { short:t('舷窗','Portholes'), pos:[64,64], img:'crossing-portholes', title:t('用四颗珍珠做舷窗','Thread four pearl portholes'), body:t('珠串附在船身，四个舷窗随船身一起移动。','Attach the strand to the hull and all four portholes travel with it.') },
      { short:t('波浪','Waves'), pos:[29,80], img:'crossing-stitches', title:t('用回针画水面','Draw the water in backstitch'), body:t('每道波浪各有一条回针路径，可以单独重画。','Each wave has its own backstitched path and can be redrawn separately.') }
    ];
    const checkpoints = [
      ['crossing-blank',t('导入白模','Import the blank'),t('两块网格，各一材质槽。','Two meshes, two material slots.')],
      ['crossing-linen',t('铺海蓝亚麻','Lay the linen'),t('底色为海蓝。','Sea-blue base.')],
      ['crossing-trace',t('描出船身','Trace the hull'),t('按住 → 描边 → 松手。','Hold → trace → release.')],
      ['crossing-sails',t('裁出两片帆','Cut the sails'),t('金帆、珊瑚帆各一层。','Gold and coral layers.')],
      ['crossing-stitches',t('绣出水面','Stitch the water'),t('一根桅杆，两道波浪。','One mast, two waves.')],
      ['crossing-stars',t('重复星纹','Repeat the stars'),t('24 × 24 格，间距 68 mm。','24 × 24 tile, 68 mm repeat.')],
      ['crossing-portholes',t('穿出舷窗','Thread the portholes'),t('直径 9 mm，间隔 26 mm。','9 mm pearls, 26 mm apart.')],
      ['crossing-layers',t('重开作品','Reopen the scene'),t('七个可编辑工艺层。','Seven editable craft layers.')]
    ];
    return `<div class="sequence-spread crossing-study"><section class="ts-session"><div><h3>${t('一个可以重新打开的抱枕','A cushion to make and reopen')}</h3><p>${t('同学设计了一只星夜帆船抱枕。试用任务是保存、重开并单独移动一片帆。','A classmate designed a boat cushion. The task was to save, reopen and move one sail.')}</p>
      <h4>${t('由此修改的教学','Changes to the tutorial')}</h4><ul><li>${t('选布前检查两个材质槽。','Check both material slots first.')}</li><li>${t('完整示范按住、描边、松开。','Demonstrate hold, trace and release.')}</li></ul></div><div>${plateFigure('crossing-session',t('用 Textile Studio 试作抱枕','Trying Textile Studio during the cushion session'))}</div></section>
       <section class="ts-trial-process"><h3>${t('这艘船是怎样缝出来的','How Night Crossing was made')}</h3><p>${t('同学设计图案与顺序。以下是 AI 在 Unity 中复现的操作。','Design and sequence by the classmate. Screens show an AI reconstruction in Unity.')}</p>
       <ol class="illustrated-steps">${checkpoints.map(([asset,name,copy])=>`<li>${zoom(asset,name)}<div><h4>${name}</h4><p>${copy}</p></div></li>`).join('')}</ol></section>
      <section class="ts-night" aria-label="${t('探索抱枕上的工艺','Explore the cushion by craft')}">
        <div class="ts-night-hero"><div class="ts-night-figure" role="group" aria-label="${t('选择图中部位','Choose a part of the cushion')}">
          ${image('crossing-reopened',t('低矮红船身、双帆和四颗珍珠舷窗，背后是蓝绿色星空','A low red hull, two sails and four pearl portholes on a field of blue-green linen and stars'))}
          ${parts.map((v,i)=>`<button type="button" class="ts-pin" style="--x:${v.pos[0]}%;--y:${v.pos[1]}%" data-ts-choice="night" data-ts-index="${i}" aria-controls="ts-night-${i}" aria-pressed="${i===selected.night}">${v.short}</button>`).join('')}
        </div><button class="ts-zoom-link" type="button" data-story-image="${path('crossing-reopened')}" data-caption="${t('《夜航》抱枕完整外观','The complete Night Crossing cushion')}">${t('放大整件抱枕','Enlarge the cushion')} ↗</button></div>
        <div class="ts-night-details" id="ts-night-details">${parts.map((v,i)=>panel('night',i,`<h3>${v.title}</h3><p>${v.body}</p>${browseImage('night',i,parts.map(part=>part.short),lang,'ts-night-details',zoom(v.img,v.title,'ts-night',i))}`,lang,v.title)).join('')}</div></section></div>
      `;
  }

  function resultsComparison(lang) {
    const t=translator(lang);
    const rows=[
      ['Adobe Substance 3D Painter',t('三维模型上的绘制路径','A paint path on a 3D mesh'),t('移动路径点，重塑笔画。','Move path points to reshape strokes.'),'https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/painting/path-tools/path'],
      ['CLO',t('二维纸样上的明线','A topstitch on a 2D pattern'),t('改针距、线径，导出纹理或 OBJ。','Adjust spacing and thickness, export texture or OBJ.'),'https://support.clo3d.com/hc/en-us/articles/115002752908-Edit-Topstitch'],
      ['Stitch Meshes',t('服装面片上的针法','Stitch types on garment faces'),t('生成相连的纱线曲线并松弛成形。','Relax connected yarn curves into shape.'),'https://www.cs.cornell.edu/projects/stitchmeshes/'],
      ['Textile Studio',t('Unity 道具上的色格','Colour cells on a Unity prop'),t('一格生成一线圈或一颗珠，珠动时线穿孔随动。','One loop or bead per cell. Move a bead and the thread follows.'),'#development']
    ];
    return `<article class="ts-research"><h3>${t('绘制之后，哪些部分还能改？','What can still change after drawing?')}</h3><table><thead><tr>${[t('工具','Tool'),t('起点','Starting point'),t('可编辑的部分','Editable result')].map(l=>`<th scope="col">${l}</th>`).join('')}</tr></thead><tbody>${rows.map(([tool,start,edit,url])=>`<tr><th scope="row"><a href="${url}">${tool}</a></th><td>${start}</td><td>${edit}</td></tr>`).join('')}</tbody></table></article>`;
  }

  function results(lang) {
    const t=(zh,en)=>tr(lang,zh,en);
    const metrics=[
      {name:t('拖动一行','Drag a row'),unit:'ms', left:'49.97', right:'12.46', note:t('中位耗时减少 37.51 ms，预览仍可选中原图层。','Median drag time fell by 37.51 ms. Strands remain selectable.')},
      {name:t('较慢的拖动帧','Slower drag frames'),unit:'ms',left:'71.99',right:'46.22',note:t('第 95 百分位包含渲染和等待 GPU 的时间。','The 95th percentile includes rendering and GPU wait time.')},
      {name:t('首次同步','First sync'),unit:'ms',left:'32.89',right:'48.04',note:t('首次合批多用 15.15 ms，后续拖动复用批次。','Preparing the batches cost 15.15 ms upfront. Later drags reuse them.')},
      {name:t('渲染组件','Renderers'),unit:'',left:'1,001',right:'6',note:t('六个组件绘制全部预览，每串珠仍可单独编辑。','Six renderers draw the preview. Each strand stays editable.')}
    ];
    return `<div class="ts-results">${resultsComparison(lang)}<h3>${t('拖动 200 颗珠子的一整行','Moving a row of 200 beads')}</h3>
       <p class="ts-intro">${t('Unity 预览 900 × 650。五行各 200 颗珠，预热 4 帧后测量拖动 20 帧。','Unity preview, 900 × 650. Five rows of 200 beads. Four warm-up frames, then 20 measured drag frames.')}</p>
       <table class="ts-readings"><thead><tr><th scope="col">${t('实测指标','Measured in Unity')}</th><th scope="col">${t('逐项绘制','Individual')}</th><th scope="col">${t('合并绘制','Batched')}</th></tr></thead><tbody>${metrics.map((v,i)=>`<tr><th scope="row"><button type="button" data-ts-choice="timing" data-ts-index="${i}" aria-controls="ts-timing-${i}" aria-pressed="${selected.timing===i}">${v.name}</button></th><td>${v.left} ${v.unit}</td><td>${v.right} ${v.unit}</td></tr>`).join('')}</tbody></table>
       ${metrics.map((v,i)=>{const nums=[v.left,v.right].map(n=>Number(n.replaceAll(',','')));return panel('timing',i,`<div class="ts-metric"><h4>${v.name}</h4>${[t('逐项绘制','Individual'),t('合并绘制','Batched')].map((label,j)=>`<div class="ts-bar"><span>${label}</span><div aria-hidden="true"><i style="width:${Math.max(.5,100*nums[j]/Math.max(...nums))}%"></i></div><b>${[v.left,v.right][j]}${v.unit?' '+v.unit:''}</b></div>`).join('')}<p>${v.note}</p></div>`,lang,v.name)}).join('')}
       <section class="ts-evidence"><div><h3>${t('合并后，珠子的轮廓还在吗？','Did batching change the bead outlines?')}</h3><p>${t('24 颗珠，10 个视图。9 张逐像素一致。远景有 0.0275% 的像素至少一个 RGB 通道相差超过 3 级。','24 beads, 10 views. Nine matched pixel for pixel. In the distant view, 0.0275% of pixels differed by over three RGB levels in any channel.')}</p>
       <div class="ts-records">${['before','after','visual'].map((f,i)=>`<a href="${directory}beads-${f}.json" download>${[t('逐项绘制记录','Individual run'),t('合批记录','Batched run'),t('图像检查','Image checks')][i]} ↓</a>`).join('')}</div></div><div>${zoom('bead-edges',t('靠近与交叠的 24 颗彩珠，保留各自轮廓','Twenty-four beads retain their outlines where they approach and overlap'))}</div></section>
       <section class="ts-review"><h3>${t('在游戏里验证一件道具','Taking one prop into the game')}</h3><p class="ts-copy">${t('保留布封面、松紧带和 15 道回针绣成的标题。把收纳内页换成五个针法教程，玩家就能在桌边学针。','The cloth cover kept its elastic and 15 backstitched title paths. Five stitch guides replaced the storage pages for players at the repair desk.')}</p>
       <div class="ts-book">${[['book-early',t('收纳针线的旧内页','The original needle case')],['book-revised',t('改成针法手册的内页','The revised stitch handbook')],['book-on-desk',t('在桌边翻开手册学习针法','Open the stitch guide at the desk')]].map(([k,c])=>`<figure>${zoom(k,c)}<figcaption>${c}</figcaption></figure>`).join('')}</div>
       <a class="text-link" href="#bridge">${t('看这些道具在工坊里的位置','See the props in the workshop')} →</a></section></div>`;
  }

  // One index per cell, transcribed from the two original Unity colour charts.
  const loomCharts = {
    strawberry: {
      palette: [
        ["#c95b8d", "底色", "Ground"],
        ["#b61d35", "果肉", "Fruit"],
        ["#225b2c", "叶片", "Leaves"],
        ["#f2cc39", "种子", "Seeds"]
      ],
      rows: [
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000220000000000000000",
        "0000000000000000220000000000000000",
        "0000000000002222222222000000000000",
        "0000000000222222222222220000000000",
        "0000000001122211222211221000000000",
        "0000000011121111121111211100000000",
        "0000000111111111111111111110000000",
        "0000000111311111111111311110000000",
        "0000000111111111111111111110000000",
        "0000000111111111311111111110000000",
        "0000000011111111111111111100000000",
        "0000000011131111111113111100000000",
        "0000000001111111111111111000000000",
        "0000000001111111111111111000000000",
        "0000000000111111131111110000000000",
        "0000000000011111111111100000000000",
        "0000000000001113111111000000000000",
        "0000000000000111111110000000000000",
        "0000000000000011111100000000000000",
        "0000000000000001111000000000000000",
        "0000000000000000110000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000",
        "0000000000000000000000000000000000"
      ]
    },
    sheep: {
      palette: [
        ["#101077", "深蓝", "Navy"],
        ["#ffffff", "白色", "White"],
        ["#bdbfbb", "灰色", "Grey"],
        ["#078319", "绿色", "Green"],
        ["#f65cb2", "粉色", "Pink"],
        ["#940e13", "红色", "Red"],
        ["#f9d929", "黄色", "Yellow"],
        ["#090d09", "黑色", "Black"]
      ],
      rows: [
        "00000000000000000000000000000000000000000000000000000000000000",
        "00000000000000000000000000000000000000000000000000000000000000",
        "00100010001000100010001000100010001000100010001000100010001000",
        "01010101010101010101010101010101010101010101010101010101010100",
        "00100010001000100010001000100010001000100010001000100010001000",
        "00001000100010001000100010001000100010001000100010001000100000",
        "00100000000000000000000000000000000000000000000000000000001000",
        "01010000000430000011111000000000000011111000000000300000010100",
        "00100000304643001111111110000000001111111110000304000300001000",
        "00001030003400015111111151000000015111111151000046430000100000",
        "00100003400030155111111151000000015111111155100004304030001000",
        "01010004640000011117111100004000000111171111000030046400010100",
        "00100000430300000111115100046400000151111100000003032000001000",
        "00001003000000000111111000004300000011111100000000000300100000",
        "00100030000000011111110000000344000001111111000000000000001000",
        "01010000000000111111200000400046400002111111100000000000010100",
        "00100000001111111111220004640004000022111111111110000000001000",
        "00001000021111111111120000400003003021111111111112000000100000",
        "00100000211111111111220330300003033022111111111111200000001000",
        "01010002211111111111200003303303300002111111111111220000010100",
        "00100022211111111111200000330033000002111111111111222000001000",
        "00001020211111221112200000030030000002211111111111202000100000",
        "00100020211222001110220030030030030022011100222111202000001000",
        "01010000212220000110220003303303300022011000022212200000010100",
        "00100000222220000110022000030030000220011000002222200000001000",
        "00001003220220000110022000030030000220011000002202230000100000",
        "00100033220222000111022200000000002220111000022202233000001000",
        "01010000020022000011000000000000000000110000022002000000010100",
        "00100000000000000000000000000000000000000000000000000000001000",
        "00001000000010001000100010001000100010001000100010001000100000",
        "00100010001000100010001000100010001000100010001000100010001000",
        "01010101010101010101010101010101010101010101010101010101010100",
        "00100010001000100010001000100010001000100010001000100010001000",
        "00000000000000000000000000000000000000000000000000000000000000",
        "00000000000000000000000000000000000000000000000000000000000000"
      ]
    },
  };

  function pattern(lang, sketch) {
    const t=translator(lang);
    const crafts=[
      {key:'strawberry',title:t('草莓针织','Strawberry knit'),element:t('七个点构成一只 V 形线圈。','Seven points form one V-shaped loop.'),source:'knit-cells',detail:'knit-detail',result:'strawberry-finished',label:t('针织线圈','Knitted loop')},
      {key:'sheep',title:t('双羊串珠','Sheep beadwork'),element:t('每颗玻璃珠保留穿线的通孔。','Each glass bead has an opening for the thread.'),source:'bead-cells',detail:'bead-detail',result:'sheep-finished',label:t('串珠通孔','Bead opening')}
    ];
    const labels=crafts.map(c=>c.title);
    return `<div class="ts-loom" id="ts-loom-patterns">
      <p class="ts-loom-intro">${t('点一格，看它用了哪种线或珠，再找出图案里的所有同色格。','Pick a cell to identify its yarn or bead, then isolate that colour across the pattern.')}</p>
      ${buttons('loom',labels,t('选择图案','Choose a pattern'))}
      ${crafts.map((craft,i)=>{
        const chart=loomCharts[craft.key];
        const cell=t('色格','Cells');
        const detailComparison=wipe(lang,3+i,{
          before:craft.source, after:craft.detail, a:cell, b:craft.label, tab:craft.title,
          alt1:craft.title+' · '+cell, alt2:craft.title+' · '+craft.label
        });
        const units=[['sample-cell', t('取样颜色','Sample the cell')], ['map-cloth',t('投射到布面','Project onto cloth')], [craft.key==='strawberry'?'knit-loop':'thread-bead',craft.label]];
        const route=`<ol class="ts-unit-flow">${units.map(([icon,label])=>`<li>${sketch(icon)}<span>${label}</span></li>`).join('')}</ol>`;
        const canvas=`<div class="ts-chart-frame"><canvas tabindex="0" role="group" aria-label="${t('逐格查看，方向键移动','Inspect cells using the arrow keys')} · ${craft.title}" aria-describedby="loom-help-${i}"></canvas></div>`;
        return panel('loom',i,`
          ${route}<div class="ts-chart-study">
          <alice-loom-chart data-chart="${craft.key}" lang="${lang}">
            ${browseImage('loom',i,labels,lang,'ts-loom-patterns',canvas,true)}
            <p class="ts-chart-help" id="loom-help-${i}">${t('点选色格，或用方向键移动。','Click a cell or use the arrow keys.')}</p>
            <div class="ts-colour-keys" role="group" aria-label="${t('选择图案颜色','Select a pattern colour')}">${chart.palette.map(([rgb,zh,en],index)=>`<button type="button" data-tone="${index}" style="--tone:${rgb}" aria-label="${t(zh,en)}" title="${t(zh,en)}" aria-pressed="false"><i></i></button>`).join('')}</div>
            <label class="ts-isolate"><input type="checkbox"> ${t('只看这一色','Isolate this colour')}</label>
            <output aria-live="polite" aria-atomic="true"></output>
          </alice-loom-chart>
          <div class="ts-chart-build"><div class="ts-chart-pictures">
            ${detailComparison}${plateFigure(craft.result,craft.title)}
          </div><p>${craft.element} ${i?t('62 × 35 格，共 2,170 颗。','62 × 35 cells · 2,170 beads.'):t('34 × 42 格，共 1,428 针。','34 × 42 cells · 1,428 stitches.')}</p>
          <div class="ts-pattern-files">${[[craft.key+'-chart',t('放大色格原图','Enlarge chart')],[craft.key+'-loom',t('查看织机参数','Loom settings')]].map(([asset,label])=>`<button type="button" data-story-image="${path(asset)}" data-caption="${escape(craft.title+' · '+label)}">${label} ↗</button>`).join('')}</div></div></div>`,lang,craft.title);
      }).join('')}</div>`;
  }

  class LoomChart extends HTMLElement {
    connectedCallback() {
      queueMicrotask(()=>{ if(this.isConnected && !this.events && this.querySelector('canvas')) this.bindChart(); });
    }
    bindChart() {
      this.events=new AbortController();
      const on=(target,event,handler)=>target.addEventListener(event,handler,{signal:this.events.signal});
      const {rows,palette}=loomCharts[this.dataset.chart];
      const en=this.lang==='en';
      const unit=this.dataset.chart==='sheep' ? tr(this.lang,'颗珠','beads') : tr(this.lang,'针','stitches');
      const canvas=this.querySelector('canvas');
      const ctx=canvas.getContext('2d');
      const isolation=this.querySelector('input');
      const keys=[...this.querySelectorAll('[data-tone]')];
      const output=this.querySelector('output');
      const width=rows[0].length,height=rows.length,cell=12;
      canvas.width=width*cell;
      canvas.height=height*cell;
      const counts=palette.map((_,index)=>rows.reduce((sum,row)=>sum+row.split(String(index)).length-1,0));
      let col=Math.floor(width/2),row=Math.floor(height/2);
      function draw() {
        const tone=Number(rows[row][col]);
        ctx.fillStyle='#f1f1e9';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let y=0;y<height;y++){
          for(let x=0;x<width;x++){
            const part=Number(rows[y][x]);
            if(isolation.checked && part!==tone)continue;
            ctx.fillStyle=palette[part][0];
            ctx.fillRect(x*cell,y*cell,cell,cell);
          }
        }
        const x=col*cell,y=row*cell;
        ctx.strokeStyle='#162b21';ctx.lineWidth=3;ctx.strokeRect(x+.5,y+.5,cell-1,cell-1);
        ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(x+2.5,y+2.5,cell-5,cell-5);
        keys.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===tone)));
        const name=palette[tone][en?2:1], amount=counts[tone].toLocaleString(en?'en-US':'zh-CN');
        output.textContent=en?`Row ${row+1} · Column ${col+1} · ${name} · ${amount} ${unit}`:`第 ${row+1} 行 · 第 ${col+1} 列 · ${name} · ${amount} ${unit}`;
      }
      on(canvas,'click',event=>{
        const rect=canvas.getBoundingClientRect();
        col=Math.min(width-1,Math.max(0,Math.floor((event.clientX-rect.left)*width/rect.width)));
        row=Math.min(height-1,Math.max(0,Math.floor((event.clientY-rect.top)*height/rect.height)));
        draw();
      });
      on(canvas,'keydown',event=>{
        const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
        if(!delta)return;
        event.preventDefault();
        col=Math.max(0,Math.min(width-1,col+delta[0]));
        row=Math.max(0,Math.min(height-1,row+delta[1]));
        draw();
      });
      keys.forEach((button,i)=>on(button,'click',()=>{
        row=rows.findIndex(line=>line.includes(String(i)));
        col=rows[row].indexOf(String(i));
        draw();
      }));
      on(isolation,'change',draw);
      draw();
    }
    disconnectedCallback(){this.events?.abort();this.events=null;}
  }
  customElements.define('alice-loom-chart',LoomChart);

  function featuredWorks(lang) {
    const t=translator(lang);
    const labels=[t('起始表面','Starting surface'),t('铺设结构','Layout'),t('收尾工艺','Finishing'),t('最终用途','Result')];
    const works=[
      ['landscape',t('绒线溪谷','Yarn landscape'),[
        t('180 × 260 mm 平布。','180 × 260 mm flat canvas.'),t('22 股滚绳，各宽 0.75 mm。','22 piping strands, 0.75 mm wide.'),t('绒球、线圈、绣结与珠子。','Pom-poms, loops, knots and beads.'),t('河道留白，两岸隆起。','Pale stream between raised banks.')]],
      ['organiser',t('工具收纳袋','Tool organiser'),[
        t('底布带两只挂套。','Panel with two hanging sleeves.'),t('折布叠袋，袋口针距 6.3 mm。','Folded pockets, 6.3 mm stitch spacing.'),t('锁边宽 4.7 mm。','4.7 mm blanket-stitch width.'),t('挂在桌边，伸手取工具。','Tools within reach at the desk.')]],
      ['mat',t('修补工作垫','Work mat'),[
        t('带浅褶的亚麻。','Softly folded linen.'),t('交错绣带与钉线。','Crossed bands with couching.'),t('绒点、四行平针，针距 15 mm。','Tufts and four rows at 15 mm pitch.'),t('红边圈出修补区。','A red border frames the work area.')]]
    ];
    return `<div class="ts-showcase"><div class="ts-showcase-head" aria-hidden="true">${labels.map(x=>`<span>${x}</span>`).join('')}</div>${works.map(([prefix,name,notes])=>`<article><header><h3>${name}</h3></header><div class="ts-work-phases">${['surface','layout','finish','result'].map((phase,i)=>`<figure>${zoom(prefix+'-'+phase,name+' · '+labels[i])}<figcaption><b>${labels[i]}</b>${notes[i]}</figcaption></figure>`).join('')}</div></article>`).join('')}</div>`;
  }

  function selectView(key, index) {
    selected[key] = index;
    document.querySelectorAll('[data-ts-choice="'+key+'"]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.tsIndex)===index)));
    document.querySelectorAll('[data-ts-panel="'+key+'"]').forEach(el=>{el.hidden=Number(el.dataset.tsIndex)!==index;});
  }
  function browseFrom(control, direction) {
    const frame = control.closest('[data-ts-browse]');
    const key = frame?.dataset.tsBrowse || control.dataset.tsChoice;
    const choices = document.querySelectorAll('[data-ts-choice="'+key+'"]');
    const index = (selected[key] + direction + choices.length) % choices.length;
    selectView(key,index);
    const panel = document.getElementById('ts-'+key+'-'+index);
    const focus = frame ? panel.querySelector('[data-browse-step="'+direction+'"]') : choices[index];
    focus.focus({preventScroll:true});
  }

  document.addEventListener('click', event => {
    const arrow=event.target.closest('[data-ts-browse] .browse-arrow');
    if (arrow) {
      browseFrom(arrow,Number(arrow.dataset.browseStep));
      return;
    }
    if(event.target.closest('a[href="#editing-sewn-piece"]') && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey){
      document.querySelector('[data-ts-choice="design"][data-ts-index="0"]')?.click();
    }
    const stepLink = event.target.closest('.ts-route a');
    if (stepLink && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      window.AliceSequences?.reveal(document.getElementById(stepLink.hash.slice(1)));
    }
    const choice = event.target.closest('[data-ts-choice]');
    if (!choice) return;
    selectView(choice.dataset.tsChoice,Number(choice.dataset.tsIndex));
  });
  document.addEventListener('keydown', event => {
    if (event.key!=='ArrowLeft' && event.key!=='ArrowRight') return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const control=event.target.closest('[data-ts-browse] .browse-arrow, [data-ts-choice]');
    if (!control || (control.dataset.tsChoice && !document.querySelector('[data-ts-browse="'+control.dataset.tsChoice+'"]'))) return;
    event.preventDefault();
    browseFrom(control,event.key==='ArrowRight'?1:-1);
  });
  document.addEventListener('input', event => {
    const group = event.target.closest('[data-ts-diff]');
    if (!group || event.target.type !== 'range') return;
    splits[Number(group.dataset.tsDiff)] = Number(event.target.value);
    group.style.setProperty('--ts-split',event.target.value+'%');
  });
  window.AliceToolStory = { ellipse, suzanne, fabricBreakdown, cushionRoute, construction, design, reuse, trial, results, pattern, featuredWorks };
})();
