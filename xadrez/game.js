/* ================= STORAGE ================= */

let customPieces = JSON.parse(localStorage.getItem("customPieces")||"[]");

function save(){
 localStorage.setItem("customPieces", JSON.stringify(customPieces));
}

/* ================= ESTADO ================= */

const game={
 board:Array.from({length:8},()=>Array(8).fill("")),
 turn:"w"
};

const boardEl=document.getElementById("board");
const dragEl=document.getElementById("drag");
const topMenu=document.getElementById("topMenu");
const bottomMenu=document.getElementById("bottomMenu");

/* ================= PEÇAS BASE ================= */

const baseSymbols={
 P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
 p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

/* ================= DRAG ================= */

let dragging=null;

document.addEventListener("pointermove",e=>{
 if(dragging){
  dragEl.style.left=e.clientX+"px";
  dragEl.style.top=e.clientY+"px";
 }
});

document.addEventListener("pointerup",e=>{
 if(!dragging) return;

 let el=document.elementFromPoint(e.clientX,e.clientY);

 if(el?.dataset){
  let r=+el.dataset.r;
  let c=+el.dataset.c;
  game.board[r][c]=dragging;
 }

 dragging=null;
 dragEl.textContent="";
 draw();
});

/* ================= MENUS ================= */

function getAllPieces(){

 let list=[...Object.keys(baseSymbols)];

 customPieces.forEach((p,i)=>{
  list.push("c"+i);
 });

 return list;
}

function getSymbol(p){

 if(baseSymbols[p]) return baseSymbols[p];

 let i=parseInt(p.slice(1));
 return customPieces[i].symbol;
}

function drawMenus(){

 topMenu.innerHTML="";
 bottomMenu.innerHTML="";

 getAllPieces().forEach(p=>{

  let el=document.createElement("div");
  el.className="menuPiece";
  el.textContent=getSymbol(p);

  el.onpointerdown=e=>{
    dragging=p;
    dragEl.textContent=getSymbol(p);
  };

  if(p===p.toLowerCase()) topMenu.appendChild(el);
  else bottomMenu.appendChild(el);
 });
}

/* ================= TABULEIRO ================= */

function draw(){

 boardEl.innerHTML="";

 for(let r=0;r<8;r++){
  for(let c=0;c<8;c++){

   let cell=document.createElement("div");
   cell.className="cell "+((r+c)%2?"dark":"light");
   cell.dataset.r=r;
   cell.dataset.c=c;

   let p=game.board[r][c];

   if(p){
    let el=document.createElement("div");
    el.className="piece";
    el.textContent=getSymbol(p);
    cell.appendChild(el);
   }

   boardEl.appendChild(cell);
  }
 }

 drawMenus();
}

/* ================= EDITOR ================= */

const editor=document.getElementById("editor");

function openEditor(){
 editor.classList.remove("hidden");
 renderEditor();
}

function closeEditor(){
 editor.classList.add("hidden");
}

function renderEditor(){

 let list=document.getElementById("pieceList");
 list.innerHTML="";

 customPieces.forEach((p,i)=>{

  let div=document.createElement("div");
  div.innerHTML=`
   ${p.symbol}
   <button onclick="deletePiece(${i})">Apagar</button>
  `;

  list.appendChild(div);
 });
}

/* ================= CRIAR PEÇA ================= */

function createPiece(){

 if(customPieces.length>=6){
  alert("Máximo 6 peças");
  return;
 }

 let symbol=prompt("Digite um símbolo (ex: ★ ☠ ♞)");

 if(!symbol) return;

 let move=prompt("Movimento (ex: N, B, R, Q, K)");
 let attack=prompt("Ataque (ex: N, B, R, Q, K)");

 customPieces.push({symbol,move,attack});

 save();
 renderEditor();
 drawMenus();
}

/* ================= DELETE ================= */

function deletePiece(i){
 customPieces.splice(i,1);
 save();
 renderEditor();
 drawMenus();
}

/* ================= RESET ================= */

function resetAll(){

 if(!confirm("Tem certeza? Isso apaga tudo!")) return;

 customPieces=[];
 game.board=Array.from({length:8},()=>Array(8).fill(""));

 save();
 draw();
 renderEditor();
}

/* ================= INIT ================= */

draw();