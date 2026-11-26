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

// Older case-study and report links enter the corresponding passage of the single-page edit.
const formerSections = {
  "design-document": "game-design", "repair-guide": "tool-library",
  "crafting-title": "assembly", "space-title": "space", "access-title": "accessibility",
  "shared-life-title": "shared-life", "furniture-model": "furniture-collection",
  "furniture-choice": "furniture-collection", "collection-name": "furniture-collection",
  "spec-spec-overview": "overview", "spec-journey": "game-design", "spec-collection": "furniture-collection",
  "spec-crafting": "assembly", "spec-decoration": "assembly", "spec-residents": "residents",
  "spec-care": "shared-life", "spec-life": "shared-life", "spec-space": "space",
  "spec-persistence": "save-recovery", "spec-production": "results"
};
function followFormerSection() {
  const id = location.hash.slice(1);
  if (document.getElementById(id)) return;
  const next = formerSections[id] || (id.startsWith("survey-") ? "joinery-survey" : null);
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
