/* ================= STORAGE ================= */

let customPieces = JSON.parse(localStorage.getItem("customPieces")||"[]");

function save(){
 localStorage.setItem("customPieces", JSON.stringify(customPieces));
}

/* ================= ELEMENTOS ================= */

const boardEl = document.getElementById("board");
const dragEl = document.getElementById("drag");
const topMenu = document.getElementById("topMenu");
const bottomMenu = document.getElementById("bottomMenu");
const editor = document.getElementById("editor");

/* ================= ESTADO ================= */

const game = {
 board: Array.from({length:8},()=>Array(8).fill(""))
};

/* ================= PEÇAS ================= */

const baseSymbols={
 P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
 p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

const iconList = [
 "★","✦","✪","☀","☠","☢","☣","⚔","⚙","⚡","🔥","💀","👑","🛡"
];

/* ================= DRAG ================= */

let dragging=null;

document.addEventListener("pointermove",e=>{
 if(dragging){
  dragEl.style.left = e.clientX+"px";
  dragEl.style.top = e.clientY+"px";
 }
});

document.addEventListener("pointerup",e=>{
 if(!dragging) return;

 let el = document.elementFromPoint(e.clientX,e.clientY);

 if(el?.dataset){
  let r = +el.dataset.r;
  let c = +el.dataset.c;
  game.board[r][c] = dragging;
 }

 dragging=null;
 dragEl.textContent="";
 draw();
});

/* ================= MENUS ================= */

function getAllPieces(){
 let list = [...Object.keys(baseSymbols)];
 customPieces.forEach((_,i)=>list.push("c"+i));
 return list;
}

function getSymbol(p){
 if(baseSymbols[p]) return baseSymbols[p];
 return customPieces[parseInt(p.slice(1))]?.symbol || "?";
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

function openEditor(){
 editor.classList.remove("hidden");
 showIconPicker();
}

function closeEditor(){
 editor.classList.add("hidden");
}

/* ================= ESCOLHA DE ÍCONE ================= */

function showIconPicker(){

 editor.innerHTML="<h2>Escolha um símbolo</h2>";

 iconList.forEach(icon=>{
  let btn=document.createElement("button");
  btn.textContent=icon;
  btn.style.fontSize="30px";

  btn.onclick=()=>{
    alert("Sistema de movimento será implementado aqui (versão simplificada ativa).");

    customPieces.push({
      symbol:icon
    });

    save();
    drawMenus();
    closeEditor();
  };

  editor.appendChild(btn);
});

/* ================= RESET ================= */

function resetAll(){

 if(!confirm("Tem certeza que deseja apagar tudo?")) return;

 customPieces=[];
 game.board = Array.from({length:8},()=>Array(8).fill(""));

 save();
 draw();
}

/* ================= INIT ================= */

draw();

/* ================= DEBUG (IMPORTANTE) ================= */

window.openEditor = openEditor;
window.closeEditor = closeEditor;
window.resetAll = resetAll;