(() => {
  const select = document.querySelector('#chapter-select');
  const sections = [...document.querySelectorAll('.chapter')];
  const dialog = document.querySelector('#image-dialog');

  function originalRender(source, caption) {
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'original-render';
    open.textContent = 'View Unity render ↗';
    open.dataset.zoom = source;
    open.dataset.caption = caption;
    open.setAttribute('aria-label', 'View Unity render: ' + caption);
    return open;
  }

  function showDolls(originals) {
    if (!window.AliceDollOrbit || !customElements.get('alice-doll-viewer')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'presentation-orbit';
    wrapper.innerHTML = window.AliceDollOrbit.gallery('en');
    const sources = [...originals.querySelectorAll('figure')];
    wrapper.querySelectorAll('.doll-figure').forEach((figure, i) => {
      const caption = sources[i].querySelector('figcaption').textContent;
      figure.querySelector('figcaption').after(originalRender(sources[i].querySelector('[data-zoom]').dataset.zoom, caption));
    });
    const study = originals.parentElement;
    study.parentElement.classList.add('character-orbits');
    study.parentElement.prepend(study);
    originals.before(wrapper);
    originals.dataset.enhanced = '';
  }

  function showMaterials(originals) {
    const materials = window.ALICE_MEDIA?.materials;
    if (!window.AliceMaterialOrbit || !materials?.length) return;
    const names = new Map([...originals.querySelectorAll('figure')].map(figure =>
      [figure.dataset.media.slice(4), figure.querySelector('figcaption').textContent]));
    names.set('A01_AliceSkin', 'Alice body');
    names.set('A02_AliceBinding', 'Alice binding');
    names.set('A03_AliceHairSurface', 'Game hair');
    names.set('A04_AliceHairGolden', 'Golden hair');
    const section = document.createElement('section');
    section.className = 'presentation-orbit fabric-study';
    section.innerHTML = '<h3>Fabric samples</h3><div class="fabric-study-layout"><div><div class="fabric-stage"></div></div><div class="fabric-choices" role="group" aria-label="Material samples"></div></div>';
    const choices = section.querySelector('.fabric-choices');
    const stage = section.querySelector('.fabric-stage');
    const open = originalRender('', '');
    stage.after(open);
    const buttons = materials.map((material, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      const image = document.createElement('img');
      image.alt = '';
      image.src = material.image.thumb || material.image.src;
      image.loading = 'lazy';
      const label = names.get(material.id) || material.id;
      button.append(image, document.createTextNode(label));
      choices.append(button);
      button.dataset.materialId = material.id;
      button.addEventListener('click', () => selectMaterial(index));
      return button;
    });
    function selectMaterial(index) {
      const material = materials[index];
      const label = buttons[index].textContent;
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
      open.dataset.zoom = material.image.src;
      open.dataset.caption = label;
      open.setAttribute('aria-label', 'View Unity render: ' + label);
      window.AliceMaterialOrbit.mount(stage, material, label, 'en');
    }
    originals.before(section);
    originals.dataset.enhanced = '';
    selectMaterial(0);
  }

  const dollOriginals = document.querySelector('.doll-originals');
  if (dollOriginals) showDolls(dollOriginals);
  const fabricOriginals = document.querySelector('.material-originals');
  if (fabricOriginals) showMaterials(fabricOriginals);

  if (select && sections.length) {
    const header = select.closest('nav');
    let frame = 0;
    let readingLine = 0;
    let current;

    function updateContents() {
      frame = 0;
      const active = sections.findLast(section => section.getBoundingClientRect().top <= readingLine + 2) || sections[0];
      if (active === current) return;
      if (current) current.querySelectorAll('video, audio').forEach(clip => { if (!clip.paused) clip.pause(); });
      current = active;
      select.value = active.id;
    }
    function queueUpdate() {
      if (!frame) frame = requestAnimationFrame(updateContents);
    }
    function measureHeader() {
      readingLine = getComputedStyle(header).position === 'sticky' ? Math.ceil(header.getBoundingClientRect().height) + 14 : 14;
      document.documentElement.style.setProperty('--nav-offset', readingLine + 'px');
      queueUpdate();
    }

    select.addEventListener('change', () => {
      if (location.hash === '#' + select.value) document.getElementById(select.value).scrollIntoView();
      else location.hash = select.value;
    });
    addEventListener('scroll', queueUpdate, {passive:true});
    addEventListener('pageshow', queueUpdate);
    addEventListener('hashchange', () => {
      if (dialog?.open) dialog.close();
      queueUpdate();
    });
    measureHeader();
    new ResizeObserver(measureHeader).observe(header);
  }
  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-zoom]');
    if (!opener || !dialog) return;
    event.preventDefault();
    dialog.querySelector('img').src = opener.dataset.zoom;
    const caption = opener.dataset.caption || opener.closest('figure')?.querySelector('figcaption')?.textContent || opener.getAttribute('aria-label');
    dialog.querySelector('img').alt = caption;
    dialog.querySelector('p').textContent = caption;
    dialog.showModal();
  });
  dialog?.querySelector('button').addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  function preparePrint() {
    document.querySelectorAll('main img').forEach(image => { image.loading = 'eager'; });
  }
  addEventListener('beforeprint', preparePrint);
  document.querySelector('[data-print]')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      preparePrint();
      await Promise.allSettled([...document.querySelectorAll('main img')].map(image => image.decode()));
      window.print();
    } finally {
      button.disabled = false;
    }
  });
})();
