(() => {
  'use strict';

  const base = new URL('.', document.currentScript.src);
  const mediaURL = file => new URL(file, base).href;

  const films = [
    {
      file: 'fold', title: 'Folding workshop', time: '0:09',
      description: 'The worktop, tool cabinet and side tray fold in sequence. The tools travel with their shelves as the suitcase closes and opens.'
    },
    {
      file: 'turntable-detail', title: 'Locking turntable', time: '0:07',
      description: 'The red lever releases the turntable. The workpiece rotates within reach, then stays in position once the lever locks.'
    },
    {
      file: 'one-hand-drill', title: 'One-handed drilling', time: '0:07',
      description: 'The support holds the drill in place. The player can release the grip and use the same hand to turn the crank.'
    }
  ];

  // Each sample uses the same reassuring line from the production voice catalog.
  // The waveforms are RMS amplitudes measured across 40 equal slices of each WAV.
  const voices = [
    {
      id: 'sprout', name: 'Sprout', trait: 'Considerate', sound: 'Warm and rounded', seconds: '1.3',
      note: 'Sprout turns the cup handle away from the leaves before taking a drink.',
      amplitude: [4,20,24,7,2,8,24,24,16,8,5,17,25,24,21,19,19,18,16,2,7,20,19,17,14,13,16,15,15,15,14,9,2,2,2,2,2,2,2,2]
    },
    {
      id: 'keeper', name: 'Keeper', trait: 'Cautious', sound: 'Low and steady', seconds: '1.7',
      note: 'Keeper checks the fill mark on the cup and takes a sip to bring the tea back to the line.',
      amplitude: [2,2,4,9,6,3,14,14,9,8,12,22,23,21,19,18,15,5,13,20,18,22,25,22,18,13,7,2,2,2,2,2,2,2,2,2,2,2,2,2]
    },
    {
      id: 'archivist', name: 'Archivist', trait: 'Orderly', sound: 'Quiet, measured phrases', seconds: '1.9',
      note: 'When offered the wrong cup, Archivist returns it and finds the same place in the book.',
      amplitude: [6,25,14,3,23,25,14,4,2,18,18,16,12,11,9,2,8,14,13,11,9,7,7,5,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    },
    {
      id: 'courier', name: 'Courier', trait: 'Eager', sound: 'Bright, with quick starts', seconds: '1.5',
      note: 'Courier asks to hear the end of a passage before the player changes records.',
      amplitude: [2,3,10,11,18,18,13,2,3,16,18,16,10,7,22,25,22,24,20,10,4,17,22,21,20,17,12,15,13,5,2,2,2,2,2,2,2,2,2,2]
    },
    {
      id: 'page', name: 'Page', trait: 'Sentimental', sound: 'Airy, with soft endings', seconds: '1.9',
      note: 'Page keeps familiar belongings close. The player asks permission before removing the cup sleeve.',
      amplitude: [2,10,19,4,4,10,25,21,8,6,12,16,15,14,13,9,2,5,6,5,5,4,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    }
  ];

  function bindChoices(container, change) {
    const buttons = Array.from(container.querySelectorAll('button[data-choice]'));
    function select(index) {
      for (const [i, button] of buttons.entries()) {
        button.setAttribute('aria-pressed', String(i === index));
      }
      change(index);
    }
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => select(index));
    });
    select(0);
  }

  class TinyFilms extends HTMLElement {
    connectedCallback() {
      if (this.querySelector('.tm-film')) return;
      this.innerHTML = `
        <div class="tm-film">
          <figure class="tm-stage">
            <video class="tm-screen" controls playsinline preload="none" width="1280" height="720" aria-label="Folding workshop"></video>
            <figcaption class="tm-legend" aria-live="polite"></figcaption>
          </figure>
          <div class="tm-film-menu">
            <p class="tm-label">Workshop films</p>
            <div class="tm-film-choices" role="group" aria-label="Select a workshop film">
              ${films.map((film,i) => `<button type="button" data-choice="${i}" class="tm-film-choice">
                <img src="${mediaURL(film.file+'.webp')}" width="112" height="63" loading="lazy" alt="">
                <span class="tm-choice-text"><strong>${film.title}</strong><small>Silent · ${film.time}</small></span>
              </button>`).join('')}
            </div>
          </div>
        </div>`;
      const video = this.querySelector('video');
      const legend = this.querySelector('figcaption');
      bindChoices(this.querySelector('.tm-film-choices'), index => {
        const film = films[index];
        const src = mediaURL(film.file+'.mp4');
        if (video.src === src) return;
        video.pause();
        video.poster = mediaURL(film.file+'.webp');
        video.setAttribute('aria-label', film.title + ', silent Unity Editor capture');
        video.src = src;
        const fallback = document.createElement('a');
        fallback.href = src;
        fallback.textContent = 'Open the film';
        video.replaceChildren(fallback);
        legend.textContent = film.description;
        video.load();
      });
    }
  }

  function residentTurntable(root) {
    const dialog = document.createElement('dialog');
    dialog.className = 'tm-turn-dialog';
    dialog.setAttribute('aria-label', 'Resident turntable');
    dialog.innerHTML = `
      <div class="tm-turn-header">
        <p class="tm-turn-name"></p>
        <button type="button" class="tm-turn-close">Close</button>
      </div>
      <div class="tm-turn-stage" tabindex="0" role="img" aria-keyshortcuts="ArrowLeft ArrowRight Home">
        <img alt="" width="270" height="360">
        <canvas width="270" height="360" hidden></canvas>
      </div>
      <p class="tm-turn-hint" role="status">Drag to turn, or use the arrow keys.</p>
      <div class="tm-turn-controls" role="group" aria-label="Turntable controls">
        <button type="button" data-step="-3">Turn left</button>
        <button type="button" data-step="0">Reset</button>
        <button type="button" data-step="3">Turn right</button>
      </div>`;
    root.append(dialog);
    const stage = dialog.querySelector('.tm-turn-stage');
    const poster = stage.querySelector('img');
    const canvas = stage.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const hint = dialog.querySelector('.tm-turn-hint');
    const controls = Array.from(dialog.querySelectorAll('[data-step]'));
    let name, frame = 0, sheet, drag;
    let loadID = 0;
    const hintText = 'Drag to turn, or use the arrow keys.';
    function showFrame(next) {
      if (!sheet || !ctx) return;
      frame = ((next % 24) + 24) % 24;
      const sx = (frame % 6) * 270, sy = Math.floor(frame / 6) * 360;
      ctx.clearRect(0, 0, 270, 360);
      ctx.drawImage(sheet, sx, sy, 270, 360, 0, 0, 270, 360);
      stage.setAttribute('aria-label', name + ', ' + (frame * 15) + ' degrees from the starting view');
    }
    controls.forEach(button => button.addEventListener('click', () => {
      const step = Number(button.dataset.step);
      showFrame(step ? frame + step : 0);
    }));
    stage.addEventListener('keydown', event => {
      if (!sheet) return;
      if (event.key === 'ArrowLeft') showFrame(frame - 1);
      else if (event.key === 'ArrowRight') showFrame(frame + 1);
      else if (event.key === 'Home') showFrame(0);
      else return;
      event.preventDefault();
    });
    stage.addEventListener('pointerdown', event => {
      if (!sheet || drag || event.button !== 0) return;
      drag = {id: event.pointerId, start: event.clientX, frame};
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener('pointermove', event => {
      if (drag?.id !== event.pointerId) return;
      const delta = Math.round((event.clientX - drag.start) / 9);
      showFrame(drag.frame - delta);
    });
    stage.addEventListener('lostpointercapture', () => { drag = null; });
    dialog.addEventListener('close', () => { loadID++; sheet = null; drag = null; });
    dialog.querySelector('.tm-turn-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    return async person => {
      name = person.name;
      dialog.setAttribute('aria-label', name + ' turntable');
      dialog.querySelector('.tm-turn-name').textContent = name + ' · 360°';
      poster.src = mediaURL(person.id+'.webp');
      poster.hidden = false;
      canvas.hidden = true;
      drag = null;
      sheet = null;
      controls.forEach(button => { button.disabled = true; });
      stage.setAttribute('aria-label', name + ', three-quarter view');
      hint.textContent = 'Loading views…';
      dialog.showModal();
      stage.focus({preventScroll:true});
      const pending = ++loadID;
      const asset = new Image();
      asset.src = mediaURL(person.id+'-360.webp');
      try {
        await asset.decode();
        if (pending !== loadID) return;
        if (!ctx) throw new Error('Canvas unavailable');
        sheet = asset;
        showFrame(0);
        poster.hidden = true;
        canvas.hidden = false;
        controls.forEach(button => { button.disabled = false; });
        hint.textContent = hintText;
      } catch {
        if (pending === loadID) hint.textContent = 'The turntable could not load. The studio portrait is shown.';
      }
    };
  }

  class TinyVoices extends HTMLElement {
    connectedCallback() {
      if (this.querySelector('.tm-residents')) return;
      this.innerHTML = `
        <div class="tm-residents" role="group" aria-label="Choose a resident">
          ${voices.map((voice,i) => `<button type="button" class="tm-resident" data-choice="${i}">
            <img src="${mediaURL(voice.id+'.webp')}" alt="" loading="lazy" width="360" height="480">
            <span>${voice.name}</span>
          </button>`).join('')}
        </div>
        <div class="tm-listening">
          <div aria-live="polite" class="tm-person">
            <p class="tm-label tm-trait"></p>
            <p class="tm-note"></p>
            <button class="tm-open-turn" type="button" aria-haspopup="dialog"></button>
          </div>
          <div class="tm-player">
            <p class="tm-label">Voice study</p>
            <button class="tm-listen" type="button">
              <span class="tm-listen-icon" aria-hidden="true"></span>
              <span class="tm-listen-label"></span>
              <span class="tm-wave" aria-hidden="true"></span>
              <span class="tm-length" aria-hidden="true"></span>
            </button>
            <p class="tm-direction">Line direction · “We can try again. Take your time.”</p>
            <p class="tm-error" role="status"></p>
            <audio preload="none"></audio>
          </div>
        </div>`;
      const get = selector => this.querySelector(selector);
      const audio = get('audio');
      const listen = get('.tm-listen');
      const wave = get('.tm-wave');
      const error = get('.tm-error');
      const openTurntable = residentTurntable(this);
      let selected = voices[0];
      let progressFrame = 0;
      const clearProgress = () => {
        cancelAnimationFrame(progressFrame);
        wave.style.removeProperty('--tm-progress');
      };
      const drawProgress = () => {
        if (audio.paused || audio.ended || !Number.isFinite(audio.duration)) return;
        wave.style.setProperty('--tm-progress', (100 * audio.currentTime / audio.duration) + '%');
        progressFrame = requestAnimationFrame(drawProgress);
      };
      const syncLabel = () => {
        const playing = !audio.paused && !audio.ended;
        listen.classList.toggle('tm-playing', playing);
        get('.tm-listen-label').textContent = playing ? 'Pause' : 'Play voice';
        listen.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + selected.name + ' voice sample');
      };
      bindChoices(get('.tm-residents'), index => {
        const next = voices[index];
        if (audio.src && selected === next) return;
        audio.pause();
        selected = next;
        error.textContent = '';
        audio.src = mediaURL('voice-'+selected.id+'.wav');
        get('.tm-trait').textContent = selected.trait + ' · ' + selected.sound;
        get('.tm-note').textContent = selected.note;
        get('.tm-open-turn').textContent = 'View ' + selected.name + ' in 360°';
        get('.tm-length').textContent = selected.seconds + ' s';
        wave.replaceChildren(...selected.amplitude.map(level => {
          const bar = document.createElement('i');
          bar.style.height = level + 'px';
          return bar;
        }));
        clearProgress();
        syncLabel();
      });
      get('.tm-open-turn').addEventListener('click', () => openTurntable(selected));
      listen.addEventListener('click', async () => {
        if (!audio.paused) { audio.pause(); return; }
        error.textContent = '';
        try {
          await audio.play();
        } catch (issue) {
          if (issue.name !== 'AbortError') {
            const link = document.createElement('a');
            link.href = audio.src;
            link.textContent = 'Open the audio sample';
            error.replaceChildren('Playback unavailable. ', link);
          }
        }
      });
      audio.addEventListener('playing', () => { clearProgress(); syncLabel(); drawProgress(); });
      audio.addEventListener('pause', () => { cancelAnimationFrame(progressFrame); syncLabel(); });
      audio.addEventListener('ended', () => { clearProgress(); syncLabel(); });
    }
  }

  // Starting a sample or film stops any other active media on this page.
  document.addEventListener('play', event => {
    if (!(event.target instanceof HTMLMediaElement)) return;
    document.querySelectorAll('audio, video').forEach(item => {
      if (item !== event.target && !item.paused) item.pause();
    });
  }, true);
  customElements.define('tiny-films', TinyFilms);
  customElements.define('tiny-voices', TinyVoices);
})();
