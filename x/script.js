const draggables = document.querySelectorAll(".draggable");
const dropzones = document.querySelectorAll(".dropzone");
const feedback = document.getElementById("feedback");

/* ===== DRAG ===== */

draggables.forEach(el => {
  el.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", el.dataset.id);
  });
});

/* ===== DROP ===== */

dropzones.forEach(zone => {
  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.classList.add("hover");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("hover");
  });

  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("hover");

    const id = e.dataTransfer.getData("text/plain");
    const block = document.querySelector(`[data-id="${id}"]`);

    if (!block) return;

    // evita mais de um bloco por grid
    if (zone.children.length === 0) {
      zone.appendChild(block);

      // 🔑 recalcula o LaTeX depois do drop
      if (window.MathJax) {
        MathJax.typesetPromise();
      }
    }
  });
});

/* ===== VERIFICAÇÃO ===== */

document.getElementById("check").addEventListener("click", () => {
  let correto = true;

  dropzones.forEach(zone => {
    const expected = zone.dataset.expected;
    const child = zone.firstElementChild;

    if (!child || child.dataset.id !== expected) {
      correto = false;
    }
  });

  if (correto) {
    feedback.textContent = "🌟 Perfeito! Você completou a demonstração de Euclides!";
    feedback.style.color = "#9C59D1";
  } else {
    feedback.textContent = "💭 Quase lá! Reorganize os passos e tente novamente.";
    feedback.style.color = "#2C2C2C";
  }
});