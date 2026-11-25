/* Step-by-step case studies, enhanced in place for the bilingual portfolio. */
(function sequences(){
    'use strict';

    const showPanel = new WeakMap();
    const lastStep = new Map();
    const sectionSelector = '#cushion, #arrival, #alice, #panda';

    function node(tag, name, text) {
        const el = document.createElement(tag);
        if (name) el.className = name;
        if (text) el.textContent = text;
        return el;
    }

    function detailView(label, content) {
        const group = node('section', 'sequence-detail');
        group.append(node('h4', '', label), content);
        return group;
    }

    function groupSteps(section, isEn) {
        const body = section.querySelector('.section-body');
        const rows = [...body.querySelectorAll(':scope > .process-row')];
        const isCushion = section.id === 'cushion';
        const steps = rows.map(row => {
            const panel = node('div', 'sequence-panel');
            const next = row.nextElementSibling;
            const craft = row.querySelector('.craft-evidence');
            if (craft) {
                const [controls, result] = craft.querySelectorAll('figure');
                if (controls && result) {
                    row.append(result);
                    const detail = detailView(isEn ? 'Workbench settings' : '工作台参数', controls);
                    if (isCushion) detail.classList.add('cushion-settings');
                    panel.append(detail);
                    craft.remove();
                }
            }
            if (next?.matches('figure, .figure-pair')) {
                let label = isEn ? 'Additional view' : '更多视图';
                if (next.matches('.figure-pair')) label = isEn ? 'Leaf and edge details' : '叶片与锁边细节';
                if (isCushion) label = next.matches('.figure-pair')
                    ? (isEn ? 'Blanket stitches and binding' : '毛毡锁边与抱枕包边')
                    : (isEn ? 'Satin thread up close' : '叶片绣线细节');
                if (next.querySelector('[data-image="aliceFill"]')) label = isEn ? 'Full workbench' : '工作台全景';
                if (next.querySelector('[data-image="aliceSend"]')) label = isEn ? 'Return parcel' : '寄回包裹';
                panel.append(detailView(label, next));
            }
            panel.prepend(row);
            return panel;
        });

        return steps;
    }

    function listenForSwipe(stage, move) {
        let start = null;
        stage.addEventListener('touchstart', event => {
            const touch = event.touches[0];
            start = event.touches.length === 1 && !event.target.closest('input,select,video,a,.sequence-arrow')
                ? { id: touch.identifier, x: touch.clientX, y: touch.clientY } : null;
        }, { passive: true });
        stage.addEventListener('touchcancel', () => { start = null; }, { passive: true });
        stage.addEventListener('touchend', event => {
            const touch = event.changedTouches[0];
            if (!start || !touch || event.touches.length || touch.identifier !== start.id) return;
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            start = null;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 2 && move(dx < 0 ? 1 : -1)) {
                if (event.cancelable) event.preventDefault();
            }
        }, { passive: false });
    }

    function install(section, isEn) {
        const body = section.querySelector('.section-body');
        if (!body || body.querySelector('.step-sequence')) return;
        const firstRow = body.querySelector(':scope > .process-row');
        if (!firstRow) return;

        const sequence = node('div','step-sequence');
        firstRow.before(sequence);
        const panels = groupSteps(section, isEn);
        const toolbar = node('div','sequence-toolbar');
        const progress = node('span','sequence-progress');
        const meter = node('span','sequence-meter');
        meter.setAttribute('aria-hidden','true');
        const ticks = panels.map(() => node('i'));
        meter.append(...ticks);
        const stage = node('div','sequence-stage');
        stage.id = section.id + '-steps';
        const frames = panels.map(panel => {
            const image = panel.querySelector('.process-row > figure > button');
            if (!image) {
                panel.classList.add('browse-frame');
                return panel;
            }
            const frame = node('div','sequence-picture browse-frame');
            image.before(frame);
            frame.append(image);
            return frame;
        });
        const announcement = node('span','sequence-sr');
        announcement.setAttribute('role','status');
        announcement.setAttribute('aria-atomic','true');
        const controls = [-1,1].map(delta => {
            const previous = delta < 0;
            const label = previous ? (isEn ? 'Previous step' : '上一步') : (isEn ? 'Next step' : '下一步');
            const b = node('button','sequence-arrow browse-arrow ' + (previous ? 'browse-prev' : 'browse-next'));
            b.type = 'button';
            b.title = label;
            b.dataset.browseStep = delta;
            b.setAttribute('aria-label', label);
            b.setAttribute('aria-controls', stage.id);
            b.addEventListener('click', () => go(index + delta));
            return b;
        });
        toolbar.append(progress, meter);
        sequence.setAttribute('role','group');
        sequence.setAttribute('aria-roledescription', isEn ? 'carousel' : '轮播');
        const title = section.querySelector('h2');
        if (!title.id) title.id = section.id + '-step-heading';
        sequence.setAttribute('aria-labelledby',title.id);
        const titles = panels.map((panel, n) => {
            const heading = panel.querySelector('h3');
            const text = heading.textContent.replace(/^\s*\d+\.\s*/, '');
            heading.textContent = text;
            if (!heading.id) heading.id = section.id + '-step-' + (n + 1);
            panel.setAttribute('role','group');
            panel.setAttribute('aria-roledescription', isEn ? 'step' : '步骤');
            panel.setAttribute('aria-labelledby', heading.id);
            return text;
        });
        stage.append(...panels);
        sequence.append(toolbar, stage, announcement);

        let index = -1;
        function go(next, animate = true) {
            if (next < 0 || next >= panels.length || next === index) return false;
            const previous = index;
            const focused = document.activeElement;
            index = next;
            lastStep.set(section.id, next);
            panels.forEach((panel, n) => {
                panel.hidden = n !== next;
                ticks[n].classList.toggle('is-current', n === next);
                ticks[n].classList.toggle('is-past', n < next);
            });
            progress.textContent = (isEn ? 'Step ' : '步骤 ') + (next + 1) + ' / ' + panels.length;
            controls[0].setAttribute('aria-disabled', String(next === 0));
            controls[1].setAttribute('aria-disabled', String(next === panels.length - 1));
            frames[next].append(...controls);
            if (controls.includes(focused)) focused.focus({preventScroll:true});
            if (previous >= 0) {
                announcement.textContent = progress.textContent + ' · ' + titles[next];
                if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    const shift = next > previous ? 8 : -8;
                    panels[next].animate?.([{opacity:.45,transform:`translateX(${shift}px)`},{opacity:1,transform:'none'}],
                        {duration:180,easing:'ease-out'});
                }
            }
            return true;
        }
        panels.forEach((panel,n) => showPanel.set(panel, () => go(n, false)));
        sequence.addEventListener('keydown', event => {
            if (!event.target.closest('.sequence-arrow') || event.altKey || event.ctrlKey || event.metaKey) return;
            const dest = {ArrowLeft:index-1,ArrowRight:index+1,Home:0,End:panels.length-1}[event.key];
            if (dest === undefined) return;
            event.preventDefault();
            go(dest);
        });
        listenForSwipe(stage, delta => go(index + delta));
        go(Math.min(lastStep.get(section.id) || 0, panels.length - 1), false);
    }

    function reveal(target) {
        const panel = target?.closest?.('.sequence-panel');
        if (!panel) return;
        showPanel.get(panel)?.();
    }

    function mount(root = document, lang = document.documentElement.lang) {
        const sections = root.matches?.(sectionSelector) ? [root] : root.querySelectorAll(sectionSelector);
        sections.forEach(section => install(section, lang === 'en'));
        reveal(document.getElementById(location.hash.slice(1)));
    }

    window.AliceSequences = { mount, reveal };
})();

