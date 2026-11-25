(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src);
  const profiles = document.querySelector('.pp-profile-source');
  const voices = document.querySelector('#residents tiny-voices');
  if (profiles && voices) {
    // The established voice player remains the owner of selection and playback.
    // Add the current facial performance and project notes to its selected resident.
    customElements.whenDefined('tiny-voices').then(() => {
      const entries = [...profiles.querySelectorAll('article')];
      const options = [...voices.querySelectorAll('.tm-resident')];
      const note = voices.querySelector('.tm-note');
      if (options.length !== entries.length || !note) return;
      function refresh() {
        const current = options.findIndex(item => item.getAttribute('aria-pressed') === 'true');
        if (current >= 0) note.textContent = entries[current].querySelector('p').textContent;
      }
      options.forEach((item,index) => {
        const pic = item.querySelector('img');
        if (pic) pic.src = new URL(entries[index].dataset.portrait+'.webp',base).href;
      });
      const choiceList = voices.querySelector('.tm-residents');
      choiceList.addEventListener('click', refresh);
      refresh();
      profiles.hidden = true;
    });
  }

  // Keep every response and prototype visible in the HTML with scripting disabled.
  function switchEvidence(container, items, label, names, hideTitles) {
    if (!items.length) return;
    const group = document.createElement('div');
    group.className = 'pp-switches';
    group.setAttribute('role','group');
    group.setAttribute('aria-label',label);
    const buttons = items.map((item,i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = names[i];
      group.append(button);
      if (hideTitles) item.querySelector('h4').hidden = true;
      button.addEventListener('click', () => select(i));
      return button;
    });
    const response = document.createElement('div');
    response.setAttribute('aria-live','polite');
    response.setAttribute('aria-atomic','true');
    response.className = 'pp-response';
    response.append(...items);
    container.append(group,response);
    function select(active) {
      items.forEach((item,i) => {
        buttons[i].setAttribute('aria-pressed',String(i===active));
        item.hidden = i!==active;
      });
    }
    select(0);
  }

  document.querySelectorAll('[data-outcomes]').forEach(container => {
    const choices = [...container.children];
    const titles = choices.map(el=>el.querySelector('h4').textContent);
    switchEvidence(container, choices, container.getAttribute('aria-label'),titles,true);
  });
  document.querySelectorAll('[data-prototype-archive]').forEach(container => {
    const plates = [...container.querySelectorAll(':scope > figure')];
    switchEvidence(container,plates,'Compare dated workshop prototypes',plates.map(el=>el.dataset.label),false);
  });
})();
