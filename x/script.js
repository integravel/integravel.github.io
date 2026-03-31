const app = document.getElementById("app");

let DEMOS = [];
let currentDemo = null;

let dragged = null;
let offsetX = 0;
let offsetY = 0;
let originZone = null;

init();

async function init() {
  try {
    const res = await fetch("demos.json");
    DEMOS = await res.json();
    renderList();
  } catch (e) {
    app.innerHTML = "<p>Erro ao carregar o JSON.</p>";
    console.error(e);
  }
}

/* STORAGE */

function getProgress(id) {
  return JSON.parse(localStorage.getItem(id)) || {
    positions: {},
    errors: 0,
    done: false
  };
}

function saveProgress(id, data) {
  localStorage.setItem(id, JSON.stringify(data));
}

/* LISTA */

function renderList() {
  app.innerHTML = "<h2>Demonstrações</h2>";

  DEMOS.forEach(d => {
    const prog = getProgress(d.id);

    const el = document.createElement("div");
    el.className = "demo-item" + (prog.done ? " done" : "");
    el.innerHTML = `<strong>${d.title}</strong>`;
    el.onclick = () => openDemo(d.id);

    app.appendChild(el);
  });
}

/* DEMO */

function openDemo(id) {
  currentDemo = DEMOS.find(d => d.id === id);
  const prog = getProgress(id);

  app.innerHTML = "";

  const back = document.createElement("div");
  back.className = "back-btn";
  back.textContent = "← Voltar";
  back.onclick = renderList;
  app.appendChild(back);

  currentDemo.initial.forEach(addLine);

  const dropzones = [];

  const total = currentDemo.blocks.length;

  for (let i = 0; i < total; i++) {
    const dz = document.createElement("div");
    dz.className = "line dropzone";
    dz.dataset.expected = String(i + 1);
    app.appendChild(dz);
    dropzones.push(dz);
  }

  currentDemo.final.forEach(addLine);

  const options = document.createElement("div");
  options.className = "options";
  app.appendChild(options);

  createBlocks(options);
  restore(dropzones, options, prog);

  setupGlobalDrag(dropzones, options, prog, id);

  setTimeout(typeset, 0);
}

function addLine(tex) {
  const p = document.createElement("p");
  p.className = "line";
  p.innerHTML = tex;
  app.appendChild(p);
}

/* BLOCOS */

function createBlocks(container) {
  const shuffled = [...currentDemo.blocks].sort(() => Math.random() - 0.5);

  shuffled.forEach((b, index) => {
    const id = String(index + 1);

    const el = document.createElement("div");
    el.className = "draggable";
    el.dataset.id = id;
    el.innerHTML = b;

    setupDrag(el);
    container.appendChild(el);
  });
}

/* DRAG */

function setupDrag(el) {
  el.addEventListener("pointerdown", e => {
    if (el.classList.contains("locked")) return;

    dragged = el;
    originZone = el.parentElement;

    if (originZone && originZone.classList.contains("dropzone")) {
      originZone.classList.remove("correct", "wrong");
    }

    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.classList.add("dragging");
  });
}

function setupGlobalDrag(dropzones, options, prog, demoId) {

  window.onpointermove = e => {
    if (!dragged) return;

    dragged.style.left = e.clientX - offsetX + "px";
    dragged.style.top = e.clientY - offsetY + "px";
  };

  window.onpointerup = e => {
    if (!dragged) return;

    const target = document.elementFromPoint(e.clientX, e.clientY);
    let placed = false;

    dropzones.forEach(zone => {
      if (zone.contains(target) && zone.children.length === 0) {

        zone.appendChild(dragged);

        const correct = dragged.dataset.id === zone.dataset.expected;

        zone.classList.add(correct ? "correct" : "wrong");

        if (correct) dragged.classList.add("locked");
        else prog.errors++;

        prog.positions[dragged.dataset.id] = zone.dataset.expected;

        placed = true;
      }
    });

    if (!placed && options.contains(target)) {
      if (!dragged.classList.contains("locked")) {
        options.appendChild(dragged);
        delete prog.positions[dragged.dataset.id];
      }
    }

    if (originZone && originZone.classList.contains("dropzone")) {
      if (originZone.children.length === 0) {
        originZone.classList.remove("correct", "wrong");
      }
    }

    dragged.classList.remove("dragging");
    dragged.style.left = "";
    dragged.style.top = "";

    checkCompletion(dropzones, prog);
    saveProgress(demoId, prog);

    dragged = null;
    originZone = null;

    typeset();
  };
}

/* RESTORE */

function restore(dropzones, options, prog) {
  Object.entries(prog.positions).forEach(([id, pos]) => {
    const el = document.querySelector(`[data-id="${id}"]`);
    const zone = dropzones[pos - 1];

    if (!el || !zone) return;

    zone.appendChild(el);

    if (id === zone.dataset.expected) {
      zone.classList.add("correct");
      el.classList.add("locked");
    } else {
      zone.classList.add("wrong");
    }
  });
}

/* COMPLETO */

function checkCompletion(zones, prog) {
  const done = zones.every(z => {
    const c = z.firstChild;
    return c && c.dataset.id === z.dataset.expected;
  });

  if (done) prog.done = true;
}

/* MATHJAX */

function typeset() {
  if (window.MathJax) {
    MathJax.typesetClear();
    MathJax.typesetPromise();
  }
}
