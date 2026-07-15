// =========================
// data.js
// Dados fixos do jogo
// =========================

// Nomes possíveis para os pacientes
const PATIENT_NAMES = [
    "Ana",
    "Bruno",
    "Carlos",
    "Daniela",
    "Eduardo",
    "Fernanda",
    "Gabriel",
    "Helena",
    "Igor",
    "Juliana",
    "Lucas",
    "Mariana",
    "Nicolas",
    "Olívia",
    "Paulo",
    "Renata",
    "Samuel",
    "Tatiane",
    "Vinícius",
    "Yasmin"
];

// Falas iniciais
const PATIENT_DIALOGS = [
    "Tenho dificuldade para enxergar placas na rua.",
    "As letras ficam meio borradas.",
    "Depois de ler por um tempo meus olhos cansam.",
    "À noite parece mais difícil enxergar.",
    "Quando dirijo sinto que falta nitidez.",
    "Às vezes preciso apertar os olhos para focar.",
    "As placas parecem duplicadas de longe.",
    "Consigo ler, mas tudo parece um pouco embaçado."
];

// Linhas da tabela de Snellen
const SNELLEN_LINES = [
    "E",
    "FP",
    "TOZ",
    "LPED",
    "PECFD",
    "EDFCZP",
    "FEPOTEC",
    "LPTOFCED"
];

// Valores permitidos para o grau esférico
const SPHERE_VALUES = [
    -4.00,-3.75,-3.50,-3.25,-3.00,
    -2.75,-2.50,-2.25,-2.00,-1.75,
    -1.50,-1.25,-1.00,-0.75,-0.50,
    -0.25,0.00,
    0.25,0.50,0.75,1.00,1.25,
    1.50,1.75,2.00,2.25,2.50,
    2.75,3.00,3.25,3.50,3.75,4.00
];

// Valores permitidos para o cilindro
const CYLINDER_VALUES = [
    0.00,
    -0.25,
    -0.50,
    -0.75,
    -1.00,
    -1.25,
    -1.50,
    -1.75,
    -2.00
];

// Eixos possíveis
const AXIS_VALUES = [];

for (let eixo = 0; eixo < 180; eixo += 10) {
    AXIS_VALUES.push(eixo);
}

// Respostas positivas do paciente
const POSITIVE_RESPONSES = [
    "Agora ficou melhor.",
    "Está bem mais nítido.",
    "Consigo enxergar melhor.",
    "Essa lente parece boa.",
    "Agora está quase perfeito."
];

// Respostas neutras
const NEUTRAL_RESPONSES = [
    "Quase não mudou.",
    "Está parecido com antes.",
    "Não percebi muita diferença."
];

// Respostas negativas
const NEGATIVE_RESPONSES = [
    "Agora ficou pior.",
    "Está bem borrado.",
    "Essa lente não ficou boa.",
    "Estou enxergando pior agora."
];

// Número de pacientes por partida
const TOTAL_PATIENTS = 5;

// Valor máximo considerado para erro perfeito
const PERFECT_TOLERANCE = 0.25;

// Utilitário para escolher um item aleatório
function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}