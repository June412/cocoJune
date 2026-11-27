/* Game captures from the project presentation, paired with their uncropped views. */
(() => {
    'use strict';
    const root = 'assets/story-game/';
    // Each small drawing describes the hand action. The full game capture is in the step below it.
    const stepDrawings = {
        'fill-cheek': `<path class="paper" d="M14 33c-6-5-3-13 4-14-1-10 13-13 18-6 6-5 15 0 14 7 10 1 12 11 6 16-4 4-12 4-17 2-7 6-18 4-21-2z"/>
            <path d="M19 25c1-4 5-5 8-4m7-4c5-3 10-1 11 3"/><path class="thread" d="m36 31 30-15 3 4-29 15z"/>`,
        'ladder-entry': `<path d="M10 13q12-6 24-3l-3 11 4 7-5 14q-12 1-19 4m52-32q-12-6-20-3l-4 12 4 8-5 13q12 1 22 5"/>
            <path class="thread" d="m31 16 12 2-12 5 10 3-10 6 10 2-11 6"/><path d="m46 19 15-12-6 8z"/>`,
        'working-snip': `<path d="M27 31 52 12 34 34m-4-2 24 8-23-3"/><path class="paper" d="M29 33c1-8-10-13-14-8-5 7 5 14 12 10m3 0c0 7-6 14-12 12-8-3-4-12 4-14"/><circle cx="31" cy="33" r="1.6"/>
            <path class="thread" d="M39 8c2 8 12 9 10 16s-10 4-8-1c2-5 10-1 15-6m2-2 6-3"/>`,
        'button-tin': `<circle class="paper" cx="35" cy="28" r="19"/><circle cx="35" cy="28" r="15"/><g class="holes"><circle cx="30" cy="24" r="1.8"/><circle cx="40" cy="23" r="1.8"/><circle cx="31" cy="33" r="1.8"/><circle cx="40" cy="32" r="1.8"/></g>
            <path class="thread" d="m58 14 5-4m-3 12 7-1"/>`,
        'button-set': `<circle class="paper" cx="32" cy="30" r="16"/><circle cx="32" cy="30" r="12"/><path class="thread" d="m27 25 10 9m0-10-10 10m10-10c13-5 22 8 27 0"/><path d="m41 27 17-18c3-3 6-1 3 2z"/>`,
        'alice-reply': `<path class="paper" d="m13 24 22-8 25 6-1 19-23 8-23-7z"/><path d="m13 24 22 7 25-9m-25 9 1 18"/><path class="thread" d="m23 20 24 7v13m-11-22c-13-1-13-9-8-9 5 0 8 8 8 9 2-9 11-12 12-8 1 4-6 8-12 8z"/>`,
        'loop-check': `<path d="M11 32q6 15 13-1t14 0 14 0 12 0m-53 8q6 14 13-1t14 0 14 0 12 0"/><path class="thread" d="M31 34c-12-12 1-20 6-11 2 4-1 8-2 10"/><path d="m34 28 18-20c4-5 9-1 6 3l-4 2"/>`,
        'ear-seam': `<path class="paper" d="M13 38c-4-12 1-23 11-28 15-8 32 1 34 16 1 8-4 15-10 18q-19-9-35-6z"/><path d="M20 31c-3-11 6-19 14-18"/><path class="thread" d="m18 35 4-6m3 7 4-6m4 7 4-6m3 8 4-6m3 8 4-6"/>`,
        'crown': `<path class="gold" d="m13 17 13 9L36 9l11 16 13-10-6 24q-19 5-37-1z"/><path d="m17 33q18 4 38 0"/><path class="thread" d="m20 37-1 8m14-7-1 8m16-8-1 7"/>`,
        'cheek-sequin': `<path class="gold" d="m34 8 8 10 13 1-4 13 3 10-14 1-8 6-7-10-13-2 6-12-1-10 12 1z"/><circle cx="34" cy="29" r="3"/><path class="thread" d="M35 29c7-5 13 4 19 2 5-2 6-6 8-10"/>`,
        'return-check': `<path d="M13 38q14-13 31-7l8-8m-21 9 2-10c1-4 5-3 5 0l1 6 10-11c3-3 6 0 4 3l-4 6 7-7c3-2 5 1 3 4l-8 10c-4 6-9 8-16 10l-7 5"/><path class="thread" d="M11 21q10-7 16-1m-7-6 7 6-8 3"/>`,
        'bakery-parcel': `<path class="paper" d="m11 24 23-8 27 7-1 19-24 7-24-7z"/><path d="m12 24 24 7 25-8m-25 8v18"/><path class="thread" d="m23 20 24 7v16"/><path class="gold" d="M23 18c0-6 8-12 17-11 5 0 9 4 7 7-4 5-15 7-24 4z"/><path d="m30 11 3 4m4-6 3 3"/>`
    };
    const pictures = {
        "torn-cheek": [608, 342, "torn-cheek-full"],
        "loose-ear": [1260, 708, "loose-ear-full"],
        "unwrap": [840, 469, "unwrap-full"],
        "mina-note": [840, 503, "mina-note-full"],
        "cotton-bag": [685, 715, "cotton-bag"],
        "packing-stick": [755, 238, "packing-stick"],
        "handbook": [773, 1050, "handbook"],
        "spool": [865, 390, "spool"],
        "pincushion": [655, 432, "pincushion"],
        "thread-eye": [1000, 588, "thread-eye"],
        "thread-align": [990, 464, "thread-align-full"],
        "crown": [840, 499, "crown-full"],
        "cheek-sequin": [423, 260, "cheek-sequin-full"],
        "ear-surface": [348, 198, "ear-surface-full"],
        "ear-shells": [348, 198, "ear-shells-full"],
        "dress-grid": [555, 351, "dress-grid-full"],
        "dress-knit": [555, 351, "dress-knit-full"],
        "seam-thread": [488, 290, "seam-thread-full"],
        "seam-cut": [488, 290, "seam-cut-full"],
        "seam-closed": [488, 290, "seam-closed-full"],
        "pane-closed": [730, 440, "pane-closed-full"],
        "pane-turned": [730, 440, "pane-turned-full"],
        "cheek-before": [145, 80, "cheek-before-full"],
        "cheek-after": [145, 80, "cheek-after-full"],
        "hole-entry": [248, 166, "hole-entry-full"],
        "hole-exit": [248, 166, "hole-exit-full"],
        "hole-route": [348, 303, "hole-route-full"],
        "prompt-upper": [765, 361, "prompt-upper-full"],
        "prompt-lower": [840, 347, "prompt-upper-full"],
        "controller-a": [342, 116, "controller-a-full"],
        "controller-cross": [342, 116, "controller-cross-full"],
        "feedback-log": [725, 145, "feedback-log-full"],
        "felt-prick": [788, 308, "felt-prick-full"],
        "press-sound": [1024, 451, "press-sound-full"],
        "snip-sound": [738, 290, "snip-sound-full"],
        "scissor-pocket": [1920, 1080, "scissor-pocket"],
        "window-sound": [1920, 1080, "window-sound"],
        "speaker": [1920, 1080, "speaker"],
        "knit-near": [750, 375, "dress-knit-full"],
        "knit-far": [192, 96, "knit-far-full"],
        "toy-alice": [495, 865, "toy-alice"],
        "toy-panda": [830, 696, "toy-panda"],
        "mat-model": [1050, 845, "mat-model"],
        "organiser-model": [711, 1050, "organiser-model"],
        "curtain-model": [663, 1050, "curtain-model"],
        "sign-model": [1050, 950, "sign-model"],
        "mat-room": [1200, 754, "mat-room"],
        "organiser-room": [1200, 754, "organiser-room"],
        "handbook-room": [1200, 754, "handbook-room"],
        "curtain-room": [1200, 754, "curtain-room"],
        "sign-room": [1200, 754, "sign-room"],
        "fill-cheek": [880, 434, "fill-cheek"],
        "ladder-entry": [480, 312, "ladder-entry"],
        "tension-band": [997, 539, "tension-band"],
        "working-snip": [464, 302, "working-snip"],
        "button-tin": [847, 854, "button-tin"],
        "button-set": [608, 342, "button-set"],
        "alice-reply": [880, 538, "alice-reply"],
        "loop-check": [880, 527, "loop-check"],
        "ear-seam": [672, 410, "ear-seam"],
        "return-check": [840, 389, "return-check"],
        "bakery-parcel": [840, 473, "bakery-parcel"],
        "hook-tip": [280, 116, "hook-tip"],
        "ribbon-original": [940, 610, "ribbon-original"],
        "ribbon-at-desk": [600, 393, "torn-cheek-full"],
        "ribbon-letter": [477, 312, "ribbon-letter-full"],
        "needle-unlit": [312, 202, "needle-unlit-full"],
        "needle-bounce": [312, 202, "needle-bounce-full"]
    };
    const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

    function forLanguage(lang) {
        const t = (zh,en) => lang === 'en' ? en : zh;
        const image = (id, description) => {
            const [width,height,full] = pictures[id];
            const caption = escape(description);
            return `<button type="button" class="story-image" data-story-image="${root}${full}.webp" data-caption="${caption}" aria-label="${escape(t('放大图片','Enlarge image'))} · ${caption}"><img src="${root}${id}.webp" width="${width}" height="${height}" alt="${caption}" loading="lazy" decoding="async"></button>`;
        };
        const figure = (id,zh,en) => {
            const caption=t(zh,en);
            return `<figure class="story-figure">${image(id,caption)}<figcaption>${escape(caption)}</figcaption></figure>`;
        };
        const figures = (...group) => `<div class="story-figures" style="--views:${group.length}">${group.join('')}</div>`;
        const link = (id,zh,en) => `<a class="story-link" href="#${id}">${escape(t(zh,en))} <span aria-hidden="true">↗</span></a>`;
        const row = (id,title,body,media) => `<article class="story-row" id="${id}"><div class="story-description"><h3>${title}</h3>${body?`<p>${body}</p>`:''}</div><div class="story-evidence">${media}</div></article>`;

        function commissions() {
            const items = [
                ['alice','toy-alice',t('Mina 的布偶 Alice','Mina’s doll, Alice'),t("给脸颊补棉，用藏针合拢布边，再缝牢纽扣眼。","Pack the torn cheek, ladder-stitch the edges and fasten the button eye.")],
                ['panda','toy-panda',t('面包店的小国王','The bakery’s Little King'),t("挑回脱落的线圈，再分别固定耳朵、皇冠和亮片。","Recover the dropped loops, then secure the ear, crown and sequin.")]
            ];
            return `<section class="story-brief" aria-label="${t('两只玩偶的损伤','Damage to the two toys')}"><div class="story-commissions">${items.map(([id,key,name,desc])=>`<article><div><h3><a href="#${id}">${name}</a></h3><p>${desc}</p></div>${image(key,name)}</article>`).join('')}</div></section>`;
        }

        function props() {
            return `<section class="story-props" id="workshop-pieces"><h3>${t('工坊里的五件布艺道具','Five textiles at the repair desk')}</h3>${window.AliceWorkshopProps.render('game',lang)}</section>`;
        }

        function arrival() {
            const cards=[
                [image('sign-room',t('窗边的营业牌','The Open sign at the workshop window')),t('开窗营业','Open the shop'),t("开内窗、推木窗、挂牌。","Open both windows and hang the sign.")],
                [image('unwrap',t('沿纸箱接缝揭开胶带','Peeling the parcel tape')),t('拆开包裹','Unwrap the parcel'),t("沿盒盖接缝揭开纸胶带。","Peel the tape along the lid seam.")],
                [image('mina-note',t('Mina 写给修补师的来信','Mina’s letter to the mender')),t('Mina 的来信','Mina’s letter'),t('“请让她保留那一点歪歪的笑。”把来信钉上毛毡板。','“Please keep her crooked little smile.” Pin the request above the work mat.')],
                [`<div class="story-damage-pair">${image('torn-cheek',t('Alice 缺失的眼睛','Alice’s missing eye'))}${image('loose-ear',t('熊猫脱线的耳朵','Panda’s unravelling ear'))}</div>`,t('检查损伤','Inspect the damage'),t("找到脸颊裂口或掉针的耳朵。","Find the torn cheek or unravelled ear.")]
            ];
            return `<div class="story-arrival"><h3>${t('收件流程','Parcel intake')}</h3><ol class="illustrated-steps">${cards.map(([visual,title,body],i)=>`<li${i===2?' id="mina-letter"':''}>${visual}<div><h4>${title}</h4><p>${body}</p></div></li>`).join('')}</ol></div>`;
        }

        function transfer() {
            const rows=[
                [t('损伤','Damage'),t('纽扣眼脱落，脸颊开裂。','A lost button eye and a torn cheek.'),t('耳朵掉针，皇冠和亮片松脱。','Dropped ear loops and loose trimmings.')],
                [t('沿用的手艺','Shared repair'),t('补棉，再交替缝过两边布褶。','Add stuffing and ladder-stitch the cheek.'),t('用同一套填棉、藏针和收线动作闭合耳朵。','Refill the ear and close it with the same stitch.')],
                [t('新学的手艺','New skill'),t('配对扣孔，把新眼睛缝牢。','Pair the holes and fasten a new eye.'),t('逐行钩回线圈，再固定原来的配饰。','Hook up each dropped row and resew the trimmings.')],
            ];
            return `<section class="mending-transfer" id="commission-skills"><h3>${t('技能递进','Skill progression')}</h3><table><thead><tr><th scope="col">${t('委托','Commission')}</th><th scope="col">Alice</th><th scope="col">Panda</th></tr></thead><tbody>${rows.map(([key,a,b])=>`<tr><th scope="row">${key}</th><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table></section>`;
        }

        function ribbon() {
            return `<section id="alice-ribbon" class="mending-ribbon"><h3>${t('为什么修好眼睛，却留下旧缎带？','Why replace the eye and keep the ribbon?')}</h3>
                <div class="mending-triptych">
                ${figure('ribbon-original','手缝原作。蓝结垂在 Alice 的毛线头发旁。','On my hand-sewn doll, the blue bow falls across Alice’s yarn hair.')}
                ${figure('ribbon-at-desk','检查裂口时，玩家读到缎带褪色的折痕。它被解开又系上过许多次。','Examining the tear reveals a note about a faded fold. Someone has retied the ribbon many times.')}
                ${figure('ribbon-letter','修好后的回信揭晓了来历。缎带原是 Mina 最喜欢的裙子的腰带，外婆用她穿小的衣服缝成了 Alice。','After the repair, Mina reveals that the ribbon was her favourite dress sash. Her grandmother sewed Alice from clothes Mina had outgrown.')}
                </div></section>`;
        }

        function keyboardCheck() {
            const checks=[
                [t('已有三针','Three stitches'),t('再次入针，针位等待确认。','Enter the next hole. The entry is pending.')],
                [t('取消，仍是三针','Cancel · still three'),t('撤回这一针，可以重新找孔。','Withdraw and try the hole again.')],
                [t('出针，成为四针','Exit · four'),t('重新入针并出针，这一针才记入。','Enter again and exit to commit the fourth stitch.')],
                [t('暂停，回来仍是四针','Pause · still four'),t('打开提示记录再返回，继续缝。','Open the cue log, return and continue.')]
            ];
            return `<p>${t('两份委托都用原生键盘输入完成了这项检查。','Native keyboard input was checked on both commissions.')}</p><ol class="mending-flow">${checks.map(([name,result])=>`<li><strong>${name}</strong><span>${result}</span></li>`).join('')}</ol>`;
        }

        function trimming() {
            const options=[
                [t('靠近线结','Near the knot'),t('离结太近，剪刀停住。线尾完整，可以换一个位置。','Too close to the knot. The scissors stop and the whole tail stays intact.'),1],
                [t('留出短尾','Leave a short tail'),t('短线尾护住线结，这道收尾完成。','A short tail protects the knot. The repair can finish.'),8],
                [t('留下长尾','Leave a long tail'),t('剪刀合拢，剩下的线仍偏长。可以再剪一次，已经缝好的部分会保留。','The scissors close and leave a long tail. Trim it again. The stitches stay secure.'),19]
            ];
            const view=options.map(([name,why,mm],i)=>`<button type="button" data-cut="${i}" aria-controls="cut-result" aria-pressed="false"><span>${mm} mm</span> ${name}</button>`).join('');
            return `<section id="trim-a-tail" class="mending-trim"><h3>${t('剪线位置','Thread trimming')}</h3>
                <p>${t('收尾规则示意。选择落剪位置，看剩余线长怎样影响修补。','A diagram of the finishing rule. Choose a cut and see what happens to the tail.')}</p>
                <alice-tail-rule><div class="cut-track" aria-hidden="true"><span class="cut-knot"></span><span class="cut-thread"></span><i class="cut-mark cut-one"></i><i class="cut-mark cut-eight"></i><i class="cut-mark cut-nineteen"></i></div>
                <div class="cut-options" role="group" aria-label="${t('落剪位置','Cut position')}">${view}</div>
                <p class="cut-result" id="cut-result" aria-live="polite">${t('打结以后，游戏接受 3–12 mm 的线尾。','After knotting, the game accepts a 3–12 mm tail.')}</p>
                <ol class="cut-key">${options.map(([name,why,mm])=>`<li><strong>${mm} mm · ${name}</strong><span>${why}</span></li>`).join('')}</ol></alice-tail-rule>
                <a class="story-link" href="#repair-tension">${t('看实机剪线原声','Watch and hear the in-game cut')} ↗</a></section>`;
        }

        function needleLight() {
            return `<section id="needle-at-night" class="mending-needle"><div><h3>${t('针眼补光','Needle lighting')}</h3>
                <p>${t('22:00，钢针和黑线几乎融在一起，棉花已经够亮。仅调整材质后，针眼仍暗。穿针时加入一盏局部中性补光，桌面维持原来的亮度。','At 22:00, dark thread blended into the steel needle while the cotton was already bright. A material adjustment left the eye dim. A neutral fill light now comes on during threading alone.')}</p></div>
                <div class="needle-proof">${figure('needle-unlit','只调钢材，雨夜 22:00','Steel adjusted · rain at 22:00')}${figure('needle-bounce','穿针时打开局部补光，同机位','Local threading light · same camera')}</div></section>`;
        }

        function route(toy) {
            const entries=toy==='alice' ? [
                ['fill-cheek',t('补回脸颊','Pack the cheek')],['ladder-entry',t('缝合裂口','Close the tear')],['working-snip',t('收线打结','Tie off the seam')],
                ['button-tin',t('选一只新眼睛','Fit a new eye')],['button-set',t('缝上纽扣','Sew on the button')],['alice-reply',t('送 Alice 回家','Send Alice home')]
            ] : [
                ['loop-check',t('挑回线圈','Recover the loops')],['ear-seam',t('缝合耳朵','Close the ear')],['crown',t('缝回皇冠','Anchor the crown')],
                ['cheek-sequin',t('固定亮片','Secure the sequin')],['return-check',t('轻拉三处','Test three repairs')],['bakery-parcel',t('寄回面包店','Return to the bakery')]
            ];
            return `<alice-commission-route aria-label="${t('委托步骤','Commission steps')}"><ol>${entries.map(([id,title],i)=>`<li><button type="button" data-commission-step="${i}" aria-controls="${toy}-steps" aria-pressed="${i===0}"><svg class="repair-sketch" viewBox="0 0 76 55" fill="none" aria-hidden="true" focusable="false">${stepDrawings[id]}</svg><span>${title}</span></button></li>`).join('')}</ol></alice-commission-route>`;
        }

        function preparation(filling) {
            const steps=[
                ['cotton',image('cotton-bag',t('装着棉团的布袋','Bag of cotton'))+image('packing-stick',t('木质填充棒','Wooden packing stick')),t('补足脸颊','Pack the cheek'),t("取一小团棉，用填充棒轻压。","Press a tuft of cotton into the cheek.")],
                ['book',image('handbook',t('桌上的针法手册','The stitch handbook')),t('翻开针法手册','Read the stitch guide'),t("翻到藏针那一页。","Open the ladder-stitch page.")],
                ['rack',image('spool',t('挂着彩色线轴的线架','Spools on the thread rack')),t('选一根线','Choose a thread'),t("在线架上挑颜色。","Pick a colour from the rack.")],
                ['needle',image('pincushion',t('刺猬针插','Hedgehog pincushion')),t('拿起缝衣针','Pick up the needle'),t('从刺猬背上抽出一根针。','Lift a needle from the hedgehog’s back.')],
                ['eye',image('thread-eye',t('工作线与针眼近景','Thread tip at the eye')),t('穿过针眼','Thread the eye'),t('对准两次。第二次错过时，第一次仍然有效。','Align twice. A miss on the second pass keeps the first.')]
            ];
            const moves=[
                ['repair-stitch','ladder-entry',t('交替缝过布褶','Sew the tear'),t('在一边入针、出针，再换到另一边。','Enter and exit one fold, then cross to the other.')],
                ['repair-tension','tension-band',t('慢慢拉紧','Draw the seam closed'),t('让线尾在张力带里稳住，再松手。','Hold inside the tension band, then release.')],
                ['repair-loops','hook-tip',t('钩住脱落的线圈','Pick up a dropped loop'),t('钩尖进圈后转动，逐行挑回。','Turn the hook inside the loop and work back row by row.')]
            ];
            return `<div class="story-workmat"><section class="story-prep" id="before-first-stitch"><h3>${t('修补准备','Repair setup')}</h3><ol class="tool-thread">${steps.map(([key,visual,title,body])=>`<li class="prep-${key}"><div class="prep-object">${visual}</div><div class="prep-description"><h4>${title}</h4>${key==='eye'?image('thread-align',t('对准时确认穿针','Confirm when the thread aligns')):''}<p>${body}</p></div></li>`).join('')}</ol></section><div class="story-at-mat">${filling}<nav class="story-gestures" aria-label="${t('跳到修补动作','Jump to a repair gesture')}">${moves.map(([id,img,title,body])=>`<a href="#${id}"><img src="${root}${img}.webp" width="${pictures[img][0]}" height="${pictures[img][1]}" alt="" loading="lazy"><span><strong>${title}</strong><span>${body}</span></span></a>`).join('')}</nav></div></div>`;
        }

        function finishing() {
            const makeButton = crossed => `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="29" fill="#f4dfab" stroke="#946e34" stroke-width="1.5"/><circle cx="32" cy="32" r="24" fill="none" stroke="#b99051"/>${[[22,22],[42,22],[22,42],[42,42]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.7" fill="#493f30"/>`).join('')}<path d="${crossed?'M22 22L42 42 M42 22L22 42':'M22 22L22 42 M42 22L42 42'}" fill="none" stroke="#95422e" stroke-width="3.3" stroke-linecap="round"/></svg>`;
            const pairing = `<figure class="story-figure"><div class="story-button-options"><div>${makeButton(true)}<small>${t('对角孔','Opposite holes')}</small></div><div>${makeButton(false)}<small>${t('相邻孔','Adjacent holes')}</small></div></div><figcaption>${t('第一对孔决定交叉或平行走线','The first pair sets a cross or parallel bars.')}</figcaption></figure>`;
            return `<section class="story-finishing"><h3>${t('Alice 的新纽扣眼','How Alice gets her new eye')}</h3><div class="story-buttons">${figure('button-tin','从盒里选一颗纽扣','Pick a button from the tin')}${pairing}${figure('button-set','每对孔缝四次，轻拉检查','Sew each pair four times and gently tug.')}</div>
            ${row('repair-fasteners',t('缝回熊猫的旧配饰','Refit Panda’s original trimmings'),t("沿帽边缝四圈。亮片从中心向外缘缝三针。","Loop the crown hem four times. Anchor the sequin with three centre-to-rim stitches."),
                figures(figure('crown','皇冠底边与头顶布面','Crown hem against the head fabric'),figure('cheek-sequin','亮片中心孔与外缘布面','Sequin centre and outer fabric')))}</section>`;
        }

        function technical() {
            const ear = figure('ear-shells','近看熊猫耳缘，毛线从轮廓上微微凸出。','Yarn stands just proud of the ear’s outline in the sewing view.');
            const surface = figure('ear-surface','只绘制表面时的耳缘。','The same edge with surface shading alone.');
            const timing = `<table class="story-metrics"><caption>${t('Unity 编辑器实测 · 1920 × 1080 · 帧耗时中位数','Unity Editor · 1920 × 1080 · median frame time')}</caption>
                 <thead><tr>${[t('固定机位','Fixed camera'),t('关闭薄层','Shells off'),t('开启薄层','Shells on'),t('实际绘制','Shells drawn')].map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>
                 <tr><th scope="row">${t('缝纫近景','Sewing close-up')}</th><td>21.0 ms</td><td>25.9 ms</td><td>17</td></tr>
                 <tr><th scope="row">${t('工作台全景','Desk view')}</th><td>47.1 ms</td><td>47.9 ms</td><td>0</td></tr></tbody></table>`;
            return `<div class="story-block"><h3>${t('近景渲染','Close-up rendering')}</h3>
            ${row('panda-knit',t('熊猫耳缘的毛线','Yarn along Panda’s ear'),t("薄层随耳朵变形。镜头拉远，纱线厚度小于一像素时停绘。","Shells follow the ear mesh. They stop drawing when yarn thickness falls below one pixel."),figures(surface,ear)+timing)}
            ${row('feedback-knit',t('退到桌边，针脚仍然清楚','Keep the knit legible from the desk'),t("距离拉远时先淡去纱线捻纹，再减弱 V 形针脚的起伏。","At a distance, fine yarn twists fade first, followed by the relief of each V stitch."),figures(figure('knit-near','1,000 × 1,000 渲染的局部','Detail from a 1,000 × 1,000 render'),figure('knit-far','256 × 256 渲染的同一区域','Same area from a 256 × 256 render')))}
            ${row('dress-weave',t('蓝裙的 V 形线圈','V stitches in the blue dress'),t("把近似帆布的方格换成交扣的 V 形线圈。","Interlocking V stitches replace the canvas-like grid."),figures(figure('dress-grid','原来的方格织纹','Original square weave'),figure('dress-knit','交扣的 V 形线圈','Interlocking V stitches')))}
            ${row('thread-simulation',t('一根活动线的三个状态','A working thread in three states'),t("针尖与布面固定两端，中间用 28 个节点模拟下垂。82 个采样点绘出六边形线管。","Needle and cloth anchor the ends. Gravity bends 28 nodes. An 82-point tube renders the strand."),figures(figure('seam-thread','线连着针与布','Thread between needle and cloth'),figure('seam-cut','剪出工作线尾','Tail after the cut'),figure('seam-closed','收紧后的布边','Edges drawn together')))}
            ${row('cloth-hatching',t('浅色布面上的铅笔排线','Pencil hatching on pale cloth'),t("暗处出现斜向排线，亮处保留原布纹。","Diagonal strokes deepen the shade. The lit cheek keeps its weave."),figures(figure('cheek-before','调整前的下巴阴影','Chin shadow before adjustment'),figure('cheek-after','调整后的斜向排线','Diagonal strokes after adjustment')))}
            </div>`;
        }

        function reflection() {
            return row('window-reflection',t('跟着窗扇转动的倒影','A reflection that turns with the pane'),t("用三块色标检查转动的倒影。反射相机以半分辨率绘制，最长边 1,024 px。","Three markers track the turning reflection. The mirrored camera renders at half resolution, capped at 1,024 px."),figures(figure('pane-closed','关闭窗扇的测试画面','Test markers with the pane closed'),figure('pane-turned','窗扇转开后的倒影','Reflections as the pane turns')));
        }

        function feedback() {
            const holes=figures(figure('hole-entry','从下方亮起的扣孔入针','Enter the highlighted lower hole'),figure('hole-exit','从上方亮起的扣孔出针','Exit through the highlighted upper hole'),figure('hole-route','手册里的四孔交叉走线','Crossed four-hole path in the handbook'));
            const prompts=figures(figure('prompt-upper','150% 提示字号的上层动作卡','Upper action card at 150% prompt size'),figure('prompt-lower','下层时机卡里的“已对准”','“Aligned” on the lower timing card'));
            const inputs=figures(figure('controller-a','Xbox 的 A 键提示','Xbox A prompt'),figure('controller-cross','PlayStation 的叉号键提示','PlayStation Cross prompt'))+figure('feedback-log','F2 展开刚才的穿针提示。','F2 recalls the recent threading cues.');
            const sounds=[
                ['repair-stitch','felt-prick',t('针入布','Needle prick')],
                ['repair-fill','press-sound',t('棉花受压','Cotton press')],
                ['repair-tension','snip-sound',t('剪断线尾','Thread snip')]
            ];
            const foleyLinks=`<nav class="story-foley-links" aria-label="${t('到对应操作试听','Listen at each repair')}">${sounds.map(([id,photo,label])=>`<a href="#${id}"><img src="${root}${photo}.webp" width="${pictures[photo][0]}" height="${pictures[photo][1]}" alt="" loading="lazy"><span>${label} ↗</span></a>`).join('')}</nav>`;
            const room=figures(figure('scissor-pocket','剪刀放回布袋','Scissors in the tool pocket'),figure('window-sound','雨中的工坊窗户','Workshop window in the rain'),figure('speaker','窗台音箱','Speaker on the sill'));
            return `<div class="story-feedback">
            ${row('feedback-hole',t('让一个扣孔亮起来','Guide one buttonhole at a time'),t("每次只亮一个孔。点击最近的孔，或用键盘分别确认入针、出针。","One rim lights up. Click the nearest hole or confirm entry and exit on the keyboard."),holes)}
            ${row('feedback-timing',t('放大文字，仍看得见对准时机','Keep the timing cue in sight'),t("提示字号可调至 100%、125%、150%。从容模式会在对准时停住，等待确认。","Choose 100%, 125% or 150% text. Relaxed mode waits for confirmation once the target aligns."),prompts)}
            ${row('feedback-input',t('跟着手里的设备换键名','Match the prompt to the input device'),t("按实际输入切换键名，忽略摇杆漂移。F2 暂停并保留最近 40 条提示。","Prompts follow deliberate inputs and ignore stick drift. F2 pauses the repair and recalls 40 cues."),inputs)}
            ${row('feedback-foley',t('听针落下、棉花受压和剪刀合拢','Hear the stitch, press and snip'),'',foleyLinks)}
            ${row('feedback-room',t('分辨桌边与窗外的声音','Listen beyond the work mat'),t("拿放剪刀有独立音效。做针线时音箱降低音量。","The scissors sound on pickup and return. The speaker quietens during needlework."),room+link('window-video','试听同一场雨的三种窗扇状态','Hear the rain through three window positions'))}
            </div>`;
        }
        return {figure,commissions,props,arrival,route,preparation,finishing,technical,reflection,feedback,transfer,ribbon,trimming,needleLight,keyboardCheck};
    }

    let lastCut=null;
    class TailRule extends HTMLElement {
        connectedCallback() {
            const buttons=[...this.querySelectorAll('button[data-cut]')];
            const key=this.querySelectorAll('.cut-key li');
            const result=this.querySelector('.cut-result');
            const setCut=index=>{
                lastCut=index;
                buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
                this.dataset.selected=String(index);
                result.textContent=key[index].querySelector('span').textContent;
            };
            this.onclick=event=>{
                const button=event.target.closest('button[data-cut]');
                if(button)setCut(Number(button.dataset.cut));
            };
            if(lastCut!==null)setCut(lastCut);
        }
    }
    customElements.define('alice-tail-rule',TailRule);

    class CommissionRoute extends HTMLElement {
        connectedCallback() {
            this.onclick=event=>{
                const button=event.target.closest('[data-commission-step]');
                if(!button)return;
                const panels=this.closest('.section').querySelectorAll('.sequence-panel');
                window.AliceSequences.reveal(panels[Number(button.dataset.commissionStep)]);
            };
            const markStep=()=>{
                const panels=Array.from(this.closest('.section').querySelectorAll('.sequence-panel'));
                const current=panels.findIndex(panel=>!panel.hidden);
                this.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
            };
            this.observer=new MutationObserver(markStep);
            this.observer.observe(this.closest('.section'),{subtree:true,attributes:true,attributeFilter:['hidden'],childList:true});
        }
        disconnectedCallback(){this.observer?.disconnect();}
    }
    customElements.define('alice-commission-route',CommissionRoute);

    function pauseClips(except) {
        for (const audio of document.querySelectorAll('#play video, #play audio, #window-video')) {
            if (audio !== except && !audio.paused) audio.pause();
        }
    }
    document.addEventListener('play',event=>pauseClips(event.target),true);
    window.addEventListener('hashchange',()=>pauseClips());
    window.addEventListener('beforeprint',()=>pauseClips());
    window.AliceGameStory={forLanguage};
})();
