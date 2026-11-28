/* The workshop map pairs each exported textile with its actual in-game close-up. */
(() => {
    const pieces = [
        { key:'mat', work:'remake-01_WorkMat', model:'mat-model', room:'mat-room', point:[39,93], name:['工作垫','Work mat'],
          made:['彩线划格，软边收口。','Coloured thread grid and soft binding.'], used:['托住玩偶，留出缝合的位置。','Supports the toy while you stitch.'] },
        { key:'organiser', work:'remake-02_Organizer', model:'organiser-model', room:'organiser-room', point:[84,56], name:['工具收纳袋','Tool organiser'],
          made:['亚麻底布上用锁边针缝出毛毡口袋。','Felt pockets blanket-stitched to linen.'], used:['从墙袋取剪刀，剪完再放回。','Pick up the scissors and return them to the pocket.'] },
        { key:'handbook', work:'remake-03_NeedleBook', model:'handbook', room:'handbook-room', point:[71,74], name:['针法手册','Stitch handbook'],
          made:['亚麻封面，回针绣书名，酒红色束带。','Linen cover, backstitched title and a burgundy strap.'], used:['在桌边翻开手册，查看五种针法。','Open the book at the desk for five stitch lessons.'] },
        { key:'curtain', work:'remake-04_Curtain', model:'curtain-model', room:'curtain-room', point:[26,37], name:['窗帘','Curtain'],
          made:['大圈红线沿着布褶包住帘边。','Red loops bind the folded cloth.'], used:['窗帘垂在双层窗左侧。','Hangs to the left of the two window frames.'] },
        { key:'sign', work:'remake-05_OpenSign', model:'sign-model', room:'sign-room', point:[94,78], name:['营业挂牌','Open sign'],
          made:['逐行针织底布，三股线绣字。','Knitted base with three-ply lettering.'], used:['从右侧黄袋取出，挂到窗前开店。','Lift it from the yellow pocket and hang it at the window.'] }
    ];
    const root='assets/story-game/';
    const initialKey=new URLSearchParams(location.search).get('piece');
    let selected=pieces.findIndex(p=>p.key===initialKey);
    if(selected<0)selected=0;

    function render(page,lang) {
        const i=lang==='en'?1:0;
        const t=(zh,en)=>i?en:zh;
        const isGame=page==='game';
        const groupName=t('选择一件道具','Choose a prop');
        const select=(piece,n,pin=false)=>{
            const location=piece.key==='sign' ? t('营业挂牌收纳处','Open sign storage') : piece.name[i];
            const style=pin?`style="left:${piece.point[0]}%;top:${piece.point[1]}%"`:'';
            return `<button type="button" class="${pin?'prop-pin':'prop-choice'}" data-piece-index="${n}" ${style} aria-controls="prop-detail-${piece.key}" aria-pressed="${n===selected}" aria-label="${pin?location:piece.name[i]}"><span class="prop-number" aria-hidden="true">${n+1}</span>${pin?'':piece.name[i]}</button>`;
        };
        function photo(file,caption,type) {
            const label=type==='model'?t('工具成品','Made in the studio'):t('工坊中的用法','At the repair desk');
            return `<figure class="prop-${type}"><span class="prop-view-label">${label}</span><button type="button" data-story-image="${root}${file}.webp" data-caption="${caption}" aria-label="${t('放大','Enlarge')} · ${caption}"><img src="${root}${file}.webp" loading="lazy" decoding="async" alt="${caption}"></button><figcaption>${caption}</figcaption></figure>`;
        }
        const panels=pieces.map((piece,n)=>{
            const next=isGame?`toolkit.html?lang=${lang}#work-${piece.work}`:`game.html?lang=${lang}&amp;piece=${piece.key}#workshop-pieces`;
            return `<div class="prop-detail" id="prop-detail-${piece.key}" ${selected===n?'':'hidden'}>
                <h3>${piece.name[i]}</h3>
                <div class="prop-pair browse-frame">${photo(piece.model,piece.made[i],'model')}${photo(piece.room,piece.used[i],'closeup')}
                    ${window.AliceBrowse.arrows(t('上一件道具','Previous prop'),t('下一件道具','Next prop'),'workshop-prop-gallery')}</div>
                <a class="text-link" href="${next}">${isGame?t('查看这件作品的原模型','Inspect the original artwork'):t('在游戏中定位','Locate it in the game')}</a>
            </div>`;
        }).join('');
        const scene=window.ALICE_MEDIA.media.gameRoom;
        const map=isGame?`<div class="prop-map" role="group" aria-label="${t('工坊内的道具位置','Prop locations in the workshop')}"><img width="${scene.width}" height="${scene.height}" alt="${t('窗左侧的帘、桌面的工作垫和手册、右墙的工具袋。','The curtain at the window, mat and book on the desk, and tool pockets on the right wall.')}" src="${scene.thumb}" srcset="${scene.thumb} 720w, ${scene.src} ${scene.width}w" sizes="auto, (max-width: 660px) 90vw, 600px" loading="lazy">${pieces.map((piece,n)=>select(piece,n,true)).join('')}</div>`:'';
        return `<alice-prop-atlas class="prop-atlas ${isGame?'prop-at-desk':'prop-in-studio'}" data-language="${lang}">
            ${map}<div class="prop-choices" role="group" aria-label="${groupName}">${pieces.map((piece,n)=>select(piece,n)).join('')}</div>
            <div class="prop-details" id="workshop-prop-gallery">${panels}</div><span class="prop-announcement" aria-live="polite"></span>
        </alice-prop-atlas>`;
    }
    class PropAtlas extends HTMLElement {
        connectedCallback() {
            this.onclick=event=>{
                const button=event.target.closest('[data-piece-index],[data-browse-step]');
                if(!button)return;
                const step=Number(button.dataset.browseStep);
                selected=step?(selected+step+pieces.length)%pieces.length:Number(button.dataset.pieceIndex);
                const piece=pieces[selected];
                this.querySelectorAll('[data-piece-index]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.pieceIndex)===selected)));
                this.querySelectorAll('.prop-detail').forEach((panel,index)=>panel.hidden=index!==selected);
                if(step)this.querySelector(`.prop-detail:not([hidden]) [data-browse-step="${step}"]`).focus({preventScroll:true});
                this.querySelector('.prop-announcement').textContent=piece.name[this.dataset.language==='en'?1:0];
                // Keep a bookmarked location accurate when another object is selected on this map.
                const url=new URL(location.href);
                if(url.searchParams.has('piece')){
                    url.searchParams.set('piece',piece.key);
                    try{history.replaceState(history.state,'',url.href);}catch{}
                }
            };
        }
    }
    customElements.define('alice-prop-atlas',PropAtlas);
    window.AliceWorkshopProps={render};
})();
