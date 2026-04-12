const boardEl = document.getElementById("board");
const topMenu = document.getElementById("topMenu");
const bottomMenu = document.getElementById("bottomMenu");
const promotionMenu = document.getElementById("promotionMenu");
const mateMessage = document.getElementById("mateMessage");

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
hand:{w:[],b:[]},
promotionPending:false,
gameOver:false,
lastMove:null
};

function clone(b){return b.map(r=>r.slice())}
function sideOf(p){return p===p.toUpperCase()?"w":"b"}
function isEnemy(a,b){return b && sideOf(a)!==sideOf(b)}

function findKing(board,side){
for(let r=0;r<8;r++)
for(let c=0;c<8;c++){
let p=board[r][c]
if(side==="w" && p==="K") return [r,c]
if(side==="b" && p==="k") return [r,c]
}
}

function isSquareAttacked(board,r,c,bySide){

for(let i=0;i<8;i++)
for(let j=0;j<8;j++){

let p=board[i][j]
if(!p) continue
if(sideOf(p)!==bySide) continue

let moves=getPseudoMoves(board,i,j)

if(moves.some(m=>m.r2===r && m.c2===c))
return true

}

return false
}

function kingWouldBeInCheck(board,side){

let king=findKing(board,side)
let enemy=side==="w"?"b":"w"

return isSquareAttacked(board,king[0],king[1],enemy)

}

function playerHasMoves(side){

for(let r=0;r<8;r++)
for(let c=0;c<8;c++){

let p=game.board[r][c]

if(!p) continue
if(sideOf(p)!==side) continue

let moves=getLegalMoves(game.board,r,c)

if(moves.length>0) return true

}

return false
}

function checkMate(){

let side=game.turn

if(kingWouldBeInCheck(game.board,side) && !playerHasMoves(side)){

game.gameOver=true

mateMessage.style.display="block"

mateMessage.innerText=
side==="w"?"Xeque-mate! Pretas vencem":"Xeque-mate! Brancas vencem"

}

}

