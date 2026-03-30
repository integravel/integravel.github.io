document.addEventListener("DOMContentLoaded", () => {

const dropzones = document.querySelectorAll(".dropzone");    
const returnZone = document.querySelector(".dropzone-return");

const pet = document.getElementById("pet");  
const hand = document.getElementById("pet-hand");

const blocksData = [

{ id: "1", tex: "Aplicando \\(\\log_b\\) em ambos os lados: \\(\\log_b(a^y) = \\log_b x\\)" },

{ id: "2", tex: "Pela propriedade da potência: \\(\\log_b(a^y) = y \\cdot \\log_b a\\)" },

{ id: "3", tex: "Logo, temos \\(y \\cdot \\log_b a = \\log_b x\\)" },

{ id: "4", tex: "Isolando \\(y\\):" },

{ id: "5", tex: "\\(y = \\frac{\\log_b x}{\\log_b a}\\)" },

{ id: "6", tex: "Substituindo de volta na definição inicial" }

];

function shuffle(array) {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.random() * (i + 1) | 0;
[array[i], array[j]] = [array[j], array[i]];
}
}

function createBlocks() {

returnZone.innerHTML = "";

const shuffled = [...blocksData];
shuffle(shuffled);

shuffled.forEach(data => {
const div = document.createElement("div");
div.className = "draggable";
div.dataset.id = data.id;
div.draggable = true;
div.innerHTML = data.tex;

enableDrag(div);
returnZone.appendChild(div);
});

if (window.MathJax) MathJax.typesetPromise();

}

function enableDrag(el) {
el.addEventListener("dragstart", e => {
e.dataTransfer.setData("text/plain", el.dataset.id);
});
}

createBlocks();

function checkIndividual() {

dropzones.forEach(zone => {

const esperado = zone.dataset.expected;
const child = zone.firstElementChild;

zone.classList.remove("correct", "wrong");

if (!child) return;

if (child.dataset.id === esperado) {
zone.classList.add("correct");
} else {
zone.classList.add("wrong");
}

});

}

dropzones.forEach(zone => {

zone.addEventListener("dragover", e => e.preventDefault());

zone.addEventListener("drop", e => {

e.preventDefault();

if (zone.children.length > 0) return;

const id = e.dataTransfer.getData("text/plain");
const block = document.querySelector(`.draggable[data-id="${id}"]`);
if (!block) return;

zone.appendChild(block);

if (window.MathJax) MathJax.typesetPromise();

if (id === zone.dataset.expected) onCorrect();
else onWrong();

checkIndividual();

});

});

returnZone.addEventListener("dragover", e => e.preventDefault());

returnZone.addEventListener("drop", e => {

e.preventDefault();

const id = e.dataTransfer.getData("text/plain");
const block = document.querySelector(`.draggable[data-id="${id}"]`);
if (!block) return;

returnZone.appendChild(block);

if (window.MathJax) MathJax.typesetPromise();

checkIndividual();

});

let reacting = false;

function react(sprite, handSprite, className) {

if (reacting) return;
reacting = true;

const img1 = new Image();
const img2 = new Image();

img1.src = sprite;
img2.src = handSprite;

img1.onload = () => {

pet.src = img1.src;
hand.src = img2.src;

pet.classList.remove("pet-happy", "pet-angry");

requestAnimationFrame(() => {
pet.classList.add(className);
hand.style.opacity = 1;
});

setTimeout(() => {
hand.style.opacity = 0;
pet.classList.remove(className);
pet.src = "cat_idle.png";
reacting = false;
}, 700);

};

}

function onCorrect() {
react("cat_happy.png", "hand_pet.png", "pet-happy");
}

function onWrong() {
react("cat_angry.png", "hand_grab.png", "pet-angry");
}

});