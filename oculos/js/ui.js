// =========================
// ui.js
// Interface do jogo
// =========================

const UI = {

    currentExam: "balloon",

    // -------------------------
    // Alterna entre telas
    // -------------------------
    showScreen(id) {

        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.add("hidden");
        });

        document.getElementById(id).classList.remove("hidden");

    },

    // -------------------------
    // Atualiza os valores exibidos
    // -------------------------
    updateLensValues() {

        const patient = patientManager.current;

        if (!patient) return;

        document.getElementById("sphereValue").textContent =
            patient.playerSphere.toFixed(2);

        document.getElementById("cylValue").textContent =
            patient.playerCylinder.toFixed(2);

        document.getElementById("axisValue").textContent =
            patient.playerAxis + "°";

        Vision.refresh();

    },

    // -------------------------
    // Mostra um novo paciente
    // -------------------------
    loadPatient(patient) {

        document.getElementById("patientName").textContent =
            "Paciente " + patientManager.number + " - " + patient.name;

        document.getElementById("patientSpeech").textContent =
            patient.dialog;

        this.currentExam = "balloon";

        document.getElementById("examTitle").textContent =
            "Teste do Balão Astigmático";

        Vision.showExam("balloon");

        this.updateLensValues();

    },

    // -------------------------
    // Vai para o segundo exame
    // -------------------------
    nextExam() {

        this.currentExam = "snellen";

        document.getElementById("examTitle").textContent =
            "Tabela de Snellen";

        document.getElementById("patientSpeech").textContent =
            "Leia as menores letras que conseguir.";

        Vision.showExam("snellen");

    },

    // -------------------------
    // Exibe resposta do paciente
    // -------------------------
    showFeedback() {

        const patient = patientManager.current;

        document.getElementById("patientSpeech").textContent =
            patient.getFeedback();

    },

    // -------------------------
    // Tela de resultado
    // -------------------------
    showResult() {

        const patient = patientManager.current;

        const score = patient.calculateScore();

        let stars = "";

        if (score >= 95)
            stars = "★★★★★";
        else if (score >= 80)
            stars = "★★★★";
        else if (score >= 60)
            stars = "★★★";
        else if (score >= 40)
            stars = "★★";
        else
            stars = "★";

        document.getElementById("resultText").innerHTML = `
            <h3>${stars}</h3>

            <p><strong>Pontuação:</strong> ${score}</p>

            <hr><br>

            <p><strong>Configuração correta</strong></p>

            <p>
            Esférico:
            ${patient.realSphere.toFixed(2)}
            </p>

            <p>
            Cilindro:
            ${patient.realCylinder.toFixed(2)}
            </p>

            <p>
            Eixo:
            ${patient.realAxis}°
            </p>

            <br>

            <p>
            ${patient.getFeedback()}
            </p>
        `;

        this.showScreen("result");

    }

};