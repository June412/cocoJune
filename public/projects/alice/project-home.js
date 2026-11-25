(() => {
    function render(lang) {
        const en = lang === 'en';
        const t = (zh, english) => en ? english : zh;
        const media = window.ALICE_MEDIA.media;
        const model = {src:'assets/story-home/alice-character.webp', width:495, height:865};
        const url = project => project + '.html?lang=' + lang;

        function image(asset, alt, eager = false) {
            const previewWidth = Math.round(Math.min(720 / asset.width, 720 / asset.height, 1) * asset.width);
            const sizes = eager
                ? '(max-width: 850px) min(56vw, 375px), min(32vw, 395px)'
                : 'auto, (max-width: 600px) calc(100vw - 24px), min(52vw, 550px)';
            const responsive = asset.thumb ? `srcset="${asset.thumb} ${previewWidth}w, ${asset.src} ${asset.width}w" sizes="${sizes}"` : '';
            return `<img src="${asset.thumb || asset.src}" ${responsive} alt="${alt}" width="${asset.width}" height="${asset.height}" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
        }

        function portrait(asset, alt, caption, cls) {
            return `<figure class="${cls}"><button type="button" class="project-home-image" data-story-image="${asset.src}" data-caption="${caption}" aria-label="${t('放大','Enlarge')} · ${caption}">
                ${image(asset, alt, true)}</button><figcaption>${caption}</figcaption></figure>`;
        }

        function project(slug, name, asset, alt, question) {
            return `<article class="project-home-project"><a class="project-home-card" href="${url(slug)}#overview">
                <span class="project-home-cover">${image(asset, alt)}</span><h2>${name}</h2>
                <p class="project-home-question">${question}</p></a></article>`;
        }

        return `<header id="overview" class="project-home">
            <div class="project-home-intro">
                <div class="project-home-copy">
                    <h1>Textile Studio <span>&amp; Alice</span></h1>
                    <a class="project-home-byline" href="#making-credits" aria-label="${t('Junyan He · 查看制作与署名','Junyan He · view contributions and credits')}">Junyan He <span>· ${t('手作与交互设计','Handcraft &amp; interaction design')}</span></a>
                    <p class="project-home-lead">${t('我从亲手缝的 Alice 出发，设计了一套 Unity 布艺工具和一款修补心爱玩偶的游戏。','I sewed Alice by hand. She inspired a Unity tool for textile artists and a game about mending well-loved toys.')}</p>
                    <p>${t('我用工具缝出一本布面手册。在游戏里，玩家翻开它，学着为 Alice 缝好眼旁的裂口。','I made a cloth-bound handbook with the tool. In the game, you open that book to learn the stitch that closes the tear beside Alice’s eye.')}</p>
                    <div class="project-home-actions">${window.AliceAdmissions.film(lang,'home')}
                        <span class="project-home-routes"><a href="${url('toolkit')}#overview">${t('看布艺工具','Explore the toolkit')}</a>
                            <a href="${url('game')}#overview">${t('看修补游戏','Explore the game')}</a></span>
                    </div>
                </div>
                <div class="project-home-dolls">
                    ${portrait(media.alicePhysical,t('手中托着的 Alice，蓝缎带系在毛线头发上。','The cloth doll in my hand, a blue ribbon tied over her yarn hair.'),t('手缝原作','Hand-sewn original'),'project-home-hand')}
                    ${portrait(model,t('数字布偶的旧蓝缎带、黑纽扣和米白围裙。','The digital doll with her blue ribbon, black button eyes and cream apron.'),t('游戏角色','In-game character'),'project-home-model')}
                </div>
            </div>
            <div class="project-home-projects">
                ${project('toolkit','Textile Studio',media.workbench,t('绿色植物刺绣抱枕的 Unity 制作界面。','A botanical cushion in the Unity textile workbench.'),t('怎样让创作者在模型上缝一针，也能回头只改那一针？','How can an artist sew on a 3D model and still change a single stitch?'))}
                ${project('game','Alice · Mending Workshop',media.gameRoom,t('窗边的工坊和铺着缝制工作垫的修补桌。','The window-side workshop with a hand-stitched mat on the repair desk.'),t('修一只心爱的玩偶时，哪些旧痕迹值得留下？','What would you keep when mending a much-loved toy?'))}
            </div>
        </header>
        <section id="making-credits" class="making-credits" aria-labelledby="making-title">
            <h2 id="making-title">${t('制作与署名','Contributions & credits')}</h2>
            <dl>
                <dt>Junyan He</dt><dd>${t('手缝 Alice 原作，设计布艺工具的工作流程、两份修补委托和声音交互。我选定材质与画面，并在 Unity 中试玩、调整和验收。','I sewed the original Alice, designed the textile workflow, designed the two repair commissions and designed how sound responds to the player. I selected materials and reviewed the look and feel in Unity.')}</dd>
                <dt>${t('制作协作','Production')}</dt><dd>${t('Codex 辅助了 Blender 模型整理、Unity 场景和交互实现，以及自动化检查。窗外街景的天气与时段图使用了 AI 图像编辑。','I used Codex for Blender asset preparation, Unity scene and interaction implementation, and automated checks. The street backdrops use AI-assisted image edits for weather and time of day.')}</dd>
                <dt>${t('声音与试作','Sound & studies')}</dt><dd>${t('音乐为 Scott Buckley 的作品，修补声和环境声以署名音源剪辑、混音。《夜航》的帆船图案由一位同学设计，网页中的操作图在 Unity 中复现。','The music is by Scott Buckley. The repair sounds and ambience use edited and mixed source recordings. A classmate designed the boat in Night Crossing. The process images reconstruct the study in Unity.')} <a href="credits.txt">${t('录音与音乐署名','Audio and music credits')}</a></dd>
            </dl>
        </section>`;
    }
    window.AliceProjectHome = {render};
})();
