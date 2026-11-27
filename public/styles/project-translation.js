// Keep the authored DOM intact so changing language preserves open sections,
// focus and playback. A replaced subtree can bind its own fresh text records.
window.bindProjectTranslation = function bindProjectTranslation(root, dictionary) {
  const entries = [];
  const normalize = value => value.trim().replace(/\s+/g, ' ');
  function add(value, set) {
    if (!value) return;
    const key = normalize(value);
    if (!Object.hasOwn(dictionary, key)) return;
    const translated = value.replace(value.trim(), () => dictionary[key]);
    entries.push({ english: value, chinese: translated, set });
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement?.closest('script,style,pre,code,noscript')) continue;
    const textNode = node;
    add(node.data, value => { textNode.data = value; });
  }
  for (const element of root.querySelectorAll('[alt],[aria-label],[title],[data-caption]')) {
    for (const attr of ['alt', 'aria-label', 'title', 'data-caption']) {
      add(element.getAttribute(attr), value => element.setAttribute(attr, value));
    }
  }
  return language => {
    for (const item of entries) item.set(language === 'zh' ? item.chinese : item.english);
  };
};
