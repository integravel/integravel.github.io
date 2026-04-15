let funcAtual = "x^2 + y^2"

function pegarFunc(){
funcAtual = document.getElementById("func").value
}

function derivarX(){

pegarFunc()

try{

let r = math.derivative(funcAtual,"x").toString()

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}catch{

document.getElementById("resultado").innerText="Erro"

}

}

function derivarY(){

pegarFunc()

try{

let r = math.derivative(funcAtual,"y").toString()

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}catch{

document.getElementById("resultado").innerText="Erro"

}

}

function integrarX(){

pegarFunc()

try{

let r = nerdamer(`integrate(${funcAtual},x)`).toString()

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}catch{

document.getElementById("resultado").innerText="Erro"

}

}

function integrarY(){

pegarFunc()

try{

let r = nerdamer(`integrate(${funcAtual},y)`).toString()

funcAtual = r

document.getElementById("resultado").innerText="Resultado: "+r

plotar(funcAtual)

}catch{

document.getElementById("resultado").innerText="Erro"

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

for(let i=-5;i<=5;i+=0.5){
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