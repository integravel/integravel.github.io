// =========================
// game.js
// Controle principal do jogo
// =========================

const Game = {

    totalScore: 0,

    // -------------------------
    // Inicia uma nova partida
    // -------------------------
    start() {

        this.totalScore = 0;

        patientManager.number = 0;

        this.nextPatient();

    },

    // -------------------------
    // Carrega o próximo paciente
    // -------------------------
    nextPatient() {

        if (patientManager.hasFinished()) {

            alert(
                "Fim da partida!\n\nPontuação total: " +
                this.totalScore
            );

            UI.showScreen("menu");

            return;
        }

        const patient = patientManager.nextPatient();

        UI.showScreen("game");

        UI.loadPatient(patient);

    },

    // -------------------------
    // Confirma o exame atual
    // -------------------------
    confirmExam() {

        if (UI.currentExam === "balloon") {

            UI.showFeedback();

            setTimeout(() => {

                UI.nextExam();

            }, 1200);

            return;

        }

        // Segundo exame finalizado

        UI.showFeedback();

        this.totalScore +=
            patientManager.current.calculateScore();

        setTimeout(() => {

            UI.showResult();

        }, 1200);

    },

    // -------------------------
    // Ajustes das lentes
    // -------------------------

    changeSphere(step) {

        const patient = patientManager.current;

        let index =
            SPHERE_VALUES.indexOf(patient.playerSphere);

        index += step;

        index = Math.max(
            0,
            Math.min(
                SPHERE_VALUES.length - 1,
                index
            )
        );

        patient.playerSphere =
            SPHERE_VALUES[index];

        UI.updateLensValues();

    },

    changeCylinder(step) {

        const patient = patientManager.current;

        let index =
            CYLINDER_VALUES.indexOf(patient.playerCylinder);

        index += step;

        index = Math.max(
            0,
            Math.min(
                CYLINDER_VALUES.length - 1,
                index
            )
        );

        patient.playerCylinder =
            CYLINDER_VALUES[index];

        UI.updateLensValues();

    },

    changeAxis(step) {

        const patient = patientManager.current;

        let index =
            AXIS_VALUES.indexOf(patient.playerAxis);

        index += step;

        if (index < 0)
            index = AXIS_VALUES.length - 1;

        if (index >= AXIS_VALUES.length)
            index = 0;

        patient.playerAxis =
            AXIS_VALUES[index];

        UI.updateLensValues();

    },

    // -------------------------
    // Liga todos os botões
    // -------------------------
    bindEvents() {

        document
            .getElementById("btnStart")
            .addEventListener(
                "click",
                () => this.start()
            );

        document
            .getElementById("nextPatient")
            .addEventListener(
                "click",
                () => this.nextPatient()
            );

        document
            .getElementById("confirmExam")
            .addEventListener(
                "click",
                () => this.confirmExam()
            );

        document
            .getElementById("sphereMinus")
            .addEventListener(
                "click",
                () => this.changeSphere(-1)
            );

        document
            .getElementById("spherePlus")
            .addEventListener(
                "click",
                () => this.changeSphere(1)
            );

        document
            .getElementById("cylMinus")
            .addEventListener(
                "click",
                () => this.changeCylinder(-1)
            );

        document
            .getElementById("cylPlus")
            .addEventListener(
                "click",
                () => this.changeCylinder(1)
            );

        document
            .getElementById("axisMinus")
            .addEventListener(
                "click",
                () => this.changeAxis(-1)
            );

        document
            .getElementById("axisPlus")
            .addEventListener(
                "click",
                () => this.changeAxis(1)
            );

    }

};