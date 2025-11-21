import js
import unicodedata

# ---------------------------------------------------------
# BANCO DE DADOS COMPLETO DOS ÂNIONS (TODOS OS DO SEU APP)
# ---------------------------------------------------------
ANION_DATA = {
    "CN⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel",
            "ag":"ppt branco","hno3":"insoluvel","pH":11},

    "S²⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel",
            "ag":"ppt preto","hno3":"insoluvel","pH":13},

    "SO₃²⁻": {"color":"incolor","rg":"+","ox":"-","baca":"ppt branco","acetic":"insoluvel",
              "ag":"ppt branco","hno3":"soluvel","pH":9},

    "S₂O₃²⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel",
               "ag":"ppt preto","hno3":"insoluvel","pH":9},

    "NO₂⁻": {"color":"incolor","rg":"+","ox":"+","baca":"nao precipita","acetic":"soluvel",
             "ag":"ppt preto","hno3":"insoluvel","pH":8},

    "ClO⁻": {"color":"incolor","rg":"-","ox":"+","baca":"nao precipita","acetic":"soluvel",
             "ag":"ppt preto","hno3":"insoluvel","pH":None},

    "CO₃²⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"soluvel",
              "ag":"ppt branco","hno3":"soluvel","pH":12},

    "HCO₃⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"soluvel",
              "ag":"ppt branco","hno3":"soluvel","pH":8},

    "F⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"insoluvel",
           "ag":"ppt branco","hno3":"soluvel","pH":8.5},

    "C₂O₄²⁻": {"color":"incolor","rg":"+","ox":"-","baca":"ppt branco","acetic":"insoluvel",
               "ag":"ppt branco","hno3":"soluvel","pH":9},

    "PO₄³⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"soluvel",
              "ag":"ppt amarelo","hno3":"soluvel","pH":12},

    "CrO₄²⁻": {"color":"amarelo","rg":"-","ox":"+","baca":"ppt amarelo","acetic":"insoluvel",
               "ag":"ppt marrom","hno3":"insolvel","pH":8},

    "Cr₂O₇²⁻": {"color":"laranja","rg":"-","ox":"+","baca":"ppt amarelo","acetic":"insoluvel",
                "ag":"ppt marrom","hno3":"insolvel","pH":4},

    "SO₄²⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"insolvel",
              "ag":"nao precipita","hno3":"soluvel","pH":7},

    "BO₂⁻": {"color":"incolor","rg":"-","ox":"-","baca":"ppt branco","acetic":"soluvel",
             "ag":"ppt bege","hno3":"soluvel","pH":9},

    "SCN⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel",
             "ag":"ppt branco","hno3":"insoluvel","pH":2},

    "I⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel",
           "ag":"ppt amarelo claro","hno3":"insoluvel","pH":(0,14)},

    "Cl⁻": {"color":"incolor","rg":"-","ox":"-","baca":"nao precipita","acetic":"soluvel",
            "ag":"ppt branco","hno3":"insoluvel","pH":(0,14)},

    "CH₃COO⁻": {"color":"incolor","rg":"-","ox":"-","baca":"nao precipita","acetic":"soluvel",
                "ag":"nao precipita","hno3":"soluvel","pH":(0,14)},

    "NO₃⁻": {"color":"incolor","rg":"-","ox":"-","baca":"nao precipita","acetic":"soluvel",
             "ag":"nao precipita","hno3":"soluvel","pH":(0,14)},

    "Br⁻": {"color":"incolor","rg":"+","ox":"-","baca":"nao precipita","acetic":"soluvel",
            "ag":"ppt amarelo claro","hno3":"insoluvel","pH":(0,14)}
}

# ---------------------------------------------------------
# Funções auxiliares
# ---------------------------------------------------------
def normalize(s):
    if s is None:
        return ""
    s = str(s).strip().lower()
    s = "".join(c for c in unicodedata.normalize('NFD', s)
                if unicodedata.category(c) != 'Mn')
    return s


