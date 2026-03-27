document.addEventListener("DOMContentLoaded", () => {

  const dropzones = document.querySelectorAll(".dropzone");
  const returnZone = document.querySelector(".dropzone-return");

  const pet = document.getElementById("pet");
  const hand = document.getElementById("pet-hand");
  const container = document.getElementById("pet-container");

  /* 🎯 ALINHA EXATAMENTE COM OS BLOCOS */
  function alignPet() {
    const first = dropzones[0];
    const last = dropzones[dropzones.length - 1];

    if (!first || !last) return;

    const rect1 = first.getBoundingClientRect();
    const rect2 = last.getBoundingClientRect();

    const middle = (rect1.top + rect2.bottom) / 2;

    container.style.top = middle - 55 + window.scrollY + "px";
  }

  window.addEventListener("resize", alignPet);
  window.addEventListener("scroll", alignPet);

  setTimeout(alignPet, 300);

  /* -------- DRAG -------- */

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
      const j = Math.random() * (i + 1) | 0;
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

    if (window.MathJax) MathJax.typesetPromise();
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

    zone.addEventListener("dragover", e => e.preventDefault());

    zone.addEventListener("drop", e => {
      e.preventDefault();

      if (zone.children.length > 0) return;

      const id = e.dataTransfer.getData("text/plain");
      const block = document.querySelector(`.draggable[data-id="${id}"]`);
      if (!block) return;

      zone.appendChild(block);

      if (window.MathJax) MathJax.typesetPromise();

      if (id === zone.dataset.expected) onCorrect();
      else onWrong();

      checkIndividual();
      alignPet(); // mantém alinhado
    });
  });

  returnZone.addEventListener("dragover", e => e.preventDefault());

  returnZone.addEventListener("drop", e => {
    e.preventDefault();

    const id = e.dataTransfer.getData("text/plain");
    const block = document.querySelector(`.draggable[data-id="${id}"]`);
    if (!block) return;

    returnZone.appendChild(block);

    if (window.MathJax) MathJax.typesetPromise();

    checkIndividual();
    alignPet();
  });

  /* 😸 REAÇÕES */

  let reacting = false;

  function react(sprite, handSprite, className) {
    if (reacting) return;
    reacting = true;

    pet.classList.remove("pet-happy", "pet-angry");
    pet.classList.add(className);

    pet.src = sprite;
    hand.src = handSprite;

    hand.style.opacity = 1;

    setTimeout(() => {
      hand.style.opacity = 0;
      pet.classList.remove(className);
      pet.src = "cat_idle.png";
      reacting = false;
    }, 700);
  }

  function onCorrect() {
    react("cat_happy.png", "hand_pet.png", "pet-happy");
  }

  function onWrong() {
    react("cat_angry.png", "hand_grab.png", "pet-angry");
  }

});