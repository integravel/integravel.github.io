/* =======================  BANCO DE DADOS LOCAL  ======================= */

let bd = JSON.parse(localStorage.getItem("horarios_bd")) || {
    blocos: [], // Parte 0 - intervalos de horários
    cursos: [],
    disciplinas: [],
    laboratorios: [],
    docentes: [],
    solutions: [] // soluções encontradas
};

function salvarBD() { localStorage.setItem("horarios_bd", JSON.stringify(bd)); }
function resetarBD() { 
    if(confirm("Tem certeza que deseja apagar tudo?")) {
        localStorage.removeItem("horarios_bd"); 
        location.reload();
    }
}

/* =======================   PARTE 0 – BLOCOS HORÁRIOS   ======================= */

function addBloco(){
    const inicio = document.getElementById("bloco_ini").value;
    const fim = document.getElementById("bloco_fim").value;
    if(inicio && fim){
        bd.blocos.push({inicio,fim});
        salvarBD();
        listarBlocos();
    }
}
function listarBlocos(){
    let box=document.getElementById("lista_blocos");
    box.innerHTML="";
    bd.blocos.forEach((b,i)=> box.innerHTML+=`<div>${b.inicio} - ${b.fim}</div>`);
}

/* ==================    PARTE 1 – CADASTRO DE CURSOS   ================== */

function addCurso(){
    const nome=document.getElementById("curso_nome").value;
    const periodo=document.getElementById("curso_periodo").value;
    const sabado=document.getElementById("curso_sab").checked;
    const sem=document.getElementById("curso_sem").value;

    if(nome !="" && sem>0){
        bd.cursos.push({id:Date.now(),nome,periodo,sabado,semestres:sem});
        salvarBD();
        listarCursos();
    }
}

function listarCursos(){
    let area=document.getElementById("lista_cursos");
    area.innerHTML="";
    bd.cursos.forEach(c=>{
        area.innerHTML+=`<div><b>${c.nome}</b> | ${c.periodo} | ${c.semestres} semestres</div>`;
    });
}

/* =========== PARTE 2 – DISCIPLINAS POR CURSO E SEMESTRE ================= */

function gerarDisciplinasForm(){
    let select=document.getElementById("selCursoDis");
    select.innerHTML="<option value=''>Selecione</option>";
    bd.cursos.forEach(c=> select.innerHTML+=`<option value=${c.id}>${c.nome}</option>`);
}

function cursoSelecionado(){
    const id=document.getElementById("selCursoDis").value;
    let c=bd.cursos.find(x=>x.id==id);

    let area=document.getElementById("areaDisciplinas");
    area.innerHTML="";

    if(!c) return;
    for(let s=1;s<=c.semestres;s++){
        area.innerHTML+=`
        <h3>Semestre ${s}</h3>
        <input id="dis_${s}" placeholder="Nome da disciplina"><br>
        Carga horário (em blocos de 2h): <input id="ch_${s}" type="number" min="1"><br>
        Necessita laboratório? 
        <select id="lab_${s}">
            <option value="">Não</option>
            ${bd.laboratorios.map(l=>`<option>${l.nome}</option>`).join("")}
        </select>
        <button onclick="addDisciplina(${id},${s})">Adicionar disciplina</button><br><br>`;
    }

    listarDisciplinas();
}

function addDisciplina(idCurso,sem){
    let nome=document.getElementById("dis_"+sem).value;
    let ch=document.getElementById("ch_"+sem).value;
    let lab=document.getElementById("lab_"+sem).value;

    if(nome!="" && ch>0){
        bd.disciplinas.push({id:Date.now(),curso:idCurso,semestre:sem,nome,ch:ch,lab:lab});
        salvarBD();
        listarDisciplinas();
    }
}

function listarDisciplinas(){
    let box=document.getElementById("listaDis");
    box.innerHTML="";
    bd.disciplinas.forEach(d=>{
        let c=bd.cursos.find(x=>x.id==d.curso);
        box.innerHTML+=`<div>${c.nome} - ${d.nome} (${d.ch} blocos) Lab: ${d.lab||"N/A"}</div>`;
    });
}

