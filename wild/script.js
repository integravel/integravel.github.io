let funcAtual = "x^2 + y^2";

function pegarFunc() {
    funcAtual = document.getElementById("func").value;
}

function derivarX() {

    pegarFunc();

    try {

        let deriv = math.derivative(funcAtual, "x").toString();

        document.getElementById("resultado").innerText = "Resultado: " + deriv;

        funcAtual = deriv;

        plotar(funcAtual);

    } catch (erro) {

        document.getElementById("resultado").innerText = "Erro ao derivar.";

    }

}

function derivarY() {

    pegarFunc();

    try {

        let deriv = math.derivative(funcAtual, "y").toString();

        document.getElementById("resultado").innerText = "Resultado: " + deriv;

        funcAtual = deriv;

        plotar(funcAtual);

    } catch (erro) {

        document.getElementById("resultado").innerText = "Erro ao derivar.";

    }

}

function integrarX() {

    pegarFunc();

    try {

        let integral = nerdamer.integrate(funcAtual, "x").toString();

        document.getElementById("resultado").innerText = "Resultado: " + integral;

        funcAtual = integral;

        plotar(funcAtual);

    } catch (erro) {

        document.getElementById("resultado").innerText = "Erro ao integrar.";

    }

}

function integrarY() {

    pegarFunc();

    try {

        let integral = nerdamer.integrate(funcAtual, "y").toString();

        document.getElementById("resultado").innerText = "Resultado: " + integral;

        funcAtual = integral;

        plotar(funcAtual);

    } catch (erro) {

        document.getElementById("resultado").innerText = "Erro ao integrar.";

    }

}

function plotarAtual() {

    pegarFunc();

    plotar(funcAtual);

}

function plotar(func) {

    let x = [];
    let y = [];
    let z = [];

    for (let i = -5; i <= 5; i += 0.4) {

        x.push(i);
        y.push(i);

    }

    for (let i = 0; i < x.length; i++) {

        z[i] = [];

        for (let j = 0; j < y.length; j++) {

            let scope = { x: x[i], y: y[j] };

            try {

                z[i][j] = math.evaluate(func, scope);

            } catch {

                z[i][j] = 0;

            }

        }

    }

    let data = [{
        x: x,
        y: y,
        z: z,
        type: 'surface'
    }];

    let layout = {
        title: "Superfície da função",
        autosize: true
    };

    Plotly.newPlot("grafico", data, layout);

}

plotar(funcAtual);