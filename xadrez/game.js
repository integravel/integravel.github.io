/* ================= ESTADO ================= */

const game = {
board: Array.from({length:8},()=>Array(8).fill("")),
turn:"w",

selected:null,
moves:[],
selectedCard:null,

deck:{ w:[], b:[] },
hand:{ w:[], b:[] },

gameOver:false
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
return {p:card.p.toLowerCase(),r:7-card.r,c:card.c};
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

/* ================= ATAQUE ================= */

function isAttacked(b,r,c,by){

for(let i=0;i<8;i++){
for(let j=0;j<8;j++){

let p=b[i][j];
if(!p) continue;

if(by==="w" && p!==p.toUpperCase()) continue;
if(by==="b" && p!==p.toLowerCase()) continue;

let isWhite=p===p.toUpperCase();

switch(p.toLowerCase()){

case "p":{
 let d=isWhite?-1:1;
 if(i+d===r && (j+1===c || j-1===c)) return true;
} break;

case "n":{
 let m=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
 for(let v of m)
  if(i+v[0]===r && j+v[1]===c) return true;
} break;

case "b":
case "r":
case "q":{
 let dirs=[];
 if(p!=="r") dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
 if(p!=="b") dirs.push([1,0],[-1,0],[0,1],[0,-1]);

 for(let d of dirs){
  for(let k=1;k<8;k++){
   let r2=i+d[0]*k,c2=j+d[1]*k;
   if(r2<0||r2>7||c2<0||c2>7) break;
   if(r2===r && c2===c) return true;
   if(b[r2][c2]) break;
  }
 }
} break;

case "k":{
 let d=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
 for(let v of d)
  if(i+v[0]===r && j+v[1]===c) return true;
} break;

}
}
}

return false;
}

/* ================= PROMOÇÃO ================= */

function promotePawn(piece){

let choice = prompt("Promover para: Q R B N","Q");

if(!choice) choice="Q";

choice=choice.toUpperCase();

if(!["Q","R","B","N"].includes(choice))
choice="Q";

if(piece===piece.toLowerCase())
choice=choice.toLowerCase();

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

return getPseudoMoves(b,side).filter(m=>{

let nb=clone(b);

nb[m.r2][m.c2]=nb[m.r][m.c];
nb[m.r][m.c]="";

let k=findKing(nb,side);

return !isAttacked(nb,k[0],k[1],side==="w"?"b":"w");

});
}

/* ================= CARTAS LEGAIS ================= */

function getLegalDrops(side){

let result=[];

game.hand[side].forEach((card,i)=>{

let b=clone(game.board);

if(b[card.r][card.c]) return;

b[card.r][card.c]=card.p;

let k=findKing(b,side);

if(!isAttacked(b,k[0],k[1],side==="w"?"b":"w")){
result.push({index:i,r:card.r,c:card.c});
}

});

return result;
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

if(game.turn!==side || game.gameOver) return;

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

/* ================= INTERAÇÃO ================= */

function handleClick(r,c){

if(game.gameOver) return;

let p=game.board[r][c];

if(game.selectedCard!==null){

let drops=getLegalDrops(game.turn)
.filter(d=>d.index===game.selectedCard);

let d=drops.find(x=>x.r===r && x.c===c);

if(!d) return;

let card=game.hand[game.turn][game.selectedCard];

game.board[r][c]=card.p;

game.hand[game.turn].splice(game.selectedCard,1);

endTurn();
return;
}

if(game.selected){

let move=game.moves.find(m=>m.r2===r && m.c2===c);

if(move){

let piece=game.board[game.selected.r][game.selected.c];

game.board[r][c]=piece;
game.board[game.selected.r][game.selected.c]="";

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

game.selectedCard=null;

game.selected={r,c};

game.moves=getLegalMoves(game.board,game.turn)
.filter(m=>m.r===r && m.c===c);

drawBoard();
}

/* ================= BOARD ================= */

function drawBoard(){

boardEl.innerHTML="";

let drops=getLegalDrops(game.turn);

for(let r=0;r<8;r++){
for(let c=0;c<8;c++){

let cell=document.createElement("div");

cell.className="cell "+((r+c)%2?"dark":"light");

if(game.selected && game.selected.r===r && game.selected.c===c)
cell.classList.add("selected");

if(game.moves.some(m=>m.r2===r && m.c2===c))
cell.classList.add("move");

if(game.selectedCard!==null){
let d=drops.find(x=>x.index===game.selectedCard && x.r===r && x.c===c);
if(d) cell.classList.add("move");
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

/* ================= XEQUE MATE ================= */

function hasAnyMove(side){

if(getLegalMoves(game.board,side).length>0)
return true;

if(getLegalDrops(side).length>0)
return true;

return false;
}

/* ================= TURNO ================= */

function endTurn(){

game.turn = game.turn==="w"?"b":"w";

drawUpToFour(game.turn);

if(!hasAnyMove(game.turn)){

let king=findKing(game.board,game.turn);

if(isAttacked(game.board,king[0],king[1],game.turn==="w"?"b":"w")){
alert("Xeque-mate!");
}else{
alert("Empate!");
}

game.gameOver=true;
}

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