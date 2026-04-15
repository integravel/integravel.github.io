let funcAtual = "x^2 + y^2"

function pegarFunc(){
funcAtual = document.getElementById("func").value
}

function derivarX(){

pegarFunc()

let r = Algebrite.run("d("+funcAtual+",x)")

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}

function derivarY(){

pegarFunc()

let r = Algebrite.run("d("+funcAtual+",y)")

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}

function integrarX(){

pegarFunc()

let r = Algebrite.run("integral("+funcAtual+",x)")

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}

function integrarY(){

pegarFunc()

let r = Algebrite.run("integral("+funcAtual+",y)")

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}

function plotarAtual(){

pegarFunc()

plotar(funcAtual)

}

function plotar(func){

let x=[]
let y=[]
let z=[]

for(let i=-5;i<=5;i+=0.3){

x.push(i)
y.push(i)

}

for(let i=0;i<x.length;i++){

z[i]=[]

for(let j=0;j<y.length;j++){

try{

let scope={x:x[i],y:y[j]}

z[i][j]=math.evaluate(func,scope)

}catch{

z[i][j]=NaN

}

}

}

let data=[{
x:x,
y:y,
z:z,
type:"surface"
}]

let layout={
title:"Superfície da função"
}

Plotly.newPlot("grafico",data,layout)

}

plotar(funcAtual)