"use strict";

const translatePage = window.bindProjectTranslation(document.body, window.TinyRoomiesChinese);
const inChinese = () => document.documentElement.lang.startsWith("zh");
const localText = text => inChinese() ? (window.TinyRoomiesChinese[text] ?? text) : text;

const gallery = [
  { path: "edition/arrival", sizes: [630, 1157], name: "Arrival at the new home", alt: "The five residents sit inside an open wooden suitcase lined with green felt." },
  { path: "images/gallery/workshop", name: "The unfolded workshop", alt: "Unity simulator view of the open suitcase, with its turntable between two fold-out work areas." },
  { path: "images/gallery/tools", name: "The workshop inventory", alt: "A layout of the 22 project tools, fixtures and materials, from the joinery mallet to the wax pad." },
  { path: "images/gallery/residents", name: "The five residents", alt: "Studio renders of Sprout, Keeper, Page, Archivist and Courier." }
];

let currentPlate = 0;
function setPlate(step, animate = true) {
  currentPlate = (currentPlate + step + gallery.length) % gallery.length;
  const item = gallery[currentPlate];
  const [small, large] = item.sizes || [720, 1440];
  const img = document.getElementById("plate");
  img.srcset = item.path + "-sm.webp " + small + "w, " + item.path + ".webp " + large + "w";
  img.src = item.path + ".webp";
  img.alt = localText(item.alt);
  if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const incoming = currentPlate;
    img.decode().then(() => {
      if (incoming !== currentPlate) return;
      img.animate([
        { opacity: .55, transform: `translateX(${Math.sign(step) * 6}px)` },
        { opacity: 1, transform: "translateX(0)" }
      ], { duration: 180, easing: "ease-out" });
    }).catch(() => {});
  }
  const link = document.getElementById("plate-target");
  link.href = item.path + ".webp";
  link.setAttribute("aria-label", localText("Enlarge project image"));
  document.getElementById("plate-name").textContent = localText(item.name);
  document.querySelector(".plate-count").textContent = String(currentPlate + 1).padStart(2, "0") + " / 04";
}
document.getElementById("prev-plate").addEventListener("click", () => setPlate(-1));
document.getElementById("next-plate").addEventListener("click", () => setPlate(1));

document.querySelector(".hero-gallery").addEventListener("keydown", event => {
  if (event.altKey || event.metaKey || event.ctrlKey) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  setPlate(event.key === "ArrowRight" ? 1 : -1);
});

const detailDialog = document.getElementById("art-detail");
if (detailDialog) {
  const detailImage = detailDialog.querySelector("img");
  const title = detailDialog.querySelector("h2");
  const viewport = detailDialog.querySelector(".detail-viewport");
  const zoom = detailDialog.querySelector("[data-zoom]");
  const close = detailDialog.querySelector("[data-dismiss]");
  let dragging;

  function fitImage() {
    viewport.classList.remove("magnified", "panning");
    detailImage.style.removeProperty("width");
    zoom.textContent = localText("Magnify 2×");
    zoom.setAttribute("aria-pressed", "false");
    viewport.scrollTo(0, 0);
    dragging = null;
  }
  function openImage(src, alt, caption) {
    fitImage();
    detailImage.src = src;
    detailImage.alt = alt;
    title.textContent = caption || alt;
    detailDialog.showModal();
    close.focus();
  }

  close.addEventListener("click", () => detailDialog.close());
  detailDialog.addEventListener("close", fitImage);
  zoom.addEventListener("click", () => {
    if (viewport.classList.contains("magnified")) {
      fitImage();
      return;
    }
    const width = Math.min(viewport.clientWidth, viewport.clientHeight * detailImage.naturalWidth / detailImage.naturalHeight);
    if (!Number.isFinite(width) || !width) return;
    detailImage.style.width = width * 2 + "px";
    viewport.classList.add("magnified");
    zoom.textContent = localText("Fit image");
    zoom.setAttribute("aria-pressed", "true");
    viewport.scrollTo((viewport.scrollWidth - viewport.clientWidth) / 2, (viewport.scrollHeight - viewport.clientHeight) / 2);
    viewport.focus({ preventScroll: true });
  });

  viewport.addEventListener("pointerdown", event => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !viewport.classList.contains("magnified")) return;
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("panning");
  });
  viewport.addEventListener("pointermove", event => {
    if (dragging?.id === event.pointerId) viewport.scrollTo(dragging.left + dragging.x - event.clientX, dragging.top + dragging.y - event.clientY);
  });
  viewport.addEventListener("lostpointercapture", () => {
    dragging = null;
    viewport.classList.remove("panning");
  });

  for (const illustration of document.querySelectorAll(".case-story figure > img, .case-story .study-image > img")) {
    if (illustration.closest("[data-model], [data-tool-viewer], tiny-voices, tiny-films, [data-no-lightbox], a, button")) continue;
    const trigger = document.createElement("button");
    trigger.className = "enlarge-art";
    trigger.type = "button";
    trigger.setAttribute("aria-label", "Enlarge image: " + illustration.alt);
    illustration.replaceWith(trigger);
    trigger.appendChild(illustration);
  }
  document.addEventListener("click", event => {
    const trigger = event.target.closest(".enlarge-art, a[data-art-link]");
    if (!trigger || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const img = trigger.querySelector("img");
    if (!img && !trigger.href) return;
    event.preventDefault();
    const caption = trigger.closest("figure")?.querySelector("figcaption strong");
    openImage(trigger.href || img.dataset.full || img.currentSrc || img.src, img?.alt || trigger.textContent, caption?.textContent);
  });
}

