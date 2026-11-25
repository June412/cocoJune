(() => {
  const guide = document.querySelector("[data-recipe-guide]");
  if (!guide) return;

  const groups = Array.from(guide.querySelectorAll(".recipe-source")).map(source => ({
    label: source.querySelector("summary").textContent,
    steps: Array.from(source.querySelectorAll("li"), row => {
      const image = row.querySelector(".recipe-source-image");
      return {
        name: image.textContent,
        image: image.href,
        alt: image.dataset.alt,
        description: row.querySelector("p").textContent,
        tools: Array.from(row.querySelectorAll(".recipe-source-tools a"), link => ({
          id: link.dataset.toolId,
          name: link.textContent,
          image: link.href
        }))
      };
    })
  }));
  if (!groups.length) return;

  const outer = guide.closest("details");
  let selectGroup;
  function openGuide() {
    if (outer && !outer.open) return;
    if (selectGroup) return;
    outer?.removeEventListener("toggle", openGuide);
    guide.innerHTML = `
      <div class="recipe-selectors">
        <label>Process<select class="recipe-group-select"></select></label>
        <label>Operation<select class="recipe-step-select"></select></label>
      </div>
      <div class="recipe-panel">
        <div class="recipe-explanation">
          <p class="recipe-description"></p>
          <ul class="recipe-tool-list" aria-label="Tools and materials"></ul>
        </div>
        <figure class="recipe-frame">
          <img width="880" height="550" alt="">
          <figcaption>Workshop capture · Unity Editor</figcaption>
        </figure>
      </div>
      <div class="recipe-pager">
        <span class="recipe-position" aria-live="polite" aria-atomic="true"></span>
        <div>
          <button type="button" class="recipe-prev" aria-label="Previous operation">Previous</button>
          <button type="button" class="recipe-next" aria-label="Next operation">Next</button>
        </div>
      </div>`;
    const groupSelect = guide.querySelector(".recipe-group-select");
    const stepSelect = guide.querySelector(".recipe-step-select");
    const frame = guide.querySelector(".recipe-frame img");
    const description = guide.querySelector(".recipe-description");
    const toolList = guide.querySelector(".recipe-tool-list");
    const position = guide.querySelector(".recipe-position");
    const previous = guide.querySelector(".recipe-prev");
    const next = guide.querySelector(".recipe-next");
    groupSelect.replaceChildren(...groups.map(group => new Option(group.label)));

    function showStep(stepIndex) {
      const group = groups[groupSelect.selectedIndex];
      const step = group.steps[stepIndex];
      stepSelect.selectedIndex = stepIndex;
      frame.src = step.image;
      frame.alt = step.alt;
      description.textContent = step.description;
      toolList.replaceChildren(...step.tools.map(tool => {
        const item = document.createElement("li");
        const image = new Image(180, 135);
        image.src = tool.image;
        image.alt = "";
        const name = document.createElement("span");
        name.textContent = tool.name;
        const link = document.createElement("a");
        link.href = "#tool-models";
        link.dataset.inspectTool = tool.id;
        link.setAttribute("aria-label", "Inspect " + tool.name + " in 3D");
        link.append(image, name);
        item.append(link);
        return item;
      }));
      toolList.hidden = step.tools.length === 0;
      position.textContent = `${group.label} · ${stepIndex + 1} / ${group.steps.length} · ${step.name}`;
      previous.disabled = groupSelect.selectedIndex === 0 && stepIndex === 0;
      next.disabled = groupSelect.selectedIndex === groups.length - 1 && stepIndex === group.steps.length - 1;
    }
    function showGroup(groupIndex, stepIndex = 0) {
      groupSelect.selectedIndex = groupIndex;
      stepSelect.replaceChildren(...groups[groupIndex].steps.map(step => new Option(step.name)));
      showStep(stepIndex);
    }
    function advance(direction) {
      const groupIndex = groupSelect.selectedIndex;
      const index = stepSelect.selectedIndex + direction;
      if (index < 0) showGroup(groupIndex - 1, groups[groupIndex - 1].steps.length - 1);
      else if (index >= groups[groupIndex].steps.length) showGroup(groupIndex + 1);
      else showStep(index);
    }
    groupSelect.addEventListener("change", () => showGroup(groupSelect.selectedIndex));
    stepSelect.addEventListener("change", () => showStep(stepSelect.selectedIndex));
    previous.addEventListener("click", () => advance(-1));
    next.addEventListener("click", () => advance(1));
    selectGroup = showGroup;
    showGroup(0);
  }
  outer?.addEventListener("toggle", openGuide);
  openGuide();

  const viewer = document.getElementById("tool-models");
  viewer?.addEventListener("click", event => {
    const link = event.target.closest("a[data-recipe-tool]");
    if (!link) return;
    if (outer) outer.open = true;
    openGuide();
    for (const [groupIndex, group] of groups.entries()) {
      const stepIndex = group.steps.findIndex(step => step.tools.some(tool => tool.id === link.dataset.recipeTool));
      if (stepIndex !== -1) {
        selectGroup(groupIndex, stepIndex);
        break;
      }
    }
  });
  guide.addEventListener("click", event => {
    const link = event.target.closest("a[data-inspect-tool]");
    if (link && viewer) viewer.dispatchEvent(new CustomEvent("portfolio:inspect-tool", {detail: {id: link.dataset.inspectTool}}));
  });
})();
