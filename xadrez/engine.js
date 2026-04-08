// estado
window.game = {
 board: Array.from({length:8},()=>Array(8).fill("")),
 turn:"w",
 running:false
};

const val={p:1,n:3,b:3,r:5,q:9,k:1000};

function clone(b){return b.map(r=>r.slice());}
function inB(r,c){return r>=0&&r<8&&c>=0&&c<8;}

function isEnemy(a,b){
 return b && ((a===a.toUpperCase()) !== (b===b.toUpperCase()));
}

function findKing(b,s){
 for(let r=0;r<8;r++)
 for(let c=0;c<8;c++){
  if(s==="w"&&b[r][c]==="K") return[r,c];
  if(s==="b"&&b[r][c]==="k") return[r,c];
 }
}

/* pseudo movimentos */
function pseudo(b,s){

 let m=[];

 for(let r=0;r<8;r++)
 for(let c=0;c<8;c++){

  let p=b[r][c];
  if(!p) continue;

  if(s==="w"&&p!==p.toUpperCase()) continue;
  if(s==="b"&&p!==p.toLowerCase()) continue;

  let w=p===p.toUpperCase();

  const push=(r2,c2)=>{
    if(!inB(r2,c2))return;
    let t=b[r2][c2];
    if(!t||isEnemy(p,t))
      m.push({r,c,r2,c2});
  };

  switch(p.toLowerCase()){

   case "p":{
    let d=w?-1:1;

    if(!b[r+d]?.[c]) push(r+d,c);

    if((w&&r===6)||(!w&&r===1)){
      if(!b[r+d][c]&&!b[r+2*d][c]) push(r+2*d,c);
    }

    for(let dc of [-1,1]){
      let r2=r+d,c2=c+dc;
      if(b[r2]?.[c2]&&isEnemy(p,b[r2][c2]))
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
     if(!inB(r2,c2))break;
     if(!b[r2][c2]) m.push({r,c,r2,c2});
     else{
      if(isEnemy(p,b[r2][c2])) m.push({r,c,r2,c2});
      break;
     }
    }
   }
  }
 }

 return m;
}

/* ataque */
function attacked(b,r,c,side){
 return pseudo(b,side).some(m=>m.r2===r&&m.c2===c);
}

/* movimentos legais */
function legal(b,s){
 return pseudo(b,s).filter(m=>{
  let nb=clone(b);
  nb[m.r2][m.c2]=nb[m.r][m.c];
  nb[m.r][m.c]="";

  let k=findKing(nb,s);
  return !attacked(nb,k[0],k[1],s==="w"?"b":"w");
 });
}