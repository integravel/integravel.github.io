const game={
board:Array.from({length:8},()=>Array(8).fill("")),
turn:"w",
selected:null,
moves:[],
selectedCard:null,
deck:{w:[],b:[]},
hand:{w:[],b:[]},
gameOver:false
};

const boardEl=document.getElementById("board");
const topMenu=document.getElementById("topMenu");
const bottomMenu=document.getElementById("bottomMenu");
const promotionMenu=document.getElementById("promotionMenu");

const symbols={
P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

function clone(b){return b.map(r=>r.slice());}

function isEnemy(a,b){
return b && ((a===a.toUpperCase())!=(b===b.toUpperCase()));
}

function findKing(b,side){
for(let r=0;r<8;r++)
for(let c=0;c<8;c++){
if(side==="w" && b[r][c]==="K") return [r,c];
if(side==="b" && b[r][c]==="k") return [r,c];
}
return null;
}

/* BARALHO */

function createDeck(side){

const base=[
{p:"R",r:7,c:0},{p:"N",r:7,c:1},{p:"B",r:7,c:2},{p:"Q",r:7,c:3},
{p:"B",r:7,c:5},{p:"N",r:7,c:6},{p:"R",r:7,c:7},
{p:"P",r:6,c:0},{p:"P",r:6,c:1},{p:"P",r:6,c:2},{p:"P",r:6,c:3},
{p:"P",r:6,c:4},{p:"P",r:6,c:5},{p:"P",r:6,c:6},{p:"P",r:6,c:7}
];

let deck=base.map(c=>{
if(side==="b"){
return{p:c.p.toLowerCase(),r:7-c.r,c:c.c};
}
return{...c};
});

return shuffle(deck);
}

function shuffle(a){
for(let i=a.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1));
[a[i],a[j]]=[a[j],a[i]];
}
return a;
}

function drawUpToFour(side){
while(game.hand[side].length<4){
let c=game.deck[side].pop();
if(!c)break;
game.hand[side].push(c);
}
}

/* ATAQUE */

function isAttacked(b,r,c,by){

for(let i=0;i<8;i++)
for(let j=0;j<8;j++){

let p=b[i][j];
if(!p)continue;

if(by==="w" && p!==p.toUpperCase())continue;
if(by==="b" && p!==p.toLowerCase())continue;

let w=p===p.toUpperCase();

if(p.toLowerCase()==="p"){
let d=w?-1:1;
if(i+d===r && (j+1===c||j-1===c))return true;
}

if(p.toLowerCase()==="n"){
let m=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
for(let v of m)
if(i+v[0]===r && j+v[1]===c)return true;
}

if(p.toLowerCase()==="b"||p.toLowerCase()==="q"){
let d=[[1,1],[1,-1],[-1,1],[-1,-1]];
for(let v of d)
for(let k=1;k<8;k++){
let r2=i+v[0]*k,c2=j+v[1]*k;
if(r2<0||r2>7||c2<0||c2>7)break;
if(r2===r && c2===c)return true;
if(b[r2][c2])break;
}
}

if(p.toLowerCase()==="r"||p.toLowerCase()==="q"){
let d=[[1,0],[-1,0],[0,1],[0,-1]];
for(let v of d)
for(let k=1;k<8;k++){
let r2=i+v[0]*k,c2=j+v[1]*k;
if(r2<0||r2>7||c2<0||c2>7)break;
if(r2===r && c2===c)return true;
if(b[r2][c2])break;
}
}

if(p.toLowerCase()==="k"){
let d=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
for(let v of d)
if(i+v[0]===r && j+v[1]===c)return true;
}

}

return false;
}

/* MOVIMENTOS */

function getLegalMoves(b,side){

let moves=[];

for(let r=0;r<8;r++)
for(let c=0;c<8;c++){

let p=b[r][c];
if(!p)continue;

if(side==="w" && p!==p.toUpperCase())continue;
if(side==="b" && p!==p.toLowerCase())continue;

let w=p===p.toUpperCase();

function push(r2,c2){
if(r2<0||r2>7||c2<0||c2>7)return;
let t=b[r2][c2];
if(!t||isEnemy(p,t)){
let nb=clone(b);
nb[r2][c2]=nb[r][c];
nb[r][c]="";
let k=findKing(nb,side);
if(!isAttacked(nb,k[0],k[1],side==="w"?"b":"w"))
moves.push({r,c,r2,c2});
}
}

if(p.toLowerCase()==="n"){
[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
.forEach(v=>push(r+v[0],c+v[1]));
}

if(p.toLowerCase()==="k"){
[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
.forEach(v=>push(r+v[0],c+v[1]));
}

}

return moves;
}

/* PROMOÇÃO */

function showPromotion(r,c,piece){

promotionMenu.innerHTML="";
promotionMenu.style.display="flex";

["Q","R","B","N"].forEach(t=>{

let p=piece===piece.toUpperCase()?t:t.toLowerCase();

let el=document.createElement("div");
el.className="promoPiece";
el.textContent=symbols[p];

el.onclick=()=>{
game.board[r][c]=p;
promotionMenu.style.display="none";
endTurn();
};

promotionMenu.appendChild(el);

});
}

/* UI */

function drawUI(){

topMenu.innerHTML="";
bottomMenu.innerHTML="";

["b","w"].forEach(side=>{

let menu=side==="w"?bottomMenu:topMenu;

game.hand[side].forEach((card,i)=>{

let el=document.createElement("div");
el.className="menuPiece";
el.textContent=symbols[card.p];

if(game.selectedCard===i && game.turn===side)
el.style.outline="3px solid yellow";

el.onclick=()=>{
if(game.turn!==side)return;

game.selected=null;
game.moves=[];
game.selectedCard=game.selectedCard===i?null:i;

drawBoard();
drawUI();

};

menu.appendChild(el);

});

});
}

/* TABULEIRO */

function drawBoard(){

boardEl.innerHTML="";

let king=findKing(game.board,game.turn);

for(let r=0;r<8;r++)
for(let c=0;c<8;c++){

let cell=document.createElement("div");
cell.className="cell "+((r+c)%2?"dark":"light");

if(game.selected && game.selected.r===r && game.selected.c===c)
cell.classList.add("selected");

if(game.moves.some(m=>m.r2===r && m.c2===c))
cell.classList.add("move");

if(king && r===king[0] && c===king[1])
if(isAttacked(game.board,r,c,game.turn==="w"?"b":"w"))
cell.classList.add("check");

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

/* CLIQUE */

function handleClick(r,c){

if(game.gameOver)return;

let p=game.board[r][c];

if(game.selected){

let m=game.moves.find(x=>x.r2===r&&x.c2===c);

if(m){

let piece=game.board[m.r][m.c];

game.board[r][c]=piece;
game.board[m.r][m.c]="";

if(piece==="P" && r===0){showPromotion(r,c,piece);return;}
if(piece==="p" && r===7){showPromotion(r,c,piece);return;}

endTurn();
return;
}
}

if(!p)return;

if(game.turn==="w" && p!==p.toUpperCase())return;
if(game.turn==="b" && p!==p.toLowerCase())return;

game.selectedCard=null;
game.selected={r,c};

game.moves=getLegalMoves(game.board,game.turn)
.filter(m=>m.r===r && m.c===c);

drawBoard();
}

/* TURNO */

function endTurn(){

game.turn=game.turn==="w"?"b":"w";

drawUpToFour(game.turn);

game.selected=null;
game.moves=[];
game.selectedCard=null;

drawBoard();
drawUI();
}

/* INIT */

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