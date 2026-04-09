/* ================= STORAGE ================= */

let customPieces = JSON.parse(localStorage.getItem("customPieces")||"[]");

function save(){
 localStorage.setItem("customPieces", JSON.stringify(customPieces));
}

/* ================= ESTADO ================= */

const game={
 board:Array.from({length:8},()=>Array(8).fill(""))
};

const boardEl=document.getElementById("board");
const dragEl=document.getElementById("drag");
const topMenu=document.getElementById("topMenu");
const bottomMenu=document.getElementById("bottomMenu");

/* ================= SÍMBOLOS ================= */

const baseSymbols={
 P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
 p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

const iconList=[
 "★","✦","✪","☀","☠","☢","☣","⚔","⚙","♞","♜","♛",
 "⚡","🔥","💀","👑","🛡","🧿","🔮","🌀"
];

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
 customPieces.forEach((p,i)=>list.push("c"+i));
 return list;
}

function getSymbol(p){
 if(baseSymbols[p]) return baseSymbols[p];
 return customPieces[parseInt(p.slice(1))].symbol;
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

  topMenu.appendChild(el);
  bottomMenu.appendChild(el);
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

let creating=null;
let phase=0;
let anchor=null;

const phases=[
 {text:"Movimento (Topo Esquerda)", anchor:[0,0], type:"move"},
 {text:"Ataque (Topo Esquerda)", anchor:[0,0], type:"attack"},

 {text:"Movimento (Topo Direita)", anchor:[0,7], type:"move"},
 {text:"Ataque (Topo Direita)", anchor:[0,7], type:"attack"},

 {text:"Movimento (Baixo Esquerda)", anchor:[7,0], type:"move"},
 {text:"Ataque (Baixo Esquerda)", anchor:[7,0], type:"attack"},

 {text:"Movimento (Baixo Direita)", anchor:[7,7], type:"move"},
 {text:"Ataque (Baixo Direita)", anchor:[7,7], type:"attack"}
];

/* abrir */
function openEditor(){
 editor.classList.remove("hidden");
 showIconPicker();
}

function closeEditor(){
 editor.classList.add("hidden");
}

/* ================= ESCOLHER ÍCONE ================= */

function showIconPicker(){

 editor.innerHTML="<h2>Escolha um símbolo</h2>";

 iconList.forEach(icon=>{
  let btn=document.createElement("button");
  btn.textContent=icon;
  btn.style.fontSize="30px";

  btn.onclick=()=>{
    creating={
      symbol:icon,
      move:[],
      attack:[]
    };
    startPlacement();
  };

  editor.appendChild(btn);
});

/* ================= DEFINIÇÃO ================= */

let boardClickHandler=null;

boardEl.addEventListener("click",e=>{
 let cell=e.target.closest(".cell");
 if(!cell || !boardClickHandler) return;

 let r=+cell.dataset.r;
 let c=+cell.dataset.c;

 boardClickHandler(r,c);
});

function startPlacement(){

 phase=0;
 game.board=Array.from({length:8},()=>Array(8).fill(""));

 updatePhaseUI();
 boardClickHandler=handlePlacement;
}

function updatePhaseUI(){
 let p=phases[phase];
 editor.innerHTML=`<h2>${p.text}</h2>`;
 anchor=p.anchor;
}

function handlePlacement(r,c){

 let dx=r-anchor[0];
 let dy=c-anchor[1];

 let type=phases[phase].type;

 creating[type].push([dx,dy]);

 game.board[r][c]="X";
 draw();

 phase++;

 if(phase>=phases.length){
  finishPiece();
 } else {
  updatePhaseUI();
 }
}

/* ================= FINALIZAR ================= */

function finishPiece(){

 customPieces.push(creating);
 save();

 boardClickHandler=null;

 alert("Peça criada!");
 openEditor();
}

/* ================= RESET ================= */

function resetAll(){
 if(!confirm("Apagar tudo?")) return;

 customPieces=[];
 save();
 draw();
}

/* INIT */
draw();