/* ======================  PARTE 3 – LABORATÓRIOS ======================== */

function addLab(){
    const nome=document.getElementById("lab_nome").value;
    const qtd=document.getElementById("lab_qtd").value;
    if(nome && qtd>0){
        let ja=bd.laboratorios.find(l=>l.nome==nome);
        if(ja) ja.qtd=parseInt(ja.qtd)+parseInt(qtd);
        else bd.laboratorios.push({nome,qtd:parseInt(qtd)});
        
        salvarBD();
        listarLab();
    }
}
function listarLab(){
    let box=document.getElementById("listaLab");
    box.innerHTML="";
    bd.laboratorios.forEach(l=> box.innerHTML+=`<div>${l.nome} – ${l.qtd} unidades</div>`);
}

/* ========================  PARTE 4 – DOCENTES  =========================*/

function addProf(){
    const nome=document.getElementById("prof_nome").value;
    const maxCH=document.getElementById("prof_ch").value;

    let disciplinas=[...document.querySelectorAll(".chkDis:checked")].map(e=>e.value);
    let disp=[];

    document.querySelectorAll(".linha_disp").forEach(l=>{
        let dia=l.querySelector(".dia").value;
        let periodo=l.querySelector(".periodo").value;
        if(dia && periodo) disp.push({dia,periodo});
    });

    bd.docentes.push({id:Date.now(),nome,maxCH,disciplinas,disp});
    salvarBD();
    listarProf();
}

function listarProf(){
    let box=document.getElementById("listaProf");
    box.innerHTML="";
    bd.docentes.forEach(p=>{
        box.innerHTML+=`<div><b>${p.nome}</b> – CH Max: ${p.maxCH}h</div>`;
    });
}

function carregarDisciplinasParaProf(){
    let box=document.getElementById("areaDisProf");
    box.innerHTML="";
    bd.disciplinas.forEach(d=>{
        let c=bd.cursos.find(x=>x.id==d.curso);
        box.innerHTML+=`<label><input type="checkbox" class="chkDis" value="${d.id}">${c.nome} - ${d.nome}</label><br>`;
    });
}

/* 🟢 GERA CAMPOS DE DISPONIBILIDADE */
function addDisponibilidade(){
    let area=document.getElementById("area_disp");
    area.innerHTML+=`
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

/* ======================  GERAR HORÁRIOS – ALGORITMO  ===================*/

function gerarSolucao(){
    alert("🔄 Iniciando busca – isso pode demorar...");

    let ocupação = {}; // bloco → { curso, disciplina, professor }

    function valido(disciplina, blocoIdx, professor){

        // ❗Evita duas disciplinas para o mesmo curso no mesmo bloco
        if(ocupação[blocoIdx] && ocupação[blocoIdx].curso == disciplina.curso) return false;

        // HORÁRIO DO DOCENTE
        let disp=bd.docentes.find(x=>x.id==professor.id).disp;
        let blocoPeriodo = bd.blocos[blocoIdx].periodo;
        if(!disp.some(d=>d.periodo==blocoPeriodo)) return false;

        return true;
    }

    // busca simples recursiva
    function backtrack(i){
        if(i>=bd.disciplinas.length){
            bd.solutions.push(JSON.parse(JSON.stringify(ocupação)));
            salvarBD();
            return;
        }

        let d=bd.disciplinas[i];
        for(let p of bd.docentes){
            if(!p.disciplinas.includes(d.id)) continue;

            let blocosLivres = [...bd.blocos.keys()];
            for(let b of blocosLivres){
                if(valido(d,b,p)){
                    ocupação[b]={curso:d.curso,disciplina:d.nome,prof:p.nome};
                    backtrack(i+1);
                    delete ocupação[b];
                }
            }
        }
    }

    backtrack(0);
    alert("Busca finalizada. Soluções encontradas: "+bd.solutions.length);
}