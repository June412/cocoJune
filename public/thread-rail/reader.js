/* One reading rail for the standalone case studies and the hash-routed portfolio. */
(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src);
  const paths = {"01":[71.2,70.4,69.4,67.8,65.5,63.1,60.3,57.0,54.1,50.8,47.1,43.7,40.2,36.5,32.9,29.7,26.5,23.1,20.3,17.6,15.0,13.1,11.3,9.8,8.6,7.7,7.2,6.8,7.0,7.2,8.1,9.0,10.2,11.9,14.0,16.0,18.7,21.7,24.7,28.1,31.9,35.5,39.4,43.4,46.9,50.7,54.5,58.0,61.6,64.8,68.0,71.0,73.6,76.2,78.6,80.7,83.1,84.7,86.3,87.8,89.3,90.3,91.0,91.9,92.3,92.6,92.7,92.4,92.2,91.3,90.7,89.6,88.4,87.0,85.3,83.5,81.3,79.1,76.8,74.2,71.6,68.8,65.9,62.6,59.9,56.5,53.4,50.3,47.1,43.8,41.0,38.2,35.5,33.4,31.4,29.6,27.9,26.5,25.5,24.6,24.1,23.6,23.7,24.0,24.5,25.2,26.2,27.3,28.9,30.5,32.3,34.2,36.5,38.5,40.7,43.2,45.2,47.1,48.7,50.4,51.6,52.3,52.9,52.9,52.6,51.5,49.9,47.4,44.8],"02":[84.7,83.3,81.7,79.6,77.4,75.5,72.8,69.2,64.1,58.6,51.6,43.1,33.5,25.9,20.1,14.9,11.1,8.8,8.0,8.3,9.7,13.1,17.8,25.0,34.5,47.5,61.1,73.2,80.7,85.7,88.9,91.2,92.0,92.2,91.7,90.5,88.9,86.8,84.3,81.9,79.3,76.5,73.5,70.7,67.7,64.9,61.7,59.2,56.7,54.6,52.5,50.8,49.2,47.9,47.1,46.2,45.8,45.5,45.3,45.3,45.3,45.4,45.8,46.3,47.1,47.9,48.9,50.0,51.2,52.8,54.4,55.9,57.8,59.5,60.9,62.4,64.0,65.3,66.5,67.7,68.9,69.7,70.1,70.6,70.8,71.1,71.1,70.8,70.4,69.8,69.1,68.1,67.0,65.7,64.5,63.0,61.5,60.0,58.4,57.0,55.3,53.8,52.2,50.8,49.6,48.4,47.5,46.8,46.4,46.0,46.0,46.3,46.8,47.7,48.9,50.3,52.0,54.0,56.2,58.3,60.8,63.3,65.8,68.3,70.7,73.4,75.4,77.3,77.4],"04":[86.0,85.4,84.6,83.4,82.1,80.3,78.5,76.9,74.6,72.5,70.3,67.9,65.3,62.8,60.0,57.4,54.8,51.9,49.1,46.4,43.3,40.4,37.6,34.7,31.9,29.4,26.9,24.7,22.8,20.9,19.1,17.8,16.6,15.6,14.9,14.3,14.3,14.4,15.1,16.0,17.1,18.6,20.5,22.4,25.4,28.0,30.8,34.1,37.4,40.8,44.4,48.0,51.3,54.7,57.5,60.2,62.5,64.4,66.0,67.1,67.7,68.0,67.8,67.2,66.0,64.5,62.9,60.0,57.4,53.8,49.7,45.3,40.4,34.9,30.2,24.9,20.0,16.3,12.9,10.1,8.3,6.9,6.1,6.3,7.0,8.5,10.5,13.2,16.9,21.0,26.2,32.3,38.1,44.7,51.3,56.7,62.2,67.5,71.7,76.0,79.8,82.6,85.5,88.0,89.9,91.6,92.9,93.7,94.0,93.9,93.3,92.1,90.3,88.0,85.1,81.8,78.2,74.5,70.4,66.7,63.3,59.9,57.8,55.7,54.1,53.5,53.7,54.9,56.7],"06":[92.5,90.8,86.5,82.9,79.1,75.5,72.4,69.0,65.8,63.0,60.1,57.1,54.7,52.7,50.7,49.2,48.0,47.2,46.9,47.0,47.6,48.7,50.4,52.6,54.9,57.4,60.4,63.0,65.5,67.8,69.5,70.7,71.3,71.2,70.5,68.8,66.8,63.7,59.5,53.0,50.4,57.8,59.1,59.5,59.2,57.9,56.1,53.6,50.6,47.0,43.5,39.9,35.9,32.5,29.5,26.5,23.9,21.9,20.4,19.1,18.4,18.0,18.4,19.0,19.8,21.4,23.2,25.8,28.5,31.5,34.9,38.6,41.7,45.1,48.6,51.4,54.4,57.1,59.6,61.6,63.4,64.9,66.2,67.2,67.8,68.1,68.2,68.0,67.4,66.3,65.1,63.6,62.1,60.2,58.1,55.8,53.5,51.0,48.3,46.0,43.3,40.6,38.5,36.1,33.9,32.0,30.2,28.5,27.4,26.2,25.4,25.0,24.9,25.2,26.0,27.2,28.7,30.7,33.2,36.5,39.8,44.1,49.3,54.4,59.5,63.7,65.4,64.5,62.1]};
  // Assigned once across the portfolio. Bookmarks and language changes use the same yarn.
  const projectYarns = {
    tinyroomies: '02',
    alice: '04',
    'textile-toolkit': '06',
    'between-sips': '01',
    'perspective-freeze': '04',
    'x-ray': '02',
    holdlight: '01',
    'opengl-2d-greeting-card': '02',
    'reality-link-cyber-travel': '06'
  };
  const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

  function mount(host, article, chapters, language, route = '') {
    const entries = chapters.map(([id, en, zh, shortEn, shortZh]) => ({
      id, node: document.getElementById(id), label: language === 'zh' ? zh : en,
      short: language === 'zh' ? shortZh || zh : shortEn || en
    })).filter(entry => entry.node && article.contains(entry.node));
    if (!entries.length) return () => {};
    entries.forEach(entry => entry.node.classList.add('thread-chapter'));
    const variant = projectYarns[host.dataset.project] || '01';
    const sample = paths[variant];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const nav = document.createElement('nav');
    nav.className = 'thread-nav';
    nav.dataset.yarn = variant;
    const zh = language === 'zh';
    nav.setAttribute('aria-label', zh ? '项目章节' : 'Project chapters');
    nav.lang = zh ? 'zh-CN' : 'en';
    const strand = document.createElement('div');
    strand.className = 'thread-strand';
    strand.style.setProperty('--yarn-art', 'url("' + new URL('yarn-' + variant + '.webp', base) + '")');
    strand.setAttribute('role', 'progressbar');
    strand.setAttribute('aria-label', zh ? '阅读进度' : 'Reading progress');
    strand.setAttribute('aria-valuemin', '0');
    strand.setAttribute('aria-valuemax', '100');
    const button = document.createElement('img');
    button.className = 'thread-button';
    button.src = new URL('button.webp', base);
    button.alt = '';
    strand.append(button);
    const list = document.createElement('ol');
    const links = entries.map(entry => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = route + '#' + entry.id;
      link.setAttribute('aria-label', entry.label);
      link.title = entry.label;
      for (const [className, label] of [['thread-full', entry.label], ['thread-short', entry.short]]) {
        const span = document.createElement('span');
        span.className = className;
        span.textContent = label;
        link.append(span);
      }
      item.append(link);
      list.append(item);
      return link;
    });
    nav.append(strand, list);
    host.replaceChildren(nav);
    let active = -1, frame = 0, measureNeeded = true, stops = [], positions = [], end = 0;
    let destination, lastAim = 0, settleTimer = 0;
    function release() {
      destination = null;
      clearTimeout(settleTimer);
    }
    function aimAt(entry) {
      return entry === entries[0] ? 0 : Math.max(0, entry.node.getBoundingClientRect().top + scrollY - Math.min(126, innerHeight * .18 - 2));
    }
    // A model or gallery above the destination may acquire its dimensions during the jump.
    // Correct that displacement only while the reader is still following the chosen link.
    function settle() {
      if (!destination) return;
      const top = aimAt(destination);
      if (Math.abs(top - lastAim) > 1) {
        lastAim = top;
        scrollTo({top, behavior: 'instant'});
      }
      clearTimeout(settleTimer);
      settleTimer = setTimeout(release, 1500);
    }
    function measure() {
      const box = host.getBoundingClientRect();
      const availableHeight = document.documentElement.clientHeight;
      const height = Math.max(128, Math.min(600, Math.max(innerWidth <= 700 ? 332 : 410, entries.length * 85 + 26), availableHeight * (innerWidth <= 700 ? .55 : .68)));
      nav.style.height = height + 'px';
      nav.style.width = box.width + 'px';
      nav.style.left = box.left + 'px';
      nav.style.top = clamp(box.top + scrollY, 12, Math.max(12, availableHeight - height - 18)) + 'px';
      // Labels occupy their real wrapped heights. The fibre continues past the final label.
      const railBox = strand.getBoundingClientRect();
      positions = links.map(link => {
        const rect = link.getBoundingClientRect();
        return clamp((rect.top + rect.height / 2 - railBox.top) / railBox.height, 0, 1);
      });
      const readingLine = Math.min(128, availableHeight * .18);
      stops = entries.map(({ node }) => Math.max(0, node.getBoundingClientRect().top + scrollY - readingLine));
      stops[0] = 0;
      end = Math.max(1, document.documentElement.scrollHeight - availableHeight);
      settle();
    }
    function paint() {
      frame = 0;
      if (measureNeeded) { measure(); measureNeeded = false; }
      const y = Math.max(0, scrollY);
      let i = 0;
      while (i + 1 < stops.length && y + 2 >= stops[i + 1]) i++;
      if (y > 0 && y >= end - 2) i = entries.length - 1;
      if (i !== active) {
        if (active >= 0) links[active].removeAttribute('aria-current');
        links[i].setAttribute('aria-current', 'location');
        active = i;
      }
      const nextY = Math.min(end, stops[i + 1] ?? end);
      const fraction = y >= end - 1 ? 1 : clamp((y - stops[i]) / Math.max(1, nextY - stops[i]), 0, 1);
      const p = positions[i] + ((positions[i + 1] ?? .986) - positions[i]) * fraction;
      const index = clamp(p * (sample.length - 1), 0, sample.length - 1);
      const left = Math.floor(index);
      const x = sample[left] + (sample[Math.min(left + 1, sample.length - 1)] - sample[left]) * (index - left);
      strand.style.setProperty('--thread-y', (p * 100).toFixed(2) + '%');
      strand.style.setProperty('--thread-x', x.toFixed(2) + '%');
      const percent = String(Math.round(clamp(y / end, 0, 1) * 100));
      if (strand.getAttribute('aria-valuenow') !== percent) strand.setAttribute('aria-valuenow', percent);
    }
    function queue() { if (!frame) frame = requestAnimationFrame(paint); }
    function resize() { measureNeeded = true; queue(); }
    function follow(link, smooth) {
      const entry = entries[links.indexOf(link)];
      entry.node.setAttribute('tabindex', '-1');
      entry.node.focus({ preventScroll: true });
      destination = entry;
      lastAim = aimAt(entry);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(release, 2200);
      scrollTo({ top: lastAim, behavior: smooth && !reduced.matches ? 'smooth' : 'instant' });
    }
    nav.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.href !== link.href) {
        try { history.pushState(null, '', link.href); } catch { location.hash = link.hash; }
      }
      follow(link, true);
    });
    function bookmark() {
      const link = links.find(link => link.hash === location.hash);
      if (link) follow(link, false);
      else if (route && location.hash.startsWith(route + '#')) {
        document.getElementById(location.hash.slice(route.length + 1))?.scrollIntoView();
      }
    }
    const resizeObserver = new ResizeObserver(resize);
    for (const element of [host, article, document.body, ...links, ...entries.map(entry => entry.node)]) resizeObserver.observe(element);
    const reveal = new IntersectionObserver(records => {
      for (const record of records) {
        if (!record.isIntersecting) continue;
        reveal.unobserve(record.target);
        if (!reduced.matches && record.boundingClientRect.top > 0) {
          record.target.animate([{ opacity: .68, transform: 'translateY(7px)' }, { opacity: 1, transform: 'none' }],
            { duration: 500, easing: 'cubic-bezier(.18,.7,.22,1)' });
        }
      }
    }, { rootMargin: '0px 0px -5% 0px' });
    article.querySelectorAll('h2, .story-lead, .section-head + .section-body > .prose:first-child').forEach(node => reveal.observe(node));
    let folded = [];
    function printNotes() {
      folded = [...article.querySelectorAll('.case-notes details:not([open])')];
      folded.forEach(note => { note.open = true; });
    }
    function restoreNotes() { folded.forEach(note => { note.open = false; }); folded = []; }
    window.addEventListener('beforeprint', printNotes);
    window.addEventListener('afterprint', restoreNotes);
    const inputEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    inputEvents.forEach(type => window.addEventListener(type, release, { passive: true, capture: true }));
    window.addEventListener('scrollend', settle);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('hashchange', bookmark);
    window.addEventListener('pageshow', resize);
    paint();
    const initial = route ? requestAnimationFrame(bookmark) : 0;
    return () => {
      window.removeEventListener('beforeprint', printNotes);
      window.removeEventListener('afterprint', restoreNotes);
      cancelAnimationFrame(initial);
      cancelAnimationFrame(frame);
      inputEvents.forEach(type => window.removeEventListener(type, release, true));
      window.removeEventListener('scrollend', settle);
      release();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('hashchange', bookmark);
      window.removeEventListener('pageshow', resize);
      resizeObserver.disconnect();
      reveal.disconnect();
      nav.remove();
    };
  }
  window.ProjectThread = { mount };
})();
