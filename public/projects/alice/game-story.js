/* Game captures from the project presentation, paired with their uncropped views. */
(() => {
    'use strict';
    const root = 'assets/story-game/';
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
        "manual-two-holes": [1600, 1072, "manual-two-holes"],
        "manual-four-holes": [1600, 1072, "manual-four-holes"],
        "manual-two-holes-en": [1600, 1072, "manual-two-holes-en"],
        "manual-four-holes-en": [1600, 1072, "manual-four-holes-en"],
        "ear-desk-off": [652, 318, "ear-desk-off"],
        "ear-desk-on": [652, 318, "ear-desk-on"],
        "needle-unlit": [312, 202, "needle-unlit-full"],
        "needle-bounce": [312, 202, "needle-bounce-full"]
    };
    const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

    function forLanguage(lang, sketch, captureWipe, gameSound) {
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
        const compare = (before, after, left, right) => {
            const [width, height] = pictures[before];
            const plate = (id,label) => `<img src="${root}${id}.webp" width="${pictures[id][0]}" height="${pictures[id][1]}" alt="${escape(label)}" loading="lazy" decoding="async">`;
            return captureWipe(plate(before,left),plate(after,right),left,right,width+'/'+height);
        };
        const bullets = (...items) => `<ul class="mending-points">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
        const row = (id,title,body,media) => `<article class="story-row" id="${id}"><div class="story-description"><h3>${title}</h3>${Array.isArray(body) ? bullets(...body) : `<p>${body}</p>`}</div><div class="story-evidence">${media}</div></article>`;
        const settingsTable = (headings, rows) => `<table class="mending-table"><thead><tr>${headings.map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${rows.map(([key,value]) => `<tr><th scope="row">${key}</th><td>${value}</td></tr>`).join('')}</tbody></table>`;

        function overview(originals) {
            const refs = [
                ['ref-restory','ReStory','© Mandragora',t('损伤决定修补的次序。','The damage sets the order of work.')],
                ['ref-assemble','Assemble with Care','© ustwo games',t('物件的来历由主人讲述。','The owner gives the object its history.')]
            ];
            return `<div class="overview-context"><div><h3>${t('Mina 的布偶','Mina’s doll')}</h3><p>${t('保留她的微笑和旧缎带，为缺失的眼睛挑一颗新纽扣。','Keep her smile and old ribbon. Choose a new button eye.')}</p>
                <h3>${t('生日熊猫','Birthday Panda')}</h3><p>${t('旧皇冠和脸颊亮片出现在历年的生日照里。补好耳朵，把原来的两件配饰都缝回去。','The crown and cheek sequin appear in years of birthday photos. Mend the ear and sew both originals back on.')}</p>${originals}</div>
                <section class="game-references"><h3>${t('设计参考','Design references')}</h3><div>${refs.map(([id,title,credit,note])=>`<figure><img src="${root}${id}.webp" width="180" height="132" alt="${escape(title)}" loading="lazy"><figcaption><strong>${title}</strong> ${note}<small>${credit}</small></figcaption></figure>`).join('')}</div></section></div>`;
        }

        function props() {
            return `<section class="story-props" id="workshop-pieces"><h3>${t('游戏中的五件 Toolkit 道具','Five Toolkit pieces in the game')}</h3>${window.AliceWorkshopProps.render('game',lang)}</section>`;
        }

        function arrival() {
            const cards=[
                [image('sign-room',t('窗边的营业牌','The Open sign at the workshop window')),t('开窗营业','Open the shop'),t("开内窗、推木窗、挂牌。","Open both windows and hang the sign.")],
                [image('unwrap',t('沿纸箱接缝揭开胶带','Peeling the parcel tape')),t('拆开包裹','Unwrap the parcel'),t("沿盒盖接缝揭开纸胶带。","Peel the tape along the lid seam.")],
                [image('mina-note',t('Mina 写给修补师的来信','Mina’s letter to the mender')),t('钉起来信','Pin the request'),t('读完委托清单，把来信钉上毛毡板。','Read the checklist and pin the request above the work mat.')],
                [`<div class="story-damage-pair">${image('torn-cheek',t('Alice 缺失的眼睛','Alice’s missing eye'))}${image('loose-ear',t('熊猫脱线的耳朵','Panda’s unravelling ear'))}</div>`,t('检查损伤','Inspect the damage'),t("找到脸颊裂口或掉针的耳朵。","Find the torn cheek or unravelled ear.")]
            ];
            return `<div class="story-arrival"><h3>${t('从收件到修补清单','From parcel to repair list')}</h3><ol class="illustrated-steps">${cards.map(([visual,title,body],i)=>`<li${i===2?' id="mina-letter"':''}>${visual}<div><h4>${title}</h4><p>${body}</p></div></li>`).join('')}</ol></div>`;
        }

        function transfer() {
            const rows=[
                [t('损伤','Damage'),t('纽扣眼脱落，脸颊开裂。','A lost button eye and a torn cheek.'),t('耳朵掉针，皇冠和亮片松脱。','Dropped ear loops and loose trimmings.')],
                [t('沿用的手艺','Shared repair'),t('补棉，再交替缝过两边布褶。','Add stuffing and ladder-stitch the cheek.'),t('用同一套填棉、藏针和收线动作闭合耳朵。','Refill the ear and close it with the same stitch.')],
                [t('新学的手艺','New skill'),t('配对扣孔，把新眼睛缝牢。','Pair the holes and fasten a new eye.'),t('逐行钩回线圈，再固定原来的配饰。','Hook up each dropped row and resew the trimmings.')],
            ];
            return `<section class="mending-transfer" id="commission-skills"><h3>${t('技能递进','Skill progression')}</h3><table><thead><tr><th scope="col">${t('委托','Commission')}</th><th scope="col">Alice</th><th scope="col">Panda</th></tr></thead><tbody>${rows.map(([key,a,b])=>`<tr><th scope="row">${key}</th><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table></section>`;
        }

        function keyboardCheck() {
            const checks=[
                ['needle-entry',t('已有三针','Three stitches'),t('再次入针，针位等待确认。','Enter the next hole. The entry is pending.')],
                ['undo-stitch',t('取消，仍是三针','Cancel · still three'),t('撤回这一针，可以重新找孔。','Withdraw and try the hole again.')],
                ['set-stitch',t('出针，成为四针','Exit · four'),t('重新入针并出针，这一针才记入。','Enter again and exit to commit the fourth stitch.')],
                ['pause-thread',t('暂停，回来仍是四针','Pause · still four'),t('打开提示记录再返回，继续缝。','Open the cue log, return and continue.')]
            ];
            return `<ol class="mending-flow">${checks.map(([icon,name,result])=>`<li>${sketch(icon)}<div><strong>${name}</strong><span>${result}</span></div></li>`).join('')}</ol>`;
        }

        function route(toy) {
            const entries=toy==='alice' ? [
                ['fill-cheek',t('补回脸颊','Pack the cheek')],['ladder-entry',t('缝合裂口','Close the tear')],['working-snip',t('收线打结','Tie off the seam')],
                ['button-tin',t('选一只新眼睛','Fit a new eye')],['button-set',t('缝上纽扣','Sew on the button')],['alice-reply',t('送 Alice 回家','Send Alice home')]
            ] : [
                ['loop-check',t('挑回线圈','Recover the loops')],['ear-seam',t('缝合耳朵','Close the ear')],['crown',t('缝回皇冠','Anchor the crown')],
                ['cheek-sequin',t('固定亮片','Secure the sequin')],['return-check',t('轻拉三处','Test three repairs')],['bakery-parcel',t('寄回面包店','Return to the bakery')]
            ];
            return `<alice-commission-route aria-label="${t('委托步骤','Commission steps')}"><ol>${entries.map(([id,title],i)=>`<li><button type="button" data-commission-step="${i}" aria-controls="${toy}-steps" aria-pressed="${i===0}"><img class="repair-sketch" src="assets/repair-sketches/${id}.png" width="192" height="192" loading="lazy" alt=""><span>${title}</span></button></li>`).join('')}</ol></alice-commission-route>`;
        }

        function preparation(filling) {
            const steps=[
                ['cotton',image('cotton-bag',t('装着棉团的布袋','Bag of cotton'))+image('packing-stick',t('木质填充棒','Wooden packing stick')),t('补足脸颊','Pack the cheek'),t("取一小团棉，用填充棒轻压。","Press a tuft of cotton into the cheek.")],
                ['book',image('handbook',t('桌上的针法手册','The stitch handbook')),t('翻开针法手册','Read the stitch guide'),t("翻到藏针那一页。","Open the ladder-stitch page.")],
                ['rack',image('spool',t('挂着彩色线轴的线架','Spools on the thread rack')),t('选一根线','Choose a thread'),t("在线架上挑颜色。","Pick a colour from the rack.")],
                ['needle',image('pincushion',t('刺猬针插','Hedgehog pincushion')),t('拿起缝衣针','Pick up the needle'),t('从刺猬背上抽出一根针。','Lift a needle from the hedgehog’s back.')],
                ['eye',image('thread-eye',t('工作线与针眼近景','Thread tip at the eye')),t('穿过针眼','Thread the eye'),t('对准两次。第二次错过时，第一次仍然有效。','Align twice. A miss on the second pass keeps the first.')]
            ];
            return `<div class="story-workmat"><section class="story-prep" id="before-first-stitch"><h3>${t('第一针之前','Before the first stitch')}</h3><ol class="tool-thread">${steps.map(([key,visual,title,body])=>`<li class="prep-${key}"><div class="prep-object">${visual}</div><div class="prep-description"><h4>${title}</h4>${key==='eye'?image('thread-align',t('对准时确认穿针','Confirm when the thread aligns')):''}<p>${body}</p></div></li>`).join('')}</ol></section><div class="story-at-mat">${filling}</div></div>`;
        }

        function tieOff() {
            return row('tie-off',t('收结工作线','Tie off the working thread'),t('留足线长，贴着布面打结，剪短线尾。','Leave enough thread for the knot. Tie against the cloth and trim the tail.'),figure('working-snip','剪出打结所需的工作线尾','Cutting the working strand'));
        }

        function finishing(buttonFilm) {
            const makeButton = crossed => `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="29" fill="#f4dfab" stroke="#946e34" stroke-width="1.5"/><circle cx="32" cy="32" r="24" fill="none" stroke="#b99051"/>${[[22,22],[42,22],[22,42],[42,42]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.7" fill="#493f30"/>`).join('')}<path d="${crossed?'M22 22L42 42 M42 22L22 42':'M22 22L22 42 M42 22L42 42'}" fill="none" stroke="#95422e" stroke-width="3.3" stroke-linecap="round"/></svg>`;
            const pairing = `<figure class="story-figure"><div class="story-button-options"><div>${makeButton(true)}<small>${t('对角孔','Opposite holes')}</small></div><div>${makeButton(false)}<small>${t('相邻孔','Adjacent holes')}</small></div></div><figcaption>${t('第一对孔决定交叉或平行走线','The first pair sets a cross or parallel bars.')}</figcaption></figure>`;
            const edition = lang === 'en' ? '-en' : '';
            return `<section class="story-finishing"><h3>${t('纽扣眼','Button eyes')}</h3>
                <div class="story-buttons">${figure('button-tin','从盒里选一颗纽扣','Pick a button')}${pairing}${figure('button-set','每对孔缝四次，再轻拉检查','Check the stitches after four passes per pair')}</div>
                <div class="manual-spreads"><h4>${t('缝补小册','Mending Notes')}</h4>
                ${figure('manual-two-holes'+edition,'双孔纽扣 · 沿同一对孔穿线四次。','Two-hole button · Four passes through one pair.')}
                ${figure('manual-four-holes'+edition,'四孔纽扣 · 每对孔各缝四次，可交叉或平行。','Four-hole button · Four passes per pair, crossed or parallel.')}</div>
                ${buttonFilm}
                ${row('repair-fasteners',t('缝回熊猫的皇冠与亮片','Refit Panda’s crown and sequin'),t('沿帽边缝四圈。亮片从中心向外缘缝三针，最后分别轻拉检查。','Loop the crown hem four times. Sew three centre-to-rim stitches on the sequin, then tug each repair.'),
                    figures(figure('crown','皇冠底边与头顶布面','Crown hem against the head fabric'),figure('cheek-sequin','亮片中心孔与外缘布面','Sequin centre and outer fabric')))}</section>`;
        }

        function technical(cheek, weather) {
            const timing = `<table class="story-metrics"><caption>${t('Unity 编辑器实测 · 1920 × 1080 · 帧耗时中位数','Unity Editor · 1920 × 1080 · median frame time')}</caption>
                 <thead><tr>${[t('固定机位','Fixed camera'),t('关闭薄层','Shells off'),t('开启薄层','Shells on'),t('实际绘制','Shells drawn')].map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>
                 <tr><th scope="row">${t('缝纫近景','Sewing close-up')}</th><td>21.0 ms</td><td>25.9 ms</td><td>17</td></tr>
                 <tr><th scope="row">${t('工作台全景','Desk view')}</th><td>47.1 ms</td><td>47.9 ms</td><td>0</td></tr></tbody></table>`;
            const closeEar = compare('ear-surface','ear-shells',t('近景 · 表面着色','Close, surface shading'),t('近景 · 毛线轮廓','Close, yarn breaks the outline'));
            const deskEar = compare('ear-desk-off','ear-desk-on',t('工作台 · 关闭薄层','Desk, shells disabled'),t('工作台 · 开启薄层','Desk, shells enabled'));
            const knit = compare('dress-grid','dress-knit',t('方格织纹','Square weave'),t('交扣的 V 形针脚','Interlocking V stitches'));
            const reflection = compare('pane-closed','pane-turned',t('窗扇关闭','Closed pane'),t('窗扇转开','Turned pane'));
            const hatching = compare('cheek-before','cheek-after',t('调整前 · 柔和阴影','Before, soft shadow'),t('调整后 · 铅笔排线','After, pencil strokes'));
            const needle = compare('needle-unlit','needle-bounce',t('仅调节钢材','Steel adjustment'),t('开启针眼补光','Local threading light'));
            return `<div class="story-block technical-plates">
            ${row('panda-knit',t('01 熊猫的针织耳朵','01 Panda’s knitted ear'),[
                t('近景：从针织高度图裁出薄层，画出耳缘的毛线。','Close-up · Shells cut from the knit height map give the ear a fuzzy edge.'),
                t('远景：纱线细于一个屏幕像素时，薄层淡出，露出基础织纹。','Desk view · Below one pixel, the shells fade into the underlying knit.')
            ],`<div class="compare-pair">${closeEar}${deskEar}</div>${timing}`)}
            ${row('dress-weave',t('02 针织连衣裙','02 A knit dress'),[
                t('近看能分辨交扣的 V 形针脚和纱线捻纹。','Up close, the interlocking V stitches show the twist of the yarn.'),
                t('拉远时先淡去捻纹，再减弱针脚起伏。','At a distance, yarn twist fades first, then stitch relief.')
            ],`<div class="compare-pair">${knit}<div id="feedback-knit">${compare('knit-near','knit-far','1,000 × 1,000','256 × 256')}</div></div>`)}
            ${row('thread-simulation',t('03 工作线','03 The working thread'),[
                t('两端固定在布面和针上，28 个节点随重力下垂。','Between cloth and needle, 28 points sag under gravity.'),
                t('沿线取 82 个采样点，绘制一根立体线管。','An 82-point tube gives the strand its visible thickness.')
            ],figures(figure('seam-thread','工作线','Working thread'),figure('seam-cut','剪出的线尾','Cut tail'),figure('seam-closed','合拢的缝口','Seam drawn in')))}
            ${row('window-reflection',t('04 转动的倒影','04 Moving reflections'),[
                t('用三块色标观察倒影是否跟随窗扇。','Three colour markers track the reflection as the pane turns.'),
                t('镜像相机使用半分辨率，最长边 1,024 像素。','The mirror camera renders at half resolution, up to 1,024 px.')
            ],reflection)}
            ${row('cloth-hatching',t('05 浅色布面上的排线','05 Hatching on pale cloth'),[
                t('脸颊亮部保留织纹，下巴暗部叠加铅笔排线。','The lit cheek shows the weave. Pencil hatching follows the shadow under the chin.'),
                t('针位记在未形变的布面上，填棉后仍能沿裂口落针。','Needle contacts stay on the undeformed cloth so stitches follow the seam after stuffing.')
            ],hatching)}
            </div><div class="lighting-studies" id="workshop">${cheek}
            <section id="needle-at-night"><h4>${t('针眼补光','Needle lighting')}</h4>${needle}<p>${t('雨夜 22:00，只在穿针时补一盏中性光，让黑线与钢针分开。','At 22:00 on a rainy night, a local fill separates dark thread from steel during threading.')}</p></section></div>${weather}`;
        }

        function feedback(recording) {
            const holes=figures(figure('hole-entry','从下方亮起的扣孔入针','Enter the highlighted lower hole'),figure('hole-exit','从上方亮起的扣孔出针','Exit through the highlighted upper hole'),figure('hole-route','手册里的四孔交叉走线','Crossed four-hole path in the handbook'));
            function soundRow(id,title,visual,players) {
                return `<article class="sound-study" id="${id}"><div><h3>${title}</h3>${visual}</div><div class="audio-stack">${players}</div></article>`;
            }
            const mat = soundRow('feedback-foley',t('工作垫上的声音','Sounds at the work mat'),
                figures(figure('felt-prick','针尖入布，随后是线的摩擦声','A prick, then thread rubbing on cloth'),figure('press-sound','棉花让敲击声变闷','Cotton muffles the tap'),figure('snip-sound','刀刃碰到线时发出剪切声','A snip as the blades meet the thread')),
                gameSound('needle-prick','针尖入布','Needle prick')+gameSound('cotton-press','填充棒压棉','Packing stick')+gameSound('scissor-snip','剪线','Scissor snip'));
            const desk = soundRow('feedback-room',t('工坊里的声音','Sounds around the desk'),
                figures(figure('scissor-pocket','工具归袋和盒盖合上各有轻响','Pocket and tin make distinct clicks'),figure('window-sound','推开窗扇，雨声更近','Open the panes to bring the rain closer'),figure('speaker','做针线时，音乐自动变轻','Music dips during needlework')),
                gameSound('tool-return','工具归袋','Tool return')+gameSound('button-tin','纽扣盒盖','Button tin lid')+gameSound('rain-window','窗扇开合时的雨声','Rain through the window')+gameSound('speaker-simplicity','音箱 · Simplicity（节选）','Speaker · Simplicity (excerpt)')+
                `<small class="sound-credit">Scott Buckley · CC BY 4.0 · <a href="credits.txt">${t('录音署名','Recording credits')}</a></small>`);
            return `<div class="cue-studies">
                <article class="cue-panel" id="feedback-hole"><div><h3>${t('扣孔提示','Buttonhole cues')}</h3>${bullets(
                    t('亮起的孔缘标出下一针。点击最近的孔即可落针。','The lit rim marks the next hole. Click the nearest hole to stitch.'),
                    t('键盘分别确认入针和出针，手册显示两孔之间的走线。','On the keyboard, confirm entry and exit separately. The handbook shows the path between them.')
                )}</div>${holes}</article>
                ${mat}${desk}<div class="desk-recording">${recording}</div></div>`;
        }

        function accessibility(stitch, comfort) {
            const options = settingsTable([t('设置','Setting'),t('游戏表现','In the game')],[
                [t('提示字号','Prompt size'),t('100%、125%、150%。动作卡始终在时机卡上方。','100%, 125% or 150%. The action card stays above the timing card.')],
                [t('从容模式','Relaxed timing'),t('针或钩尖对准后，等待玩家确认。','The aligned needle or hook waits for confirmation.')],
                [t('减少动态','Reduced motion'),t('直接切到特写，同时展示两种走线。','Cut straight to the close-up and show both stitch paths together.')]
            ]);
            const controls = settingsTable([t('操作','Input'),t('反馈','Response')],[
                [t('手柄按键','Controller button'),t('按键名跟随实际使用的手柄，忽略摇杆漂移。','Labels follow the controller in use. Stick drift leaves them unchanged.')],
                ['F2',t('暂停修补，回看最近的操作提示，最多 40 条。','Pause the repair and review up to 40 recent cues.')],
                [t('关闭记录','Close the log'),t('保留当前针数，从同一针继续。','Keep the stitch count and resume where you paused.')]
            ]);
            const prompts = figures(figure('prompt-upper','动作提示 · 150%','Action prompt at 150%'),figure('prompt-lower','时机提示 · 已对准','Timing cue · Aligned'));
            const inputs = figures(figure('controller-a','Xbox · A','Xbox · A'),figure('controller-cross','PlayStation · 叉号键','PlayStation · Cross'));
            return `<div class="cue-studies">
                <article class="cue-panel" id="feedback-timing"><div><h3>${t('显示与操作时机','Display & timing')}</h3>${options}</div>
                    <div class="settings-evidence">${prompts}${comfort}</div></article>
                <article class="cue-panel" id="feedback-input"><div><h3>${t('输入与提示记录','Input & cue history')}</h3>${controls}</div>
                    <div class="input-evidence">${inputs}${figure('feedback-log','提示记录里的穿针反馈','Threading cue in the feedback log')}</div></article>
                <article class="cue-panel keyboard-panel" id="thread-state"><div><h3>${t('键盘修补','Keyboard repair')}</h3>
                    <p>${t('Alice 和熊猫两份委托都用键盘验证了以下步骤。','Tested with keyboard input on both Alice and Panda.')}</p>${keyboardCheck()}</div>${stitch}</article>
            </div>`;
        }
        return {figure,overview,props,arrival,route,preparation,tieOff,finishing,technical,feedback,accessibility,transfer};
    }

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
