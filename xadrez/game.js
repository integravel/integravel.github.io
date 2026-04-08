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
let possibleMoves = [];

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

   // destaque da peça selecionada
   if(selected && selected.r===r && selected.c===c){
     cell.style.outline="3px solid yellow";
   }

   // destaque dos movimentos
   if(possibleMoves.some(m=>m.r===r && m.c===c)){
     cell.style.background = "#90ee90";
   }

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

/* ================= CLIQUE ================= */

function handleClick(r,c){

 let p=game.board[r][c];

 // mover peça
 if(selected){
   if(possibleMoves.some(m=>m.r===r && m.c===c)){
     game.board[r][c]=game.board[selected.r][selected.c];
     game.board[selected.r][selected.c]="";

     selected=null;
     possibleMoves=[];
     game.turn = game.turn==="w"?"b":"w";

     drawBoard();
     return;
   }
 }

 // selecionar nova peça
 if(!p) return;

 if(game.turn==="w" && p!==p.toUpperCase()) return;
 if(game.turn==="b" && p!==p.toLowerCase()) return;

 selected={r,c};
 possibleMoves = getMoves(r,c);

 drawBoard();
}

/* ================= MOVIMENTOS ================= */

function getMoves(r,c){

 let p=game.board[r][c];
 if(!p) return [];

 let moves=[];
 let isWhite=p===p.toUpperCase();

 function add(r2,c2){
   if(r2<0||r2>7||c2<0||c2>7) return;

   let t=game.board[r2][c2];
   if(!t || (isWhite && t!==t.toUpperCase()) || (!isWhite && t!==t.toLowerCase())){
     moves.push({r:r2,c:c2});
   }
 }

 switch(p.toLowerCase()){

  case "p":{
    let d=isWhite?-1:1;

    if(!game.board[r+d]?.[c]) add(r+d,c);

    if((isWhite && r===6)||(!isWhite && r===1)){
      if(!game.board[r+d][c] && !game.board[r+2*d][c])
        add(r+2*d,c);
    }

    for(let dc of [-1,1]){
      let r2=r+d,c2=c+dc;
      let t=game.board[r2]?.[c2];
      if(t && ((isWhite && t!==t.toUpperCase()) || (!isWhite && t!==t.toLowerCase())))
        moves.push({r:r2,c:c2});
    }

  } break;

  case "n":
    [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
    .forEach(v=>add(r+v[0],c+v[1]));
  break;

  case "b": slide([[1,1],[1,-1],[-1,1],[-1,-1]]); break;
  case "r": slide([[1,0],[-1,0],[0,1],[0,-1]]); break;
  case "q": slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]); break;

  case "k":
    [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
    .forEach(v=>add(r+v[0],c+v[1]));
  break;
 }

 function slide(dirs){
   for(let d of dirs){
     for(let i=1;i<8;i++){
       let r2=r+d[0]*i,c2=c+d[1]*i;
       if(r2<0||r2>7||c2<0||c2>7) break;

       let t=game.board[r2][c2];

       if(!t){
         moves.push({r:r2,c:c2});
       } else {
         if((isWhite && t!==t.toUpperCase()) || (!isWhite && t!==t.toLowerCase()))
           moves.push({r:r2,c:c2});
         break;
       }
     }
   }
 }

 return moves;
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