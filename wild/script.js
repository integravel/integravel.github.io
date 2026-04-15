let funcAtual = "x^2 + y^2"

function pegarFunc(){

funcAtual = document.getElementById("func").value

}

function derivarX(){

pegarFunc()

let deriv = math.derivative(funcAtual,"x").toString()

document.getElementById("resultado").innerText = "Resultado: " + deriv

funcAtual = deriv

plotar(funcAtual)

}

function derivarY(){

pegarFunc()

let deriv = math.derivative(funcAtual,"y").toString()

document.getElementById("resultado").innerText = "Resultado: " + deriv

funcAtual = deriv

plotar(funcAtual)

}

function integrarX(){

pegarFunc()

let integral = math.integral(funcAtual,"x").toString()

document.getElementById("resultado").innerText = "Resultado: " + integral

funcAtual = integral

plotar(funcAtual)

}

function integrarY(){

pegarFunc()

let integral = math.integral(funcAtual,"y").toString()

document.getElementById("resultado").innerText = "Resultado: " + integral

funcAtual = integral

plotar(funcAtual)

}

function plotarAtual(){

pegarFunc()

plotar(funcAtual)

}

function plotar(func){

let x = []
let y = []
let z = []

for(let i=-5;i<=5;i+=0.3){

x.push(i)
y.push(i)

}

for(let i=0;i<x.length;i++){

z[i] = []

for(let j=0;j<y.length;j++){

let scope = {x:x[i],y:y[j]}

try{

z[i][j] = math.evaluate(func,scope)

}catch{

z[i][j] = 0

}

}

}

let data = [{

x:x,
y:y,
z:z,
type:'surface'

}]

let layout = {

title:"Superfície da função",
autosize:true

}

Plotly.newPlot("grafico",data,layout)

}

plotar(funcAtual)