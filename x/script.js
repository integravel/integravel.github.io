let dados = [];
let atual = null;
let progresso = JSON.parse(localStorage.getItem("progresso") || "{}");

const listaView = document.getElementById("lista-view");
const demoView = document.getElementById("demo-view");
const listaDiv = document.getElementById("lista");

const enunciadoEl = document.getElementById("enunciado");
const demoContainer = document.getElementById("demo-container");
const options = document.getElementById("options");

document.getElementById("back").onclick = () => {
  salvarProgresso();
  demoView.classList.add("hidden");
  listaView.classList.remove("hidden");
  renderLista();
};

fetch("dados.json")
  .then(r => r.json())
  .then(json => {
    dados = json;
    renderLista();
  });

function renderLista() {
  listaDiv.innerHTML = "";

  dados.forEach((d, i) => {
    const item = document.createElement("div");
    item.className = "item";

    const prog = progresso[d.id];

    item.innerHTML = `
      <strong>${d.titulo}</strong>
      <span>
        ${prog?.completo ? "✅" : "⬜"}
        erros: ${prog?.erros || 0}
      </span>
    `;

    item.onclick = () => abrirDemo(d.id);
    listaDiv.appendChild(item);
  });
}

function abrirDemo(id) {
  atual = dados.find(d => d.id === id);

  listaView.classList.add("hidden");
  demoView.classList.remove("hidden");

  enunciadoEl.innerHTML = `<strong>Teorema.</strong> ${atual.enunciado}`;

  renderDemo();
}

function renderDemo() {
  demoContainer.innerHTML = "";
  options.innerHTML = "";

  const prog = progresso[atual.id] || { colocados: {}, erros: 0 };

  // LINHAS FIXAS INICIAIS
  atual.inicio.forEach(t => {
    demoContainer.appendChild(createLine(t));
  });

  // DROPZONES
  atual.passos.forEach((_, i) => {
    const zone = document.createElement("div");
    zone.className = "line dropzone";
    zone.dataset.index = i;

    if (prog.colocados[i]) {
      const bloco = createBlock(prog.colocados[i]);
      zone.appendChild(bloco);

      if (prog.colocados[i] === atual.passos[i].id) {
        zone.classList.add("correct");
        bloco.draggable = false;
      } else {
        zone.classList.add("wrong");
      }
    }

    enableDrop(zone);
    demoContainer.appendChild(zone);
  });

  // LINHAS FINAIS
  atual.fim.forEach(t => {
    demoContainer.appendChild(createLine(t));
  });

  // BLOCOS
  const usados = Object.values(prog.colocados);

  const restantes = atual.passos.filter(p => !usados.includes(p.id));

  shuffle(restantes);

  restantes.forEach(p => {
    options.appendChild(createBlock(p.id));
  });

  MathJax.typesetPromise();
}

function createLine(html) {
  const p = document.createElement("p");
  p.className = "line";
  p.innerHTML = html;
  return p;
}

function createBlock(id) {
  const data = atual.passos.find(p => p.id === id);

  const div = document.createElement("div");
  div.className = "draggable";
  div.dataset.id = id;
  div.innerHTML = data.tex;
  div.draggable = true;

  div.addEventListener("dragstart", e => {
    e.dataTransfer.setData("id", id);
  });

  return div;
}

function enableDrop(zone) {
  zone.addEventListener("dragover", e => e.preventDefault());

  zone.addEventListener("drop", e => {
    e.preventDefault();

    if (zone.children.length > 0) return;

    const id = e.dataTransfer.getData("id");
    const block = document.querySelector(`.draggable[data-id="${id}"]`);
    if (!block) return;

    zone.appendChild(block);

    const index = zone.dataset.index;
    const correto = atual.passos[index].id === id;

    if (!progresso[atual.id]) {
      progresso[atual.id] = { colocados: {}, erros: 0 };
    }

    progresso[atual.id].colocados[index] = id;

    if (correto) {
      zone.classList.add("correct");
      block.draggable = false;
    } else {
      zone.classList.add("wrong");
      progresso[atual.id].erros++;
    }

    salvarProgresso();
    checkCompleto();

    MathJax.typesetPromise();
  });
}

function checkCompleto() {
  const prog = progresso[atual.id];
  if (!prog) return;

  const completo = atual.passos.every((p, i) => prog.colocados[i] === p.id);

  if (completo) {
    prog.completo = true;
    salvarProgresso();
  }
}

function salvarProgresso() {
  localStorage.setItem("progresso", JSON.stringify(progresso));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0;
    [array[i], array[j]] = [array[j], array[i]];
  }
}
