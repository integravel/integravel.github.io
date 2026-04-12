const boardEl=document.getElementById("board");
const topMenu=document.getElementById("topMenu");
const bottomMenu=document.getElementById("bottomMenu");
const promotionMenu=document.getElementById("promotionMenu");

const symbols={
P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔",
p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"
};

const game={
board:Array.from({length:8},()=>Array(8).fill("")),
turn:"w",
selected:null,
moves:[],
selectedCard:null,
deck:{w:[],b:[]},
hand:{w:[],b:[]}
};

/* UTIL */

function clone(b){return b.map(r=>r.slice())}

function isEnemy(a,b){
return b && ((a===a.toUpperCase())!=(b===b.toUpperCase()))
}

function findKing(b,side){
for(let r=0;r<8;r++)
for(let c=0;c<8;c++){
if(side==="w" && b[r][c]==="K") return [r,c]
if(side==="b" && b[r][c]==="k") return [r,c]
}
return null
}

/* BARALHO */

function createDeck(side){

const base=[
{p:"R",r:7,c:0},{p:"N",r:7,c:1},{p:"B",r:7,c:2},{p:"Q",r:7,c:3},
{p:"B",r:7,c:5},{p:"N",r:7,c:6},{p:"R",r:7,c:7},
{p:"P",r:6,c:0},{p:"P",r:6,c:1},{p:"P",r:6,c:2},{p:"P",r:6,c:3},
{p:"P",r:6,c:4},{p:"P",r:6,c:5},{p:"P",r:6,c:6},{p:"P",r:6,c:7}
]

let deck=base.map(x=>{
if(side==="b") return {p:x.p.toLowerCase(),r:7-x.r,c:x.c}
return {...x}
})

return shuffle(deck)
}

function shuffle(a){
for(let i=a.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1))
let t=a[i];a[i]=a[j];a[j]=t
}
return a
}

function drawUpToFour(side){
while(game.hand[side].length<4){
let c=game.deck[side].pop()
if(!c) break
game.hand[side].push(c)
}
}

/* MOVIMENTOS BÁSICOS */

function getMoves(r,c){

let p=game.board[r][c]
let moves=[]

if(!p) return moves

function push(r2,c2){
if(r2<0||r2>7||c2<0||c2>7) return
let t=game.board[r2][c2]
if(!t||isEnemy(p,t)) moves.push({r2,c2})
}

if(p.toLowerCase()==="n"){
[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
.forEach(v=>push(r+v[0],c+v[1]))
}

if(p.toLowerCase()==="k"){
[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
.forEach(v=>push(r+v[0],c+v[1]))
}

return moves
}

/* PROMOÇÃO */

function showPromotion(r,c,piece){

promotionMenu.innerHTML=""
promotionMenu.style.display="flex"

let opts=["Q","R","B","N"]

opts.forEach(t=>{

let p=piece===piece.toUpperCase()?t:t.toLowerCase()

let el=document.createElement("div")
el.className="promoPiece"
el.textContent=symbols[p]

el.onclick=()=>{
game.board[r][c]=p
promotionMenu.style.display="none"
endTurn()
}

promotionMenu.appendChild(el)

})
}

/* UI */

function drawUI(){

topMenu.innerHTML=""
bottomMenu.innerHTML=""

["b","w"].forEach(side=>{

let menu=side==="w"?bottomMenu:topMenu

game.hand[side].forEach((card,i)=>{

let el=document.createElement("div")
el.className="menuPiece"
el.textContent=symbols[card.p]

if(game.selectedCard===i && game.turn===side)
el.style.outline="3px solid yellow"

el.onclick=()=>{

if(game.turn!==side) return

game.selected=null
game.moves=[]

game.selectedCard = (game.selectedCard===i)?null:i

drawBoard()
drawUI()

}

menu.appendChild(el)

})

})

}

/* TABULEIRO */

function drawBoard(){

boardEl.innerHTML=""

for(let r=0;r<8;r++)
for(let c=0;c<8;c++){

let cell=document.createElement("div")
cell.className="cell "+((r+c)%2?"dark":"light")

if(game.selected && game.selected.r===r && game.selected.c===c)
cell.classList.add("selected")

if(game.moves.some(m=>m.r2===r && m.c2===c))
cell.classList.add("move")

/* destaque carta */

if(game.selectedCard!==null){

let card=game.hand[game.turn][game.selectedCard]

if(card && r===card.r && c===card.c && !game.board[r][c])
cell.classList.add("move")

}

let p=game.board[r][c]

if(p) cell.textContent=symbols[p]

cell.onclick=()=>handleClick(r,c)

boardEl.appendChild(cell)

}

}

/* CLIQUE */

function handleClick(r,c){

/* colocar carta */

if(game.selectedCard!==null){

let card=game.hand[game.turn][game.selectedCard]

if(r===card.r && c===card.c && !game.board[r][c]){

game.board[r][c]=card.p

game.hand[game.turn].splice(game.selectedCard,1)

endTurn()

}

return
}

/* mover peça */

if(game.selected){

let move=game.moves.find(m=>m.r2===r && m.c2===c)

if(move){

let piece=game.board[game.selected.r][game.selected.c]

game.board[r][c]=piece
game.board[game.selected.r][game.selected.c]=""

if(piece==="P" && r===0){showPromotion(r,c,piece);return}
if(piece==="p" && r===7){showPromotion(r,c,piece);return}

endTurn()
return

}

}

let p=game.board[r][c]

if(!p) return

if(game.turn==="w" && p!==p.toUpperCase()) return
if(game.turn==="b" && p!==p.toLowerCase()) return

game.selectedCard=null
game.selected={r,c}
game.moves=getMoves(r,c).map(m=>({r2:m.r2,c2:m.c2}))

drawBoard()

}

/* TURNO */

function endTurn(){

game.turn=game.turn==="w"?"b":"w"

drawUpToFour(game.turn)

game.selected=null
game.moves=[]
game.selectedCard=null

drawBoard()
drawUI()

}

/* INIT */

function init(){

game.board[7][4]="K"
game.board[0][4]="k"

game.deck.w=createDeck("w")
game.deck.b=createDeck("b")

drawUpToFour("w")
drawUpToFour("b")

drawBoard()
drawUI()

}

init()