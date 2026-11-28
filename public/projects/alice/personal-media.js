// Overlay the personal site's controls without moving the source video.
// Its chapter buttons, subtitle tracks and playback position stay attached.
(() => {
  'use strict';

  const chinese = () => document.documentElement.lang.toLowerCase().startsWith('zh');
  const textilePage = document.body.dataset.page === 'toolkit' || /\/toolkit-slides\.html$/.test(location.pathname);
  document.body.classList.toggle('personal-textile-media', textilePage);

  function loadPoster(video) {
    if (!video.dataset.poster) return;
    video.poster = video.dataset.poster;
    delete video.dataset.poster;
    posters?.unobserve(video);
  }
  const posters = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) loadPoster(entry.target);
  }, {rootMargin: '360px 0px'}) : null;

  function dressVideo(video) {
    if (video.matches('.workshop-motion')) return;
    const host = video.parentElement;
    if (!host || host.classList.contains('personal-video-host')) return;

    if (video.dataset.poster) {
      if (posters) posters.observe(video);
      else loadPoster(video);
    }
    host.classList.add('personal-video-host');
    const film = host.classList.contains('admission-film-dialog');
    const frame = document.createElement('div');
    frame.className = 'personal-video-tools';
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'personal-yarn-play';
    const label = () => {
      const caption = video.getAttribute('aria-label') || host.querySelector('figcaption')?.textContent.trim() || '';
      play.setAttribute('aria-label', [chinese() ? '播放视频' : 'Play video', caption].filter(Boolean).join(' · '));
      const fallback = frame.querySelector('a');
      if (fallback) fallback.textContent = chinese() ? '打开视频' : 'Open video';
    };
    label();
    if (document.body.classList.contains('roomies-case')) {
      document.addEventListener('tinyroomies-language-change', label);
    }
    frame.append(play);
    video.after(frame);

    function showPlayback() {
      play.hidden = true;
      video.controls = true;
    }

    function showPaused() {
      play.hidden = false;
    }

    play.addEventListener('click', async () => {
      try {
        await video.play();
        video.focus({ preventScroll: true });
      } catch (error) {
        // Another clip can pause this one while a play request is pending.
        if (error.name !== 'AbortError') video.controls = true;
      }
    });
    video.addEventListener('play', showPlayback);
    video.addEventListener('pause', showPaused);
    video.addEventListener('ended', showPaused);
    video.addEventListener('error', () => {
      video.controls = true;
      if (film || frame.querySelector('a')) return;
      const source = video.currentSrc || video.querySelector('source')?.src;
      if (!source) return;
      const link = document.createElement('a');
      link.className = 'personal-video-file';
      link.href = source;
      link.textContent = chinese() ? '打开视频' : 'Open video';
      play.hidden = true;
      frame.append(link);
    });

    if (video.paused) video.controls = film;
    else showPlayback();
  }

  function scan(node) {
    if (!(node instanceof Element)) return;
    if (node.matches('video')) dressVideo(node);
    else node.querySelectorAll('video').forEach(dressVideo);
  }

  scan(document.body);
  // The reference replaces sections on language changes and opens its film
  // in a freshly constructed dialog. Decorate only new content.
  new MutationObserver(changes => {
    for (const change of changes) {
      for (const node of change.removedNodes) {
        if (node.nodeType !== 1 || node.isConnected) continue;
        if (node.matches('video[data-poster]')) posters?.unobserve(node);
        node.querySelectorAll('video[data-poster]').forEach(video => posters?.unobserve(video));
      }
      change.addedNodes.forEach(scan);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
