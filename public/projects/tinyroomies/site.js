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
    if (illustration.closest("[data-tool-viewer], tiny-voices, tiny-films, [data-no-lightbox], a, button")) continue;
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

const catalogue = document.getElementById("furniture-collection");
if (catalogue) {
  const controls = catalogue.querySelector(".catalogue-views");
  controls.hidden = false;
  controls.addEventListener("change", event => {
    const mode = event.target.value;
    for (const figure of catalogue.querySelectorAll("figure[data-room]")) {
      const image = figure.querySelector("img");
      image.src = figure.dataset[mode];
      image.alt = figure.dataset[mode + "Alt"];
      const opener = figure.querySelector(".enlarge-art");
      if (opener) opener.setAttribute("aria-label", "Enlarge image: " + image.alt);
    }
  });
}

// The catalogue cards supply both views of each piece, including the static fallback.
document.addEventListener("DOMContentLoaded", () => {
  const model = document.getElementById("furniture-model");
  const picker = document.getElementById("furniture-choice");
  const room = document.getElementById("furniture-room");
  if (!model || !picker || !room || !catalogue) return;

  const furniture = new Map();
  for (const group of catalogue.querySelectorAll(".belonging-group")) {
    const options = document.createElement("optgroup");
    options.label = group.querySelector("h4").textContent;
    for (const card of group.querySelectorAll("[data-furniture]")) {
      const id = card.dataset.furniture;
      const name = card.querySelector("figcaption strong").textContent;
      const inspect = document.createElement("button");
      inspect.className = "compare-piece";
      inspect.type = "button";
      inspect.textContent = "Inspect in 3D";
      inspect.setAttribute("aria-label", "Inspect " + name + " in 3D beside its room capture");
      inspect.addEventListener("click", () => {
        selectPiece(id);
        picker.focus({ preventScroll: true });
        catalogue.scrollIntoView({ block: "start" });
      });
      furniture.set(id, {card, name});
      options.append(new Option(name, id));
      card.append(inspect);
    }
    picker.append(options);
  }

  function selectPiece(id) {
    const entry = furniture.get(id);
    if (!entry) return;
    const {card, name} = entry;
    const capture = room.querySelector("img");
    capture.src = card.dataset.room;
    capture.alt = card.dataset.roomAlt;
    room.querySelector("strong").textContent = name;
    room.querySelector("figcaption span").textContent =
      card.querySelector("figcaption span").textContent;
    room.querySelector(".enlarge-art")?.setAttribute("aria-label", "Enlarge image: " + capture.alt);
    picker.value = id;
    model.dispatchEvent(new CustomEvent("portfolio:inspect-furniture", {
      detail: { id, name, poster: card.dataset.studio, alt: card.dataset.studioAlt }
    }));
  }

  picker.closest("label").hidden = false;
  picker.addEventListener("change", () => selectPiece(picker.value));
  selectPiece(location.hash === "#bench-model" ? "bench" : "record-player");
  window.addEventListener("hashchange", () => {
    if (location.hash === "#bench-model") selectPiece("bench");
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
  const target = document.getElementById(location.hash.slice(1));
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
