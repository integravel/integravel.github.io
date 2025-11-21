import js
import unicodedata


# ---------------------------------------------------------
# DICIONÁRIO COMPLETO DOS ÂNIONS
# ---------------------------------------------------------
ANION_DATA = {
    "CN⁻": {"color": "incolor", "rg": "+", "ox": "-", "baca": "nao precipita", "acetic": "soluvel",
            "ag": "ppt branco", "hno3": "insoluvel", "pH": 11},

    "S²⁻": {"color": "incolor", "rg": "+", "ox": "-", "baca": "nao precipita", "acetic": "soluvel",
            "ag": "ppt preto", "hno3": "insoluvel", "pH": 13},

    "SO₃²⁻": {"color": "incolor", "rg": "+", "ox": "-", "baca": "ppt branco", "acetic": "insoluvel",
              "ag": "ppt branco", "hno3": "soluvel", "pH": 9},

    "S₂O₃²⁻": {"color": "incolor", "rg": "+", "ox": "-", "baca": "nao precipita", "acetic": "soluvel",
               "ag": "ppt preto", "hno3": "insoluvel", "pH": 9},

    "NO₂⁻": {"color": "incolor", "rg": "+", "ox": "+", "baca": "nao precipita", "acetic": "soluvel",
             "ag": "ppt preto", "hno3": "insoluvel", "pH": 8},

    "ClO⁻": {"color": "incolor", "rg": "-", "ox": "+", "baca": "nao precipita", "acetic": "soluvel",
             "ag": "ppt preto", "hno3": "insoluvel", "pH": None},

    "CO₃²⁻": {"color": "incolor", "rg": "-", "ox": "-", "baca": "ppt branco", "acetic": "soluvel",
              "ag": "ppt branco", "hno3": "soluvel", "pH": 12},

    "HCO₃⁻": {"color": "incolor", "rg": "-", "ox": "-", "baca": "ppt branco", "acetic": "soluvel",
              "ag": "ppt branco", "hno3": "soluvel", "pH": 8},

    "F⁻": {"color": "incolor", "rg": "-", "ox": "-", "baca": "ppt branco", "acetic": "insoluvel",
           "ag": "ppt branco", "hno3": "soluvel", "pH": 8.5},

    "C₂O₄²⁻": {"color": "incolor", "rg": "+", "ox": "-", "baca": "ppt branco", "acetic": "insoluvel",
               "ag": "ppt branco", "hno3": "soluvel", "pH": 9},

    "PO₄³⁻": {"color": "incolor", "rg": "-", "ox": "-", "baca": "ppt branco", "acetic": "soluvel",
              "ag": "ppt amarelo", "hno3": "soluvel", "pH": 12},

    "CrO₄²⁻": {"color": "amarelo", "rg": "-", "ox": "+", "baca": "ppt amarelo", "acetic": "insoluvel",
               "ag": "ppt marrom", "hno3": "insolvel", "pH": 8},

    "Cr₂O₇²⁻": {"color": "laranja", "rg": "-", "ox": "+", "baca": "ppt amarelo", "acetic": "insoluvel",
                "ag": "ppt marrom", "hno3": "insolvel", "pH": 4},

    "SO₄²⁻": {"color": "incolor", "rg": "-", "ox": "-", "baca": "ppt branco", "acetic": "insoluvel",
              "ag": "nao precipita", "hno3": "soluvel", "pH": 7},

    "BO₂⁻": {"color": "incolor", "rg": "-", "ox": "-", "baca": "ppt branco", "acetic": "soluvel",
             "ag": "ppt bege", "hno3": "soluvel", "pH": 9},

    "SCN⁻": {"color": "incolor", "rg": "+", "ox": "-", "baca": "nao precipita", "acetic": "soluvel",
             "ag": "ppt branco", "hno3": "insoluvel", "pH": 2},

    "I⁻": {"color": "incolor", "rg": "+", "ox": "-", "baca": "nao precipita", "acetic": "soluvel",
           "ag": "ppt amarelo claro", "hno3": "insoluvel", "pH": (0, 14)},

    "Cl⁻": {"color": "incolor", "rg": "-", "ox": "-", "baca": "nao precipita", "acetic": "soluvel",
            "ag": "ppt branco", "hno3": "insoluvel", "pH": (0, 14)},

    "CH₃COO⁻": {"color": "incolor", "rg": "-", "ox": "-", "baca": "nao precipita", "acetic": "soluvel",
                "ag": "nao precipita", "hno3": "soluvel", "pH": (0, 14)},

    "NO₃⁻": {"color": "incolor", "rg": "-", "ox": "-", "baca": "nao precipita", "acetic": "soluvel",
             "ag": "nao precipita", "hno3": "soluvel", "pH": (0, 14)},

    "Br⁻": {"color": "incolor", "rg": "+", "ox": "-", "baca": "nao precipita", "acetic": "soluvel",
            "ag": "ppt amarelo claro", "hno3": "insoluvel", "pH": (0, 14)},
}


