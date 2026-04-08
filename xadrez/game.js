/* ================= ESTADO ================= */
const game = {
 board: Array.from({length:8},()=>Array(8).fill("")),
 turn:"w",
 selected:null,
 moves:[],
 lastMove:null,
 enPassant:null,
 moved:{K:false,k:false,R0:false,R7:false,r0:false,r7:false}
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
 return null;
}

/* ================= ATAQUE CORRETO ================= */

function isAttacked(b,r,c,by){

 for(let i=0;i<8;i++){
  for(let j=0;j<8;j++){

   let p=b[i][j];
   if(!p) continue;

   if(by==="w" && p!==p.toUpperCase()) continue;
   if(by==="b" && p!==p.toLowerCase()) continue;

   let isWhite = p===p.toUpperCase();

   switch(p.toLowerCase()){

    case "p":{
      let d = isWhite ? -1 : 1;
      if(i+d===r && (j+1===c || j-1===c)) return true;
    } break;

    case "n":{
      let moves=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
      for(let m of moves){
        if(i+m[0]===r && j+m[1]===c) return true;
      }
    } break;

    case "b":
    case "r":
    case "q":{
      let dirs=[];
      if(p.toLowerCase()!=="r") dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
      if(p.toLowerCase()!=="b") dirs.push([1,0],[-1,0],[0,1],[0,-1]);

      for(let d of dirs){
        for(let k=1;k<8;k++){
          let r2=i+d[0]*k;
          let c2=j+d[1]*k;

          if(r2<0||r2>7||c2<0||c2>7) break;

          if(r2===r && c2===c) return true;

          if(b[r2][c2]) break;
        }
      }
    } break;

    case "k":{
      let dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
      for(let d of dirs){
        if(i+d[0]===r && j+d[1]===c) return true;
      }
    } break;

   }
  }
 }

 return false;
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

   function push(r2,c2,extra={}){
    if(r2<0||r2>7||c2<0||c2>7) return;
    let t=b[r2][c2];
    if(!t || isEnemy(p,t))
      moves.push({r,c,r2,c2,...extra});
   }

   switch(p.toLowerCase()){

    case "p":{
      let d=isWhite?-1:1;

      if(!b[r+d]?.[c]) push(r+d,c);

      if((isWhite&&r===6)||(!isWhite&&r===1)){
        if(!b[r+d][c]&&!b[r+2*d][c])
          push(r+2*d,c,{double:true});
      }

      for(let dc of [-1,1]){
        let r2=r+d,c2=c+dc;

        if(b[r2]?.[c2] && isEnemy(p,b[r2][c2]))
          push(r2,c2);

        if(game.enPassant && game.enPassant.r===r && game.enPassant.c===c2){
          push(r+d,c2,{enPassant:true});
        }
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

/* LEGAIS */
function getLegalMoves(b,side){
 return getPseudoMoves(b,side).filter(m=>{
  let nb=clone(b);

  nb[m.r2][m.c2]=nb[m.r][m.c];
  nb[m.r][m.c]="";

  if(m.enPassant){
    nb[m.r][m.c2]="";
  }

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
    dragEl.style.left=t.clientX+"px";
    dragEl.style.top=t.clientY+"px";
    dragEl.textContent=symbols[k];
  };

  if(k===k.toLowerCase()) topMenu.appendChild(el);
  else bottomMenu.appendChild(el);
 }
}

function drawBoard(){

 boardEl.innerHTML="";

 for(let r=0;r<8;r++){
  for(let c=0;c<8;c++){

   let cell=document.createElement("div");
   cell.className="cell "+((r+c)%2?"dark":"light");
   cell.dataset.r=r;
   cell.dataset.c=c;

   let p=game.board[r][c];

   if(game.selected && game.selected.r===r && game.selected.c===c)
     cell.classList.add("selected");

   if(game.moves.some(m=>m.r2===r && m.c2===c))
     cell.classList.add(p?"capture":"move");

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

    game.turn = game.turn==="w"?"b":"w";

    let next=getLegalMoves(game.board,game.turn);

    if(!next.length){
      let k=findKing(game.board,game.turn);
      if(isAttacked(game.board,k[0],k[1],game.turn==="w"?"b":"w"))
        alert("Xeque-mate!");
      else
        alert("Empate!");
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
 game.moves=getLegalMoves(game.board,game.turn)
   .filter(m=>m.r===r && m.c===c);

 drawBoard();
}

/* INIT */
drawMenus();
drawBoard();