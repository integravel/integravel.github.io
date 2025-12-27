const draggables = document.querySelectorAll(".draggable");
const dropzones = document.querySelectorAll(".dropzone");
const returnZone = document.querySelector(".dropzone-return");
const feedback = document.getElementById("feedback");

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

    if (!block) return;

    // se já tiver algo, não aceita
    if (zone.children.length > 0) return;

    zone.appendChild(block);

    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  });
});

/* DROP DE VOLTA PARA A ÁREA DE OPÇÕES */
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

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
});

/* VERIFICAÇÃO */
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
    ? "🌟 Demonstração correta! Muito bem!"
    : "💭 Algo não está certo ainda. Reorganize as linhas!";
});