function getPseudoMoves(board,r,c){

let p=board[r][c]
let moves=[]

function push(r2,c2){

if(r2<0||r2>7||c2<0||c2>7) return

let t=board[r2][c2]

if(!t || isEnemy(p,t))
moves.push({r,c,r2,c2})

}

function slide(dirs){

for(let d of dirs){

for(let i=1;i<8;i++){

let r2=r+d[0]*i
let c2=c+d[1]*i

if(r2<0||r2>7||c2<0||c2>7) break

let t=board[r2][c2]

if(!t){
moves.push({r,c,r2,c2})
}else{

if(isEnemy(p,t))
moves.push({r,c,r2,c2})

break
}

}

}

}

if(p.toLowerCase()==="n"){
[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
.forEach(v=>push(r+v[0],c+v[1]))
}

if(p.toLowerCase()==="k"){
[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
.forEach(v=>push(r+v[0],c+v[1]))
}

if(p.toLowerCase()==="r"){
slide([[1,0],[-1,0],[0,1],[0,-1]])
}

if(p.toLowerCase()==="b"){
slide([[1,1],[1,-1],[-1,1],[-1,-1]])
}

if(p.toLowerCase()==="q"){
slide([
[1,0],[-1,0],[0,1],[0,-1],
[1,1],[1,-1],[-1,1],[-1,-1]
])
}

if(p==="P"){

if(!board[r-1]?.[c])
moves.push({r,c,r2:r-1,c2:c})

if(r===6 && !board[r-1][c] && !board[r-2][c])
moves.push({r,c,r2:r-2,c2:c})

if(board[r-1]?.[c-1] && isEnemy(p,board[r-1][c-1]))
moves.push({r,c,r2:r-1,c2:c-1})

if(board[r-1]?.[c+1] && isEnemy(p,board[r-1][c+1]))
moves.push({r,c,r2:r-1,c2:c+1})

}

if(p==="p"){

if(!board[r+1]?.[c])
moves.push({r,c,r2:r+1,c2:c})

if(r===1 && !board[r+1][c] && !board[r+2][c])
moves.push({r,c,r2:r+2,c2:c})

if(board[r+1]?.[c-1] && isEnemy(p,board[r+1][c-1]))
moves.push({r,c,r2:r+1,c2:c-1})

if(board[r+1]?.[c+1] && isEnemy(p,board[r+1][c+1]))
moves.push({r,c,r2:r+1,c2:c+1})

}

return moves
}

function getLegalMoves(board,r,c){

let p=board[r][c]
let side=sideOf(p)

let pseudo=getPseudoMoves(board,r,c)

let legal=[]

for(let m of pseudo){

let newBoard=clone(board)

newBoard[m.r2][m.c2]=p
newBoard[m.r][m.c]=""

if(!kingWouldBeInCheck(newBoard,side))
legal.push(m)

}

return legal

}

function showPromotion(r,c,piece){

game.promotionPending=true

promotionMenu.innerHTML=""

;["Q","R","B","N"].forEach(type=>{

let promoted = piece===piece.toUpperCase()?type:type.toLowerCase()

let el=document.createElement("div")
el.className="promoPiece"
el.textContent=symbols[promoted]

el.onclick=()=>{

game.board[r][c]=promoted

promotionMenu.style.display="none"
game.promotionPending=false

endTurn()

}

promotionMenu.appendChild(el)

})

promotionMenu.style.display="flex"

}

function drawBoard(){

boardEl.innerHTML=""

let card=null
if(game.selectedCard!==null)
card=game.hand[game.turn][game.selectedCard]

let kingCheck=null

if(kingWouldBeInCheck(game.board,"w"))
kingCheck=findKing(game.board,"w")

if(kingWouldBeInCheck(game.board,"b"))
kingCheck=findKing(game.board,"b")

for(let r=0;r<8;r++)
for(let c=0;c<8;c++){

let light=(r+c)%2===0
let cell=document.createElement("div")

cell.className="cell "+(light?"light":"dark")

if(game.lastMove){

if(r===game.lastMove.r1 && c===game.lastMove.c1)
cell.classList.add(light?"lastMoveLight":"lastMoveDark")

if(r===game.lastMove.r2 && c===game.lastMove.c2)
cell.classList.add(light?"lastMoveLight":"lastMoveDark")

}

if(game.selected && game.selected.r===r && game.selected.c===c)
cell.classList.add("selected")

if(game.moves.some(m=>m.r2===r && m.c2===c))
cell.classList.add("move")

if(card && r===card.r && c===card.c){

if(game.board[r][c])
cell.classList.add(light?"blocked-light":"blocked-dark")
else
cell.classList.add("move")

}

if(kingCheck && kingCheck[0]===r && kingCheck[1]===c)
cell.classList.add("check")

let p=game.board[r][c]

if(p) cell.textContent=symbols[p]

cell.onclick=()=>handleClick(r,c)

boardEl.appendChild(cell)

}

}

function handleClick(r,c){

if(game.gameOver) return
if(game.promotionPending) return

if(game.selectedCard!==null){

let card=game.hand[game.turn][game.selectedCard]

if(r===card.r && c===card.c && !game.board[r][c]){

let newBoard=clone(game.board)
newBoard[r][c]=card.p

if(kingWouldBeInCheck(newBoard,game.turn)) return

game.board=newBoard
game.hand[game.turn].splice(game.selectedCard,1)

if(card.p==="P" && r===0){drawBoard();showPromotion(r,c,"P");return}
if(card.p==="p" && r===7){drawBoard();showPromotion(r,c,"p");return}

endTurn()

}

return
}

if(game.selected){

let move=game.moves.find(m=>m.r2===r && m.c2===c)

if(move){

let piece=game.board[move.r][move.c]

let newBoard=clone(game.board)
newBoard[move.r2][move.c2]=piece
newBoard[move.r][move.c]=""

if(kingWouldBeInCheck(newBoard,game.turn)) return

game.board=newBoard

game.lastMove={
r1:move.r,
c1:move.c,
r2:move.r2,
c2:move.c2
}

if(piece==="P" && move.r2===0){drawBoard();showPromotion(move.r2,move.c2,"P");return}
if(piece==="p" && move.r2===7){drawBoard();showPromotion(move.r2,move.c2,"p");return}

endTurn()
return

}

}

let p=game.board[r][c]

if(!p) return
if(sideOf(p)!==game.turn) return

game.selectedCard=null
game.selected={r,c}

game.moves=getLegalMoves(game.board,r,c)

drawBoard()

}

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

function drawUI(){

topMenu.innerHTML=""
bottomMenu.innerHTML=""

;["b","w"].forEach(side=>{

let menu = side==="w"?bottomMenu:topMenu

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

game.selectedCard = game.selectedCard===i?null:i

drawBoard()
drawUI()

}

menu.appendChild(el)

})

})

}

function endTurn(){

game.turn = game.turn==="w"?"b":"w"

drawUpToFour(game.turn)

game.selected=null
game.moves=[]
game.selectedCard=null

checkMate()

drawBoard()
drawUI()

}

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