/* Inspect the original image without leaving its case study. */
(() => {
    let current;
    const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
    function mount(dialog) {
        current?.disconnect();
        const stage = dialog.querySelector('.inspection-stage');
        const image = stage.querySelector('img');
        const level = dialog.querySelector('[data-zoom-level]');
        const buttons = dialog.querySelectorAll('[data-inspect]');
        const stops = [1, 1.5, 2, 3, 4];
        let zoom = 1, x = 0, y = 0;
        let drag = null;

        function draw() {
            const {clientWidth:w, clientHeight:h} = stage;
            if (w && h && image.naturalWidth) {
                const fit = Math.min(w / image.naturalWidth, h / image.naturalHeight);
                const boundX = Math.max(0, (image.naturalWidth * fit * zoom - w) / 2);
                const boundY = Math.max(0, (image.naturalHeight * fit * zoom - h) / 2);
                x = clamp(x, -boundX, boundX);
                y = clamp(y, -boundY, boundY);
            }
            image.style.transform = `translate(${x}px,${y}px) scale(${zoom})`;
            level.textContent = Math.round(zoom * 100) + '%';
            stage.classList.toggle('is-zoomed', zoom > 1);
            for (const button of buttons) {
                const inactive = button.dataset.inspect === 'in' ? zoom >= 4 : zoom <= 1;
                button.setAttribute('aria-disabled', String(inactive));
            }
        }
        function reset() {
            zoom = 1; x = 0; y = 0; drag = null;
            stage.classList.remove('is-dragging');
            draw();
        }
        function resize(next, pointX = 0, pointY = 0) {
            const ratio = next / zoom;
            x = pointX + (x - pointX) * ratio;
            y = pointY + (y - pointY) * ratio;
            zoom = next;
            draw();
        }
        function step(dir) {
            const index = clamp(stops.indexOf(zoom) + dir, 0, stops.length - 1);
            resize(stops[index]);
        }
        for (const button of buttons) {
            button.onclick = () => {
                if (button.dataset.inspect === 'fit') reset();
                else step(button.dataset.inspect === 'in' ? 1 : -1);
            };
        }
        stage.onpointerdown = event => {
            if (!event.isPrimary || event.button !== 0) return;
            drag = {id:event.pointerId, fromX:event.clientX, fromY:event.clientY, originalX:x, originalY:y, moved:false};
            stage.setPointerCapture(event.pointerId);
            stage.focus({preventScroll:true});
        };
        stage.onpointermove = event => {
            if (!drag || event.pointerId !== drag.id) return;
            const dx = event.clientX - drag.fromX, dy = event.clientY - drag.fromY;
            if (Math.hypot(dx,dy) > 5) drag.moved = true;
            if (zoom > 1 && drag.moved) {
                stage.classList.add('is-dragging');
                x = drag.originalX + dx; y = drag.originalY + dy;
                draw();
            }
        };
        stage.onpointerup = event => {
            if (!drag || event.pointerId !== drag.id) return;
            if (!drag.moved) {
                const rect = stage.getBoundingClientRect();
                const dx = event.clientX - rect.left - rect.width/2;
                const dy = event.clientY - rect.top - rect.height/2;
                if (zoom === 1) resize(2,dx,dy);
                else { x -= dx; y -= dy; draw(); }
            }
            drag = null;
            stage.classList.remove('is-dragging');
        };
        stage.onpointercancel = stage.onlostpointercapture = () => { drag = null; stage.classList.remove('is-dragging'); };
        stage.onkeydown = event => {
            if (['+','=','Enter',' '].includes(event.key)) step(1);
            else if (event.key === '-') step(-1);
            else if (event.key === 'Home') reset();
            else if (zoom > 1 && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
                const dx = Math.max(40,stage.clientWidth / 6), dy = Math.max(40,stage.clientHeight / 6);
                if (event.key === 'ArrowLeft') x += dx;
                if (event.key === 'ArrowRight') x -= dx;
                if (event.key === 'ArrowUp') y += dy;
                if (event.key === 'ArrowDown') y -= dy;
                draw();
            } else return;
            event.preventDefault();
            event.stopPropagation();
        };
        image.onload = draw;
        const observer = new ResizeObserver(draw);
        observer.observe(stage);
        current = {reset, disconnect: () => observer.disconnect()};
        reset();
    }
    window.AliceImageInspection = {mount, reset: () => current?.reset()};
})();
