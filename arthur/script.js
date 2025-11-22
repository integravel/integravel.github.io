// -------------------------
//  Banco de dados dos ânions
// -------------------------
const ANION_DATA = {
  "CN⁻": {color:"incolor", rg:"+", ox:"-", baca:"nao precipita", acetic:"soluvel", ag:"ppt branco", hno3:"insoluvel", pH:11},
  "S²⁻": {color:"incolor", rg:"+", ox:"-", baca:"nao precipita", acetic:"soluvel", ag:"ppt preto", hno3:"insoluvel", pH:13},
  "SO₃²⁻": {color:"incolor", rg:"+", ox:"-", baca:"ppt branco", acetic:"insoluvel", ag:"ppt branco", hno3:"soluvel", pH:9},
  "S₂O₃²⁻":{color:"incolor", rg:"+", ox:"-", baca:"nao precipita", acetic:"soluvel", ag:"ppt preto", hno3:"insoluvel", pH:9},
  "NO₂⁻": {color:"incolor", rg:"+", ox:"+", baca:"nao precipita", acetic:"soluvel", ag:"ppt preto", hno3:"insoluvel", pH:8},
  "ClO⁻": {color:"incolor", rg:"-", ox:"+", baca:"nao precipita", acetic:"soluvel", ag:"ppt preto", hno3:"insoluvel", pH:null},
  "CO₃²⁻": {color:"incolor", rg:"-", ox:"-", baca:"ppt branco", acetic:"soluvel", ag:"ppt branco", hno3:"soluvel", pH:12},
  "HCO₃⁻": {color:"incolor", rg:"-", ox:"-", baca:"ppt branco", acetic:"soluvel", ag:"ppt branco", hno3:"soluvel", pH:8},
  "F⁻": {color:"incolor", rg:"-", ox:"-", baca:"ppt branco", acetic:"insoluvel", ag:"ppt branco", hno3:"soluvel", pH:8.5},
  "C₂O₄²⁻":{color:"incolor", rg:"+", ox:"-", baca:"ppt branco", acetic:"insoluvel", ag:"ppt branco", hno3:"soluvel", pH:9},
  "PO₄³⁻": {color:"incolor", rg:"-", ox:"-", baca:"ppt branco", acetic:"soluvel", ag:"ppt amarelo", hno3:"soluvel", pH:12},
  "CrO₄²⁻":{color:"amarelo", rg:"-", ox:"+", baca:"ppt amarelo", acetic:"insoluvel", ag:"ppt marrom", hno3:"insolvel", pH:8},
  "Cr₂O₇²⁻":{color:"laranja", rg:"-", ox:"+", baca:"ppt amarelo", acetic:"insoluvel", ag:"ppt marrom", hno3:"insolvel", pH:4},
  "SO₄²⁻": {color:"incolor", rg:"-", ox:"-", baca:"ppt branco", acetic:"insolvel", ag:"nao precipita", hno3:"soluvel", pH:7},
  "BO₂⁻": {color:"incolor", rg:"-", ox:"-", baca:"ppt branco", acetic:"soluvel", ag:"ppt bege", hno3:"soluvel", pH:9},
  "SCN⁻": {color:"incolor", rg:"+", ox:"-", baca:"nao precipita", acetic:"soluvel", ag:"ppt branco", hno3:"insoluvel", pH:2},
  "I⁻": {color:"incolor", rg:"+", ox:"-", baca:"nao precipita", acetic:"soluvel", ag:"ppt amarelo", hno3:"insoluvel", pH:[0,14]},
  "Cl⁻": {color:"incolor", rg:"-", ox:"-", baca:"nao precipita", acetic:"soluvel", ag:"ppt branco", hno3:"insoluvel", pH:[0,14]},
  "CH₃COO⁻": {color:"incolor", rg:"-", ox:"-", baca:"nao precipita", acetic:"soluvel", ag:"nao precipita", hno3:"soluvel", pH:[0,14]},
  "NO₃⁻": {color:"incolor", rg:"-", ox:"-", baca:"nao precipita", acetic:"soluvel", ag:"nao precipita", hno3:"soluvel", pH:[0,14]},
  "Br⁻": {color:"incolor", rg:"+", ox:"-", baca:"nao precipita", acetic:"soluvel", ag:"ppt amarelo", hno3:"insoluvel", pH:[0,14]}
};

