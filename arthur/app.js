// Dados portados do Python (ANION_DATA)
const ANION_DATA = {
  "CN⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"ppt branco","hno3":"insoluvel","pH":11},
  "S²⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"ppt preto","hno3":"insoluvel","pH":13},
  "SO₃²⁻": {"color":"incolor","rg":"+","ox":"-","baca":"ppt branco","acetic":"insoluvel","ag":"ppt branco","hno3":"soluvel","pH":9},
  "S₂O₃²⁻":{"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"ppt preto","hno3":"insoluvel","pH":9},
  "NO₂⁻": {"color":"incolor","rg":"+","ox":"+","baca":"nao precipita","acetic":"soluvel","ag":"ppt preto","hno3":"insoluvel","pH":8},
  "ClO⁻": {"color":"incolor","rg":"-","ox":"+","baca":"nao precipita","acetic":"soluvel","ag":"ppt preto","hno3":"insoluvel","pH":null},
  "CO₃²⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"soluvel","ag":"ppt branco","hno3":"soluvel","pH":12},
  "HCO₃⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"soluvel","ag":"ppt branco","hno3":"soluvel","pH":8},
  "F⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"insoluvel","ag":"ppt branco","hno3":"soluvel","pH":8.5},
  "C₂O₄²⁻":{"color":"incolor","rg":"+","ox":"-","baca":"ppt branco","acetic":"insoluvel","ag":"ppt branco","hno3":"soluvel","pH":9},
  "PO₄³⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"soluvel","ag":"ppt amarelo","hno3":"soluvel","pH":12},
  "CrO₄²⁻":{"color":"amarelo","rg":"-","ox":"+","baca":"ppt amarelo","acetic":"insoluvel","ag":"ppt marrom","hno3":"insolvel","pH":8},
  "Cr₂O₇²⁻":{"color":"laranja","rg":"-","ox":"+","baca":"ppt amarelo","acetic":"insoluvel","ag":"ppt marrom","hno3":"insolvel","pH":4},
  "SO₄²⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"insolvel","ag":"nao precipita","hno3":"soluvel","pH":7},
  "BO₂⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"soluvel","ag":"ppt bege","hno3":"soluvel","pH":9},
  "SCN⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"ppt branco","hno3":"insoluvel","pH":2},
  "I⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"ppt amarelo claro","hno3":"insoluvel","pH":[0,14]},
  "Cl⁻": {"color":"incolor","rg":"-","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"ppt branco","hno3":"insoluvel","pH":[0,14]},
  "CH₃COO⁻": {"color":"incolor","rg":"-","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"nao precipita","hno3":"soluvel","pH":[0,14]},
  "NO₃⁻": {"color":"incolor","rg":"-","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"nao precipita","hno3":"soluvel","pH":[0,14]},
  "Br⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"ppt amarelo claro","hno3":"insoluvel","pH":[0,14]}
};

function normalize(s){
  if (!s) return "";
  return String(s).trim().toLowerCase();
}

function processarEntrada(userInput){
  const explicacoes = [];
  const eliminados = new Set();

  const restantes = new Set(Object.keys(ANION_DATA));

  const color = normalize(userInput.color);
  const rg = normalize(userInput.rg);
  const ox = normalize(userInput.ox);
  const baca = normalize(userInput.baca);
  const acetic = normalize(userInput.acetic);
  const ag = normalize(userInput.ag);
  const hno3 = normalize(userInput.hno3);
  const ph_str = normalize(userInput.ph);

  // ---------------------- pH ----------------------
  if (ph_str !== "" && ph_str !== "nao medido"){
    const ph_user = parseFloat(ph_str);
    if (!isNaN(ph_user)){
      for(const [a,p] of Object.entries(ANION_DATA)){
        const ph = p.pH;
        if (Array.isArray(ph)){
          if (!(ph[0] <= ph_user && ph_user <= ph[1])) eliminados.add(a);
        } else if (typeof ph === "number"){
          if (ph !== ph_user) eliminados.add(a);
        }
      }
      explicacoes.push(`pH = ${ph_user} → elimina ânions fora desse valor`);
    }
  }

  // ---------------------- Cor ----------------------
  if (color === "incolor"){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.color !== "incolor") eliminados.add(a);
    }
    explicacoes.push("Cor: incolor → elimina coloridos");
  }
  if (color === "amarelo"){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.color === "laranja") eliminados.add(a);
    }
    explicacoes.push("Cor: amarela → elimina apenas laranja");
  }

  // ---------------------- RG/OX ----------------------
  if (rg && ox){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.rg !== rg || p.ox !== ox) eliminados.add(a);
    }
    explicacoes.push(`RG/OX: ${rg}/${ox} → filtra por comportamento redox`);
  }

  // ---------------------- Ba/Ca ----------------------
  if (baca){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.baca !== baca) eliminados.add(a);
    }
    explicacoes.push(`Ba/Ca: ${baca}`);
  }

  // ---------------------- Ácido acético ----------------------
  if (acetic){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.acetic !== acetic) eliminados.add(a);
    }
    explicacoes.push(`Ácido acético: ${acetic}`);
  }

  // ---------------------- Ag⁺ ----------------------
  if (ag){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.ag !== ag) eliminados.add(a);
    }
    explicacoes.push(`Ag⁺: ${ag}`);
  }

  // ---------------------- HNO₃ ----------------------
  if (hno3){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.hno3 !== hno3) eliminados.add(a);
    }
    explicacoes.push(`HNO₃: ${hno3}`);
  }

  // ---------------------- Final ----------------------
  const eliminadosArr = Array.from(eliminados).sort();
  const restantesArr = Object.keys(ANION_DATA)
    .filter(a => !eliminados.has(a))
    .sort();

  return {restantes: restantesArr, eliminados: eliminadosArr, explicacoes};
}

