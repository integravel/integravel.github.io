/* ================= ESTADO ================= */
let board = Array.from({length:8},()=>Array(8).fill(""));
let turn="w", running=false;

let dragPiece=null;
let dragEl=document.getElementById("drag");

let whiteKing=false, blackKing=false;

/* ================= PEÇAS ================= */
const pieces={
P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

/* ================= RENDER ================= */
function render(){
 renderMenus();
 renderBoard();
}

function renderMenus(){
 let top=topMenu, bot=bottomMenu;
 top.innerHTML=""; bot.innerHTML="";

 for(let k in pieces){

  let el=document.createElement("div");
  el.className="piece";
  el.textContent=pieces[k];

  el.ontouchstart=()=>{dragPiece=k;dragEl.textContent=pieces[k];};

  if(k===k.toLowerCase()){
    if(k==="k"&&blackKing) continue;
    top.appendChild(el);
  }else{
    if(k==="K"&&whiteKing) continue;
    bot.appendChild(el);
  }
 }
}

function renderBoard(){
 boardEl.innerHTML="";
 for(let r=0;r<8;r++){
  for(let c=0;c<8;c++){
   let d=document.createElement("div");
   d.className="cell "+((r+c)%2?"dark":"light");
   d.textContent=pieces[board[r][c]]||"";
   d.dataset.r=r; d.dataset.c=c;
   boardEl.appendChild(d);
  }
 }
}

/* ================= DRAG ================= */
document.addEventListener("touchmove",e=>{
 if(!dragPiece)return;
 let t=e.touches[0];
 dragEl.style.left=t.clientX+"px";
 dragEl.style.top=t.clientY+"px";
});

document.addEventListener("touchend",e=>{
 if(!dragPiece||running)return;

 let t=e.changedTouches[0];
 let el=document.elementFromPoint(t.clientX,t.clientY);

 if(el && el.dataset){
  let r=+el.dataset.r,c=+el.dataset.c;

  if(dragPiece==="K") whiteKing=true;
  if(dragPiece==="k") blackKing=true;

  board[r][c]=dragPiece;
  render();
  checkStart();
 }

 dragPiece=null;
 dragEl.textContent="";
});

/* ================= MOTOR REAL ================= */

function clone(b){return b.map(r=>r.slice());}

function inBounds(r,c){return r>=0&&r<8&&c>=0&&c<8;}

function findKing(b,side){
 for(let r=0;r<8;r++){
  for(let c=0;c<8;c++){
   if(side==="w" && b[r][c]==="K") return [r,c];
   if(side==="b" && b[r][c]==="k") return [r,c];
  }
 }
}

function isEnemy(a,b){
 if(!b)return false;
 return (a===a.toUpperCase()) !== (b===b.toUpperCase());
}

/* ================= MOVIMENTOS CORRETOS ================= */

function getMoves(b,side){

 let moves=[];

 for(let r=0;r<8;r++){
  for(let c=0;c<8;c++){

   let p=b[r][c];
   if(!p) continue;

   if(side==="w" && p!==p.toUpperCase()) continue;
   if(side==="b" && p!==p.toLowerCase()) continue;

   let isWhite=p===p.toUpperCase();

   function push(r2,c2){
    if(!inBounds(r2,c2)) return;
    let t=b[r2][c2];
    if(!t || isEnemy(p,t))
      moves.push({r,c,r2,c2});
   }

   switch(p.toLowerCase()){

    case "p":{
      let d=isWhite?-1:1;

      /* frente */
      if(inBounds(r+d,c) && !b[r+d][c]){
        push(r+d,c);

        /* 2 casas */
        if((isWhite&&r===6)||(!isWhite&&r===1)){
          if(!b[r+2*d][c]) push(r+2*d,c);
        }
      }

      /* capturas */
      for(let dc of [-1,1]){
        let r2=r+d,c2=c+dc;
        if(inBounds(r2,c2) && b[r2][c2] && isEnemy(p,b[r2][c2]))
          moves.push({r,c,r2,c2});
      }

      /* promoção */
      if((isWhite && r===1) || (!isWhite && r===6)){
        moves.push({r,c,r2:r+d,c2:c,promo:true});
      }

    } break;

    case "n":
      [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
      .forEach(v=>push(r+v[0],c+v[1]));
    break;

    case "b":
      slide([[1,1],[1,-1],[-1,1],[-1,-1]]);
    break;

    case "r":
      slide([[1,0],[-1,0],[0,1],[0,-1]]);
    break;

    case "q":
      slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
    break;

    case "k":
      [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
      .forEach(v=>push(r+v[0],c+v[1]));
    break;
   }

   function slide(dirs){
    for(let d of dirs){
     for(let i=1;i<8;i++){
      let r2=r+d[0]*i,c2=c+d[1]*i;
      if(!inBounds(r2,c2)) break;

      if(!b[r2][c2]){
        moves.push({r,c,r2,c2});
      } else {
        if(isEnemy(p,b[r2][c2]))
          moves.push({r,c,r2,c2});
        break;
      }
     }
    }
   }
  }
 }

 return moves;
}

/* ================= IA SIMPLES CORRETA ================= */

const val={p:1,n:3,b:3,r:5,q:9,k:1000};

function evaluate(b){
 let s=0;
 for(let row of b){
  for(let p of row){
   if(!p) continue;
   s += (p===p.toUpperCase()?1:-1)*val[p.toLowerCase()];
  }
 }
 return s;
}

function bestMove(){

 let moves=getMoves(board,turn);
 if(!moves.length) return null;

 let best=moves[0], bestVal=-Infinity;

 for(let m of moves){

  let nb=clone(board);

  nb[m.r2][m.c2]=nb[m.r][m.c];
  nb[m.r][m.c]="";

  if(m.promo){
    nb[m.r2][m.c2]= (turn==="w"?"Q":"q");
  }

  let v=evaluate(nb);

  if(v>bestVal){
    bestVal=v;
    best=m;
  }
 }

 return best;
}

/* ================= LOOP ================= */

function step(){

 let m=bestMove();
 if(!m){alert("Fim");return;}

 board[m.r2][m.c2]=board[m.r][m.c];
 board[m.r][m.c]="";

 if(m.promo){
  board[m.r2][m.c2]=(turn==="w"?"Q":"q");
 }

 renderBoard();

 turn = turn==="w"?"b":"w";

 setTimeout(step,300);
}

function checkStart(){
 if(whiteKing && blackKing){
  running=true;
  setTimeout(step,300);
 }
}

/* INIT */
const boardEl=document.getElementById("board");
render();