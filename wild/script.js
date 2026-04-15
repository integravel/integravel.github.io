let funcAtual = "x^2 + y^2"

function pegarFunc(){
funcAtual = document.getElementById("func").value
}

function derivarX(){

pegarFunc()

try{

let r = Algebrite.run("d("+funcAtual+",x)")

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}catch{

document.getElementById("resultado").innerText="Erro na derivada"

}

}

function derivarY(){

pegarFunc()

try{

let r = Algebrite.run("d("+funcAtual+",y)")

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}catch{

document.getElementById("resultado").innerText="Erro na derivada"

}

}

function integrarX(){

pegarFunc()

try{

let r = Algebrite.run("integral("+funcAtual+",x)")

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}catch{

document.getElementById("resultado").innerText="Erro na integral"

}

}

function integrarY(){

pegarFunc()

try{

let r = Algebrite.run("integral("+funcAtual+",y)")

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}catch{

document.getElementById("resultado").innerText="Erro na integral"

}

}

function plotarAtual(){

pegarFunc()

plotar(funcAtual)

}

function plotar(func){

let x=[]
let y=[]
let z=[]

for(let i=-5;i<=5;i+=0.4){

x.push(i)
y.push(i)

}

for(let i=0;i<x.length;i++){

z[i]=[]

for(let j=0;j<y.length;j++){

try{

let expr = func
.replace(/x/g,"("+x[i]+")")
.replace(/y/g,"("+y[j]+")")

let v = Algebrite.run(expr)

z[i][j] = Number(v)

}catch{

z[i][j]=0

}

}

}

let data=[{
x:x,
y:y,
z:z,
type:"surface"
}]

Plotly.newPlot("grafico",data)

}

plotar(funcAtual)