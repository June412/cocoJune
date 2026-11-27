(() => {
    'use strict';
    const media = 'assets/admissions/';
    const gameBuild = 'downloads/Alice-Workshop-macOS.zip';
    const chapters = [
        [0, '绣一只抱枕', 'Make a cushion'],
        [25, '道具进工坊', 'Furnish the workshop'],
        [34, '翻开针法手册', 'Open the handbook'],
        [41, '缝合 Alice 的裂口', 'Stitch Alice’s cheek'],
        [50, '轻轻收线', 'Pull the thread'],
        [60, '挑回熊猫的线圈', 'Recover Panda’s loops'],
        [67, '送 Alice 回家', 'Send Alice home']
    ];
    // The local-file edition cannot fetch sidecar tracks in every browser.
    // These are the original VTT cues, with the same timings and language.
    const subtitles = [
        [0, 8, '在白模上选一块绿色织物。', 'Choose a woven fabric on the blank cushion.'],
        [8, 19, '在毛毡上画出刺绣。', 'Draw the embroidery on the felt.'],
        [19, 25, '旋转成品，检查抱枕包边。', 'Rotate the finished cushion to inspect the edge.'],
        [25, 34, '工具包做出的五件道具摆进修补工坊。', 'Five Textile Studio props furnish the repair desk.'],
        [34, 41, '翻开刺绣手册，学习藏针缝。', 'The stitched handbook teaches the ladder stitch.'],
        [41, 50, '沿破口两侧交替入针，逐步缝合 Alice 的脸。', 'Alice’s torn cheek closes one stitch at a time.'],
        [50, 60, '轻拉收线，等张力稳住再松手。', 'Pull gently, settle the tension, then release.'],
        [60, 67, '换到 Panda，用钩针挑回耳朵上脱落的线圈。', 'Panda’s knit ear needs a hook to recover dropped loops.'],
        [67, 77, 'Alice 坐起来，头上的旧蓝缎带留了下来。', 'Alice sits up. Her old blue ribbon stays.']
    ];
    const clock = seconds => Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');

    function film(lang, context = 'home') {
        const en = lang === 'en';
        const start = context === 'game' ? 41 : 0;
        const text = start
            ? (en ? 'Watch the first stitch' : '看第一针怎么缝')
            : (en ? 'Watch the film · 77 sec' : '看 77 秒项目短片');
        return `<button type="button" class="admission-film-launch" data-admission-film="${start}" data-film-language="${en ? 'en' : 'zh'}" aria-haspopup="dialog"><span aria-hidden="true" class="admission-play-sign">▶</span><span>${text}</span></button>`;
    }

    function download(lang) {
        const en = lang === 'en';
        return `<div class="admission-game-download"><a href="${gameBuild}" download>${en ? 'Download the Mac demo' : '下载 Mac 试玩版'} <span aria-hidden="true">↓</span></a><span>${en ? '456 MiB · macOS 12+ · Intel / Apple silicon · 5 Nov 2026, unnotarized build' : '456 MiB · macOS 12 或更高版本 · Intel / Apple 芯片 · 2026 年 11 月 5 日构建，未经 Apple 公证'}</span></div>`;
    }

    function addCaptions(video, lang, start = 0, end = Infinity) {
        const languages = [['zh', '中文'], ['en', 'English']];
        for (const [index, [code, label]] of languages.entries()) {
            if ((Number.isFinite(end) || location.protocol === 'file:') && typeof VTTCue === 'function') {
                const track = video.addTextTrack('subtitles', label, code);
                for (const [from, to, zh, en] of subtitles) {
                    if (to > start && from < end) {
                        track.addCue(new VTTCue(Math.max(from, start) - start, Math.min(to, end) - start, index === 0 ? zh : en));
                    }
                }
                track.mode = code === lang ? 'showing' : 'disabled';
            } else {
                const track = document.createElement('track');
                Object.assign(track, {kind:'subtitles', label, srclang:code, src:media + 'demo-' + code + '.vtt', default:code === lang});
                video.append(track);
            }
        }
    }

    function openFilm(trigger) {
        const lang = trigger.dataset.filmLanguage;
        const en = lang === 'en';
        const dialog = document.createElement('dialog');
        dialog.className = 'admission-film-dialog';
        dialog.setAttribute('aria-labelledby', 'admission-film-title');
        dialog.innerHTML = `<header class="admission-film-mast"><h2 id="admission-film-title">${en ? 'From a cushion to a first stitch' : '从布艺抱枕到工坊里的第一针'}</h2><button type="button" class="admission-film-close" autofocus aria-label="${en ? 'Close film' : '关闭短片'}">×</button></header>
            <video controls playsinline preload="metadata" aria-label="${en ? 'Textile Studio and Alice, project film' : 'Textile Studio 与 Alice 项目实录'}"></video>
            <p class="admission-film-status" role="status" hidden></p>
            <div class="admission-film-chapters" role="group" aria-label="${en ? 'Jump to a moment' : '选择短片片段'}">
              ${chapters.map(([time, zh, english]) => `<button type="button" data-film-seek="${time}"><time>${clock(time)}</time> ${en ? english : zh}</button>`).join('')}
            </div>
            <footer>${download(lang)}
              <a class="admission-film-credit" href="${media}demo-audio-credits.txt" target="_blank" rel="noopener">${en ? 'Music & sound credits' : '音乐与音效署名'} ↗</a>
            </footer>`;
        document.body.append(dialog);
        const video = dialog.querySelector('video');
        video.src = media + 'studio-alice-demo.mp4';
        addCaptions(video, lang);
        const buttons = Array.from(dialog.querySelectorAll('[data-film-seek]'));
        let highlighted = -1;
        function highlight(time) {
            const current = chapters.reduce((found, [start], i) => time >= start ? i : found, 0);
            if (current === highlighted) return;
            buttons[highlighted]?.removeAttribute('aria-current');
            buttons[current].setAttribute('aria-current', 'time');
            highlighted = current;
        }
        let pending = null;
        function playFrom(seconds) {
            // Start within the first frame, after the previous subtitle has ended.
            const position = seconds > 0 && Number.isInteger(seconds) ? seconds + 0.015 : seconds;
            pending = video.readyState < HTMLMediaElement.HAVE_METADATA ? position : null;
            video.currentTime = position;
            highlight(seconds);
            video.play().catch(() => { /* Playback remains available via the native controls. */ });
        }
        video.addEventListener('loadedmetadata', () => {
            if (pending !== null) video.currentTime = pending;
            pending = null;
        });
        video.addEventListener('timeupdate', () => highlight(pending ?? video.currentTime));
        dialog.addEventListener('click', event => {
            const chapter = event.target.closest('[data-film-seek]');
            if (chapter) playFrom(Number(chapter.dataset.filmSeek));
            else if (event.target.closest('.admission-film-close')) dialog.close();
            else if (event.target === dialog) {
                const rect = dialog.getBoundingClientRect();
                if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
            }
        });
        dialog.addEventListener('close', () => {
            video.pause();
            bufferRequest.abort();
            if (bufferURL) URL.revokeObjectURL(bufferURL);
            dialog.remove();
            document.body.classList.remove('admission-film-open');
            if (trigger.isConnected) trigger.focus({preventScroll:true});
        }, {once:true});
        // A static host can advertise byte ranges yet fail a conditional seek.
        // For this short film, restore the chosen moment from a complete response.
        const bufferRequest = new AbortController();
        let bufferURL = null;
        let triedBuffer = false;
        const status = dialog.querySelector('.admission-film-status');
        function showFileLink() {
            status.hidden = false;
            status.innerHTML = `<a href="${media}studio-alice-demo.mp4" target="_blank" rel="noopener">${en ? 'Open the film file' : '打开短片文件'} ↗</a>`;
        }
        video.addEventListener('error', async () => {
            if (triedBuffer || !/^https?:$/.test(location.protocol)) {
                showFileLink();
                return;
            }
            triedBuffer = true;
            status.textContent = en ? 'Loading the film…' : '正在载入短片…';
            status.hidden = false;
            try {
                const response = await fetch(media + 'studio-alice-demo.mp4', {cache:'reload', signal:bufferRequest.signal});
                if (!response.ok) throw new Error(String(response.status));
                const blob = await response.blob();
                if (!dialog.open) return;
                const resumeTime = pending ?? video.currentTime;
                bufferURL = URL.createObjectURL(blob);
                for (const track of video.querySelectorAll('track')) track.remove();
                video.src = bufferURL;
                addCaptions(video, lang);
                status.hidden = true;
                playFrom(resumeTime);
            } catch (error) {
                if (error.name !== 'AbortError') showFileLink();
            }
        });
        // Stop a repair recording or a foley sample before starting another soundtrack.
        document.querySelectorAll('main video, main audio').forEach(clip => { if (!clip.paused) clip.pause(); });
        dialog.showModal();
        document.body.classList.add('admission-film-open');
        playFrom(Number(trigger.dataset.admissionFilm));
    }

    document.addEventListener('click', event => {
        const trigger = event.target.closest('[data-admission-film]');
        if (trigger && !document.querySelector('.admission-film-dialog[open]')) openFilm(trigger);
    });
    function addOpeningCaptions(video, lang, page) {
        if (page === 'game') addCaptions(video, lang, 25, 77);
        else addCaptions(video, lang, 0, 34);
    }
    window.AliceAdmissions = {film, download, addOpeningCaptions};
})();