// ----------------------------------------------------
//  Função principal de eliminação (IDA + IDAE unificados)
// ----------------------------------------------------
function processarEntrada(inp) {
  let eliminados = new Set();
  let explicacoes = [];

  for (let [anion, p] of Object.entries(ANION_DATA)) {

    // --- pH ---
    if (inp.ph !== "") {
      let phUser = parseFloat(inp.ph);

      if (Array.isArray(p.pH)) {
        if (phUser < p.pH[0] || phUser > p.pH[1]) {
          eliminados.add(anion);
        }
      } else if (typeof p.pH === "number" && p.pH !== phUser) {
        eliminados.add(anion);
      }
    }

    // --- cor ---
    if (inp.color === "incolor" && (p.color === "amarelo" || p.color === "laranja"))
      eliminados.add(anion);

    if (inp.color === "amarelo" && p.color === "laranja")
      eliminados.add(anion);

    // --- RG e OX ---
    if (inp.rg && inp.ox) {
      if (inp.rg === "+" && inp.ox === "-") {
        if (p.rg === "-" && p.ox === "+") eliminados.add(anion);
      }
      if (inp.rg === "+" && inp.ox === "+") {
        if (p.rg === "+" && p.ox === "-") eliminados.add(anion);
      }
      if (inp.rg === "-" && inp.ox === "+") {
        if (p.rg === "+" && p.ox === "-") eliminados.add(anion);
      }
      if (inp.rg === "-" && inp.ox === "-") {
        if (!(p.rg === "-" && p.ox === "-")) eliminados.add(anion);
      }
    }

    // --- Ba/Ca ---
    if (inp.baca === "nao precipita" && p.baca.includes("ppt"))
      eliminados.add(anion);

    if (inp.baca === "ppt branco" && (p.baca.includes("marrom") || p.baca.includes("laranja") || p.baca.includes("preto")))
      eliminados.add(anion);

    if (inp.baca === "ppt laranja" && (p.baca.includes("preto") || p.baca.includes("marrom")))
      eliminados.add(anion);

    // --- acético ---
    if (inp.acetic === "soluvel" && p.acetic === "insoluvel")
      eliminados.add(anion);

    // --- Ag ---
    if (inp.ag === "ppt branco" &&
       (p.ag.includes("amarelo") || p.ag.includes("marrom") || p.ag.includes("preto")))
      eliminados.add(anion);

    if (inp.ag === "ppt amarelo" &&
       (p.ag.includes("laranja") || p.ag.includes("marrom") || p.ag.includes("preto")))
      eliminados.add(anion);

    // --- HNO3 ---
    if (inp.hno3 === "soluvel" && p.hno3 === "insoluvel")
      eliminados.add(anion);
  }

  // gerar explicações automáticas
  explicacoes.push("Regras aplicadas com base nos dados fornecidos.");

  // gerar lista de restantes
  let restantes = Object.keys(ANION_DATA).filter(a => !eliminados.has(a));

  return {
    eliminados: [...eliminados],
    restantes,
    explicacoes
  };
}

// -------------------------
//  Interação com a interface
// -------------------------
document.getElementById("btn").addEventListener("click", () => {
  let inp = {
    color: document.getElementById("color").value,
    ph: document.getElementById("ph").value,
    rg: document.getElementById("rg").value,
    ox: document.getElementById("ox").value,
    baca: document.getElementById("baca").value,
    acetic: document.getElementById("acetic").value,
    ag: document.getElementById("ag").value,
    hno3: document.getElementById("hno3").value,
  };

  let r = processarEntrada(inp);
  renderResultados(r);
});

document.getElementById("clear").addEventListener("click", () => {
  document.getElementById("results").innerHTML = "";
});

function renderResultados(r) {
  let div = document.getElementById("results");
  div.innerHTML = "";

  let card1 = document.createElement("div");
  card1.className = "card";
  card1.innerHTML = `<h3>Ânions possíveis</h3><p>${r.restantes.join(", ")}</p>`;
  div.appendChild(card1);

  let card2 = document.createElement("div");
  card2.className = "card";
  card2.innerHTML = `<h3>Ânions eliminados</h3><p>${r.eliminados.join(", ") || "Nenhum"}</p>`;
  div.appendChild(card2);

  let card3 = document.createElement("div");
  card3.className = "card";
  card3.innerHTML = `<h3>Explicações</h3><p>${r.explicacoes.join("<br>")}</p>`;
  div.appendChild(card3);
}
