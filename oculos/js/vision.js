// =========================
// vision.js
// Renderização dos exames
// =========================

const Vision = {

    currentExam: "balloon",

    // -------------------------
    // Inicia um exame
    // -------------------------
    showExam(type) {

        this.currentExam = type;

        if (type === "balloon") {
            this.drawBalloon();
        } else {
            this.drawSnellen();
        }

    },

    // -------------------------
    // Balão Astigmático
    // -------------------------
    drawBalloon() {

        const display = document.getElementById("examDisplay");

        display.innerHTML = "";

        const balloon = document.createElement("div");
        balloon.className = "balloon";

        // 18 linhas (uma a cada 10°)
        for (let angle = 0; angle < 180; angle += 10) {

            const line = document.createElement("div");
            line.className = "balloon-line";

            line.style.transform =
                `translate(-50%, -100%) rotate(${angle}deg)`;

            balloon.appendChild(line);

        }

        display.appendChild(balloon);

        this.applyBlur();

    },

    // -------------------------
    // Tabela de Snellen
    // -------------------------
    drawSnellen() {

        const display = document.getElementById("examDisplay");

        display.innerHTML = "";

        const chart = document.createElement("div");
        chart.className = "eye-chart";

        SNELLEN_LINES.forEach((line, index) => {

            const row = document.createElement("div");

            row.className = `l${Math.min(index + 1, 6)}`;

            row.textContent = line;

            chart.appendChild(row);

        });

        display.appendChild(chart);

        this.applyBlur();

    },

    // -------------------------
    // Calcula intensidade do desfoque
    // -------------------------
    getBlurAmount() {

        if (!patientManager.current)
            return 0;

        const patient = patientManager.current;

        const sphere =
            Math.abs(patient.realSphere - patient.playerSphere);

        const cylinder =
            Math.abs(patient.realCylinder - patient.playerCylinder);

        const axis =
            patient.axisError() / 90;

        let blur = sphere + cylinder + axis;

        blur *= 2.2;

        blur = Math.max(0, blur);
        blur = Math.min(10, blur);

        return blur;

    },

    // -------------------------
    // Atualiza filtro visual
    // -------------------------
    applyBlur() {

        const display = document.getElementById("examDisplay");

        const blur = this.getBlurAmount();

        display.style.filter =
            `blur(${blur}px)`;

    },

    // -------------------------
    // Atualiza após trocar lente
    // -------------------------
    refresh() {

        this.applyBlur();

    }

};