# ---------------------------------------------------------
# APLICAÇÃO DE REGRAS (versão reduzida, mas funcional na web)
# ---------------------------------------------------------
def aplicar_regras(user_input):
    eliminados = set()
    explicacoes = []

    # Normalização
    color = normalize(user_input["color"])
    rg = normalize(user_input["rg"])
    ox = normalize(user_input["ox"])
    baca = normalize(user_input["baca"])
    acetic = normalize(user_input["acetic"])
    ag = normalize(user_input["ag"])
    hno3 = normalize(user_input["hno3"])
    ph_str = normalize(user_input["ph"])

    # -----------------------------
    # Regras REALISTAS DELICADAS
    # -----------------------------

    # pH
    if ph_str not in ("", "nao foi possivel medir", "nao medido"):
        try:
            ph_user = float(ph_str)
            for a, p in ANION_DATA.items():
                ph = p["pH"]
                if isinstance(ph, (int, float)) and ph != ph_user:
                    eliminados.add(a)
                elif isinstance(ph, tuple) and not (ph[0] <= ph_user <= ph[1]):
                    eliminados.add(a)
            explicacoes.append(f"pH = {ph_user} → eliminados os incompatíveis")
        except:
            pass

    # Cor
    if color == "incolor":
        rem = [a for a,p in ANION_DATA.items() if p["color"] in ["amarelo","laranja"]]
        eliminados.update(rem)
        explicacoes.append("Cor incolor → elimina amarelo e laranja")

    elif color == "amarelo":
        rem = [a for a,p in ANION_DATA.items() if p["color"] == "laranja"]
        eliminados.update(rem)
        explicacoes.append("Cor amarela → elimina laranja")

    # RG + OX
    if rg == "+" and ox == "-":   # redutor
        rem = [a for a,p in ANION_DATA.items() if p["rg"] == "-" and p["ox"] == "+"]
        eliminados.update(rem)
        explicacoes.append("Ânion redutor → elimina oxidantes")

    if rg == "-" and ox == "+":   # oxidante
        rem = [a for a,p in ANION_DATA.items() if p["rg"] == "+" and p["ox"] == "-"]
        eliminados.update(rem)
        explicacoes.append("Ânion oxidante → elimina redutores")

    # Precipitação Ba/Ca
    if "nao precipita" in baca:
        rem = [a for a,p in ANION_DATA.items() if "ppt" in p["baca"]]
        eliminados.update(rem)
        explicacoes.append("Ba/Ca não precipita → elimina precipitados")

    # Ácido acético
    if "soluvel" in acetic:
        rem = [a for a,p in ANION_DATA.items() if p["acetic"] == "insoluvel"]
        eliminados.update(rem)
        explicacoes.append("Solúvel em acético → elimina insolúveis")

    # Ag⁺
    if "ppt branco" in ag:
        rem = [a for a,p in ANION_DATA.items() if any(x in p["ag"]
                for x in ["amarelo","preto","marrom"])]
        eliminados.update(rem)
        explicacoes.append("Ag+ ppt branco → elimina coloridos")

    # HNO₃
    if "soluvel" in hno3:
        rem = [a for a,p in ANION_DATA.items() if p["hno3"] == "insoluvel"]
        eliminados.update(rem)
        explicacoes.append("Solúvel em HNO₃ → elimina insolúveis")

    # ---------------------------------------------------------
    # Resultado final
    # ---------------------------------------------------------
    restantes = sorted(set(ANION_DATA.keys()) - eliminados)
    return restantes, explicacoes, sorted(list(eliminados))


# ---------------------------------------------------------
# FUNÇÃO EXECUTADA PELO BOTÃO NO HTML
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

    possiveis, explicacoes, eliminados = aplicar_regras(user_input)

    js.document.getElementById("possiveis").innerText = "\n".join(possiveis)

    js.document.getElementById("eliminacoes").innerText = (
        "\n".join(explicacoes)
        + "\n\n--- Eliminados ---\n"
        + "\n".join(eliminados)
    )
