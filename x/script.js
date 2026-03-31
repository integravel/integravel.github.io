const app = document.getElementById("app");

let DATA = null;
let current = null;

/* =========================
   LOAD
========================= */

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
  app.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Demonstrações";
  app.appendChild(title);

  DATA.forEach(d => {
    const state = getState(d.id);
    const total = d.blocos.length;
    const feitos = Object.keys(state.acertos).length;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <strong>${d.titulo}</strong><br>
      <span class="badge">
        ${feitos}/${total} completos | erros: ${state.erros}
      </span>
    `;

    card.onclick = () => abrirDemo(d.id);

    app.appendChild(card);
  });
}

/* =========================
   DEMONSTRAÇÃO
========================= */

function abrirDemo(id) {
  current = DATA.find(d => d.id === id);
  const state = getState(id);

  app.innerHTML = "";

  /* BOTÃO VOLTAR */
  const back = document.createElement("div");
  back.className = "back";
  back.textContent = "← voltar";
  back.onclick = renderLista;
  app.appendChild(back);

  /* ENUNCIADO */
  const enunciado = document.createElement("p");
  enunciado.innerHTML = `<strong>Teorema.</strong> ${current.enunciado}`;
  app.appendChild(enunciado);

  /* INÍCIO */
  current.inicio.forEach(l => {
    const p = document.createElement("p");
    p.className = "line";
    p.innerHTML = l;
    app.appendChild(p);
  });

  /* DROPZONES */
  current.blocos.forEach(b => {
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

  /* FINAL */
  current.fim.forEach(l => {
    const p = document.createElement("p");
    p.className = "line";
    p.innerHTML = l;
    app.appendChild(p);
  });

  /* BLOCOS DISPONÍVEIS */
  const options = document.createElement("div");
  options.className = "options";
  app.appendChild(options);

  const livres = current.blocos.filter(b => !state.acertos[b.id]);
  shuffle(livres);

  livres.forEach(b => {
    options.appendChild(createBlock(b));
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
    e.dataTransfer.setData("text/plain", data.id);
  });

  return div;
}

function enableDrop(zone, state) {
  zone.addEventListener("dragover", e => {
    e.preventDefault(); // ESSENCIAL
  });

  zone.addEventListener("drop", e => {
    e.preventDefault();

    if (zone.classList.contains("locked")) return;

    const id = e.dataTransfer.getData("text/plain");

    if (!id) return;

    if (id === zone.dataset.expected) {
      const bloco = current.blocos.find(b => b.id === id);

      zone.innerHTML = bloco.tex;
      zone.classList.add("locked");

      state.acertos[id] = true;
      saveState(current.id, state);

      const el = document.querySelector(`.draggable[data-id="${id}"]`);
      if (el) el.remove();

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
