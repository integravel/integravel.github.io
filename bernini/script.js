// armazenamento local
function load(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

let profs = load("profs");
let labs = load("labs");
let discs = load("discs");

function render() {
  document.getElementById("profList").innerHTML =
    profs.map(p => `<li>${p}</li>`).join("");

  document.getElementById("labList").innerHTML =
    labs.map(l => `<li>${l}</li>`).join("");

  document.getElementById("discList").innerHTML =
    discs.map(d => `<li>${d.nome} - ${d.prof} - ${d.lab}</li>`).join("");
}

function addProf() {
  const v = document.getElementById("profName").value;
  if (!v) return;
  profs.push(v);
  save("profs", profs);
  render();
}

function addLab() {
  const v = document.getElementById("labName").value;
  if (!v) return;
  labs.push(v);
  save("labs", labs);
  render();
}

function addDisc() {
  const nome = document.getElementById("discName").value;
  const prof = document.getElementById("discProf").value;
  const lab = document.getElementById("discLab").value;

  if (!nome || !prof || !lab) return;

  discs.push({ nome, prof, lab });
  save("discs", discs);
  render();
}

// mini-solver simples (placeholder)
function generateSolutions() {
  let out = "Soluções encontradas:\n";

  discs.forEach((d, i) => {
    out += `Aula ${d.nome} → segunda ${8 + i}:00 no lab ${d.lab} com ${d.prof}\n`;
  });

  document.getElementById("solutions").innerText = out;
}

render();