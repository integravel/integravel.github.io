const draggables = document.querySelectorAll(".draggable");
const dropzones = document.querySelectorAll(".dropzone");
const returnZone = document.querySelector(".dropzone-return");
const feedback = document.getElementById("feedback");

/* EMBARALHAR BLOCOS */
(function shuffle() {
  const blocks = Array.from(returnZone.children);
  blocks.sort(() => Math.random() - 0.5);
  blocks.forEach(b => returnZone.appendChild(b));
})();

/* DRAG */
draggables.forEach(el => {
  el.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", el.dataset.id);
  });
});

/* DROP NAS LINHAS */
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
    if (!block || zone.children.length > 0) return;

    zone.appendChild(block);
    MathJax.typesetPromise();
  });
});

/* DROP DE VOLTA PARA OPÇÕES */
returnZone.addEventListener("dragover", e => {
  e.preventDefault();
  returnZone.classList.add("hover");
});

returnZone.addEventListener("dragleave", () => {
  returnZone.classList.remove("hover");
});

returnZone.addEventListener("drop", e => {
  e.preventDefault();
  returnZone.classList.remove("hover");

  const id = e.dataTransfer.getData("text/plain");
  const block = document.querySelector(`[data-id="${id}"]`);
  if (!block) return;

  returnZone.appendChild(block);
  MathJax.typesetPromise();
});

/* VERIFICAÇÃO */
document.getElementById("check").addEventListener("click", () => {
  let correto = true;

  dropzones.forEach(zone => {
    const esperado = zone.dataset.expected;
    const child = zone.firstElementChild;
    if (!child || child.dataset.id !== esperado) correto = false;
  });

  feedback.textContent = correto
    ? "Demonstração correta."
    : "Ainda há algo fora de ordem.";
});