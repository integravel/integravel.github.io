const app = document.getElementById("app");

let DEMOS = [];
let currentDemo = null;

init();

async function init() {
  const res = await fetch("demos.json");
  DEMOS = await res.json();
  renderList();
}

/* =========================
   STORAGE
========================= */

function getProgress(id) {
  return JSON.parse(localStorage.getItem("demo_" + id)) || {
    positions: {},
    errors: 0,
    done: false
  };
}

function saveProgress(id, data) {
  localStorage.setItem("demo_" + id, JSON.stringify(data));
}

/* =========================
   LISTA
========================= */

function renderList() {
  app.innerHTML = "<h2>Demonstrações</h2>";

  DEMOS.forEach(demo => {
    const prog = getProgress(demo.id);

    const div = document.createElement("div");
    div.className = "demo-item" + (prog.done ? " done" : "");

    div.innerHTML = `
      <strong>${demo.title}</strong><br>
      Erros: ${prog.errors}
    `;

    div.onclick = () => openDemo(demo.id);

    app.appendChild(div);
  });
}

/* =========================
   DEMONSTRAÇÃO
========================= */

function openDemo(id) {
  currentDemo = DEMOS.find(d => d.id === id);
  const prog = getProgress(id);

  app.innerHTML = "";

  const back = document.createElement("div");
  back.className = "back-btn";
  back.textContent = "← Voltar";
  back.onclick = renderList;

  app.appendChild(back);

  currentDemo.initial.forEach(t => addLine(t));

  const dropzones = [];

  currentDemo.blocks.forEach((_, i) => {
    const dz = document.createElement("div");
    dz.className = "line dropzone";
    dz.dataset.expected = i + 1;
    app.appendChild(dz);
    dropzones.push(dz);
  });

  currentDemo.final.forEach(t => addLine(t));

  const options = document.createElement("div");
  options.className = "options";
  app.appendChild(options);

  createBlocks(options, prog);

  enableDrop(dropzones, options, prog, id);

  restorePositions(dropzones, options, prog);

  if (window.MathJax) MathJax.typesetPromise();
}

function addLine(tex) {
  const p = document.createElement("p");
  p.className = "line";
  p.innerHTML = tex;
  app.appendChild(p);
}

/* =========================
   BLOCOS
========================= */

function createBlocks(container, prog) {
  const shuffled = [...currentDemo.blocks]
    .sort(() => Math.random() - 0.5);

  shuffled.forEach((b, i) => {
    const div = document.createElement("div");
    div.className = "draggable";
    div.dataset.id = i + 1;
    div.innerHTML = b;

    enableDrag(div);
    container.appendChild(div);
  });
}

function enableDrag(el) {
  el.setAttribute("draggable", "true");

  el.addEventListener("mousedown", () => {
    el.style.cursor = "grabbing";
  });

  el.addEventListener("mouseup", () => {
    el.style.cursor = "grab";
  });

  el.addEventListener("dragstart", e => {
    if (el.classList.contains("locked")) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("id", el.dataset.id);
  });
}

/* =========================
   DROP + LÓGICA
========================= */

function enableDrop(dropzones, options, prog, id) {

  dropzones.forEach(zone => {

    zone.addEventListener("dragover", e => e.preventDefault());

    zone.addEventListener("drop", e => {
      e.preventDefault();

      if (zone.children.length > 0) return;

      const idBlock = e.dataTransfer.getData("id");
      const block = document.querySelector(`[data-id="${idBlock}"]`);

      zone.appendChild(block);

      const correct = idBlock === zone.dataset.expected;

      zone.classList.add(correct ? "correct" : "wrong");

      if (correct) {
        block.classList.add("locked");
      } else {
        prog.errors++;
      }

      prog.positions[idBlock] = zone.dataset.expected;
      checkCompletion(dropzones, prog);

      saveProgress(id, prog);
    });
  });

  options.addEventListener("dragover", e => e.preventDefault());

  options.addEventListener("drop", e => {
    e.preventDefault();

    const idBlock = e.dataTransfer.getData("id");
    const block = document.querySelector(`[data-id="${idBlock}"]`);

    if (block.classList.contains("locked")) return;

    options.appendChild(block);
    delete prog.positions[idBlock];

    saveProgress(id, prog);
  });
}

/* =========================
   RESTAURAR
========================= */

function restorePositions(dropzones, options, prog) {
  Object.entries(prog.positions).forEach(([id, pos]) => {
    const block = document.querySelector(`[data-id="${id}"]`);
    const zone = dropzones[pos - 1];

    zone.appendChild(block);

    if (id == zone.dataset.expected) {
      zone.classList.add("correct");
      block.classList.add("locked");
    } else {
      zone.classList.add("wrong");
    }
  });
}

/* =========================
   COMPLETO
========================= */

function checkCompletion(dropzones, prog) {
  const allCorrect = dropzones.every(z => {
    const child = z.firstChild;
    return child && child.dataset.id === z.dataset.expected;
  });

  if (allCorrect) {
    prog.done = true;
  }
}