// -------------- UI HELPERS --------------
function getInput(){
  return {
    color: document.getElementById('color').value,
    ph: document.getElementById('ph').value,
    rg: document.getElementById('rg').value,
    ox: document.getElementById('ox').value,
    baca: document.getElementById('baca').value,
    acetic: document.getElementById('acetic').value,
    ag: document.getElementById('ag').value,
    hno3: document.getElementById('hno3').value
  };
}

function renderResultado({restantes, eliminados, explicacoes}){
  document.getElementById('restantes-list').innerHTML =
    restantes.length ? restantes.join(", ") : "—";

  document.getElementById('eliminados-list').innerHTML =
    eliminados.length ? eliminados.join(", ") : "—";

  document.getElementById('explicacoes-list').innerHTML =
    explicacoes.length ? "<ul><li>" + explicacoes.join("</li><li>") + "</li></ul>" : "—";
}

// -------------- Randomizer --------------
function gerarAleatorio(){
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];

  document.getElementById("color").value  = pick(["","incolor","amarelo","laranja"]);
  document.getElementById("ph").value     = Math.random()<0.8 ? (Math.random()*14).toFixed(1) : "";
  document.getElementById("rg").value     = pick(["","+","-"]);
  document.getElementById("ox").value     = pick(["","+","-"]);
  document.getElementById("baca").value   = pick(["","nao precipita","ppt branco","ppt marrom","ppt laranja"]);
  document.getElementById("acetic").value = pick(["","soluvel","insoluvel"]);
  document.getElementById("ag").value     = pick(["","nao precipita","ppt branco","ppt preto","ppt amarelo"]);
  document.getElementById("hno3").value   = pick(["","soluvel","insoluvel"]);

  renderResultado(processarEntrada(getInput()));
}

// -------------- Clear --------------
function limpar(){
  document.querySelectorAll("select, input").forEach(e=> e.value = "");
  renderResultado({restantes:[],eliminados:[],explicacoes:[]});
}

// -------------- Eventos --------------
document.getElementById("btn-identify").onclick = () => {
  renderResultado(processarEntrada(getInput()));
};

document.getElementById("btn-random").onclick = gerarAleatorio;
document.getElementById("btn-clear").onclick = limpar;

// Initial render
renderResultado({restantes:[],eliminados:[],explicacoes:[]});
