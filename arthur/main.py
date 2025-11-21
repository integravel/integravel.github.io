import unicodedata
from pyscript import Element
import random

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
# FUNÇÕES AUXILIARES
# ---------------------------------------------------------
def normalize(s):
    if not s:
        return ""
    s = s.strip().lower()
    s = "".join(c for c in unicodedata.normalize("NFD", s)
                if unicodedata.category(c) != "Mn")
    return s


# ---------------------------------------------------------
# APLICAÇÃO DAS REGRAS
# ---------------------------------------------------------
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

    # -------- pH -------------------------------------------------
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

    # -------- Cor ------------------------------------------------
    if color:
        for a, p in ANION_DATA.items():
            if p["color"] != color:
                eliminados.add(a)
        explicacoes.append(f"Cor: {color}")

    # -------- RG + OX -------------------------------------------
    if rg and ox:
        for a, p in ANION_DATA.items():
            if p["rg"] != rg or p["ox"] != ox:
                eliminados.add(a)
        explicacoes.append(f"Redox: RG={rg} OX={ox}")

    # -------- Ba/Ca ---------------------------------------------
    if baca:
        for a, p in ANION_DATA.items():
            if baca != p["baca"]:
                eliminados.add(a)
        explicacoes.append(f"Ba/Ca: {baca}")

    # -------- Acético -------------------------------------------
    if acetic:
        for a, p in ANION_DATA.items():
            if acetic != p["acetic"]:
                eliminados.add(a)
        explicacoes.append(f"Acético: {acetic}")

    # -------- Ag+ ------------------------------------------------
    if ag:
        for a, p in ANION_DATA.items():
            if ag != p["ag"]:
                eliminados.add(a)
        explicacoes.append(f"Ag⁺: {ag}")

    # -------- HNO3 ----------------------------------------------
    if hno3:
        for a, p in ANION_DATA.items():
            if hno3 != p["hno3"]:
                eliminados.add(a)
        explicacoes.append(f"HNO₃: {hno3}")

    restantes = sorted(set(ANION_DATA.keys()) - eliminados)
    return restantes, explicacoes, sorted(eliminados)


# ---------------------------------------------------------
# FUNÇÃO PRINCIPAL (PYSCRIPT)
# ---------------------------------------------------------
def executar(event=None):

    user_input = {
        "color": Element("color").value,
        "ph": Element("ph").value,
        "rg": Element("rg").value,
        "ox": Element("ox").value,
        "baca": Element("baca").value,
        "acetic": Element("acetic").value,
        "ag": Element("ag").value,
        "hno3": Element("hno3").value,
    }

    possiveis, exp, elim = aplicar_regras(user_input)

    Element("possiveis").write("\n".join(possiveis))

    Element("eliminacoes").write(
        "\n".join(exp) +
        "\n\n——— Eliminados ———\n" +
        "\n".join(elim)
    )


# ---------------------------------------------------------
# TESTE ALEATÓRIO
# ---------------------------------------------------------
def teste_aleatorio(event=None):

    Element("color").element.value = random.choice(["incolor", "amarelo", "laranja"])
    Element("rg").element.value = random.choice(["+", "-"])
    Element("ox").element.value = random.choice(["+", "-"])
    Element("baca").element.value = random.choice(["nao precipita", "ppt branco", "ppt laranja", "ppt marrom"])
    Element("acetic").element.value = random.choice(["soluvel", "insoluvel"])
    Element("ag").element.value = random.choice(["ppt branco", "ppt amarelo", "ppt preto"])
    Element("hno3").element.value = random.choice(["soluvel", "insoluvel"])
    Element("ph").element.value = str(round(random.uniform(0, 14), 1))

    executar()
