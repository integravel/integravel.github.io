/* ================= ESTADO ================= */

const game = {
board: Array.from({length:8},()=>Array(8).fill("")),
turn:"w",

selected:null,
moves:[],
selectedCard:null,

deck:{ w:[], b:[] },
hand:{ w:[], b:[] }
};

/* ================= ELEMENTOS ================= */

const boardEl = document.getElementById("board");
const topMenu = document.getElementById("topMenu");
const bottomMenu = document.getElementById("bottomMenu");

/* ================= PEÇAS ================= */

const symbols={
P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

/* ================= BARALHO ================= */

function createDeck(side){

const base = [
{p:"R",r:7,c:0},{p:"N",r:7,c:1},{p:"B",r:7,c:2},{p:"Q",r:7,c:3},
{p:"B",r:7,c:5},{p:"N",r:7,c:6},{p:"R",r:7,c:7},

{p:"P",r:6,c:0},{p:"P",r:6,c:1},{p:"P",r:6,c:2},{p:"P",r:6,c:3},
{p:"P",r:6,c:4},{p:"P",r:6,c:5},{p:"P",r:6,c:6},{p:"P",r:6,c:7}
];

let deck = base.map(card=>{
if(side==="b"){
return { p:card.p.toLowerCase(), r:7-card.r, c:card.c };
}
return {...card};
});

return shuffle(deck);
}

function shuffle(arr){
for(let i=arr.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1));
[arr[i],arr[j]]=[arr[j],arr[i]];
}
return arr;
}

/* ================= COMPRA AUTOMÁTICA ================= */

function drawUpToFour(side){

while(game.hand[side].length < 4){

let card = game.deck[side].pop();

if(!card) break;

game.hand[side].push(card);
}
}

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

/* ================= PROMOÇÃO ================= */

function promotePawn(piece){

let choice = prompt("Promover para: Q (Rainha), R (Torre), B (Bispo), N (Cavalo)","Q");

if(!choice) choice="Q";

choice = choice.toUpperCase();

if(!["Q","R","B","N"].includes(choice))
choice="Q";

if(piece===piece.toLowerCase())
choice = choice.toLowerCase();

return choice;
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
    if(!b[r+d][c]&&!b[r+2*d][c])
      push(r+2*d,c);
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

function getLegalMoves(b,side){
return getPseudoMoves(b,side);
}

/* ================= UI ================= */

function drawUI(){

topMenu.innerHTML="";
bottomMenu.innerHTML="";

["b","w"].forEach(side=>{

let menu = side==="w" ? bottomMenu : topMenu;

game.hand[side].forEach((card,i)=>{

let el=document.createElement("div");
el.className="menuPiece";
el.textContent=symbols[card.p];

if(game.selectedCard===i && game.turn===side)
el.style.outline="3px solid yellow";

el.onclick=()=>{
if(game.turn!==side) return;

game.selectedCard = game.selectedCard===i ? null : i;

game.selected=null;
game.moves=[];

drawBoard();
drawUI();

};

menu.appendChild(el);
});

});
}

/* ================= COLOCAR PEÇA ================= */

function placeCard(r,c){

let side=game.turn;
let card=game.hand[side][game.selectedCard];

if(r!==card.r || c!==card.c)
return alert("Posição incorreta");

if(game.board[r][c])
return alert("Casa ocupada");

game.board[r][c]=card.p;

game.hand[side].splice(game.selectedCard,1);

game.selectedCard=null;

endTurn();
}

/* ================= INTERAÇÃO ================= */

function handleClick(r,c){

let p=game.board[r][c];

if(game.selectedCard!==null){

placeCard(r,c);
return;
}

if(game.selected){

let move=game.moves.find(m=>m.r2===r && m.c2===c);

if(move){

let piece = game.board[game.selected.r][game.selected.c];

game.board[r][c]=piece;
game.board[game.selected.r][game.selected.c]="";

/* PROMOÇÃO */
if(piece==="P" && r===0)
  game.board[r][c]=promotePawn(piece);

if(piece==="p" && r===7)
  game.board[r][c]=promotePawn(piece);

endTurn();
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

/* ================= BOARD ================= */

function drawBoard(){

boardEl.innerHTML="";

for(let r=0;r<8;r++){
for(let c=0;c<8;c++){

let cell=document.createElement("div");
cell.className="cell "+((r+c)%2?"dark":"light");

if(game.selected && game.selected.r===r && game.selected.c===c){
cell.classList.add("selected");
}

if(game.moves.some(m=>m.r2===r && m.c2===c)){
cell.classList.add("move");
}

let p=game.board[r][c];

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

/* ================= TURNO ================= */

function endTurn(){

game.turn = game.turn==="w"?"b":"w";

drawUpToFour(game.turn);

game.selected=null;
game.moves=[];
game.selectedCard=null;

drawBoard();
drawUI();
}

/* ================= INIT ================= */

function init(){

game.board[7][4]="K";
game.board[0][4]="k";

game.deck.w=createDeck("w");
game.deck.b=createDeck("b");

drawUpToFour("w");
drawUpToFour("b");

drawBoard();
drawUI();
}

init();