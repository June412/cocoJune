// A native audio element remains available when a recording has no measured envelope.
(() => {
  'use strict';
  function pauseOtherRecordings(current) {
    for (const media of document.querySelectorAll('audio, video')) {
      if (media !== current && !media.paused && !media.muted &&
          (current.closest('audio-waveform') || media.closest('audio-waveform'))) media.pause();
    }
  }
  document.addEventListener('play', event => {
    if (event.target instanceof HTMLMediaElement && !event.target.muted) pauseOtherRecordings(event.target);
  }, true);
  class AudioWaveform extends HTMLElement {
    connectedCallback() {
      queueMicrotask(() => {
        if (this.isConnected && !this.controls) this.mount();
      });
    }

    mount() {
      const audio = this.querySelector('audio');
      const source = audio?.getAttribute('src') || audio?.querySelector('source')?.getAttribute('src');
      const recording = source && window.PortfolioSoundPeaks?.[source.split('/').pop()];
      if (!recording) return;
      const controls = document.createElement('div');
      controls.className = 'wave-controls';
      controls.innerHTML = '<span class="wave-title"></span><button type="button" class="wave-toggle"></button><div class="wave-track"><svg viewBox="0 0 336 48" preserveAspectRatio="none" aria-hidden="true"><path/></svg><div class="wave-played" aria-hidden="true"></div><input type="range" min="0" max="1000" step="1" value="0"></div><span class="wave-time" aria-hidden="true"></span>';
      this.controls = controls;
      this.audio = audio;
      this.append(controls);
      const toggle = controls.querySelector('button');
      const slider = controls.querySelector('input');
      const time = controls.querySelector('.wave-time');
      const title = controls.querySelector('.wave-title');
      const svg = controls.querySelector('svg');
      const spacing = 336 / recording.peaks.length;
      svg.firstElementChild.setAttribute('d', recording.peaks.map((peak,i) => {
        const x = ((i + .5) * spacing).toFixed(2);
        const height = Math.max(.55, peak * .22);
        return 'M' + x + ' ' + (24 - height).toFixed(2) + 'v' + (2 * height).toFixed(2);
      }).join(' '));
      controls.querySelector('.wave-played').append(svg.cloneNode(true));
      audio.controls = false;
      this.classList.add('wave-ready');
      const events = new AbortController();
      this.events = events;
      const on = (el, event, callback) => el.addEventListener(event, callback, {signal:events.signal});
      const duration = () => Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : recording.seconds;
      const clock = value => value < 10 ? value.toFixed(duration() < 1 ? 2 : 1) + ' s' :
        Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2,'0');
      let pendingSeek = null;
      const update = () => {
        const zh = document.documentElement.lang.startsWith('zh');
        const label = zh ? this.dataset.zh : this.dataset.en;
        const active = !audio.paused && !audio.ended;
        title.textContent = label;
        toggle.setAttribute('aria-label', (active ? (zh ? '暂停' : 'Pause') : (zh ? '播放' : 'Play')) + ' · ' + label);
        toggle.dataset.playing = String(active);
        const seconds = pendingSeek === null ? audio.currentTime : pendingSeek * duration();
        const fraction = Math.max(0, Math.min(1, seconds / duration()));
        controls.style.setProperty('--played', (fraction * 100) + '%');
        slider.value = String(Math.round(fraction * 1000));
        slider.setAttribute('aria-label', (zh ? '调整播放位置' : 'Seek') + ' · ' + label);
        slider.setAttribute('aria-valuetext', clock(seconds) + ' / ' + clock(duration()));
        time.textContent = clock(seconds > 0 && !audio.ended ? seconds : duration());
        time.title = clock(seconds) + ' / ' + clock(duration());
      };
      const seek = () => {
        if (pendingSeek === null || audio.readyState < HTMLMediaElement.HAVE_METADATA) return;
        audio.currentTime = pendingSeek * duration();
        pendingSeek = null;
      };
      on(slider, 'input', () => {
        pendingSeek = Number(slider.value) / 1000;
        if (audio.readyState < HTMLMediaElement.HAVE_METADATA) {
          if (audio.networkState !== HTMLMediaElement.NETWORK_LOADING) audio.load();
        } else seek();
        update();
      });
      on(toggle, 'click', () => {
        if (audio.paused || audio.ended) {
          pauseOtherRecordings(audio);
          audio.play().catch(update);
        } else audio.pause();
      });
      on(audio, 'loadedmetadata', () => { seek(); update(); });
      for (const event of ['durationchange','play','pause','timeupdate','ended','seeked']) on(audio,event,update);
      on(audio,'error',() => {
        this.classList.remove('wave-ready');
        controls.hidden = true;
        audio.controls = true;
      });
      this.language = new MutationObserver(update);
      this.language.observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
      update();
    }

    disconnectedCallback() {
      this.events?.abort();
      this.language?.disconnect();
      if (this.audio) { this.audio.pause(); this.audio.controls = true; }
      this.controls?.remove();
      this.controls = null;
      this.classList.remove('wave-ready');
    }
  }
  customElements.define('audio-waveform', AudioWaveform);
})();
