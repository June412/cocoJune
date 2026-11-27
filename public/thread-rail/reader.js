/* One reading rail for the standalone case studies and the hash-routed portfolio. */
(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src);
  const paths = {"01":[67.9,67.4,67.1,67,67.1,67.2,67.7,68.3,69,70.1,71.2,72.5,73.8,75.2,77,78.5,79.9,81.4,82.8,84.1,85.2,86.1,87,87.7,88.5,88.7,88.9,88.9,88.8,88.6,88,87.4,86.3,85.5,84.4,83.6,82.3,81.2,79.8,78.7,77.4,76.1,74.6,73.3,71.8,70.6,69.2,67.8,65.7,63.4,60.2,57.1,53.8,50.5,46.6,43,38.9,35.5,31.5,28.2,24.7,21.7,18.7,16.4,14.2,12.4,11,10,9.3,8.9,9.1,9.5,10.4,11.5,13,15,17.2,19.9,23,26.2,30.2,33.9,37.6,42,45.7,50,53.7,57.6,61.4,65,68,71.2,73.7,76.4,78.8,81.1,83,84.8,86.3,87.6,88.6,89.6,90.1,90.5,90.6,90.3,90,89.1,88.3,87,85.6,84,82,79.7,77.4,74.8,72.3,69.2,66.3,63,60,56.1,53.2,49.6,46.3,43,40.2,37.2,34.9,32.4,30.6,28.9,27.5,26.4,25.5,25.1,25,25.2,25.7,26.4,27.5,28.8,30.4,32.2,34.3,36.5,38.6,41.2,43.4,45.8,47.8,49.7,51,52.1,52.7,52.8,52.5,51.3,49.5,46.3,45],"02":[58.4,59.8,61.1,62.4,63.7,65.1,66.5,67.7,68.7,69.9,70.9,72.2,73.2,74.2,75.4,76.3,77.4,78.4,79.4,80.5,81.6,82.7,83.5,84.6,85.8,86.5,87.4,88,88.6,89,89.4,89.4,89.4,89.2,89,88.4,87.7,87.1,86.2,85.1,83.9,82.6,81.3,79.6,78,76.1,74.2,72.4,70.4,68,66.3,64.5,62.6,60.5,57.3,53.3,48.8,42.3,34.4,26.3,19.9,15.3,11.6,9.5,8.8,9.4,11.2,14.7,20.1,28.7,40.6,52.5,61.6,67.7,71.3,73.4,74.4,74.6,73.9,72.6,71.1,69.1,67,64.4,61.9,59.5,56.8,54.2,51.5,49.1,47,45.1,43.3,41.6,40.4,39.5,38.7,38.3,38,37.9,37.8,37.9,38.3,38.7,39.4,40.2,41.1,42.1,43.4,44.8,46.2,47.8,49.3,50.6,52,53.2,54.4,55.5,56.5,57.1,57.5,57.8,58,57.9,57.8,57.5,56.9,56,55.1,54.2,52.9,51.4,50.1,48.9,47.6,46.1,44.7,43.3,42,41,40.1,39.4,38.9,38.5,38.5,38.7,39.5,40.3,41.3,42.9,44.6,46.6,48.6,50.8,52.9,55.4,57.6,59.9,61.7,63.3,63.2],"04":[74.5,75.4,76.4,77.5,78.7,80.1,81.3,82.8,84.2,85.3,86.5,87.7,88.6,89.5,90.3,90.8,91.2,91.5,91.6,91.6,91.3,90.9,90.3,89.5,88.8,87.9,87.1,86.1,85,83.9,82.8,81.7,80.4,79.2,77.9,76.7,75.7,74.6,73.8,73,72.3,71.9,71.7,71.7,71.8,72.2,72.2,71.3,70.1,68.6,67.1,65.4,63.4,61.5,59.4,57.1,55,52.6,50.1,47.6,45,42.4,39.8,37.1,34.4,31.8,29.3,26.9,24.6,22.5,20.7,18.9,17.4,16.2,15.2,14.4,14,13.9,14,14.5,15.4,16.6,18.2,19.9,22.2,24.6,27,30.1,33.2,36.4,39.8,43,46.1,48.7,51.4,53.4,55,56.5,57.3,57.8,57.9,57.5,56.6,55.4,53.7,51.3,48.7,45.5,41.6,37.2,32.5,27.7,23,18.5,14.9,12,9.9,8.3,7.3,7.2,7.7,8.9,10.8,13.5,16.9,21.2,25.9,31.3,37.4,43.3,48.6,53.7,58.2,62.4,66.1,69,71.7,73.9,75.9,77.3,78.5,79.2,79.3,79.1,78.2,76.8,74.8,72.3,69.3,65.9,62.5,58.8,55.3,52.4,49.8,47.9,46.7,46,46.3,47.7,48.6],"06":[64.5,65.6,66.9,68,69.1,70.4,71.5,72.6,73.6,74.6,75.6,76.5,77.6,78.4,79.6,80.3,81.3,82.2,83.1,83.9,84.9,85.8,86.7,87.7,88.6,89.2,90,90.6,91,91.3,91.6,91.6,91.6,91.4,91.1,90.5,89.9,89.1,88.4,87.3,86.3,85,83.7,82.1,80.8,79.1,77.5,75.7,73.7,71.2,67.4,63.9,61,57.8,54.9,52.3,49.6,47.2,44.7,42.6,40.7,39.1,37.7,36.8,36.2,36.2,36.5,37.4,38.9,40.7,42.7,45.1,47.5,49.6,51.5,52.9,53.7,54.1,53.7,52.5,50.7,48.1,40.6,40,43.5,44.9,45.4,45.2,44.1,42.3,40,37.3,34.4,31.1,27.9,25.1,22.5,20.2,18.3,16.9,15.9,15.3,15.2,15.5,16.2,17.4,18.9,21,23.3,26,29,31.8,34.8,37.5,40.1,42.3,44.7,46.5,48,49.3,50.6,51.2,51.6,51.8,51.7,51.2,50.3,49.3,47.9,46.6,44.8,43,40.9,38.8,36.7,34.5,32.4,30.3,28.4,26.6,25,23.5,22.3,21.2,20.6,20.2,20.2,20.6,21.2,22.5,24,26.2,28.8,32,35.8,40.3,44.5,48.2,49.7,48.3,47.2]};
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

  function mount(host, article, language, route = '') {
    const entries = [...article.querySelectorAll('[data-thread-chapter][id]')].map(node => {
      const heading = node.matches('h1,h2') ? node : node.querySelector('h2');
      return { id: node.id, node, label: heading?.textContent.trim() };
    }).filter(entry => entry.label);
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
    strand.style.setProperty('--yarn-art', 'url("' + new URL('yarn-' + variant + '-long.webp', base) + '")');
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
      link.textContent = entry.label;
      item.append(link);
      list.append(item);
      return link;
    });
    nav.append(strand, list);
    host.replaceChildren(nav);
    let active = -1, frame = 0, measureNeeded = true, stops = [], positions = [], end = 0;
    let destination, lastAim = 0, settleTimer = 0, selectedChapter = 0;
    function release() {
      destination = null;
      clearTimeout(settleTimer);
    }
    function aimAt(entry) {
      return Math.min(end, Math.ceil(stops[entries.indexOf(entry)]));
    }
    function measureLabels() {
      const rail = strand.getBoundingClientRect();
      const menu = list.getBoundingClientRect();
      positions = links.map(link => {
        const rect = link.getBoundingClientRect();
        const centre = clamp(rect.top + rect.height / 2, menu.top, menu.bottom);
        return clamp((centre - rail.top) / rail.height, 0, 1);
      });
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
      const edge = Math.min(box.left, clamp((innerWidth - 1200) * .045, 4, 38));
      nav.style.left = edge + 'px';
      nav.style.width = Math.min(box.right - edge, Math.max(box.width, innerWidth > 960 ? 195 : box.width)) + 'px';
      // Allow a blank chapter interval at the head, and a loose end beyond the last name.
      const total = entries.length;
      const rowHeight = links.reduce((sum, link) => sum + link.offsetHeight, 0);
      const preferred = availableHeight * (.59 + .20 * clamp((total - 3) / 10, 0, 1));
      const height = Math.min(availableHeight - 4, Math.max(preferred, rowHeight + (total + 1) * 4 + 15));
      const tail = Math.min(36, height * .045);
      const interval = (height - tail) / (total + .5);
      const lead = clamp(interval, 14, Math.max(14, height - tail - rowHeight - (total - 1) * 2));
      nav.style.height = height + 'px';
      list.style.top = lead + 'px';
      list.style.bottom = tail + 'px';
      nav.classList.toggle('thread-overflow', rowHeight > height - lead - tail + 1);
      measureLabels();
      const readingLine = Math.min(128, availableHeight * .18);
      stops = entries.map(({ node }) => Math.max(0, node.getBoundingClientRect().top + scrollY - readingLine));
      if (entries[0].node.hasAttribute('data-thread-start')) stops[0] = 0;
      end = Math.max(0, document.documentElement.scrollHeight - availableHeight);
      // A short final chapter may already be on screen at maximum scroll.
      // Space the last chapter stops over the reachable part of the page.
      const last = stops[stops.length - 1];
      if (last > end) {
        const start = Math.max(0, end - availableHeight * .8);
        const scale = (end - start) / (last - start);
        stops = stops.map(stop => stop <= start ? stop : start + (stop - start) * scale);
      }
      settle();
    }
    function paint() {
      frame = 0;
      if (measureNeeded) { measure(); measureNeeded = false; }
      const y = Math.max(0, scrollY);
      let i = end <= 2 ? selectedChapter : 0;
      if (end > 2 && y > 0) {
        while (i + 1 < stops.length && y + .5 >= stops[i + 1]) i++;
        if (y >= end - 1) i = entries.length - 1;
      }
      if (i !== active) {
        if (active >= 0) links[active].removeAttribute('aria-current');
        links[i].setAttribute('aria-current', 'location');
        active = i;
        if (list.scrollHeight > list.clientHeight) {
          const rect = links[i].getBoundingClientRect();
          const menu = list.getBoundingClientRect();
          if (rect.top < menu.top) list.scrollTop += rect.top - menu.top;
          else if (rect.bottom > menu.bottom) list.scrollTop += rect.bottom - menu.bottom;
          measureLabels();
        }
      }
      const nextY = Math.min(end, stops[i + 1] ?? end);
      let fraction = clamp((y - stops[i]) / Math.max(1, nextY - stops[i]), 0, 1);
      if (end > 2 && y >= end - 1) fraction = 1;
      const p = positions[i] + ((positions[i + 1] ?? .986) - positions[i]) * fraction;
      const index = clamp(p * (sample.length - 1), 0, sample.length - 1);
      const left = Math.floor(index);
      const x = sample[left] + (sample[Math.min(left + 1, sample.length - 1)] - sample[left]) * (index - left);
      strand.style.setProperty('--thread-y', (p * 100).toFixed(2) + '%');
      strand.style.setProperty('--thread-x', x.toFixed(2) + '%');
      const progress = end <= 2 ? i / Math.max(1, entries.length - 1) : y / end;
      const percent = String(Math.round(clamp(progress, 0, 1) * 100));
      if (strand.getAttribute('aria-valuenow') !== percent) strand.setAttribute('aria-valuenow', percent);
    }
    function queue() { if (!frame) frame = requestAnimationFrame(paint); }
    function resize() { measureNeeded = true; queue(); }
    list.addEventListener('scroll', () => { measureLabels(); queue(); }, { passive: true });
    function follow(link, smooth) {
      selectedChapter = links.indexOf(link);
      const entry = entries[selectedChapter];
      entry.node.setAttribute('tabindex', '-1');
      entry.node.focus({ preventScroll: true });
      destination = entry;
      lastAim = aimAt(entry);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(release, 2200);
      scrollTo({ top: lastAim, behavior: smooth && !reduced.matches ? 'smooth' : 'instant' });
      queue();
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