document.querySelectorAll("dialog").forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});

for (const study of document.querySelectorAll("[data-posture]")) {
  const slider = study.querySelector("input[type=range]");
  const toolbar = study.querySelector(".posture-toolbar");
  const presets = [...toolbar.querySelectorAll("button")];
  function setPosition() {
    const share = Number(slider.value);
    study.style.setProperty("--standing-share", share + "%");
    slider.setAttribute("aria-valuetext", inChinese() ? "站姿 " + share + "%，坐姿 " + (100 - share) + "%" : share + "% standing, " + (100 - share) + "% seated");
    for (const button of presets) button.setAttribute("aria-pressed", String(share === Number(button.dataset.position)));
  }
  for (const button of presets) button.addEventListener("click", () => {
    slider.value = button.dataset.position;
    setPosition();
  });
  document.addEventListener("tinyroomies-language-change", setPosition);
  slider.addEventListener("input", setPosition);
  setPosition();
  study.classList.add("interactive");
  toolbar.hidden = false;
  slider.disabled = false;
}

// Direct links also reveal exhibits and credits inside a closed disclosure.
function revealLinkedContent() {
  const id = location.hash.slice(1);
  const aliases = {
    "save-recovery": "results", "furniture-model": "furniture-collection", "furniture-choice": "furniture-collection",
    "furniture-room": "furniture-collection", "design-document": "game-design", "joinery-survey": "research",
    "repair-guide": "assembly", "bench-model": "piece-bench", "experience-film": "results",
    "spec-collection": "household", "spec-crafting": "assembly", "spec-decoration": "assembly",
    "spec-residents": "residents", "spec-care": "shared-life", "spec-life": "shared-life",
    "spec-space": "space", "spec-persistence": "results", "spec-production": "results"
  };
  let target = document.getElementById(id);
  if (!target) {
    const chapter = aliases[id] || (id.startsWith("survey-") && "research")
      || (id.startsWith("op-") && "assembly") || (id.startsWith("spec-") && "game-design");
    target = chapter && document.getElementById(chapter);
    if (target) {
      history.replaceState(history.state, "", "#" + chapter);
      target.scrollIntoView({ block: "start" });
    }
  }
  if (!target) return;
  for (let node = target; node; node = node.parentElement) {
    if (node instanceof HTMLDetailsElement) node.open = true;
  }
}
window.addEventListener("hashchange", revealLinkedContent);
revealLinkedContent();

document.addEventListener("play", event => {
  if (!(event.target instanceof HTMLMediaElement)) return;
  for (const player of document.querySelectorAll("audio, video")) {
    if (player !== event.target && !player.paused) player.pause();
  }
}, true);

