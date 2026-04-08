const boardEl=document.getElementById("board");
const drag=document.getElementById("drag");

const symbols={
P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

/* render */
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
     el.textContent=symbols[p];
     cell.appendChild(el);
   }

   boardEl.appendChild(cell);
  }
 }
}

/* loop IA */
function loop(){

 let m=bestMove();
 if(!m){alert("fim");return;}

 game.board[m.r2][m.c2]=game.board[m.r][m.c];
 game.board[m.r][m.c]="";

 game.turn = game.turn==="w"?"b":"w";

 draw();
 setTimeout(loop,200);
}

/* start manual */
draw();