# ---------------------------------------------------------
# FUNÇÕES DE NORMALIZAÇÃO E REGRAS
# ---------------------------------------------------------
def normalize(s):
    if not s:
        return ""
    s = s.strip().lower()
    s = "".join(c for c in unicodedata.normalize("NFD", s)
                if unicodedata.category(c) != "Mn")
    return s


def aplicar_regras(user_input):

    eliminados = set()
    explicacoes = []

    color = normalize(user_input["color"])
    rg = normalize(user_input["rg"])
    ox = normalize(user_input["ox"])
    baca = normalize(user_input["baca"])
    acetic = normalize(user_input["acetic"])
    ag = normalize(user_input["ag"])
    hno3 = normalize(user_input["hno3"])
    ph_str = normalize(user_input["ph"])

    # --------------- pH ----------------------------------
    if ph_str:
        try:
            ph_user = float(ph_str)
            for a, p in ANION_DATA.items():
                ph = p["pH"]
                if isinstance(ph, (int, float)):
                    if abs(ph_user - ph) > 0.1:
                        eliminados.add(a)
                elif isinstance(ph, tuple):
                    if not (ph[0] <= ph_user <= ph[1]):
                        eliminados.add(a)
            explicacoes.append(f"pH = {ph_user}: eliminando incompatíveis.")
        except:
            pass

    # --------------- Cor ----------------------------------
    if color:
        for a, p in ANION_DATA.items():
            if p["color"] != color and p["color"] in ["amarelo", "laranja", "incolor"]:
                eliminados.add(a)
        explicacoes.append(f"Cor: {color}")

    # --------------- RG + OX ------------------------------
    if rg and ox:
        for a, p in ANION_DATA.items():
            if p["rg"] != rg or p["ox"] != ox:
                eliminados.add(a)
        explicacoes.append(f"Redox: RG={rg} OX={ox}")

    # --------------- Ba/Ca --------------------------------
    if baca:
        for a, p in ANION_DATA.items():
            if baca not in p["baca"]:
                eliminados.add(a)
        explicacoes.append(f"Ba/Ca: {baca}")

    # --------------- Acético ------------------------------
    if acetic:
        for a, p in ANION_DATA.items():
            if acetic != p["acetic"]:
                eliminados.add(a)
        explicacoes.append(f"Acético: {acetic}")

    # --------------- Ag+ ----------------------------------
    if ag:
        for a, p in ANION_DATA.items():
            if ag not in p["ag"]:
                eliminados.add(a)
        explicacoes.append(f"Ag⁺: {ag}")

    # --------------- HNO₃ ---------------------------------
    if hno3:
        for a, p in ANION_DATA.items():
            if hno3 != p["hno3"]:
                eliminados.add(a)
        explicacoes.append(f"HNO₃: {hno3}")

    restantes = sorted(set(ANION_DATA.keys()) - eliminados)
    return restantes, explicacoes, sorted(eliminados)


# ---------------------------------------------------------
# FUNÇÃO CHAMADA PELO BOTÃO NA PÁGINA WEB
# ---------------------------------------------------------
def executar(event=None):

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

    possiveis, exp, elim = aplicar_regras(user_input)

    js.document.getElementById("possiveis").innerText = "\n".join(possiveis)
    js.document.getElementById("eliminacoes").innerText = (
        "\n".join(exp) +
        "\n\n——— Eliminados ———\n" +
        "\n".join(elim)
    )

def teste_aleatorio(event=None):
    import random
    
    # Valores possíveis
    colors = ["incolor", "amarelo", "laranja"]
    rg_values = ["+", "-"]
    ox_values = ["+", "-"]
    baca_values = ["nao precipita", "ppt branco", "ppt laranja", "ppt marrom"]
    acetic_values = ["soluvel", "insolvel"]
    ag_values = ["ppt branco", "ppt amarelo", "ppt preto"]
    hno3_values = ["soluvel", "insolvel"]

    # Preencher selects
    js.document.getElementById("color").value = random.choice(colors)
    js.document.getElementById("rg").value = random.choice(rg_values)
    js.document.getElementById("ox").value = random.choice(ox_values)
    js.document.getElementById("baca").value = random.choice(baca_values)
    js.document.getElementById("acetic").value = random.choice(acetic_values)
    js.document.getElementById("ag").value = random.choice(ag_values)
    js.document.getElementById("hno3").value = random.choice(hno3_values)

    # pH aleatório
    js.document.getElementById("ph").value = str(round(random.uniform(0, 14), 1))

    # Executar normalmente
    executar()
