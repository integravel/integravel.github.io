document.addEventListener("DOMContentLoaded", () => {

let DATA = null;
let current = null;

const app = document.getElementById("app");

/* =========================
   FALLBACK DATA (IMPORTANTE)
========================= */

const fallback = [
  {
    id: "teste",
    titulo: "√2 é irracional",
    enunciado: "\\( \\sqrt{2} \\) é irracional.",
    inicio: [
      "Suponha que seja racional",
      "Então \\( \\sqrt{2} = a/b \\)"
    ],
    blocos: [
      { id: "1", tex: "\\(2 = a^2/b^2\\)" },
      { id: "2", tex: "\\(2b^2 = a^2\\)" }
    ],
    fim: [
      "Contradição",
      "Logo irracional"
    ]
  }
];

/* =========================
   LOAD
========================= */

fetch("data.json")
  .then(r => r.json())
  .then(json => {
    DATA = json.demonstracoes;
    renderLista();
  })
  .catch(() => {
    console.warn("Usando fallback");
    DATA = fallback;
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

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${d.titulo}</strong><br>
      erros: ${state.erros}
    `;

    div.addEventListener("click", () => abrirDemo(d.id));

    app.appendChild(div);
  });
}

/* =========================
   DEMO
========================= */

function abrirDemo(id) {
  current = DATA.find(d => d.id === id);
  const state = getState(id);

  app.innerHTML = "";

  const back = document.createElement("div");
  back.className = "back";
  back.textContent = "← voltar";
  back.addEventListener("click", renderLista);
  app.appendChild(back);

  const p = document.createElement("p");
  p.innerHTML = `<strong>Teorema.</strong> ${current.enunciado}`;
  app.appendChild(p);

  current.inicio.forEach(t => {
    const el = document.createElement("p");
    el.innerHTML = t;
    app.appendChild(el);
  });

  current.blocos.forEach(b => {
    const zone = document.createElement("div");
    zone.className = "dropzone";
    zone.dataset.expected = b.id;

    enableDrop(zone, state);

    app.appendChild(zone);
  });

  current.fim.forEach(t => {
    const el = document.createElement("p");
    el.innerHTML = t;
    app.appendChild(el);
  });

  const options = document.createElement("div");
  options.className = "options";
  app.appendChild(options);

  current.blocos.forEach(b => {
    const el = document.createElement("div");
    el.className = "draggable";
    el.draggable = true;
    el.dataset.id = b.id;
    el.innerHTML = b.tex;

    el.addEventListener("dragstart", e => {
      console.log("drag", b.id); // DEBUG
      e.dataTransfer.setData("text/plain", b.id);
    });

    options.appendChild(el);
  });

  if (window.MathJax) MathJax.typesetPromise();
}

/* =========================
   DROP (VERSÃO SEGURA)
========================= */

function enableDrop(zone, state) {

  zone.addEventListener("dragover", e => {
    e.preventDefault();
  });

  zone.addEventListener("drop", e => {
    e.preventDefault();

    const id = e.dataTransfer.getData("text/plain");
    console.log("drop recebido:", id); // DEBUG

    if (!id) return;

    if (id === zone.dataset.expected) {
      zone.textContent = "✔ correto";
      zone.classList.add("locked");

      state.acertos[id] = true;
      saveState(current.id, state);

    } else {
      state.erros++;
      saveState(current.id, state);
      alert("errado");
    }
  });
}

});
