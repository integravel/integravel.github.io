// =========================
// patient.js
// Criação dos pacientes
// =========================

class Patient {

    constructor() {

        this.name = randomItem(PATIENT_NAMES);
        this.dialog = randomItem(PATIENT_DIALOGS);

        // Grau verdadeiro do paciente
        this.realSphere = randomItem(SPHERE_VALUES);
        this.realCylinder = randomItem(CYLINDER_VALUES);
        this.realAxis = randomItem(AXIS_VALUES);

        // Configuração escolhida pelo jogador
        this.playerSphere = 0.00;
        this.playerCylinder = 0.00;
        this.playerAxis = 0;

    }

    // Diferença entre o grau correto e o escolhido
    sphereError() {
        return Math.abs(this.realSphere - this.playerSphere);
    }

    cylinderError() {
        return Math.abs(this.realCylinder - this.playerCylinder);
    }

    axisError() {

        let diff = Math.abs(this.realAxis - this.playerAxis);

        // Ex.: diferença entre 170° e 10° = 20°
        if (diff > 90) {
            diff = 180 - diff;
        }

        return diff;
    }

    totalError() {

        return (
            this.sphereError() +
            this.cylinderError() +
            (this.axisError() / 90)
        );

    }

    // Avaliação do paciente
    getFeedback() {

        const erro = this.totalError();

        if (erro <= 0.30)
            return randomItem(POSITIVE_RESPONSES);

        if (erro <= 0.80)
            return randomItem(NEUTRAL_RESPONSES);

        return randomItem(NEGATIVE_RESPONSES);

    }

    // Calcula a pontuação
    calculateScore() {

        const erro = this.totalError();

        if (erro <= 0.25) return 100;
        if (erro <= 0.50) return 90;
        if (erro <= 0.75) return 80;
        if (erro <= 1.00) return 70;
        if (erro <= 1.50) return 60;
        if (erro <= 2.00) return 45;
        if (erro <= 3.00) return 25;

        return 10;

    }

}

// =========================
// Gerenciador dos pacientes
// =========================

class PatientManager {

    constructor() {

        this.current = null;
        this.number = 0;

    }

    nextPatient() {

        this.number++;

        this.current = new Patient();

        return this.current;

    }

    hasFinished() {

        return this.number >= TOTAL_PATIENTS;

    }

}

// Instância global
const patientManager = new PatientManager();