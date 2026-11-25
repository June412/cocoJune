(() => {
  const anatomy = document.querySelector('.making-anatomy');
  if (anatomy) {
    const pins = anatomy.querySelector('.making-pins');
    const buttons = [...pins.querySelectorAll('button')];
    const stations = [...anatomy.querySelectorAll('details')];
    function mark() {
      for (const [index, button] of buttons.entries())
        button.setAttribute('aria-expanded', String(stations[index].open));
    }
    for (const [index, button] of buttons.entries()) {
      button.addEventListener('click', () => {
        for (const [i, station] of stations.entries()) station.open = i === index;
        mark();
      });
      stations[index].addEventListener('toggle', mark);
    }
    mark();
    pins.hidden = false;
  }
  document.querySelector('.making-stages')?.addEventListener('click', event => {
    const link = event.target.closest('[data-making-tool]');
    if (link) document.getElementById('tool-models')?.dispatchEvent(
      new CustomEvent('portfolio:inspect-tool', { detail: { id: link.dataset.makingTool } })
    );
  });
  document.querySelector('.making-example-grid')?.addEventListener('click', event => {
    const link = event.target.closest('[data-making-piece]');
    const picker = document.getElementById('furniture-choice');
    if (!link || !picker) return;
    picker.value = link.dataset.makingPiece;
    picker.dispatchEvent(new Event('change', { bubbles: true }));
  });
  for (const movie of document.querySelectorAll('.making-films video')) {
    movie.addEventListener('play', () => {
      for (const other of movie.closest('.making-films').querySelectorAll('video'))
        if (other !== movie) other.pause();
    });
  }
  const films = document.getElementById('workshop-films');
  films?.addEventListener('toggle', () => {
    if (!films.open) films.querySelectorAll('video').forEach(movie => movie.pause());
  });
  function revealTarget() {
    if (location.hash === '#workshop-films') films.open = true;
    if (location.hash === '#repair-guide') document.getElementById('repair-guide').open = true;
  }
  addEventListener('hashchange', revealTarget);
  revealTarget();
})();
