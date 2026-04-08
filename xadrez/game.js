/* ================= ESTADO ================= */
const game = {
 board: Array.from({length:8},()=>Array(8).fill("")),
 turn:"w",
 selected:null,
 moves:[],
 lastMove:null
};

/* ================= ELEMENTOS ================= */
const boardEl = document.getElementById("board");
const dragEl = document.getElementById("drag");
const topMenu = document.getElementById("topMenu");
const bottomMenu = document.getElementById("bottomMenu");

/* ================= PEÇAS ================= */
const symbols={
P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

let dragging=null;

/* ================= UTIL ================= */

function clone(b){return b.map(r=>r.slice());}

function isEnemy(a,b){
 return b && ((a===a.toUpperCase()) !== (b===b.toUpperCase()));
}

function findKing(b,side){
 for(let r=0;r<8;r++)
 for(let c=0;c<8;c++){
  if(side==="w" && b[r][c]==="K") return [r,c];
  if(side==="b" && b[r][c]==="k") return [r,c];
 }
}

/* ================= ATAQUE ================= */

function isAttacked(b,r,c,by){

 let moves = getPseudoMoves(b,by);
 return moves.some(m=>m.r2===r && m.c2===c);
}

/* ================= MOVIMENTOS ================= */

function getPseudoMoves(b,side){

 let moves=[];

 for(let r=0;r<8;r++){
  for(let c=0;c<8;c++){

   let p=b[r][c];
   if(!p) continue;

   if(side==="w" && p!==p.toUpperCase()) continue;
   if(side==="b" && p!==p.toLowerCase()) continue;

   let isWhite=p===p.toUpperCase();

   function push(r2,c2){
    if(r2<0||r2>7||c2<0||c2>7) return;
    let t=b[r2][c2];
    if(!t || isEnemy(p,t))
      moves.push({r,c,r2,c2});
   }

   switch(p.toLowerCase()){

    case "p":{
      let d=isWhite?-1:1;

      if(!b[r+d]?.[c]) push(r+d,c);

      if((isWhite&&r===6)||(!isWhite&&r===1)){
        if(!b[r+d][c]&&!b[r+2*d][c]) push(r+2*d,c);
      }

      for(let dc of [-1,1]){
        let r2=r+d,c2=c+dc;
        if(b[r2]?.[c2] && isEnemy(p,b[r2][c2]))
          push(r2,c2);
      }

    } break;

    case "n":
      [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
      .forEach(v=>push(r+v[0],c+v[1]));
    break;

    case "b": slide([[1,1],[1,-1],[-1,1],[-1,-1]]); break;
    case "r": slide([[1,0],[-1,0],[0,1],[0,-1]]); break;
    case "q": slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]); break;

    case "k":
      [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
      .forEach(v=>push(r+v[0],c+v[1]));
    break;
   }

   function slide(dirs){
    for(let d of dirs){
     for(let i=1;i<8;i++){
      let r2=r+d[0]*i,c2=c+d[1]*i;
      if(r2<0||r2>7||c2<0||c2>7) break;

      if(!b[r2][c2]) moves.push({r,c,r2,c2});
      else{
        if(isEnemy(p,b[r2][c2])) moves.push({r,c,r2,c2});
        break;
      }
     }
    }
   }
  }
 }

 return moves;
}

/* FILTRAR LEGAIS */
function getLegalMoves(b,side){

 return getPseudoMoves(b,side).filter(m=>{
  let nb=clone(b);
  nb[m.r2][m.c2]=nb[m.r][m.c];
  nb[m.r][m.c]="";

  let k=findKing(nb,side);
  return !isAttacked(nb,k[0],k[1],side==="w"?"b":"w");
 });
}

/* ================= UI ================= */

function drawMenus(){
 topMenu.innerHTML="";
 bottomMenu.innerHTML="";

 for(let k in symbols){

  let el=document.createElement("div");
  el.className="menuPiece";
  el.textContent=symbols[k];

  el.ontouchstart=e=>{
    dragging=k;
    let t=e.touches[0];
    dragEl.style.left=t.clientX+"px;
    dragEl.style.top=t.clientY+"px;
    dragEl.textContent=symbols[k];
  };

  if(k===k.toLowerCase()){
    topMenu.appendChild(el);
  } else {
    bottomMenu.appendChild(el);
  }
 }
}

function drawBoard(){

 boardEl.innerHTML="";

 let kingPos=findKing(game.board,game.turn);
 let inCheck = kingPos && isAttacked(game.board,kingPos[0],kingPos[1],game.turn==="w"?"b":"w");

 for(let r=0;r<8;r++){
  for(let c=0;c<8;c++){

   let cell=document.createElement("div");
   cell.className="cell "+((r+c)%2?"dark":"light");

   let p=game.board[r][c];

   if(game.selected && game.selected.r===r && game.selected.c===c){
     cell.classList.add("selected");
   }

   if(game.moves.some(m=>m.r2===r && m.c2===c)){
     cell.classList.add(p?"capture":"move");
   }

   if(game.lastMove && (
     (game.lastMove.r===r && game.lastMove.c===c) ||
     (game.lastMove.r2===r && game.lastMove.c2===c)
   )){
     cell.classList.add("lastMove");
   }

   if(inCheck && kingPos[0]===r && kingPos[1]===c){
     cell.classList.add("check");
   }

   if(p){
    let el=document.createElement("div");
    el.className="piece";
    el.textContent=symbols[p];
    cell.appendChild(el);
   }

   cell.onclick=()=>handleClick(r,c);

   boardEl.appendChild(cell);
  }
 }
}

/* ================= INTERAÇÃO ================= */

function handleClick(r,c){

 let p=game.board[r][c];

 if(game.selected){
  let move = game.moves.find(m=>m.r2===r && m.c2===c);

  if(move){
    game.board[r][c]=game.board[game.selected.r][game.selected.c];
    game.board[game.selected.r][game.selected.c]="";

    game.lastMove=move;

    game.turn = game.turn==="w"?"b":"w";

    let nextMoves=getLegalMoves(game.board,game.turn);

    if(!nextMoves.length){
      let king=findKing(game.board,game.turn);
      if(isAttacked(game.board,king[0],king[1],game.turn==="w"?"b":"w")){
        alert("Xeque-mate!");
      } else {
        alert("Empate!");
      }
    }

    game.selected=null;
    game.moves=[];
    drawBoard();
    return;
  }
 }

 if(!p) return;

 if(game.turn==="w" && p!==p.toUpperCase()) return;
 if(game.turn==="b" && p!==p.toLowerCase()) return;

 game.selected={r,c};
 game.moves=getLegalMoves(game.board,game.turn);

 drawBoard();
}

/* ================= DRAG ================= */

document.addEventListener("touchmove", e=>{
 if(!dragging)return;
 let t=e.touches[0];
 dragEl.style.left=t.clientX+"px";
 dragEl.style.top=t.clientY+"px";
});

document.addEventListener("touchend", e=>{
 if(!dragging)return;

 let t=e.changedTouches[0];
 let el=document.elementFromPoint(t.clientX,t.clientY);

 if(el && el.classList.contains("cell")){
  let r=[...boardEl.children].indexOf(el)/8|0;
  let c=[...boardEl.children].indexOf(el)%8;

  game.board[r][c]=dragging;
 }

 dragging=null;
 dragEl.textContent="";
 drawBoard();
});

/* INIT */
drawMenus();
drawBoard();