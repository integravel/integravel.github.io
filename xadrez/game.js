/* ================= ESTADO ================= */
const game = {
 board: Array.from({length:8},()=>Array(8).fill("")),
 turn:"w"
};

/* ================= ELEMENTOS ================= */
const boardEl = document.getElementById("board");
const dragEl = document.getElementById("drag");
const topMenu = document.getElementById("topMenu");
const bottomMenu = document.getElementById("bottomMenu");

/* ================= PEÇAS ================= */
const symbols = {
 P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
 p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

let dragging = null;
let selected = null;

/* ================= MENUS ================= */
function drawMenus(){

 topMenu.innerHTML="";
 bottomMenu.innerHTML="";

 for(let k in symbols){

  let el=document.createElement("div");
  el.className="menuPiece";
  el.textContent=symbols[k];

  el.addEventListener("touchstart", e=>{
    dragging=k;

    let t=e.touches[0];
    dragEl.style.left=t.clientX+"px";
    dragEl.style.top=t.clientY+"px";

    dragEl.textContent=symbols[k];
  });

  if(k===k.toLowerCase()){
    if(k==="k" && hasKing("b")) continue;
    topMenu.appendChild(el);
  } else {
    if(k==="K" && hasKing("w")) continue;
    bottomMenu.appendChild(el);
  }
 }
}

/* ================= TABULEIRO ================= */
function drawBoard(){

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
    el.textContent=symbols[p];
    cell.appendChild(el);
   }

   cell.addEventListener("click", ()=>handleClick(r,c));

   boardEl.appendChild(cell);
  }
 }
}

/* ================= DRAG ================= */

document.addEventListener("touchmove", e=>{
 if(!dragging) return;

 let t=e.touches[0];
 dragEl.style.left=t.clientX+"px";
 dragEl.style.top=t.clientY+"px";
});

document.addEventListener("touchend", e=>{

 if(!dragging) return;

 let t=e.changedTouches[0];
 let el=document.elementFromPoint(t.clientX,t.clientY);

 if(el && el.dataset){

  let r=+el.dataset.r;
  let c=+el.dataset.c;

  if(dragging==="K" && hasKing("w")) return;
  if(dragging==="k" && hasKing("b")) return;

  game.board[r][c]=dragging;

  drawBoard();
  drawMenus();
 }

 dragging=null;
 dragEl.textContent="";
});

/* ================= CLIQUE (PvP) ================= */

function handleClick(r,c){

 let p=game.board[r][c];

 if(selected){
  game.board[r][c]=game.board[selected.r][selected.c];
  game.board[selected.r][selected.c]="";

  selected=null;
  game.turn = game.turn==="w"?"b":"w";

  drawBoard();
  return;
 }

 if(!p) return;

 if(game.turn==="w" && p!==p.toUpperCase()) return;
 if(game.turn==="b" && p!==p.toLowerCase()) return;

 selected={r,c};
}

/* ================= UTIL ================= */

function hasKing(side){
 for(let r=0;r<8;r++){
  for(let c=0;c<8;c++){
   if(side==="w" && game.board[r][c]==="K") return true;
   if(side==="b" && game.board[r][c]==="k") return true;
  }
 }
 return false;
}

/* ================= INIT ================= */

drawMenus();
drawBoard();