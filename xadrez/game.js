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
hand:{w:[],b:[]},
gameOver:false,
promotionPending:false
};

/* UTIL */

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

/* ATAQUE */

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

/* MOVIMENTOS */

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

/* PROMOÇÃO */

function showPromotion(r,c,piece){

game.promotionPending=true

promotionMenu.innerHTML=""

const opts=["Q","R","B","N"]

opts.forEach(t=>{

let p=piece===piece.toUpperCase()?t:t.toLowerCase()

let el=document.createElement("div")
el.className="promoPiece"
el.textContent=symbols[p]

el.onclick=()=>{

game.board[r][c]=p

promotionMenu.style.display="none"
game.promotionPending=false

endTurn()

}

promotionMenu.appendChild(el)

})

promotionMenu.style.display="flex"

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

let p=game.board[r][c]

if(p) cell.textContent=symbols[p]

cell.onclick=()=>handleClick(r,c)

boardEl.appendChild(cell)

}

}

/* CLIQUE */

function handleClick(r,c){

if(game.gameOver) return
if(game.promotionPending) return

if(game.selected){

let move=game.moves.find(m=>m.r2===r && m.c2===c)

if(move){

let piece=game.board[move.r][move.c]

game.board[move.r2][move.c2]=piece
game.board[move.r][move.c]=""

if(piece==="P" && move.r2===0){drawBoard();showPromotion(move.r2,move.c2,"P");return}
if(piece==="p" && move.r2===7){drawBoard();showPromotion(move.r2,move.c2,"p");return}

endTurn()
return

}

}

let p=game.board[r][c]

if(!p) return
if(sideOf(p)!==game.turn) return

game.selected={r,c}
game.moves=getPseudoMoves(game.board,r,c)

drawBoard()

}

/* TURNO */

function endTurn(){

game.turn=game.turn==="w"?"b":"w"

game.selected=null
game.moves=[]

drawBoard()

}

/* INIT */

function init(){

game.board[7][4]="K"
game.board[0][4]="k"

drawBoard()

}

init()