const drawingGuide = document.querySelector(".drawing-guide");
const referenceStill = document.querySelector("[data-manual-still]");
const referencePages = {
  "01_PageCabinet": ["display-cabinet", "Display cabinet · in-game manual", "收藏柜 · 游戏内图纸"],
  "02_KeeperFoldDesk": ["folding-worktable", "Folding worktable · in-game manual", "折叠工作桌 · 游戏内图纸"],
  "02_KeeperBench": ["knock-down-bench", "Knock-down bench · in-game manual", "可拆长凳 · 游戏内图纸"]
};
let openDrawing = "04_LeafShelf";
function updateManualStill() {
  const study = referencePages[openDrawing];
  const image = referenceStill.querySelector("img");
  const caption = study ? study[inChinese() ? 2 : 1] : localText("Reading shelf · in-game manual");
  const src = study ? "drawings/pieces/" + study[0] + (inChinese() ? "-zh.webp" : "-en.webp") : "narrative/manual-main.webp";
  if (image.getAttribute("src") !== src) image.src = src;
  image.alt = study ? caption : localText("The assembled shelf on the left page and the current insertion step on the right");
  referenceStill.querySelector("figcaption").textContent = caption;
  referenceStill.querySelector("button")?.setAttribute("aria-label", (inChinese() ? "放大图片：" : "Enlarge image: ") + image.alt);
}
window.addEventListener("message", event => {
  if (!drawingGuide || event.source !== drawingGuide.contentWindow) return;
  if (event.origin !== location.origin && !(location.protocol === "file:" && event.origin === "null")) return;
  const message = event.data;
  if (message?.type === "tinyroomies-guide-size" && Number.isFinite(message.height) && message.height > 0) {
    drawingGuide.height = String(Math.ceil(message.height) + 2);
  }
  if (message?.type === "tinyroomies-guide-piece") {
    openDrawing = message.piece;
    updateManualStill();
  }
});

const workshopMap = document.querySelector("[data-workshop-map]");
const workshopMovie = workshopMap.querySelector("video");
const views = document.querySelectorAll("[data-workshop-view]");
const diagram = workshopMap.querySelector(".workshop-model > a");
let workshopView = "map";

function showWorkshop(view) {
  workshopView = view;
  const playing = view !== "map";
  workshopMap.classList.toggle("is-playing", playing);
  workshopMovie.hidden = !playing;
  diagram.inert = playing;
  views.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.workshopView === view)));
  if (!playing) {
    workshopMovie.pause();
    return;
  }
  workshopMovie.src = "media/" + view + ".mp4";
  workshopMovie.play().catch(() => { if (workshopView === view) showWorkshop("map"); });
}
views.forEach(button => button.addEventListener("click", () => showWorkshop(button.dataset.workshopView)));
workshopMovie.addEventListener("ended", () => showWorkshop("map"));
workshopMovie.addEventListener("error", () => showWorkshop("map"));
workshopMap.querySelectorAll(".workshop-leaders path").forEach((path,index) => {
  path.setAttribute("pathLength", "1");
  path.style.setProperty("--order", index);
});
for (const selector of [".workshop-key li", ".workshop-leaders rect", ".workshop-pins span"]) {
  workshopMap.querySelectorAll(selector).forEach((element, index) => element.style.setProperty("--order", index));
}
new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    workshopMap.classList.add("arrived");
    observer.disconnect();
  }
}, {threshold:.2}).observe(workshopMap);

function tellManual(message) {
  drawingGuide.contentWindow?.postMessage(message, location.protocol === "file:" ? "*" : location.origin);
}
function notifyManualLanguage() {
  tellManual({ type: "tinyroomies-language", language: inChinese() ? "zh" : "en" });
}
let lastGuideWidth;
new ResizeObserver(([entry]) => {
  if (entry.contentRect.width === lastGuideWidth) return;
  lastGuideWidth = entry.contentRect.width;
  tellManual({ type: "tinyroomies-guide-measure" });
}).observe(drawingGuide);
drawingGuide.addEventListener("load", notifyManualLanguage);
document.addEventListener("tinyroomies-language-change", event => {
  translatePage(event.detail);
  document.title = localText("TinyRoomies — Game design portfolio") + " — Junyan He";
  setPlate(0, false);
  for (const button of document.querySelectorAll(".enlarge-art")) {
    button.setAttribute("aria-label", (inChinese() ? "放大图片：" : "Enlarge image: ") + button.querySelector("img").alt);
  }
  for (const stage of document.querySelectorAll(".model-stage[aria-keyshortcuts]")) {
    stage.setAttribute("aria-label", stage.querySelector("img").alt + (inChinese()
      ? "。拖动或用方向键旋转，按 Home 复位。"
      : ". Drag to rotate, or use the arrow keys. Home resets the view."));
  }
  notifyManualLanguage();
  updateManualStill();
});
