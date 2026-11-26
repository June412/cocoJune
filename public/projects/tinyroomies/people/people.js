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
})();
