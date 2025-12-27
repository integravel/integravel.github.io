const draggables = document.querySelectorAll(".draggable");
const dropzones = document.querySelectorAll(".dropzone");
const feedback = document.getElementById("feedback");

draggables.forEach(el => {
  el.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", el.dataset.id);
  });
});

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

    if (zone.children.length > 0) return;

    const id = e.dataTransfer.getData("text/plain");
    const block = document.querySelector(`[data-id="${id}"]`);

    if (!block) return;

    zone.appendChild(block);

    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  });
});

document.getElementById("check").addEventListener("click", () => {
  let correto = true;

  dropzones.forEach(zone => {
    const esperado = zone.dataset.expected;
    const child = zone.firstElementChild;

    if (!child || child.dataset.id !== esperado) {
      correto = false;
    }
  });

  feedback.textContent = correto
    ? "🌟 Demonstração completa e correta!"
    : "💭 Algo não está na ordem certa. Tente novamente!";
});