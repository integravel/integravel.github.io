const app = document.getElementById("app");

let DATA = null;

fetch("data.json")
  .then(r => r.json())
  .then(json => {
    DATA = json;
    renderMenu();
  });

function getProgress(id) {
  return JSON.parse(localStorage.getItem("demo_" + id)) || {
    positions: {},   // { blocoId: zonaIndex }
    locked: [],      // blocos corretos
    erros: 0
  };
}

function saveProgress(id, data) {
  localStorage.setItem("demo_" + id, JSON.stringify(data));
}

function renderMenu() {
  app.innerHTML = "<h2>Demonstrações</h2>";

  DATA.demos.forEach(d => {
    const p = getProgress(d.id);
    const done = p.locked.length === 6;

    const div = document.createElement("div");
    div.className = "card " + (done ? "done" : "");
    div.innerHTML = `<strong>${d.titulo}</strong><br>Erros: ${p.erros}`;

    div.onclick = () => renderDemo(d);

    app.appendChild(div);
  });
}

function renderDemo(demo) {
  const progress = getProgress(demo.id);

  app.innerHTML = `
    <button onclick="renderMenu()">← Voltar</button>
    <p class="enunciado">${demo.enunciado}</p>
  `;

  demo.inicio.forEach(t => {
    app.innerHTML += `<p class="line">${t}</p>`;
  });

  demo.meio.forEach((_, i) => {
    app.innerHTML += `<div class="line dropzone" data-index="${i}"></div>`;
  });

  demo.final.forEach(t => {
    app.innerHTML += `<p class="line">${t}</p>`;
  });

  app.innerHTML += `<div class="options"></div>`;

  const options = document.querySelector(".options");
  const zones = document.querySelectorAll(".dropzone");

  const blocks = demo.meio.map((tex, i) => ({
    id: i,
    tex
  }));

  shuffle(blocks);

  // criar todos blocos
  blocks.forEach(b => {
    const el = createBlock(b, progress);
    options.appendChild(el);
  });

  // restaurar posições salvas
  Object.entries(progress.positions).forEach(([id, zoneIndex]) => {
    const el = document.querySelector(`[data-id="${id}"]`);
    const zone = zones[zoneIndex];
    if (el && zone) zone.appendChild(el);
  });

  // configurar zonas
  zones.forEach(zone => {
    const index = Number(zone.dataset.index);

    zone.addEventListener("dragover", e => e.preventDefault());

    zone.addEventListener("drop", e => {
      e.preventDefault();

      const id = Number(e.dataTransfer.getData("id"));
      const block = document.querySelector(`[data-id="${id}"]`);

      if (!block) return;

      zone.appendChild(block);
      progress.positions[id] = index;

      zone.classList.remove("correct", "wrong");

      if (id === index) {
        zone.classList.add("correct");

        if (!progress.locked.includes(id)) {
          progress.locked.push(id);
        }

        block.draggable = false;
        block.classList.add("locked");

      } else {
        zone.classList.add("wrong");
        progress.erros++;
      }

      saveProgress(demo.id, progress);
      typeset();
    });
  });

  // voltar blocos
  options.addEventListener("dragover", e => e.preventDefault());

  options.addEventListener("drop", e => {
    e.preventDefault();

    const id = Number(e.dataTransfer.getData("id"));

    if (progress.locked.includes(id)) return; // não remove correto

    const block = document.querySelector(`[data-id="${id}"]`);
    options.appendChild(block);

    delete progress.positions[id];

    // limpar cores
    zones.forEach(z => z.classList.remove("wrong"));

    saveProgress(demo.id, progress);
  });

  // aplicar estado visual inicial
  zones.forEach(zone => {
    const index = Number(zone.dataset.index);
    const child = zone.firstElementChild;

    if (!child) return;

    const id = Number(child.dataset.id);

    if (progress.locked.includes(id)) {
      zone.classList.add("correct");
      child.draggable = false;
      child.classList.add("locked");
    } else {
      if (id !== index) zone.classList.add("wrong");
    }
  });

  typeset();
}

function createBlock(b, progress) {
  const el = document.createElement("div");
  el.className = "draggable";
  el.dataset.id = b.id;
  el.innerHTML = b.tex;

  if (progress.locked.includes(b.id)) {
    el.draggable = false;
    el.classList.add("locked");
  } else {
    el.draggable = true;

    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("id", b.id);
    });
  }

  return el;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function typeset() {
  if (window.MathJax) MathJax.typesetPromise();
}
