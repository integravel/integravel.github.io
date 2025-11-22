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
  if (s===null || s===undefined) return "";
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

  // pH
  if (ph_str !== "" && ph_str !== "nao foi possivel medir" && ph_str !== "nao medido"){
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
      explicacoes.push(`pH = ${ph_user} → elimina ânions fora desse valor (exceto os com pH = [0,14])`);
    }
  }

  // Cor
  if (color === "incolor"){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.color === "amarelo" || p.color === "laranja") eliminados.add(a);
    }
    explicacoes.push("Cor: incolor → elimina coloridos (amarelo, laranja)");
  } else if (color === "amarelo"){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.color === "laranja") eliminados.add(a);
    }
    explicacoes.push("Cor: amarelo → elimina apenas laranja");
  } else if (color === "laranja"){
    explicacoes.push("Cor: laranja → não elimina ninguém");
  }

  // RG/OX
  if (rg === "+" && ox === "-"){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.rg === "-" && p.ox === "+") eliminados.add(a);
    }
    explicacoes.push("RG/OX: redutor (+/-) → elimina oxidantes e anfóteros");
  } else if (rg === "+" && ox === "+"){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.rg === "+" && p.ox === "-") eliminados.add(a);
    }
    explicacoes.push("RG/OX: anfótero (++) → elimina oxidantes e redutores");
  } else if (rg === "-" && ox === "+"){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.rg === "+" && p.ox === "-") eliminados.add(a);
    }
    explicacoes.push("RG/OX: oxidante (-/+) → elimina redutores e anfóteros");
  } else if (rg === "-" && ox === "-"){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (!(p.rg === "-" && p.ox === "-")) eliminados.add(a);
    }
    explicacoes.push("RG/OX: neutro (--) → elimina todos, exceto neutros");
  }

  // Ba/Ca (baca)
  if (baca.includes("nao precipita")){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.baca && p.baca.includes("ppt")) eliminados.add(a);
    }
    explicacoes.push("Ba/Ca: não precipita → elimina os que precipitam");
  } else if (baca.includes("ppt branco")){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.baca && (p.baca.includes("marrom") || p.baca.includes("laranja") || p.baca.includes("preto"))) eliminados.add(a);
    }
    explicacoes.push("Ba/Ca: ppt branco → elimina coloridos");
  } else if (baca.includes("ppt marrom")){
    explicacoes.push("Ba/Ca: ppt marrom → não elimina ninguém");
  } else if (baca.includes("ppt laranja")){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.baca && (p.baca.includes("preto") || p.baca.includes("marrom"))) eliminados.add(a);
    }
    explicacoes.push("Ba/Ca: ppt laranja → elimina preto e marrom");
  }

  // Ácido acético
  if (acetic.includes("soluvel")){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.acetic && p.acetic.includes("insoluvel")) eliminados.add(a);
    }
    explicacoes.push("Ácido acético: solúvel → elimina insolúveis");
  } else if (acetic.includes("insoluvel")){
    explicacoes.push("Ácido acético: insolúvel → não elimina ninguém");
  }

  // Ag+
  if (ag.includes("ppt preto")){
    explicacoes.push("Ag⁺: ppt preto → não elimina ninguém");
  } else if (ag.includes("ppt branco")){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.ag && (p.ag.includes("amarelo") || p.ag.includes("marrom") || p.ag.includes("preto"))) eliminados.add(a);
    }
    explicacoes.push("Ag⁺: ppt branco → elimina coloridos");
  } else if (ag.includes("ppt amarelo")){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.ag && (p.ag.includes("laranja") || p.ag.includes("marrom") || p.ag.includes("preto"))) eliminados.add(a);
    }
    explicacoes.push("Ag⁺: ppt amarelo → elimina laranja, marrom/preto");
  }

  // HNO3
  if (hno3.includes("soluvel")){
    for(const [a,p] of Object.entries(ANION_DATA)){
      if (p.hno3 && p.hno3.includes("insol")) eliminados.add(a);
    }
    explicacoes.push("Ácido nítrico: solúvel → elimina insolúveis");
  } else if (hno3.includes("insoluvel")){
    explicacoes.push("Ácido nítrico: insolúvel → não elimina ninguém");
  }

  // Resultado final: calcular restantes
  const eliminadosArr = Array.from(eliminados).sort();
  const restantesArr = Object.keys(ANION_DATA).filter(a => !eliminados.has(a)).sort();

  return {restantes:restantesArr, eliminados:eliminadosArr, explicacoes};
}

// UI helpers
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
  document.getElementById('restantes-list').innerHTML = restantes.length?restantes.join(', '):'Nenhum';
  document.getElementById('eliminados-list').innerHTML = eliminados.length?eliminados.join(', '):'Nenhum';
  document.getElementById('explicacoes-list').innerHTML = explicacoes.length? ('<ul>' + explicacoes.map(e=>`<li>${e}</li>`).join('') + '</ul>') : '—';
}

function limpar(){
  document.getElementById('color').value='';
  document.getElementById('ph').value='';
  document.getElementById('rg').value='';
  document.getElementById('ox').value='';
  document.getElementById('baca').value='';
  document.getElementById('acetic').value='';
  document.getElementById('ag').value='';
  document.getElementById('hno3').value='';
  renderResultado({restantes:[],eliminados:[],explicacoes:[]});
}

function gerarAleatorio(){
  const colors = ['incolor','amarelo','laranja',''];
  const bacaOpts = ['nao precipita','ppt branco','ppt marrom','ppt laranja',''];
  const aceticOpts = ['soluvel','insoluvel',''];
  const agOpts = ['nao precipita','ppt branco','ppt preto','ppt amarelo',''];
  const hno3Opts = ['soluvel','insoluvel',''];
  const rgs = ['+','-',''];
  const oxs = ['+','-',''];
  const maybePh = Math.random()<0.85 ? (Math.round((Math.random()*14)*10)/10).toString() : '';

  document.getElementById('color').value = colors[Math.floor(Math.random()*colors.length)];
  document.getElementById('baca').value = bacaOpts[Math.floor(Math.random()*bacaOpts.length)];
  document.getElementById('acetic').value = aceticOpts[Math.floor(Math.random()*aceticOpts.length)];
  document.getElementById('ag').value = agOpts[Math.floor(Math.random()*agOpts.length)];
  document.getElementById('hno3').value = hno3Opts[Math.floor(Math.random()*hno3Opts.length)];
  document.getElementById('rg').value = rgs[Math.floor(Math.random()*rgs.length)];
  document.getElementById('ox').value = oxs[Math.floor(Math.random()*oxs.length)];
  document.getElementById('ph').value = maybePh;
  // run identify automatically for convenience
  const resultado = processarEntrada(getInput());
  renderResultado(resultado);
}

// Events
document.getElementById('btn-identify').addEventListener('click', ()=>{
  const resultado = processarEntrada(getInput());
  renderResultado(resultado);
});
document.getElementById('btn-clear').addEventListener('click', limpar);
document.getElementById('btn-random').addEventListener('click', gerarAleatorio);

// initial empty render
renderResultado({restantes:[],eliminados:[],explicacoes:[]});
