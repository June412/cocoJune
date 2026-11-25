(() => {
    const escape = value => String(value).replace(/[&<>"']/g, c => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[c]);

    function arrows(previousLabel, nextLabel, controlsId = '') {
        const controls = controlsId ? ` aria-controls="${escape(controlsId)}"` : '';
        return [previousLabel, nextLabel].map((label, i) => {
            const name = escape(label);
            return `<button type="button" class="browse-arrow ${i ? 'browse-next' : 'browse-prev'}" data-browse-step="${i ? 1 : -1}"${controls} aria-label="${name}" title="${name}"></button>`;
        }).join('');
    }
    window.AliceBrowse = {arrows};
})();
