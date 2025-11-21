import js
import unicodedata

# Banco de dados igual ao original (resumido aqui por brevidade)
ANION_DATA = {
    "CN⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"ppt branco","hno3":"insoluvel","pH":11},
    "S²⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel","ag":"ppt preto","hno3":"insoluvel","pH":13},
    "SO₃²⁻": {"color":"incolor","rg":"+","ox":"-","baca":"ppt branco","acetic":"insoluvel","ag":"ppt branco","hno3":"soluvel","pH":9},
    "SO₄²⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"insolvel","ag":"nao precipita","hno3":"soluvel","pH":7},
    # insira aqui TODO o seu dicionário completo
}

def normalize(s):
    if s is None:
        return ""
    s = str(s).strip().lower()
    s = "".join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    return s

def aplicar_regras(user_input):
    eliminados = set()
    explicacoes = []
    restantes = set(ANION_DATA.keys())

    color = normalize(user_input["color"])
    rg = normalize(user_input["rg"])
    ox = normalize(user_input["ox"])
    baca = normalize(user_input["baca"])
    acetic = normalize(user_input["acetic"])
    ag = normalize(user_input["ag"])
    hno3 = normalize(user_input["hno3"])
    ph_str = normalize(user_input["ph"])

    # exemplo reduzido:
    if color == "incolor":
        eliminados.update([a for a,p in ANION_DATA.items() if p["color"] in ["amarelo","laranja"]])
        explicacoes.append("Cor incolor → elimina amarelo e laranja")

    restantes = set(ANION_DATA.keys()) - eliminados
    return sorted(restantes), explicacoes, sorted(eliminados)


def executar(event=None):
    # Capturar valores dos inputs HTML
    user_input = {
        "color": js.document.getElementById("color").value,
        "ph": js.document.getElementById("ph").value,
        "rg": js.document.getElementById("rg").value,
        "ox": js.document.getElementById("ox").value,
        "baca": js.document.getElementById("baca").value,
        "acetic": js.document.getElementById("acetic").value,
        "ag": js.document.getElementById("ag").value,
        "hno3": js.document.getElementById("hno3").value,
    }

    possiveis, explicacoes, eliminados = aplicar_regras(user_input)

    js.document.getElementById("possiveis").innerText = "\n".join(possiveis)
    js.document.getElementById("eliminacoes").innerText = (
        "\n".join(explicacoes) + "\n\nEliminados:\n" + "\n".join(eliminados)
    )
