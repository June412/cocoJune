(() => {
  document.querySelectorAll('[data-drawing-gallery]').forEach((gallery, galleryIndex) => {
    const figures = Array.from(gallery.children).filter(node => node.matches('figure[data-drawing-label]'));
    if (figures.length < 2) return;

    const controls = document.createElement('div');
    controls.className = 'trn-switch';
    controls.setAttribute('role', 'tablist');
    controls.setAttribute('aria-label', gallery.dataset.drawingGallery);
    const buttons = figures.map((figure, index) => {
      const button = document.createElement('button');
      const name = 'manual-view-' + galleryIndex + '-' + index;
      button.type = 'button';
      button.id = name;
      button.setAttribute('role', 'tab');
      button.textContent = figure.dataset.drawingLabel;
      button.setAttribute('aria-controls', name + '-panel');
      figure.id = name + '-panel';
      figure.setAttribute('role', 'tabpanel');
      figure.setAttribute('aria-labelledby', name);
      figure.tabIndex = 0;
      controls.append(button);
      return button;
    });

    function select(index, focus = false) {
      buttons.forEach((button, i) => {
        const current = index === i;
        button.setAttribute('aria-selected', String(current));
        button.tabIndex = current ? 0 : -1;
        figures[i].hidden = !current;
      });
      if (focus) buttons[index].focus();
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => select(index));
      button.addEventListener('keydown', event => {
        const last = buttons.length - 1;
        const destination = {
          ArrowLeft: (index + last) % buttons.length,
          ArrowRight: (index + 1) % buttons.length,
          Home: 0,
          End: last
        }[event.key];
        if (destination === undefined) return;
        event.preventDefault();
        select(destination, true);
      });
    });
    gallery.prepend(controls);
    select(0);
  });
})();
