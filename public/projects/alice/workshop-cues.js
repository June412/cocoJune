(() => {
    const pending = new WeakMap();
    document.addEventListener('click', event => {
        const button = event.target.closest('button[data-window-cue]');
        if (!button) return;
        const video = button.closest('.window-film').querySelector('video');
        const seconds = Number(button.dataset.windowCue);
        const previous = pending.get(video);
        if (previous) video.removeEventListener('loadedmetadata', previous);
        const seek = () => {
            pending.delete(video);
            video.currentTime = seconds;
        };
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) seek();
        else {
            pending.set(video, seek);
            video.addEventListener('loadedmetadata', seek, {once:true});
        }
        video.play().catch(() => {
            // The native controls remain available if playback was interrupted.
        });
    });
})();

(() => {
    // The same fixed-camera captures are available in both languages.
    let selectedIndex=1, split=50;
    class WeatherComparison extends HTMLElement {
        connectedCallback(){
            this.choices=[...this.querySelectorAll('[data-climate-choice]')];
            this.range=this.querySelector('input[type="range"]');
            this.plate=this.querySelector('.climate-wipe');
            this.photo=this.querySelector('.climate-alternative');
            this.zoom=this.querySelector('[data-climate-side="view"]');
            this.events=new AbortController();
            this.addEventListener('click',event=>{
                const button=event.target.closest('button[data-climate-choice],button[data-browse-step]');
                if(!button)return;
                const step=Number(button.dataset.browseStep);
                const index=step?(selectedIndex+step+this.choices.length)%this.choices.length:Number(button.dataset.climateChoice);
                this.select(index);
                this.querySelector('.climate-status').textContent=this.choices[index].dataset.label;
                if(split===100)this.showSplit(50);
            },{signal:this.events.signal});
            this.range.addEventListener('input',()=>this.showSplit(Number(this.range.value)),{signal:this.events.signal});
            this.select(selectedIndex);
            this.showSplit(split);
        }
        disconnectedCallback(){this.events?.abort();}
        select(index){
            selectedIndex=index;
            const choice=this.choices[index];
            this.choices.forEach(button=>button.setAttribute('aria-pressed',String(button===choice)));
            const {src,label}=choice.dataset;
            this.photo.alt=label;
            this.photo.src=src;
            this.zoom.dataset.workshopSrc=src;
            this.zoom.dataset.caption=label;
            this.zoom.querySelector('span').textContent=label;
            this.zoom.setAttribute('aria-label',(this.dataset.climateLang==='en'?'Enlarge':'放大')+' · '+label);
        }
        showSplit(value){
            split=value;
            this.range.value=String(value);
            this.range.setAttribute('aria-valuetext',this.dataset.climateLang==='en'?value+'% clear afternoon':'左侧晴天 '+value+'%');
            this.plate.style.setProperty('--weather-split',value+'%');
        }
    }
    customElements.define('alice-weather-comparison',WeatherComparison);
})();
