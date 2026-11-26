"use strict";

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

// The menu is the collection: each entry pairs a production model with its room capture.
document.addEventListener("DOMContentLoaded", () => {
  const model = document.getElementById("furniture-model");
  const picker = document.getElementById("furniture-choice");
  const room = document.getElementById("furniture-room");
  function showPiece() {
    const option = picker.selectedOptions[0];
    const capture = room.querySelector("img");
    capture.src = option.dataset.room;
    capture.alt = option.dataset.roomAlt;
    room.querySelector("strong").textContent = option.text;
    room.querySelector("figcaption span").textContent = option.dataset.caption;
    room.querySelector(".enlarge-art")?.setAttribute("aria-label", "Enlarge image: " + capture.alt);
    model.dispatchEvent(new CustomEvent("portfolio:inspect-furniture", {
      detail: { id: option.value, name: option.text, poster: option.dataset.studio, alt: option.dataset.studioAlt }
    }));
  }
  picker.closest("label").hidden = false;
  picker.addEventListener("change", showPiece);
  if (location.hash === "#bench-model") picker.value = "bench";
  showPiece();
  window.addEventListener("hashchange", () => {
    if (location.hash === "#bench-model") {
      picker.value = "bench";
      showPiece();
    }
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

// Older case-study and report links enter the corresponding passage of the single-page edit.
const formerSections = {
  "design-document": "game-design", "game-references": "game-design", "iteration-title": "iteration",
  "spec-spec-overview": "overview", "spec-journey": "game-design", "spec-collection": "furniture-collection",
  "spec-crafting": "assembly", "spec-decoration": "tool-library", "spec-residents": "residents",
  "spec-care": "residents", "spec-life": "household", "spec-space": "space",
  "spec-persistence": "results", "spec-production": "results", "crafting-title": "assembly",
  "joinery-survey": "research", "repair-guide": "tool-library", "room-consistency": "space", "space-title": "space",
  "characters": "residents", "shared-life": "residents", "shared-life-title": "residents"
};
function followFormerSection() {
  const id = location.hash.slice(1);
  const next = id.startsWith("survey-") ? "research" : /^station-[1-6]$/.test(id) ? "workshop" : formerSections[id];
  const target = next && document.getElementById(next);
  if (!target) return;
  try { history.replaceState(history.state, "", "#" + next); } catch { /* Offline bookmarks still scroll. */ }
  target.scrollIntoView({behavior: "instant", block: "start"});
}
followFormerSection();
window.addEventListener("hashchange", followFormerSection);

document.addEventListener("play", event => {
  if (!(event.target instanceof HTMLMediaElement)) return;
  for (const player of document.querySelectorAll("audio, video")) {
    if (player !== event.target && !player.paused) player.pause();
  }
}, true);
