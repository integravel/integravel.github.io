document.addEventListener("DOMContentLoaded", () => {

  const dropzones = document.querySelectorAll(".dropzone");
  const returnZone = document.querySelector(".dropzone-return");
  const feedback = document.getElementById("feedback");

  /* ===============================
     ATIVAR DRAG EM UM BLOCO
     =============================== */
  function enableDrag(el) {
    el.setAttribute("draggable", "true");

    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", el.dataset.id);
    });
  }

  /* ===============================
     EMBARALHAR BLOCOS
     =============================== */
  function shuffleBlocks() {
    const blocks = Array.from(returnZone.children);

    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }

    returnZone.innerHTML = "";
    blocks.forEach(b => {
      enableDrag(b);
      returnZone.appendChild(b);
    });
  }

  shuffleBlocks();

  /* ===============================
     DROP NAS LINHAS
     =============================== */
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
      const block = document.querySelector(`.draggable[data-id="${id}"]`);
      if (!block) return;

      zone.appendChild(block);
      enableDrag(block);

      if (window.MathJax) {
        MathJax.typesetPromise();
      }
    });
  });

  /* ===============================
     DROP DE VOLTA PARA OPÇÕES
     =============================== */
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
    const block = document.querySelector(`.draggable[data-id="${id}"]`);
    if (!block) return;

    returnZone.appendChild(block);
    enableDrag(block);

    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  });

  /* ===============================
     VERIFICAÇÃO
     =============================== */
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
      ? "Demonstração correta."
      : "Ainda há algo fora de ordem.";
  });

});