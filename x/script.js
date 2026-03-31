const app = document.getElementById("app");

let DATA = null;
let current = null;

fetch("data.json")
  .then(r => r.json())
  .then(json => {
    DATA = json.demonstracoes;
    renderLista();
  });

/* =========================
   STORAGE
========================= */

function getState(id) {
  return JSON.parse(localStorage.getItem("demo_" + id)) || {
    acertos: {},
    erros: 0
  };
}

function saveState(id, state) {
  localStorage.setItem("demo_" + id, JSON.stringify(state));
}

/* =========================
   LISTA
========================= */

function renderLista() {
  app.innerHTML = "<h2>Demonstrações</h2>";

  DATA.forEach(d => {
    const state = getState(d.id);
    const total = d.blocos.length;
    const feitos = Object.keys(state.acertos).length;

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${d.titulo}</strong><br>
      <span class="badge">
        ${feitos}/${total} completos | erros: ${state.erros}
      </span>
    `;

    div.onclick = () => abrirDemo(d.id);

    app.appendChild(div);
  });
}

/* =========================
   DEMONSTRAÇÃO
========================= */

function abrirDemo(id) {
  current = DATA.find(d => d.id === id);
  const state = getState(id);

  app.innerHTML = `
    <div class="back">← voltar</div>
    <p><strong>Teorema.</strong> ${current.enunciado}</p>
  `;

  document.querySelector(".back").onclick = renderLista;

  current.inicio.forEach(l => {
    app.innerHTML += `<p class="line">${l}</p>`;
  });

  current.blocos.forEach((b, i) => {
    const zone = document.createElement("div");
    zone.className = "line dropzone";
    zone.dataset.expected = b.id;

    if (state.acertos[b.id]) {
      zone.classList.add("locked");
      zone.innerHTML = b.tex;
    }

    enableDrop(zone, state);
    app.appendChild(zone);
  });

  current.fim.forEach(l => {
    app.innerHTML += `<p class="line">${l}</p>`;
  });

  const options = document.createElement("div");
  options.className = "options";
  app.appendChild(options);

  const livres = current.blocos.filter(b => !state.acertos[b.id]);
  shuffle(livres);

  livres.forEach(b => {
    const el = createBlock(b);
    options.appendChild(el);
  });

  MathJax.typesetPromise();
}

/* =========================
   DRAG & DROP
========================= */

function createBlock(data) {
  const div = document.createElement("div");
  div.className = "draggable";
  div.draggable = true;
  div.dataset.id = data.id;
  div.innerHTML = data.tex;

  div.addEventListener("dragstart", e => {
    e.dataTransfer.setData("id", data.id);
  });

  return div;
}

function enableDrop(zone, state) {
  zone.addEventListener("dragover", e => e.preventDefault());

  zone.addEventListener("drop", e => {
    e.preventDefault();

    if (zone.classList.contains("locked")) return;

    const id = e.dataTransfer.getData("id");

    if (id === zone.dataset.expected) {
      const bloco = current.blocos.find(b => b.id === id);

      zone.innerHTML = bloco.tex;
      zone.classList.add("locked");

      state.acertos[id] = true;
      saveState(current.id, state);

      document.querySelector(`.draggable[data-id="${id}"]`)?.remove();

    } else {
      state.erros++;
      saveState(current.id, state);
    }

    MathJax.typesetPromise();
  });
}

/* =========================
   UTIL
========================= */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
