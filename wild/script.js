let funcAtual = "x^2 + y^2";

function pegarFunc(){
funcAtual = document.getElementById("func").value;
}

function derivarX(){

pegarFunc();

try{

let deriv = math.derivative(funcAtual,"x").toString();

funcAtual = deriv;

document.getElementById("resultado").innerText = "Resultado: "+deriv;

plotar(funcAtual);

}catch(e){

document.getElementById("resultado").innerText = "Erro na derivada";

}

}

function derivarY(){

pegarFunc();

try{

let deriv = math.derivative(funcAtual,"y").toString();

funcAtual = deriv;

document.getElementById("resultado").innerText = "Resultado: "+deriv;

plotar(funcAtual);

}catch(e){

document.getElementById("resultado").innerText = "Erro na derivada";

}

}

function integrarX(){

pegarFunc();

try{

let integral = nerdamer(`integrate(${funcAtual},x)`).toString();

funcAtual = integral;

document.getElementById("resultado").innerText = "Resultado: "+integral;

plotar(funcAtual);

}catch(e){

document.getElementById("resultado").innerText = "Erro na integral";

}

}

function integrarY(){

pegarFunc();

try{

let integral = nerdamer(`integrate(${funcAtual},y)`).toString();

funcAtual = integral;

document.getElementById("resultado").innerText = "Resultado: "+integral;

plotar(funcAtual);

}catch(e){

document.getElementById("resultado").innerText = "Erro na integral";

}

}

function plotarAtual(){

pegarFunc();

plotar(funcAtual);

}

function plotar(func){

let x=[];
let y=[];
let z=[];

for(let i=-5;i<=5;i+=0.4){

x.push(i);
y.push(i);

}

for(let i=0;i<x.length;i++){

z[i]=[];

for(let j=0;j<y.length;j++){

let scope={x:x[i],y:y[j]};

try{

z[i][j]=math.evaluate(func,scope);

}catch{

z[i][j]=0;

}

}

}

let data=[{
x:x,
y:y,
z:z,
type:"surface"
}];

Plotly.newPlot("grafico",data);

}

plotar(funcAtual);