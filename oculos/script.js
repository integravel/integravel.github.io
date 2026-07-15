// =========================
// script.js
// Inicialização do jogo
// =========================

window.addEventListener("DOMContentLoaded", () => {

    console.log("Oculista Simulator iniciado.");

    // Liga todos os botões
    Game.bindEvents();

    // Exibe a tela inicial
    UI.showScreen("menu");

});