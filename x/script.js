document.addEventListener("DOMContentLoaded", () => {

  const dropzones = document.querySelectorAll(".dropzone");
  const returnZone = document.querySelector(".dropzone-return");

  const blocksData = [
    { id: "1", tex: "\\( N \\text{ não é divisível por nenhum dos } p_i \\)" },
    { id: "2", tex: "\\( N \\text{ é primo ou composto} \\)" },
    { id: "3", tex: "\\( N \\text{ possui um divisor primo } q \\)" },
    { id: "4", tex: "\\( q \\notin \\{p_1,\\ldots,p_n\\} \\)" },
    { id: "5", tex: "\\( \\text{Existe um primo fora da lista} \\)" },
    { id: "6", tex: "\\( \\text{A hipótese de finitude é falsa} \\)" }
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function createBlocks() {
    returnZone.innerHTML = "";

    const shuffled = [...blocksData];
    shuffle(shuffled);

    shuffled.forEach(data => {
      const div = document.createElement("div");
      div.className = "draggable";
      div.dataset.id = data.id;
      div.draggable = true;
      div.innerHTML = data.tex;

      enableDrag(div);
      returnZone.appendChild(div);
    });

    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  }

  function enableDrag(el) {
    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", el.dataset.id);
    });
  }

  createBlocks();

  function checkIndividual() {
    dropzones.forEach(zone => {
      const esperado = zone.dataset.expected;
      const child = zone.firstElementChild;

      zone.classList.remove("correct", "wrong");

      if (!child) return;

      if (child.dataset.id === esperado) {
        zone.classList.add("correct");
      } else {
        zone.classList.add("wrong");
      }
    });
  }

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

      if (window.MathJax) {
        MathJax.typesetPromise();
      }

      checkIndividual();
    });
  });

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

    if (window.MathJax) {
      MathJax.typesetPromise();
    }

    checkIndividual();
  });

});
