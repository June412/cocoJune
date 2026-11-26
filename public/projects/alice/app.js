/* Alice portfolio — all visual work is sourced from the actual Unity projects. */
(() => {
'use strict';
const D=window.ALICE_MEDIA, M=D.media, W=D.works;
const page=document.body.dataset.page;
const requestedLanguage=new URLSearchParams(location.search).get('lang');
const savedLanguage=(()=>{try{return localStorage.getItem('alice-language')}catch{return null}})();
const browserLanguage=navigator.language.toLowerCase().startsWith('zh')?'zh':'en';
let lang=[requestedLanguage,savedLanguage,browserLanguage].find(choice=>choice==='zh'||choice==='en');
const t=(zh,en)=>lang==='en'?en:zh;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title=w=>lang==='en'?w.titleEn:w.title;
const desc=w=>lang==='en'?w.descriptionEn:w.description;
const category=w=>lang==='en'?w.categoryEn:w.category;
const work=id=>W.find(w=>w.id===id);
const img=(a,alt,cls='',lazy=true)=>`<img src="${a.src}" ${lazy?'loading="lazy"':'fetchpriority="high"'} decoding="async" width="${a.width}" height="${a.height}" alt="${esc(alt)}" class="${cls}">`;
const photo=(key,caption,cl='')=>`<figure class="${cl}"><button class="image-button" data-image="${key}" aria-label="${esc(t('放大：','Enlarge: ')+caption)}">${img(M[key],caption)}</button><figcaption class="caption">${caption}<span>↗</span></figcaption></figure>`;
const href=(p,hash='')=>`${p}.html?lang=${lang}${hash?'#'+hash:''}`;
function section(id,zh,en,subzh,suben,body) {
    const group=chapters[page].find(([, ,ids])=>ids[0]===id);
    const topic=t(zh,en);
    let heading;
    if(group){
        let title=t(group[0],group[1]);
        if(id==='mechanics')title=topic;
        const subject=topic===title?'':`<h3 class="chapter-subject">${topic}</h3>`;
        heading=`<h2 class="chapter-name" id="${id}-title">${title}</h2>${subject}`;
    }else if(page==='toolkit' && id==='workflow'){
        heading=`<h2 class="chapter-name" id="${id}-title">${topic}</h2>`;
    }else{
        heading=`<h3 class="topic-name" id="${id}-title">${topic}</h3>`;
    }
    return `<section id="${id}" class="section${group?' chapter-start':''}" aria-labelledby="${id}-title"><header class="section-head">${heading}</header>
        ${group?topicNavigation(group):''}<div class="section-body">${subzh?`<div class="prose"><p>${t(subzh,suben)}</p></div>`:''}${body}</div></section>`;
}
const compare=(a,b,zh,en)=>`<figure class="study"><div class="compare" style="--split:50%">${img(M[b],t(zh,en)+' · '+t('调整后','After'))}<div class="compare-top">${img(M[a],t(zh,en)+' · '+t('调整前','Before'))}</div><span class="compare-line"></span><span class="compare-handle">↔</span><span class="compare-label before">${t('调整前','Before')}</span><span class="compare-label after">${t('调整后','After')}</span><input type="range" min="0" max="100" value="50" aria-label="${esc(t('拖动比较：','Compare: ')+t(zh,en))}"></div><figcaption class="caption">${t(zh,en)}<span>${t('拖动分界线','Drag to compare')}</span></figcaption></figure>`;
const navs={toolkit:[['overview','概览','Overview'],['workflow','工作台与制作逻辑','Workbench'],['cushion','抱枕制作步骤','Cushion walkthrough'],['materials','材质与尺度','Materials & scale'],['cases','工艺案例','Craft examples'],['delivery','保存与导出','Saving & export'],['bridge','游戏应用','Game integration'],['development','局部修改','Editing a detail'],['works','作品与案例','Showcase'],['trial','《夜航》抱枕试作','Night Crossing trial'],['results','编辑与视口实测','Editing and viewport results']],game:[['overview','概览','Overview'],['play','修补玩法','Repair mechanics'],['arrival','开店与收件','Opening & arrival'],['alice','Alice 委托','Alice commission'],['panda','Panda 委托','Panda commission'],['mechanics','修补反馈与操作辅助','Repair feedback & accessibility'],['doll','玩偶模型与制作','Doll models & making'],['workshop','工坊的声音与光线','Workshop sound & light'],['history','开发与后续','Development & plans']]};
const chapters = {
    toolkit: [
        ['概览','Overview',['overview','workflow']],
        ['制作流程','Workflow',['cushion','delivery']],
        ['设计','Design',['development','cases','materials']],
        ['作品展示','Showcase',['works']],
        ['使用测试','User testing',['trial']],
        ['结果','Results',['results','bridge']]
    ],
    game: [
        ['概览','Overview',['overview']],
        ['两份委托','Commissions',['arrival','alice','panda']],
        ['工具与针法','Tools & stitches',['play']],
        ['技术设计','Technical design',['doll','workshop']],
        ['反馈与辅助','Feedback & access',['mechanics','history']]
    ]
};

function chapterNavigation() {
    return `<nav class="chapter-links" aria-label="${t('项目章节','Project chapters')}">
        ${chapters[page].map(([zh,en,ids])=>`<a href="#${ids[0]}">${t(zh,en)}</a>`).join('')}
    </nav>`;
}

function topicNavigation([zh,en,ids]) {
    if(ids.length<2)return '';
    const links=ids.map(id=>{
        const [,labelZh,labelEn]=navs[page].find(entry=>entry[0]===id);
        return `<a href="#${id}">${t(labelZh,labelEn)}</a>`;
    });
    return `<nav class="topic-links" aria-label="${t(zh,en)}">${links.join('')}</nav>`;
}

function overviewActions(){
    const links=page==='toolkit' ? [['workflow','查看工作台导览','Explore the workbench'],['cushion','跟做植物抱枕','Follow the cushion workflow']]
        : [['mina-letter','读 Mina 的委托信','Read Mina’s letter'],['play','看修补动作','See the repairs']];
    return `<div class="overview-actions">${links.map(([id,z,e])=>`<a href="#${id}">${t(z,e)}</a>`).join('')}
        <a href="${href(page+'-slides')}">${t('技术详解（英文）','Technical case study')}</a></div>`;
}

function projectCredits(){
    const game = page === 'game';
    return `<section id="making-credits" class="making-credits" aria-labelledby="making-title">
        <h2 id="making-title">${t('制作与署名','Contributions & credits')}</h2>
        <p>${game
            ? t('我手缝了 Alice 原作，设计了两份修补委托和声音交互，并在 Unity 中试玩、调整材质和画面。Codex 协助整理 Blender 模型、实现 Unity 场景与交互，以及做自动化检查。窗外街景的天气和时段变化使用了 AI 图像编辑。','I sewed the original Alice, designed the two repair commissions and sound interactions, and tested the materials and visuals in Unity. Codex assisted with Blender asset preparation, Unity scenes and interactions, and automated checks. The street backdrops use AI-assisted edits for weather and time of day.')
            : t('我设计了布艺工作流程，选择材质，并在 Unity 中检验成品的外观和手感。Codex 协助整理 Blender 资产、实现 Unity 交互和做自动化检查。','I designed the textile workflow, selected the materials, and tested the finished pieces in Unity. Codex assisted with Blender asset preparation, Unity interactions, and automated checks.')}</p>
        <p>${game
            ? t('配乐由 Scott Buckley 创作。修补声和环境声使用了经过剪辑与混音的署名录音。','The music is by Scott Buckley. The repair sounds and ambience use edited and mixed source recordings.') + ' <a href="credits.txt">' + t('音乐与录音署名','Music and recording credits') + '</a>'
            : t('《夜航》抱枕上的帆船图案由一位同学设计，制作过程的配图在 Unity 中复现。','A classmate designed the sailboat on the Night Crossing cushion. I recreated the process images in Unity.')}</p>
        <button type="button" class="case-print" data-print>${t('打印 / PDF','Print / PDF')}</button>
    </section>`;
}

function shell(content){return `<main class="main" id="main" tabindex="-1">${content}${projectCredits()}
    </main><dialog class="lightbox" aria-labelledby="dialog-title"><div class="dialog-bar"><span id="dialog-kind"></span><div class="image-tools" role="group" aria-label="${t('图片缩放','Image zoom')}"><button type="button" data-inspect="out" aria-label="${t('缩小','Zoom out')}">−</button><output data-zoom-level aria-live="off">100%</output><button type="button" data-inspect="in" aria-label="${t('放大','Zoom in')}">+</button><button type="button" data-inspect="fit">${t('适应窗口','Fit')}</button></div><button autofocus class="dialog-close" aria-label="${t('关闭','Close')}">×</button></div><div class="dialog-layout"><div class="dialog-view browse-frame"><div class="inspection-stage" tabindex="0" role="group" aria-label="${t('查看图片细节','Inspect image details')}"><img id="dialog-image" alt="" draggable="false"></div><button type="button" class="dialog-arrow dialog-prev browse-arrow browse-prev" aria-controls="dialog-image" aria-label="${t('上一张','Previous image')}"></button><button type="button" class="dialog-arrow dialog-next browse-arrow browse-next" aria-controls="dialog-image" aria-label="${t('下一张','Next image')}"></button></div><div class="dialog-info"><h2 id="dialog-title"></h2><p id="dialog-description"></p><p id="dialog-provenance"></p><div class="view-count" id="dialog-count" aria-live="polite" aria-atomic="true"></div><div class="dialog-thumbs"></div><a class="text-link" id="dialog-original" target="_blank" rel="noopener">${t('打开大图','Open full image')} ↗</a></div></div></dialog>`;}

const para=(zh,en)=>`<p>${t(zh,en)}</p>`;
const wfig=(id,zh,en,index=0)=>{const w=work(id);return `<figure><button class="image-button" data-work="${id}" aria-label="${esc(t(zh,en))}">${img(w.images[index]||w.images[0],t(zh,en))}</button><figcaption class="caption">${t(zh,en)}</figcaption></figure>`};
const pair=(a,b)=>`<div class="figure-pair">${a}${b}</div>`;
const passage=(id,zh,en,text,visual='')=>`<article class="case-study" id="${id}"><h3>${t(zh,en)}</h3><div class="prose">${text}</div>${visual}</article>`;
const row=(zh,en,text,visual)=>`<article class="process-row"><div class="prose"><h3>${t(zh,en)}</h3>${text}</div>${visual}</article>`;
const craftRow=(zh,en,text,controls,result)=>`<article class="process-row craft-step"><div class="prose"><h3>${t(zh,en)}</h3>${text}</div><div class="craft-evidence">${controls}${result}</div></article>`;
const table=(heads,rows)=>`<div class="table-scroll"><table class="content-table"><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${v}</td>`:`<th scope="row">${v}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;

function toolkit(){return `
<header id="overview" class="overview-tool"><div class="hero-intro"><h1>Textile Studio</h1>
<p class="lead">${t('我想让道具制作者能直接在 Unity 模型上缝纫。这个工作台把贴布、绣线和包边留在各自的图层，成品可以导出给游戏使用。','I wanted prop artists to be able to sew directly on a Unity model. This workbench keeps felt, embroidery and binding on editable layers and exports the finished piece.')}</p>
<p class="project-connection">${t(
    `我用这个工作台制作了游戏《<a href="${href('game')}">Alice · Mending Workshop</a>》里的布面针法手册。`,
    `I used this workbench to make the cloth-bound stitch guide that players open in <a href="${href('game')}">Alice · Mending Workshop</a>.`
)}</p>
${overviewActions()}</div>
<figure class="tool-opening-piece ts-gesture-film"><video controls playsinline preload="none" width="950" height="680" poster="assets/story-tool/botanical-leaf-gesture.webp" aria-describedby="leaf-gesture-caption"><source src="assets/story-tool/botanical-leaf-gesture.mp4" type="video/mp4"><a href="assets/story-tool/botanical-leaf-gesture.mp4">${t('播放绣叶过程','Play the embroidery clip')}</a></video>
<figcaption id="leaf-gesture-caption">${t('描出叶形，松手生成一层缎面绣。工作台实录，3 倍速。','Trace a leaf and release to create a satin-stitch layer. Workbench recording at 3× speed.')} <a href="#editing-sewn-piece">${t('看移动毛毡后的效果','See what moves with the felt')} ↗</a></figcaption></figure>
</header>
${chapterNavigation()}

${section('workflow','布艺工作台','The Textile Studio workbench','','',`
${window.AliceWorkbenchGuide.render(lang)}
<section class="project-notes" id="workbench-notes"><h3>${t('画一道针脚','Draw a stitch path')}</h3>
<ol class="ts-path-flow">
<li><b>${t('标定尺寸','Set the scale')}</b><span>${t('导入模型副本，按实物毫米数标定。','Import a working copy and set its size in millimetres.')}</span></li>
<li><b>${t('指定布面','Choose the cloth')}</b><span>${t('选中材质槽，或逐面圈出局部。','Choose a material region or select individual faces.')}</span></li>
<li><b>${t('沿曲面绘制','Draw on the surface')}</b><span>${t('自由绘制松手收笔；逐点绘制按 Enter。','Release a freehand stroke, or press Enter to finish a point path.')}</span></li></ol>
${window.AliceToolStory.ellipse(lang)}
</section>
`)}

${section('cushion','植物刺绣抱枕','The botanical cushion','','',(() => {
    function capture(name,width,height,zh,en,fullKey) {
        const caption = t(zh,en);
        const source = 'assets/story-tool/botanical-'+name+'.webp';
        const full = fullKey ? M[fullKey].src : source;
        return `<figure class="botanical-capture"><button class="image-button" data-story-image="${full}" data-caption="${esc(caption)}" aria-label="${esc(t('放大图片','Enlarge image')+' · '+caption)}">${img({src:source,width,height},caption)}</button><figcaption class="caption">${caption}<span aria-hidden="true">↗</span></figcaption></figure>`;
    }
    return `
${window.AliceToolStory.cushionRoute(lang)}
${craftRow('导入抱枕白模','Import the blank cushion',
    para('把模型拖入「模型资源」，命名后点「导入并开始」。','Drop the model into Model asset, name it and choose Import and start.'),
    capture('import',656,189,'模型资源与名称。','Model asset and name.'),
    capture('input',1440,1125,'原始抱枕网格。','Original cushion mesh.'))}
${craftRow('按毫米确定尺寸','Set the physical size',
    para('选择高度 280 mm，勾选「保持针脚和饰边尺寸」。','Set the height to 280 mm. Enable Keep stitch and trim size.'),
    capture('scale',659,242,'高度 280 mm。','Height 280 mm.','uiImportDetail'),
    capture('undyed',862,748,'320 × 280 × 65 mm。','320 × 280 × 65 mm.'))}
${craftRow('为底布织出纹理','Weave the base fabric',
    para('在正面铺灰绿色梭织布，选中等织纹。','Apply a medium sage weave to the front region.'),
    capture('weave',642,555,'织纹 2.5 mm · 0° · 起伏 0.42 mm。','2.5 mm weave · 0° · 0.42 mm relief.'),
    photo('cushionBase',t('织纹沿着抱枕的鼓面铺开。','The green weave follows the curve of the cushion.')))}
${craftRow('铺一块椭圆毛毡','Lay the oval felt patch',
    para('从对角拖出椭圆，再将贴片换成米色羊毛毡。','Drag between opposite corners to draw an ellipse. Choose cream wool felt.'),
    capture('patch',642,352,'156 × 194 mm · 厚 1.4 mm · 织纹 0.6 mm。','156 × 194 mm · 1.4 mm thick · 0.6 mm weave.','uiPatchDetail'),
    photo('cushionPatch',t('米色椭圆贴在绿色底布上，留给枝叶的区域有了边界。','The cream oval defines the area for the sprig.')))}
${craftRow('绣一根枝茎和五片叶','Stitch the stem and five leaves',
    para('用滚绳画枝茎，用缎面绣填五片叶。六层都附在毛毡上。','Draw the stem with cord piping and the five leaves with satin fill. Attach all six to the felt.'),
    capture('satin',640,383,'中叶：针距 0.6 mm · 线径 0.54 mm · 方向 58°。','Centre leaf · 0.6 mm spacing · 0.54 mm yarn · 58°.','uiLeafDetail'),
    photo('cushionEmbroidery',t('五片缎面绣叶分别成层，可以单独转动绣线方向。','Each satin leaf is a separate layer with its own thread direction.')))}
${photo('cushionLeafDetail',t('叶片近景可见一排排斜向绣线，以及枝茎高出毛毡的轮廓。','At close range, the angled rows of satin thread and the raised cord stem stand out from the felt.'))}
${craftRow('缝好内外两道边','Finish the felt and cushion edges',
    para('在毛毡边缝锁边针，再沿抱枕外圈铺布条包边。','Blanket-stitch the felt, then bind the cushion edge with a fabric strip.'),
    capture('edging',656,275,'毛毡针距 4.5 mm · 外包边宽 4.5 mm、厚 1 mm。','4.5 mm stitch spacing · outer binding 4.5 × 1 mm.'),
    photo('cushionComplete',t('锁边绕着米色毛毡，绿色布条沿抱枕的轮廓收口。','Blanket stitches surround the cream felt while a green band finishes the cushion itself.')))}
${pair(photo('cushionEdgeDetail',t('针脚跨过毛毡边缘，落在下面的织物上。','The stitches cross from the felt edge onto the weave.')),photo('cushionBindingDetail',t('布条绕过抱枕转角，封住外侧边缘。','The binding follows the rounded outside corner.')))}
${craftRow('保存可编辑的作品','Save the editable work',
    para('保存场景与外观方案。','Save the scene and an editable Look.')+
    `<p id="cushion-attachments">${t('九个图层重开后仍可编辑，七层随毛毡移动。','Nine editable layers reopen. Seven follow the felt.')}</p><p><a class="text-link" href="#editing-sewn-piece">${t('看移动毛毡后的针脚','Move the felt and inspect the stitches')} →</a></p>`,
    capture('save',644,316,'保存当前场景与外观。','Scene and Look controls.'),
    capture('layers',594,734,'重开后保留九个图层。','Nine layers after reopening.'))}
${craftRow('导出并重新打开成品','Export and reopen the cushion',
    para('将抱枕导出为 Unity 资源包，再载入静态预制体检查外观。','Export the cushion as a Unity package and reopen its static prefab to check the finish.'),
    capture('formats',650,483,'Unity 包、OBJ 或 PNG。','Unity package, OBJ or PNG.'),
    photo('cushionExport',t('从导出资源重新打开的静态预制体，保留了叶片、毛毡和两道封边。','The exported static prefab reopened with its leaves, felt and both finished edges.')))}
`;
})())}

${section('delivery','从可编辑作品到游戏道具','From editable work to a game prop','','',`
<div class="ts-export-images">
${photo('uiExportDetail',t('工作台里的可编辑场景。','Editable scene in the workbench.'))}
${photo('cushionExport',t('从资源包载入的静态抱枕。','Static cushion reloaded from the package.'))}</div>
${table([t('用途','Goal'),t('保存或导出','Format'),t('保留什么','What travels')],[
[t('下次继续缝','Resume sewing'),t('场景','Scene'),t('控制点、针脚、图层与依附关系。','Control points, stitches, layers and attachments.')],
[t('换一张布复用','Reuse on another surface'),t('组合 / 外观','Motif / Look'),t('组合重投图案；外观恢复指定区域的材质。','Motif projects the pattern. Look restores mapped materials.')],
[t('导入游戏','Use in a game'),'Unity package',t('静态 Prefab、网格、材质、贴图和着色器。','Static prefab, meshes, materials, textures and shaders.')],
[t('交给建模软件','Share geometry'),'OBJ + MTL',t('网格与基础色。','Mesh and base colours.')],
[t('展示成品','Show the finished piece'),'PNG',t('可选透明背景，1200–4096 px。','Optional transparency, 1200–4096 px.')]])}
<article id="export-implementation" class="ts-pack-flow"><h3>${t('独立资源包','Building the Unity package')}</h3><ol class="ts-path-flow">
<li><b>${t('复制静态模型','Clone the mesh')}</b></li><li><b>${t('收集材质与依赖','Collect dependencies')}</b></li><li><b>${t('重开核对外观','Reopen and verify')}</b></li></ol></article>
`)}

${section('development','局部工艺的绘制与修改','Drawing and editing a detail','','',`
${window.AliceToolStory.suzanne(lang)}
${window.AliceToolStory.construction(lang)}
${window.AliceToolStory.design(lang)}
${window.AliceToolStory.reuse(lang)}
<h3 class="ts-history-title">${t('工具的演变','Tool development')}</h3>
<ol class="ts-path-flow"><li><b>2026.04–06</b><span>${t('Alice 的材料与针脚实验','Fabric and seam studies for Alice')}</span></li>
<li><b>2026.09–10</b><span>${t('把工艺做成独立工作台','Craft tools become a standalone workbench')}</span></li>
<li><b>2026.11</b><span>${t('1.0.1 版通过跨项目道具导入验证','Version 1.0.1 tested with cross-project prop imports')}</span></li></ol>
<p class="ts-input-note">${t('验证环境：macOS，Unity 6.3 / URP 17.3 与 Unity 6.5 / URP 17.5。','Tested on macOS with Unity 6.3 / URP 17.3 and Unity 6.5 / URP 17.5.')}</p>
`)}

${section('cases','工艺功能与具体案例','Craft features in context','','',`
${craftNavigation()}
${passage('case-pattern','色格如何变成织物','From colour cells to cloth','',window.AliceToolStory.pattern(lang))}
${passage('case-stitches','曲面针脚与区域刺绣','Surface stitches and filled embroidery',para('回针沿布面勾出房屋。调针距改变疏密；调线径改变笔画粗细。','Backstitch traces the houses. Stitch spacing sets the gaps and yarn diameter sets the line weight.'),pair(wfig('reference-1','蓝棉布：回针沿房屋轮廓贴合布面。','Blue cotton: backstitch follows the house outlines across the fabric.'),photo('threadAfter',t('线材细节：三股绞合与表面细纤维。','Thread detail: three-ply construction and fine surface fibres.'))))}
${passage('case-patches','贴布、共享缝边与图层依附','Patchwork, shared seams and attached layers',para('六片衣物贴在同一件 T 恤上，各有自己的厚度。相邻布片可以共用一条缝。','Six appliqués share one shirt. Each has its own thickness. Neighbouring patches can share a seam.'),pair(wfig('reference-2','短袖上的六片晾衣绳布贴。','Six washing-line patches on the shirt.'),wfig('edging','封边样板：逐项比较跨边、环线与连接方式。','Edging sampler: comparing edge crossings, loops and connections.')))}
${passage('case-accessories','纽扣、亮片与连续串珠','Buttons, sequins and continuous beadwork',para('库里有 22 款纽扣。固定线穿过双孔或四孔，珠串则沿一条可编辑的路径连续穿线。','The library has 22 button designs. Thread passes through two or four holes; a bead strand follows one editable path.'),pair(wfig('craft-10','材料卡：真实孔道、配件表面与固定针线。','Sample card: physical holes, accessory surfaces and securing threads.'),wfig('motif-0','珠绣花环：路径排珠与连续穿线。','Bead wreath: a path-based array with continuous thread.')))}

${passage('case-yarn','绒线体积与参数化缎带','Yarn volume and parametric ribbons',para('点一下生成绒簇，拖出路径排一行。蝴蝶结两条尾带可以分别画，花形结可用 3–16 个结环。','Click for a tuft or drag to plant a row. Draw each bow tail separately. Rosettes use 3–16 loops.'),pair(wfig('craft-8','绒线溪谷：多种成簇与成排绒线结构。','Yarn valley: clustered and path-based yarn structures.'),wfig('ribbon-0','缎面蝴蝶结：结环与尾带分别可调，点击查看侧面。','Satin bow: editable loops and tails; open to inspect the oblique view.')))}
`)}

${section('materials','材质分区与织物尺度','Material regions and textile scale','','',`
<p class="ts-copy">${t('用两侧箭头换布，拖动样球看织纹和反光。','Use the arrows to change fabrics. Drag the sphere to inspect the weave and sheen.')}</p>
<div class="material-layout"><div><div class="material-view"><div class="material-stage" id="material-stage"></div>
    <div class="material-nav browse-frame">${window.AliceBrowse.arrows(t('上一种材质','Previous fabric'), t('下一种材质','Next fabric'),'material-stage')}</div>
    </div><h3 class="material-name" aria-live="polite" aria-atomic="true"><span id="material-name"></span> <span class="material-position"></span></h3></div><div><div class="material-buttons" aria-label="${t('材质样本','Material samples')}">${D.materials.map((m,i)=>`<button class="material-btn" data-material="${i}" aria-pressed="${i===0}">${img({...m.image,src:m.image.thumb},materialNames[i][lang==='en'?1:0])}${materialNames[i][lang==='en'?1:0]}</button>`).join('')}</div></div></div>
${window.AliceToolStory.fabricBreakdown(lang)}
<h3 class="ts-history-title">${t('布面变形时','When cloth takes a crease')}</h3>
${compare('wrinkleBefore','wrinkleAfter','褶皱带动贴布与针脚。刚性配件随表面转向。','The patch and stitches follow the crease. Rigid trims rotate with the surface.')}
`)}

${section('works','作品与研究档案','Works and study archive','','',`
${window.AliceToolStory.featuredWorks(lang)}
<h3 class="ts-catalogue-title">${t('作品与工艺研究档案','Catalogue of works and studies')}</h3>
<p class="ts-catalogue-note">${t('48 个条目中有 6 件参考重建、5 件工坊道具和 11 项基于游戏原网格的布料研究。每项附制作来源。','The 48 entries include six reference reconstructions, five workshop props and eleven fabric studies on existing game meshes. Each entry credits its source.')}</p>
<div class="works-catalogue">
<div class="gallery-toolbar"><div class="filter-row" aria-label="${t('作品类别','Work categories')}"><button class="filter" data-filter="all" aria-pressed="true">${t('全部','All')}</button>${[...new Set(W.map(w=>w.category))].map(c=>`<button class="filter" data-filter="${esc(c)}" aria-pressed="false">${esc(category(W.find(w=>w.category===c)))}</button>`).join('')}</div><div class="search-row"><input type="search" id="work-search" placeholder="${t('搜索作品或工艺','Search works or crafts')}" aria-label="${t('搜索作品','Search works')}"><span class="gallery-count" aria-live="polite"></span></div></div><div class="gallery" id="work-gallery"></div><nav class="gallery-pager" aria-label="${t('目录翻页','Catalogue pages')}"></nav></div>
`)}

${section('trial','重新打开《夜航》抱枕','Reopening the Night Crossing cushion','','',window.AliceToolStory.trial(lang))}

${section('results','串珠预览与游戏道具实测','Testing the bead preview and the game props','','',window.AliceToolStory.results(lang))}

${section('bridge','布艺作品进了游戏','From studio to workshop','','',`
${window.AliceWorkshopProps.render('toolkit',lang)}
<p class="prop-more"><a class="text-link" href="#work-gamecraft-1">${t('角色布料研究 · Alice','Character textile study · Alice')}</a></p>
`)}
`}

function game(){
const story = window.AliceGameStory.forLanguage(lang);
const points=(...items)=>`<ul class="mending-points">${items.map(([zh,en])=>`<li>${t(zh,en)}</li>`).join('')}</ul>`;
return `
<header id="overview" class="overview-game"><div class="hero-intro"><h1>Alice · Mending Workshop</h1><p class="lead">${t('在窗边修好两只玩偶，第一只是我亲手缝的 Alice。Mina 明天要去新学校，请给 Alice 缝上一只新的纽扣眼，留下她歪歪的笑。','Mend two well-loved toys, starting with Alice, the doll I sewed by hand. Mina starts at a new school tomorrow. Give Alice a new button eye and keep her crooked smile.')}</p>
<p class="project-connection">${t(
    `玩家翻开的布面针法手册，是我用自己开发的 Unity 布艺工具 <a href="${href('toolkit')}">Textile Studio</a> 制作的。`,
    `I made the cloth-bound guide that teaches players their first stitch with <a href="${href('toolkit')}">Textile Studio</a>, my textile tool for Unity.`
)}</p>
${overviewActions()}</div>
<div class="mending-first-look"><div class="mending-first-frame">${img(M[D.clips.stitch.poster],t('玩家正沿 Alice 眼旁的裂口落针。','The player places a stitch beside Alice’s missing eye.'),'',false)}${window.AliceAdmissions.film(lang,'game')}</div>${window.AliceAdmissions.download(lang)}</div></header>
${chapterNavigation()}

${section('arrival','两份委托','Commissions','','',story.arrival()+story.commissions()+story.transfer())}

${section('alice','Mina 的布偶 Alice','Mina’s doll, Alice','箱扣勾掉了纽扣眼。请保留她歪歪的笑容和旧缎带。','A suitcase clasp caught her eye. Keep her crooked smile and old ribbon.',`
${story.route('alice')}
${row("1. 补回脸颊","1. Pack the cheek",points(["填入四小团棉花。","Add four tufts of cotton."],["用填充棒轻压到两边脸颊对称。","Press gently until the cheeks match."]),photo("fill100",t("整理后的脸颊","Cheek after packing")))}
${photo('aliceFill',t('棉花袋与填充棒','Cotton bag and packing stick'))}
${row("2. 缝合裂口","2. Close the tear",points(["沿同一侧的布褶入针、出针。","Enter and exit through one fold."],["交替换边，完成六组藏针。","Alternate sides for six ladder stitches."]),photo("aliceSew",t("沿布褶落针","Needle placement along the fold")))}
${row("3. 收紧、打结、修线","3. Tension, knot and trim",points(["剪出线尾，慢拉到蓝色张力区。","Cut a working tail and pull into the blue tension band."],["稳住后松手。打结，剪短余线。","Hold, release, knot and trim."]),photo("aliceTension",t("慢拉时的张力条","The tension band while pulling")))}
${row("4. 挑一只新眼睛","4. Fit a new eye",points(["从盒里选纽扣，放到脸颊上。","Choose a button and place it on the cheek."],["按扣孔数量翻开手册。","Open the handbook to its hole pattern."]),story.figure("button-tin","桌上的纽扣盒","The button tin"))}
${row("5. 缝牢纽扣","5. Fasten the button",points(["每对孔缝四次。四孔扣依次缝两对。","Sew each pair four times. A four-hole button takes two pairs."],["收线打结，轻拉试一试。","Knot the thread and gently tug."]),photo("aliceButton",t("固定后的四孔纽扣","Secured four-hole button")))}
${row("6. 送 Alice 回家","6. Send Alice home",points(["Alice 坐起来挥手。Mina 想让她陪自己度过明天在新学校的第一天。","Alice sits up and waves. Mina wants her there for her first day at a new school tomorrow."],["把玩偶装盒，封口寄回。","Pack the doll, seal the box and send her home."]),photo("aliceComplete",t("修好后的 Alice","Alice after repair")))}
${photo('aliceSend',t('寄回前的确认','Ready for dispatch'))}
${story.ribbon()}
`)}

${section('panda','面包店的小国王','The bakery’s Little King','生日彩旗勾松了耳朵。把原来的皇冠和亮片缝回去。','Birthday bunting snagged the ear. Sew the original crown and sequin back on.',`
${story.route('panda')}
${row("1. 逐行挑回线圈","1. Recover the loops",points(["用两个针目扣稳住活线圈。","Secure the live loops with two markers."],["对准钩尖，逐行挑回六行。失误只重试当前行。","Align the hook and recover six rows. A miss repeats one row."]),photo("pandaLoops",t("耳朵边的钩针","Hook at the edge of the ear")))}
${row("2. 补棉、闭耳","2. Close the ear",points(["补三团棉花，轻压两次。","Add three tufts and press twice."],["用六组藏针合拢耳朵，收紧、回结、藏尾。","Close with six ladder stitches. Tension, knot and hide the tail."]),photo("pandaEar",t("耳部的缝口","The ear seam")))}
${row("3. 缝回旧皇冠","3. Anchor the crown",points(["摆正帽边。每针先穿皇冠，再进头顶布面。","Align the hem. Pass through the crown, then the head fabric."],["缝四次，两侧锁结。","Make four loops and secure both sides."]),photo("pandaCrown",t("皇冠底边","The crown hem")))}
${row("4. 固定旧亮片","4. Secure the sequin",points(["放平亮片，从中心孔穿入，从外缘布面穿回。","Lay the sequin flat. Pierce the centre and return just outside the rim."],["缝三道固定针，藏结修线。","Secure with three stitches and bury the knot."]),story.figure("cheek-sequin","从中心孔到外缘","Centre-to-rim stitch"))}
${row("5. 分开轻拉三处","5. Test each repair",points(["依次轻拉耳朵、皇冠和亮片。","Tug the ear, crown and cheek sequin in turn."],["三处都牢固后，小国王动动耳朵。","When all three hold, Panda wiggles its ears."]),story.figure("return-check","轻拉亮片","Testing the sequin"))}
${row("6. 寄回面包店","6. Return to the bakery",points(["面包店想为每年都出现在生日照里的小国王过一次生日。","The bakery wants a birthday of Panda’s own after years in everyone’s photos."],["合上盒盖，封好寄回。","Close and seal the parcel."]),story.figure("bakery-parcel","寄回的包裹","The return parcel"))}
`)}

${section('play','工具与针法','Tools & stitches','','',`
${story.preparation(repairMethod(mechanics[2],2))}
<div class="repair-methods">${repairMethod(mechanics[0],0)}${repairMethod(mechanics[1],1)}${story.trimming()}${repairMethod(mechanics[3],3)}${repairMethod(mechanics[4],4)}</div>
${story.finishing()}
`)}

${section('doll','玩偶模型与工坊渲染','Toy models and workshop rendering','','',`
${window.AliceDollOrbit.gallery(lang)}
${story.technical()}
<section class="project-notes"><h3>${t('从实物到可修补的模型','From handmade doll to repairable model')}</h3>
${pair(photo('alicePhysical',t('手缝原作','The hand-sewn doll')),photo('aliceCurrent',t('游戏模型','The game model')))}
${table([t('部位','Part'),t('处理方法','Treatment')],[
 [t('身体、头发与衣服','Body, hair and dress'),t('按织物分区，修整袖口、裙边与坐姿。','Separate textile regions. Refine the cuffs, hem and seated pose.')],
 [t('脸颊','Cheek'),t('棉花增加体积，填充棒重新分布已有的棉花。','Cotton adds volume. The packing stick redistributes it.')],
 [t('缝口','Seam'),t('在未形变的布面记录针位，填棉后仍能准确落针。','Store needle contacts on the undeformed cloth so stitches stay aligned as the cheek fills.')]])}
${pair(photo('fill0',t('填棉前','Before stuffing')),photo('fill100',t('填入四团后','After four tufts')))}</section>
`)}

${section('workshop','工坊里的声音与光线','Sound and light in the workshop','','',`
${workshopAtmosphere()}
${story.needleLight()}
${story.props()}
`)}

${section('mechanics','修补反馈与无障碍设计','Repair feedback and accessibility','','',`
${story.feedback()}
${passage('thread-state','中途停下，会丢掉哪一针？','What happens if you stop mid-stitch?',story.keyboardCheck(),pair(photo('clothEntry',t('入针待确认','Entry pending')),photo('clothExit',t('第三针已确认','Third stitch confirmed'))))}
${row('可调整的操作','Control options',points(['键位可重映射，也可点击代替拖动。','Remap keys or use clicks for drag actions.'],['纸张可放大，提示可延长或提高对比度。','Enlarge the paper, extend cues or increase contrast.']),photo('accessibility',t('两份委托共用的辅助设置','Comfort settings for both commissions')))}
`)}

${section('history','开发历程与后续设计','Development and further designs','','',`
<div class="mending-influences"><p>${t('Alice 的原型由我手缝。我选择要保留的磨损痕迹，设计委托、修补反馈和工坊内的声音交互。','I sewed the original Alice, chose which signs of wear to keep, and designed the commissions, repair feedback and sound interactions.')} <a class="text-link" href="#making-credits">${t('制作分工','Production credits')}</a></p><dl><dt>ReStory</dt><dd>${t('损伤决定修理次序','Damage sets the repair order.')}</dd><dt>Assemble with Care</dt><dd>${t('主人讲出物件的来历','Owners give objects their history.')}</dd></dl></div>
${table([t('阶段','Stage'),t('交付','Milestone')],[
 ['2026.04–06',t('布艺材质与 Alice 数字原型','Textile materials and the digital Alice')],
 ['2026.09–10',t('窗边工坊、两份委托和针线操作','Workshop, two commissions and hand-operated stitches')],
 ['2026.11',t('工坊加入五件布艺道具，验证中途读档与寄回','Five textile props integrated. Mid-repair saves and return journeys checked.')]])}
<a class="text-link mending-validation" href="game-slides.html#validation">${t('查看两份委托从收件、存档到寄回的技术验证（英文）','Read the technical checks from parcel to dispatch (English)')} ↗</a>
${passage('future','尚未实现的委托构想','Unimplemented commission concepts','',table([t('委托构想','Concept'),t('新问题与技法','New problem and technique'),t('保留的物件线索','Object details to preserve')],[
[t('围巾狐狸','Scarf fox'),t('前臂磨破 → 补布、毛毯针','Worn forearm → patch and blanket stitch'),t('送信人的旧邮袋、围巾','Courier’s old satchel and scarf')],
[t('条纹针织熊','Striped knitted bear'),t('腹部缺纱 → 托底、交错织补','Missing belly yarn → supported darning'),t('旧毛衣的晒痕、园丁的纸花','Sun-faded wool and gardener’s paper flower')],
[t('帆布小鲸','Canvas whale'),t('鳍部脱缝 → 对位、疏缝、闭口','Loose fin seam → align, baste, close'),t('学校戏剧社的演出痕迹','School play’s wear marks')],
[t('红围裙猫','Red-apron cat'),t('嘴角松线 → 沿旧迹回针','Loose mouth thread → backstitch'),t('老照片里歪歪的笑容','Crooked smile in old photos')],
[t('拼布小象','Patchwork elephant'),t('补丁翘边 → 组合旧针法','Loose patchwork → combine earlier stitches'),t('邻里捐来的布头','Neighbours’ fabric scraps')]
]))}
<div class="prose game-endnote">${para('下一轮真人试玩想观察：首次接触游戏的人能否认出熊猫耳朵也需要藏针，并把在 Alice 身上学到的手法用上。','Next playtest question: do first-time players recognise that Panda’s ear needs the ladder stitch they learned on Alice?')}<p>${t('配乐来自 Scott Buckley；雨声和工具声取自授权录音。','Music by Scott Buckley. Rain and tool sounds use licensed recordings.')} <a class="text-link" href="credits.txt" target="_blank" rel="noopener">${t('音乐与音源署名','Music and recording credits')} ↗</a></p></div>
`)}
`}

const materialNames=[['细棉','Fine cotton'],['粗麻','Coarse linen'],['平针','Jersey'],['罗纹','Rib knit'],['粗毛线','Bulky yarn'],['毛毡','Felt'],['短绒','Short pile'],['缎面','Satin'],['Alice 身体','Alice body'],['Alice 包边','Alice binding'],['游戏头发','Game hair'],['金色头发','Golden hair']];
const mechanics=[
    {id:'stitch',foley:'needle',still:'aliceSew',name:['梯形藏针','Ladder stitch'],actions:[['入针','Enter'],['出针','Exit'],['换边','Cross sides']],sound:['入针时轻响，随后是线穿布声。','A prick on entry, then the thread sliding through.']},
    {id:'tension',foley:'scissors',still:'aliceTension',name:['慢拉收线','Gentle tension'],actions:[['慢拉','Pull slowly'],['在蓝区稳住','Hold in blue'],['松手','Release']],sound:['听剪线声和松手时短促的抽线声。','A snip, then a short slide as the thread settles.']},
    {id:'fill',foley:'packing',still:'aliceFill',name:['填棉整形','Stuffing and shaping'],actions:[['取棉','Take a tuft'],['塞入','Fill'],['轻压','Press']],sound:['工具碰桌轻响，压进棉花时变沉。','A tap on the desk, a muffled press into cotton.']},
    {id:'loops',still:'pandaLoops',name:['挑回线圈','Recovering loops'],actions:[['固定活线圈','Clip the loops'],['W / S 对准','Align with W / S'],['空格转钩','Turn with Space']],sound:['竹钩拿起时轻响，每行收好后线轻轻滑动。','A click as the hook lifts, then yarn sliding at each row.']},
    {id:'button',still:'aliceButton',name:['缝纽扣','Sewing a button'],actions:[['穿过一对孔','Sew the pair'],['打结','Knot'],['轻拉检查','Tug to test']],sound:['听针入孔和拉线穿出的两个声音。','Listen for the needle entering and the thread pulling through.']}
];
let galleryFilter='all', query='', activeModal=null, modalIndex=0, lastFocus=null, galleryPage=0;
const worksPerPage=9;
function render(){

document.documentElement.lang=lang==='en'?'en':'zh-CN';
document.getElementById('app').innerHTML=shell(page==='toolkit'?toolkit():game());
if(page==='toolkit'){showMaterial(0);renderGallery()}
document.querySelectorAll('[data-print]').forEach(b=>b.onclick=printPage);
document.querySelectorAll('.compare input').forEach(i=>i.oninput=()=>i.closest('.compare').style.setProperty('--split',i.value+'%'));
document.querySelectorAll('[data-hotspot]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-hotspot]').forEach(x=>x.setAttribute('aria-pressed',x===b));document.querySelectorAll('[data-note]').forEach(x=>x.classList.toggle('selected',x.dataset.note===b.dataset.hotspot))});
document.querySelectorAll('[data-material]').forEach(b=>b.onclick=()=>showMaterial(+b.dataset.material));
const materialNav=document.querySelector('.material-nav');
if(materialNav){
    materialNav.addEventListener('click',event=>{
        const button=event.target.closest('[data-browse-step]');
        if(button)changeFabric(Number(button.dataset.browseStep));
    });
    materialNav.addEventListener('keydown',event=>{
        if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
        event.preventDefault();
        changeFabric(event.key==='ArrowLeft'?-1:1);
    });
}
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{galleryPage=0;galleryFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderGallery()});
const search=document.querySelector('#work-search');if(search)search.value=query;if(search)search.oninput=()=>{galleryPage=0;query=search.value.toLowerCase().trim();renderGallery()};
document.querySelector('.dialog-close').onclick=closeModal;document.querySelector('.dialog-prev').onclick=()=>moveModal(-1);document.querySelector('.dialog-next').onclick=()=>moveModal(1);
const dialog=document.querySelector('dialog');
window.AliceImageInspection.mount(dialog);
dialog.addEventListener('click',e=>{if(e.target===dialog)closeModal()});dialog.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus({preventScroll:true})});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();moveModal(1)}if(e.key==='ArrowLeft'){e.preventDefault();moveModal(-1)}});
document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===galleryFilter));
document.querySelectorAll('[data-workshop-src]').forEach(button=>button.onclick=()=>openWorkshopView(button));
bindImages();
window.AliceSequences?.mount(document.getElementById('main'), lang);
mountReader();
}
function switchLanguage(nextLanguage) {
    if (lang === nextLanguage) return;
    syncReader();
    const nextUrl = new URL(location.href);
    nextUrl.searchParams.set('lang',nextLanguage);
    // Rebuild the translated page around the passage the reader is looking at.
    const line = readerLine();
    const underHeader = document.elementFromPoint(innerWidth/2,Math.min(line,innerHeight-1));
    const oldAnchor = underHeader?.closest('main [id]') || currentSection;
    const rect = oldAnchor?.getBoundingClientRect();
    const fraction = rect?.height ? (line-rect.top)/rect.height : 0;
    const atStart = window.scrollY < 2;
    const hashSection = document.getElementById(location.hash.slice(1))?.closest('main > .section, main > #overview');
    if (currentSection && hashSection!==currentSection) nextUrl.hash=currentSection.id;
    try { localStorage.setItem('alice-language', nextLanguage); } catch {}
    try { history.replaceState(null, '', nextUrl.href); }
    catch { location.replace(nextUrl.href); return; }
    const material = document.querySelector('[data-material][aria-pressed="true"]')?.dataset.material;
    lang = nextLanguage;
    render();
    if(Number(material)>0)showMaterial(Number(material));
    const anchor = oldAnchor && document.getElementById(oldAnchor.id);
    if(atStart)window.scrollTo(0,0);
    else if(anchor){
        const translated = anchor.getBoundingClientRect();
        window.scrollBy(0,translated.top+fraction*translated.height-readerLine());
    }
    syncReader();

}

let printState=null;
function preparePrint(){
    if(printState)return;
    printState={galleryFilter,query,galleryPage};
    if(page==='toolkit'){
        galleryFilter='all';query='';renderGallery();
    }
    document.querySelectorAll('main img[src]').forEach(img=>img.loading='eager');
}

function finishPrint(){
    if(!printState)return;
    if(page==='toolkit'){
        ({galleryFilter,query,galleryPage}=printState);
        renderGallery();
    }
    printState=null;
}

async function printPage(){
    preparePrint();
    const images=[...document.querySelectorAll('main img[src]')];
    await Promise.all(images.map(img=>img.decode().catch(()=>{})));
    window.print();
}
window.addEventListener('beforeprint',preparePrint);
window.addEventListener('afterprint',finishPrint);
function changeFabric(direction) {
    const active=document.querySelector('[data-material][aria-pressed="true"]');
    const next=(Number(active.dataset.material)+direction+D.materials.length)%D.materials.length;
    showMaterial(next);
}
function showMaterial(index) {
    const material = D.materials[index];
    const label = materialNames[index][lang === 'en' ? 1 : 0];
    window.AliceMaterialOrbit.mount(document.getElementById('material-stage'), material, label, lang);
    document.getElementById('material-name').textContent=label;
    document.querySelector('.material-position').textContent=(index+1)+' / '+D.materials.length;
    document.querySelectorAll('[data-material]').forEach((button,i) => button.setAttribute('aria-pressed', i === index));
}
function renderGallery(){
    const matches=W.filter(w=>(galleryFilter==='all'||w.category===galleryFilter)&&(!query||[w.title,w.titleEn,w.description,w.descriptionEn,w.category].join(' ').toLowerCase().includes(query)));
    const pages=Math.ceil(matches.length/worksPerPage);
    galleryPage=Math.max(0,Math.min(galleryPage,pages-1));
    document.getElementById('work-gallery').innerHTML=matches.length?matches.map((w,index)=>{
        const pageClass = Math.floor(index/worksPerPage) === galleryPage ? '' : ' off-page';
        return `<button class="work-card${pageClass}" data-work="${w.id}" id="work-${w.id}"><div class="work-image">${img({...w.images[0],src:w.images[0].thumb},title(w))}</div><div class="work-info"><div><h3>${esc(title(w))}</h3><p>${esc(category(w))}${w.status==='historical'?' · '+t('开发档案','Archive'):''}</p></div><span>${w.images.length>1?String(w.images.length).padStart(2,'0')+' ↗':'↗'}</span></div></button>`;
    }).join(''):`<p class="empty-results">${t('没有匹配的作品，试试另一个关键词。','No matching works. Try another search.')}</p>`;
    document.querySelector('.gallery-count').textContent=`${matches.length} / ${W.length} ${t('件作品','works')}`;
    const pager=document.querySelector('.gallery-pager');
    pager.innerHTML=pages<2?'':Array.from({length:pages},(_,i)=>`<button data-catalogue-page="${i}" aria-label="${t('第 ','Page ')}${i+1}" ${galleryPage===i?'aria-current="page"':''}>${i+1}</button>`).join('');
    pager.querySelectorAll('button').forEach(button=>button.onclick=()=>{
        galleryPage=Number(button.dataset.cataloguePage);
        renderGallery();
        const first=document.querySelector('#work-gallery .work-card:not(.off-page)');
        first?.focus({preventScroll:true});
        first?.scrollIntoView({behavior:'instant',block:'start'});
    });
    bindImages();
}

function craftNavigation() {
    const cases = [
        ['case-pattern','像素图案','Pixel patterns'], ['case-stitches','曲面刺绣','Embroidery'],
        ['case-patches','贴布与缝边','Appliqué'], ['case-accessories','纽扣与串珠','Fastenings'],
        ['case-yarn','绒线与缎带','Yarn and ribbon']
    ];
    return `<nav class="filter-row" aria-label="${t('工艺案例','Craft examples')}">
        ${cases.map(([id,zh,en]) => `<a class="text-link" href="#${id}">${t(zh,en)}</a>`).join('')}</nav>`;
}

function repairMethod(mechanic, index) {
    const {id,still,name,actions,sound,foley}=mechanic;
    const clip=D.clips[id], label=t(...name);
    const visual=clip
        ? `<video controls playsinline preload="none" poster="${M[clip.poster].src}" aria-label="${esc(label)}" aria-describedby="sound-${id}"><source src="${clip.src}" type="video/mp4"><a href="${clip.src}">${label}</a></video><div class="print-only">${img(M[still],label)}</div>`
        : `<button class="image-button" data-image="${still}" aria-label="${esc(label)}">${img(M[still],label)}</button>`;
    return `<article class="repair-method" id="repair-${id}" aria-labelledby="mechanic-${index}">
        <h3 id="mechanic-${index}">${label}</h3><div class="video-layout"><div class="video-copy">
            <ol class="repair-actions">${actions.map(words=>`<li>${t(...words)}</li>`).join('')}</ol>
            ${clip?`<p class="repair-sound" id="sound-${id}">${t(...sound)}</p>`:''}
            ${foley?`<audio class="repair-sample" controls preload="none" aria-label="${esc(label+' · '+t('游戏原声','Game sound'))}" aria-describedby="sound-${id}"><source src="assets/story-game/${foley}.m4a" type="audio/mp4"><a href="assets/story-game/${foley}.m4a">${t('播放原声','Play game sound')}</a></audio>`:''}
            <button class="text-link" data-image="${still}" data-caption="${esc(label)}">${t('放大针脚','Inspect detail')}</button>
        </div><div>${visual}</div></div></article>`;
}
function workshopAtmosphere() {
    const {film, comparisons} = window.ALICE_WORKSHOP_MEDIA;
    const cues = film.cues.map(({seconds, label}) => {
        const time = '0:' + String(seconds).padStart(2, '0');
        const listen = t('试听', 'Play');
        return `<button type="button" data-window-cue="${seconds}" aria-controls="window-video" aria-label="${esc(listen+' · '+time+' · '+label[lang])}"><span class="cue-time">${time}</span> ${label[lang]}</button>`;
    }).join('');
    const [weather,timeOfDay]=comparisons.groups;
    const baseline=weather.images[0], baseLabel=t('晴天 14:00','Clear · 14:00');
    const presets=[
        [weather.images[1],t('阴天 14:00','Overcast · 14:00')],
        [weather.images[2],t('雨天 14:00','Rain · 14:00')],
        [timeOfDay.images[1],t('晴天 17:00','Clear · 17:00')],
        [timeOfDay.images[2],t('晴天 22:00','Clear · 22:00')]
    ];
    const [first,firstLabel]=presets[1];
    const controls=presets.map(([view,label],i)=>`<button type="button" data-climate-choice="${i}" data-src="${view.src}" data-label="${esc(label)}" aria-controls="weather-plate" aria-pressed="${i===1}">${label}</button>`).join('');
    const zoom=(side,view,label)=>`<button type="button" data-climate-side="${side}" data-workshop-src="${view.src}" data-caption="${esc(label)}" aria-label="${esc(t('放大','Enlarge')+' · '+label)}"><span>${label}</span><span aria-hidden="true"> ↗</span></button>`;
    const printViews=[[baseline,baseLabel],...presets].map(([view,label])=>`<figure><img width="1440" height="1000" src="${view.src}" alt="${esc(label)}" loading="lazy"><figcaption>${label}</figcaption></figure>`).join('');
    const comparison=`<section id="workshop-weather" class="workshop-comparisons"><h3>${comparisons.title[lang]}</h3>
        <p>${t('同一机位、双窗敞开。选一种天气或时刻，拖动分界线比较街面反光。','Same camera, both windows open. Choose a view and drag the divider to compare the street reflections.')}</p>
        <alice-weather-comparison data-climate-lang="${lang}">
            <div class="climate-choices" role="group" aria-label="${t('选择对照画面','Choose comparison view')}">${controls}</div>
            <div class="climate-wipe browse-frame" id="weather-plate" style="--weather-split:50%">
                <img class="climate-alternative" src="${first.src}" width="1440" height="1000" decoding="async" loading="lazy" alt="${firstLabel}">
                <img class="climate-base" src="${baseline.src}" width="1440" height="1000" decoding="async" loading="lazy" alt="${baseLabel}">
                <i aria-hidden="true"></i>
                <input type="range" min="0" max="100" value="50" aria-label="${t('左侧晴天画面的显示比例','Width of the clear afternoon view')}" aria-describedby="climate-views">
                ${window.AliceBrowse.arrows(t('上一种天气或时段','Previous weather or time'),t('下一种天气或时段','Next weather or time'),'weather-plate')}
            </div>
            <div class="climate-views" id="climate-views">${zoom('base',baseline,baseLabel)}${zoom('view',first,firstLabel)}</div>
            <span class="climate-status" aria-live="polite"></span>
            <p class="climate-note">${t('游戏中的挂钟每次可调 15 分钟。','The workshop clock advances in 15-minute steps.')}</p>
        </alice-weather-comparison>
        <div class="climate-print">${printViews}</div></section>`;
    return `<section id="window-recording" class="window-study"><h3>${film.title[lang]}</h3>
            <p id="window-sound">${t('雨天 13:00，游戏原声。双窗敞开时雨声清亮，合上玻璃后变闷。','13:00, rain, game audio only. Open both windows for a brighter patter. Close the glass to muffle it.')}</p>
            <figure class="window-film"><video id="window-video" controls playsinline preload="none" poster="${film.poster.src}" aria-label="${esc(film.title[lang])}" aria-describedby="window-sound">
                <source src="${film.src}" type="video/mp4"><a href="${film.src}">${film.title[lang]}</a></video>
                <img class="window-print" src="${film.poster.src}" loading="lazy" alt="${esc(film.title[lang])}">
                <figcaption><div class="window-cues" role="group" aria-label="${t('按窗扇状态试听','Listen by window position')}">${cues}</div></figcaption></figure></section>
        ${comparison}`;

}
function bindImages(){document.querySelectorAll('[data-work]').forEach(b=>b.onclick=()=>{const w=work(b.dataset.work);openModal({title:title(w),description:desc(w),provenance:lang==='en'?w.provenance:w.provenanceZh,images:w.images,kind:category(w)})});document.querySelectorAll('[data-image]').forEach(b=>b.onclick=()=>{const key=b.dataset.image;if(!M[key])return;const fig=b.closest('figure');let caption=fig?.querySelector('figcaption')?.textContent?.replace('↗','').trim()||b.dataset.caption||b.querySelector('img')?.alt||t('Unity 项目截图','Unity project capture');openModal({title:caption,description:'',provenance:'',images:[M[key]],kind:page==='toolkit'?'Textile Studio':'Alice · Game'})})}
function openWorkshopView(button) {
    const caption = button.dataset.caption;
    const view = {src: button.dataset.workshopSrc, thumb: button.dataset.workshopSrc};
    openModal({title:caption, description:'', provenance:'', images:[view], kind:t('工坊','Workshop')});
}
function openModal(data, startIndex=0) {
    activeModal=data;
    modalIndex=startIndex;
    lastFocus=document.activeElement;
    const dialog=document.querySelector('.lightbox');
    dialog.querySelector('#dialog-kind').textContent=data.kind;
    dialog.querySelector('#dialog-description').textContent=data.description;
    dialog.querySelector('#dialog-provenance').textContent=data.provenance;
    const thumbnails=dialog.querySelector('.dialog-thumbs');
    thumbnails.replaceChildren();
    if(data.images.length>1)data.images.forEach((view,i)=>{
        const name=view.caption || t('视图 ','View ')+(i+1);
        const button=document.createElement('button');
        button.type='button';
        button.dataset.view=i;
        button.setAttribute('aria-label',name);
        const preview=document.createElement('img');
        preview.src=view.thumb || view.src;
        preview.alt='';
        button.append(preview);
        button.onclick=()=>{modalIndex=i;drawModal();};
        thumbnails.append(button);
    });
    drawModal();
    dialog.showModal();
    document.body.style.overflow='hidden';
}
function drawModal() {
    window.AliceImageInspection.reset();
    const {images,title}=activeModal;
    const view=images[modalIndex];
    const caption=view.caption || title;
    document.getElementById('dialog-title').textContent=caption;
    const image=document.getElementById('dialog-image');
    image.src=view.src;
    image.alt=caption;
    document.getElementById('dialog-original').href=view.src;
    document.getElementById('dialog-count').textContent=images.length>1?(modalIndex+1)+' / '+images.length:'';
    for(const arrow of document.querySelectorAll('.dialog-arrow'))arrow.hidden=images.length<2;
    document.querySelectorAll('.dialog-thumbs button').forEach((button,index)=>{
        button.setAttribute('aria-pressed',String(index===modalIndex));
    });
}
function moveModal(delta){if(!activeModal)return;modalIndex=(modalIndex+delta+activeModal.images.length)%activeModal.images.length;drawModal()}
function closeModal(){document.querySelector('dialog').close()}
let readerSections=[], currentSection, readerObserver, mediaVisibilityObserver, scrollFrame=0;
const readerInset = 16;
function readerLine(){ return readerInset + 4; }

function syncReader() {
    if(!readerSections.length)return;
    let section=readerSections[0];
    for(const candidate of readerSections){
        if(candidate.getBoundingClientRect().top>readerLine())break;
        section=candidate;
    }
    if(section===currentSection)return;
    currentSection?.classList.remove('current-topic');
    currentSection=section;
    section.classList.add('current-topic');
    const group=chapters[page].find(([, ,ids])=>ids.includes(section.id));
    const chapterId=group[2][0];
    document.querySelectorAll('.chapter-links a, .topic-links a').forEach(link=>{
        const active=link.hash.slice(1)===(link.closest('.chapter-links')?chapterId:section.id);
        if(active)link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
    });
}
function queueReaderUpdate(){
    if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;syncReader();});
}
function mountReader(){
    readerObserver?.disconnect();
    mediaVisibilityObserver?.disconnect();
    readerSections=Array.from(document.querySelectorAll('main > #overview, main > .section'));
    currentSection=null;
    document.documentElement.style.setProperty('--reader-head', readerInset + 'px');
    readerObserver=new ResizeObserver(queueReaderUpdate);
    for(const section of readerSections)readerObserver.observe(section);
    // Keep the player and its cues active while they are still on screen.
    mediaVisibilityObserver=new IntersectionObserver(entries=>{
        for(const entry of entries){
            if(entry.isIntersecting)continue;
            entry.target.querySelectorAll('video,audio').forEach(clip=>{if(!clip.paused)clip.pause();});
        }
    });
    for(const section of readerSections){
        if(section.querySelector('video,audio'))mediaVisibilityObserver.observe(section);
    }
    syncReader();
}

function openFragment(initial=false){
    const id=location.hash.slice(1);
    const dialog=document.querySelector('dialog');
    if(dialog.open)closeModal();
    const deepWork=page==='toolkit'&&id.startsWith('work-')?work(id.slice(5)):null;
    if(deepWork){
        galleryFilter='all';query='';galleryPage=Math.floor(W.indexOf(deepWork)/worksPerPage);
        document.querySelector('#work-search').value='';
        document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter==='all'));
        renderGallery();
    }
    const target=document.getElementById(id);
    if(target){
        const needsReveal=!!target.closest('.sequence-panel[hidden]');
        window.AliceSequences?.reveal(target);
        if(initial||needsReveal||deepWork)target.scrollIntoView({block:'start',behavior:'instant'});
        if(deepWork){target.focus({preventScroll:true});target.click();}
    }
    syncReader();
}
window.addEventListener('scroll',queueReaderUpdate,{passive:true});
window.addEventListener('pageshow',queueReaderUpdate);
window.addEventListener('hashchange',()=>openFragment());
document.addEventListener('play',event=>{
    if(!event.target.matches('main video, main audio'))return;
    document.querySelectorAll('main video, main audio').forEach(clip=>{
        if(clip!==event.target && !clip.paused)clip.pause();
    });
},true);
document.addEventListener('click',event=>{
    const button=event.target.closest('[data-story-image]');
    if(button){
        const group=button.dataset.imageGroup;
        let items=[button];
        if(group){
            // Workbench hotspots and their text labels can open the same detail.
            const unique=new Map();
            for(const other of document.querySelectorAll('[data-story-image][data-image-group]')){
                if(other.dataset.imageGroup===group)unique.set(Number(other.dataset.imageIndex),other);
            }
            items=[...unique.keys()].sort((a,b)=>a-b).map(index=>unique.get(index));
        }
        const images=items.map(item=>({
            src:item.dataset.storyImage,
            thumb:item.querySelector('img')?.getAttribute('src') || item.dataset.storyImage,
            caption:item.dataset.caption || item.querySelector('img')?.alt || ''
        }));
        const start=group?items.findIndex(item=>item.dataset.imageIndex===button.dataset.imageIndex):0;
        const kind=page==='game'?'Alice · Mending Workshop':'Textile Studio';
        openModal({title:images[start].caption,description:'',provenance:'',images,kind},start);
    }
});
document.addEventListener('portfolio-language-change', event => {
    if (event.detail === 'en' || event.detail === 'zh') switchLanguage(event.detail);
});
render();
openFragment(true);
})();
