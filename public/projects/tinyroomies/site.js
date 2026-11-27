"use strict";

const gallery = [
  { path: "edition/arrival", sizes: [630, 1157], name: "Arrival at the new home", target: "#game-design", action: "Explore how the five residents arrive", alt: "The five residents sit inside an open wooden suitcase lined with green felt." },
  { path: "images/gallery/workshop", name: "The unfolded workshop", target: "#workshop", action: "Explore the suitcase workshop", alt: "Unity simulator view of the open suitcase, with its turntable between two fold-out work areas." },
  { path: "images/gallery/tools", name: "The workshop inventory", target: "#tool-models", action: "Inspect the workshop tools in 3D", alt: "A layout of the 22 project tools, fixtures and materials, from the joinery mallet to the wax pad." },
  { path: "images/gallery/residents", name: "The five residents", target: "#residents", action: "Meet the residents and hear their voices", alt: "Studio renders of Sprout, Keeper, Page, Archivist and Courier." }
];

let currentPlate = 0;
function setPlate(step) {
  currentPlate = (currentPlate + step + gallery.length) % gallery.length;
  const item = gallery[currentPlate];
  const [small, large] = item.sizes || [720, 1440];
  const img = document.getElementById("plate");
  img.srcset = item.path + "-sm.webp " + small + "w, " + item.path + ".webp " + large + "w";
  img.src = item.path + ".webp";
  img.alt = item.alt;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
  link.href = item.target;
  link.setAttribute("aria-label", item.action);
  document.getElementById("plate-name").textContent = item.name;
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
    zoom.textContent = "Magnify 2×";
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
    zoom.textContent = "Fit image";
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
    slider.setAttribute("aria-valuetext", share + "% standing, " + (100 - share) + "% seated");
    for (const button of presets) button.setAttribute("aria-pressed", String(share === Number(button.dataset.position)));
  }
  for (const button of presets) button.addEventListener("click", () => {
    slider.value = button.dataset.position;
    setPosition();
  });
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
window.addEventListener("message", event => {
  if (!drawingGuide || event.source !== drawingGuide.contentWindow || event.origin !== location.origin) return;
  const message = event.data;
  if (message?.type === "tinyroomies-guide-size" && Number.isFinite(message.height) && message.height > 0) {
    drawingGuide.height = String(Math.ceil(message.height) + 2);
  }
});
