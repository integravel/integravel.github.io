function evaluate(b){

 let score=0;

 for(let r=0;r<8;r++)
 for(let c=0;c<8;c++){
  let p=b[r][c];
  if(!p) continue;

  let v={p:100,n:320,b:330,r:500,q:900,k:20000}[p.toLowerCase()];
  score += (p===p.toUpperCase()?v:-v);
 }

 return score;
}

function minimax(b,depth,alpha,beta,max){

 let side=max?"w":"b";
 let moves=legal(b,side);

 if(depth===0) return evaluate(b);

 if(!moves.length){
  let k=findKing(b,side);
  if(attacked(b,k[0],k[1],side==="w"?"b":"w")){
    return max?-999999:999999;
  }
  return 0;
 }

 if(max){
  let best=-Infinity;
  for(let m of moves){
    let nb=clone(b);
    nb[m.r2][m.c2]=nb[m.r][m.c];
    nb[m.r][m.c]="";

    let v=minimax(nb,depth-1,alpha,beta,false);
    best=Math.max(best,v);
    alpha=Math.max(alpha,v);
    if(beta<=alpha) break;
  }
  return best;
 } else {
  let best=Infinity;
  for(let m of moves){
    let nb=clone(b);
    nb[m.r2][m.c2]=nb[m.r][m.c];
    nb[m.r][m.c]="";

    let v=minimax(nb,depth-1,alpha,beta,true);
    best=Math.min(best,v);
    beta=Math.min(beta,v);
    if(beta<=alpha) break;
  }
  return best;
 }
}

function bestMove(){

 let moves=legal(game.board,game.turn);
 let best=null;
 let bestVal= game.turn==="w"?-Infinity:Infinity;

 for(let m of moves){

  let nb=clone(game.board);
  nb[m.r2][m.c2]=nb[m.r][m.c];
  nb[m.r][m.c]="";

  let v=minimax(nb,4,-Infinity,Infinity,game.turn==="b");

  if(game.turn==="w" && v>bestVal){bestVal=v;best=m;}
  if(game.turn==="b" && v<bestVal){bestVal=v;best=m;}
 }

 return best;
}