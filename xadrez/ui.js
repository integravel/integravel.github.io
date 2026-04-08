/* ================= ELEMENTOS ================= */
const boardEl = document.getElementById("board");
const dragEl = document.getElementById("drag");
const topMenu = document.getElementById("topMenu");
const bottomMenu = document.getElementById("bottomMenu");

/* ================= PEÇAS ================= */
const symbols = {
  P:"♙", R:"♖", N:"♘", B:"♗", Q:"♕", K:"♔",
  p:"♟", r:"♜", n:"♞", b:"♝", q:"♛", k:"♚"
};

let dragging = null;

/* ================= MENUS ================= */
function drawMenus(){

  topMenu.innerHTML="";
  bottomMenu.innerHTML="";

  for(let k in symbols){

    let el = document.createElement("div");
    el.className = "menuPiece";
    el.textContent = symbols[k];

    el.ontouchstart = e=>{
      dragging = k;
      dragEl.textContent = symbols[k];
    };

    // pretas (topo)
    if(k === k.toLowerCase()){
      if(k==="k" && hasKing("b")) continue;
      topMenu.appendChild(el);
    }

    // brancas (base)
    else{
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

      let cell = document.createElement("div");
      cell.className = "cell " + ((r+c)%2?"dark":"light");
      cell.dataset.r = r;
      cell.dataset.c = c;

      let p = game.board[r][c];

      if(p){
        let el = document.createElement("div");
        el.className = "piece";
        el.textContent = symbols[p];
        cell.appendChild(el);
      }

      boardEl.appendChild(cell);
    }
  }
}

/* ================= DRAG ================= */
document.addEventListener("touchmove", e=>{
  if(!dragging) return;

  let t = e.touches[0];
  dragEl.style.left = t.clientX+"px";
  dragEl.style.top = t.clientY+"px";
});

document.addEventListener("touchend", e=>{

  if(!dragging || game.running) return;

  let t = e.changedTouches[0];
  let el = document.elementFromPoint(t.clientX, t.clientY);

  if(el && el.dataset){

    let r = +el.dataset.r;
    let c = +el.dataset.c;

    // impedir múltiplos reis
    if(dragging==="K" && hasKing("w")) return;
    if(dragging==="k" && hasKing("b")) return;

    game.board[r][c] = dragging;

    drawBoard();
    drawMenus();

    checkStart();
  }

  dragging = null;
  dragEl.textContent = "";
});

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

/* ================= LOOP IA ================= */
function loop(){

  if(!game.running) return;

  let m = bestMove();

  if(!m){
    alert("Fim de jogo");
    game.running=false;
    return;
  }

  game.board[m.r2][m.c2] = game.board[m.r][m.c];
  game.board[m.r][m.c] = "";

  game.turn = game.turn==="w"?"b":"w";

  drawBoard();

  setTimeout(loop,200);
}

/* ================= START ================= */
function checkStart(){
  if(hasKing("w") && hasKing("b")){
    game.running = true;
    setTimeout(loop,300);
  }
}

/* ================= INIT ================= */
drawMenus();
drawBoard();