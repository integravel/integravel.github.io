/* =======================  BANCO DE DADOS LOCAL  ======================= */

let bd = JSON.parse(localStorage.getItem("horarios_bd")) || {
    blocos: [],
    cursos: [],
    disciplinas: [],
    laboratorios: [],
    docentes: [],
    solutions: []
};

function salvarBD(){ localStorage.setItem("horarios_bd", JSON.stringify(bd)); }
function resetarBD(){ if(confirm("APAGAR TUDO?")){localStorage.removeItem("horarios_bd"); location.reload();}}

/* ============================ BLOCOS ============================= */

function addBloco(){
    let i=document.getElementById("bloco_ini").value;
    let f=document.getElementById("bloco_fim").value;
    if(i&&f){ bd.blocos.push({inicio:i,fim:f}); salvarBD(); listarBlocos(); }
}
function listarBlocos(){
    let box=document.getElementById("lista_blocos"); box.innerHTML="";
    bd.blocos.forEach(b=> box.innerHTML+=`<div>${b.inicio} - ${b.fim}</div>`);
}

/* ============================ CURSOS ============================= */

function addCurso(){
    let nome=document.getElementById("curso_nome").value;
    let periodo=document.getElementById("curso_periodo").value;
    let sab=document.getElementById("curso_sab").checked;
    let sem=document.getElementById("curso_sem").value;

    if(nome && sem>0){
        bd.cursos.push({id:Date.now(), nome, periodo, sabado:sab, semestres:sem});
        salvarBD(); listarCursos();
    }
}
function listarCursos(){
    let area=document.getElementById("lista_cursos"); area.innerHTML="";
    bd.cursos.forEach(c=> area.innerHTML+=`<div><b>${c.nome}</b> | ${c.periodo} (${c.semestres} sem)</div>`);
}

/* ============================ DISCIPLINAS ============================= */

function gerarDisciplinasForm(){
    let sel=document.getElementById("selCursoDis");
    sel.innerHTML="<option value=''>-- selecione --</option>";
    bd.cursos.forEach(c=> sel.innerHTML+=`<option value="${c.id}">${c.nome}</option>`);
}

function cursoSelecionado(){
    let id=document.getElementById("selCursoDis").value;
    let c=bd.cursos.find(x=>x.id==id);
    let area=document.getElementById("areaDisciplinas");
    area.innerHTML="";

    if(!c) return;

    for(let s=1;s<=c.semestres;s++){
        area.innerHTML+=`
        <h3>Semestre ${s}</h3>
        <input id="dis_${s}" placeholder="Nome da disciplina"><br>
        CH (blocos de 2h): <input id="ch_${s}" type="number" min="1"><br>
        Laboratório: 
        <select id="lab_${s}">
            <option value="">Não</option>
            ${bd.laboratorios.map(l=> `<option>${l.nome}</option>`).join("")}
        </select>
        <button onclick="addDisciplina(${c.id},${s})">Adicionar</button><br><br>`;
    }
    listarDisciplinas();
}

function addDisciplina(id,sem){
    let nome=document.getElementById("dis_"+sem).value;
    let ch=document.getElementById("ch_"+sem).value;
    let lab=document.getElementById("lab_"+sem).value;

    if(nome && ch>0){
        bd.disciplinas.push({id:Date.now(),curso:id,semestre:sem,nome,ch,lab});
        salvarBD(); listarDisciplinas();
    }
}
function listarDisciplinas(){
    let box=document.getElementById("listaDis"); box.innerHTML="";
    bd.disciplinas.forEach(d=>{
        let c=bd.cursos.find(x=>x.id==d.curso);
        box.innerHTML+=`<div>${c.nome} - ${d.nome} (${d.ch} blocos) Lab:${d.lab||"Não"}</div>`;
    });
}

/* ============================ LABS ============================= */

function addLab(){
    let n=document.getElementById("lab_nome").value;
    let q=document.getElementById("lab_qtd").value;
    if(n && q>0){
        let ja=bd.laboratorios.find(l=>l.nome==n);
        if(ja) ja.qtd+=parseInt(q);
        else bd.laboratorios.push({nome:n,qtd:parseInt(q)});
        salvarBD(); listarLab();
    }
}
function listarLab(){
    let b=document.getElementById("listaLab"); b.innerHTML="";
    bd.laboratorios.forEach(l=> b.innerHTML+=`<div>${l.nome} — ${l.qtd} unidades</div>`);
}

/* ============================ DOCENTES ============================= */

function carregarDisciplinasParaProf(){
    let box=document.getElementById("areaDisProf");
    box.innerHTML="";
    bd.disciplinas.forEach(d=>{
        let c=bd.cursos.find(x=>x.id==d.curso);
        box.innerHTML+=`<label><input type="checkbox" class="chkDis" value="${d.id}">
            ${c.nome} - ${d.nome}</label><br>`;
    });
}

/* 🔥 Exibir área de disponibilidade devidamente */
function mostrarDisponibilidade(){
    document.getElementById("area_disp").innerHTML="";
    addDisponibilidade(); // cria pelo menos 1 linha inicial
}

function addDisponibilidade(){
    document.getElementById("area_disp").innerHTML+=`
    <div class="linha_disp">
        <select class="dia">
            <option>Segunda</option><option>Terça</option><option>Quarta</option>
            <option>Quinta</option><option>Sexta</option><option>Sábado</option>
        </select>
        <select class="periodo">
            <option>Manhã</option><option>Tarde</option><option>Noite</option>
        </select>
    </div>`;
}

function addProf(){
    let nome=document.getElementById("prof_nome").value;
    let max=document.getElementById("prof_ch").value;

    let disciplinas=[...document.querySelectorAll(".chkDis:checked")].map(e=>e.value);
    let disp=[];

    document.querySelectorAll(".linha_disp").forEach(l=>{
        disp.push({
            dia:l.querySelector(".dia").value,
            periodo:l.querySelector(".periodo").value
        });
    });

    bd.docentes.push({id:Date.now(),nome,max,disciplinas,disp});
    salvarBD(); listarProf();
}

/* ❗ Agora com botão REMOVER */
function removerProf(id){
    if(confirm("Excluir docente?")){
        bd.docentes = bd.docentes.filter(p=>p.id!=id);
        salvarBD(); listarProf();
    }
}

function listarProf(){
    let box=document.getElementById("listaProf");
    box.innerHTML="";
    bd.docentes.forEach(p=>{
        box.innerHTML+=`
        <div>
            <b>${p.nome}</b> — CH Máx: ${p.max}<br>
            <button onclick="removerProf(${p.id})">🗑 Remover</button>
        </div><br>`;
    });
}

/* ======================== GERAÇÃO DE HORÁRIOS ======================== */

function gerarSolucao(){
    alert("Gerando soluções...");
    let ocup={};

    function valido(d,b,p){
        if(ocup[b] && ocup[b].curso==d.curso) return false; // evita 2 matérias simultâneas da mesma turma
        return true;
    }

    function back(i){
        if(i>=bd.disciplinas.length){ bd.solutions.push(JSON.parse(JSON.stringify(ocup))); salvarBD(); return; }
        let d=bd.disciplinas[i];
        for(let p of bd.docentes){
            if(!p.disciplinas.includes(String(d.id))) continue;
            for(let b in bd.blocos){
                if(valido(d,b,p)){
                    ocup[b]={curso:d.curso,disciplina:d.nome,prof:p.nome};
                    back(i+1);
                    delete ocup[b];
                }
            }
        }
    }

    back(0);
    alert("Concluído — soluções encontradas: "+bd.solutions.length);
}