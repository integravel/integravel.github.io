/* ==========================================================
   BANCO DE DADOS — LocalStorage
========================================================== */
let bd = JSON.parse(localStorage.getItem("horariosBD")) || {
    blocos: [], cursos: [], disciplinas: [], labs: [], profs: [], solucoes: []
};

function salvarBD(){ localStorage.setItem("horariosBD", JSON.stringify(bd)); }


/* ==========================================================
   FUNÇÃO — MUDAR DE ABA
========================================================== */
function openTab(tab){
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.getElementById(tab).classList.add("active");
}
openTab("t0");


/* ==========================================================
   ETAPA 0 — BLOCOS DE HORÁRIO
========================================================== */
function addBloco(){
    let dia = diaBloco.value, ini = inicioBloco.value, fim=fimBloco.value, turno=turnoBloco.value;
    if(!ini||!fim){ alert("Horário inválido."); return; }
    bd.blocos.push({dia, inicio:ini, fim, turno});
    salvarBD(); renderBlocos();
}

function renderBlocos(){
    listaBlocos.innerHTML="";
    bd.blocos.forEach((b,i)=>{
        let li=document.createElement("li");
        li.textContent=`${b.dia} ${b.inicio}–${b.fim} (${b.turno})`;
        listaBlocos.appendChild(li);
    });
}
renderBlocos();


/* ==========================================================
   ETAPA 1 — CURSOS
========================================================== */
function addCurso(){
    let c={nome:nomeCurso.value, turno:turnoCurso.value, sabado:sabadoCurso.value, semestres:+semestresCurso.value};
    bd.cursos.push(c); salvarBD(); renderCursos(); updateCursosSelect();
}

function renderCursos(){
    listaCursos.innerHTML="";
    bd.cursos.forEach(c=>{
        let li=document.createElement("li");
        li.textContent=`${c.nome} — ${c.turno}, ${c.semestres} semestres`;
        listaCursos.appendChild(li);
    });
}
function updateCursosSelect(){
    selCursoDis.innerHTML="";
    bd.cursos.forEach(c=>{
        let opt=document.createElement("option");
        opt.textContent=c.nome; selCursoDis.appendChild(opt);
    });
}
renderCursos(); updateCursosSelect();


/* ==========================================================
   ETAPA 2 — DISCIPLINAS
========================================================== */
function addDisciplina(){
    let d={
        curso: selCursoDis.value,
        semestre:+semestreDis.value,
        nomeDis:nomeDis.value,
        carga:+cargaDis.value,
        lab:precisaLabDis.value==="Sim" ? tipoLabDis.value : null
    };
    bd.disciplinas.push(d); salvarBD(); renderDisciplinas();
}
function renderDisciplinas(){
    listaDisciplinas.innerHTML="";
    bd.disciplinas.forEach(d=>{
        let li=document.createElement("li");
        li.textContent=`${d.curso} — Sem ${d.semestre} — ${d.nomeDis} (${d.carga} blocos) Lab:${d.lab||"—"}`;
        listaDisciplinas.appendChild(li);
    });
}
renderDisciplinas();


/* ==========================================================
   ETAPA 3 — LABORATÓRIOS
========================================================== */
function addLaboratorio(){
    let lab={tipo:tipoLab.value, qtd:+qtdLab.value};
    bd.labs.push(lab); salvarBD(); renderLabs();
}
function renderLabs(){
    listaLaboratorios.innerHTML="";
    bd.labs.forEach(l=>{
        let li=document.createElement("li");
        li.textContent=`${l.tipo}: ${l.qtd} unidades`;
        listaLaboratorios.appendChild(li);
    });
}
renderLabs();


/* ==========================================================
   ETAPA 4 — PROFESSORES
========================================================== */
function addDocente(){
    let p={
        nome:nomeProf.value,
        habilitadas:habDisProf.value.split(",").map(s=>s.trim()),
        cargaMax:+cargaProf.value,
        dias:{Segunda:[],Terça:[],Quarta:[],Quinta:[],Sexta:[],Sábado:[]}
    };

    document.querySelectorAll("[data-disp]").forEach(ch=>{
        if(ch.checked) p.dias[ch.dataset.dia].push(ch.dataset.turno);
    });

    bd.profs.push(p); salvarBD(); renderProfs();
}
function renderProfs(){
    listaDocentes.innerHTML="";
    bd.profs.forEach(p=>{
        let li=document.createElement("li");
        li.textContent=`${p.nome} — ${p.habilitadas.join(", ")} (máx ${p.cargaMax} blocos)`;
        listaDocentes.appendChild(li);
    });
}
renderProfs();


/* ==========================================================
   ETAPA 5 — GERAÇÃO DE HORÁRIOS (ALGORITMO CORRIGIDO)
========================================================== */
let rodando=false, testadas=0;

function iniciarGeracao(){
    rodando=true; testadas=0;
    document.getElementById("testadas").textContent=0;

    let ocupacao = Array(bd.blocos.length).fill(null);
    let diasProf = Object.fromEntries(bd.profs.map(p=>[p.nome,new Set()]));
    let carga = Object.fromEntries(bd.profs.map(p=>[p.nome,0]));

    backtrack(0, ocupacao, diasProf, carga);
}

function pararGeracao(){ rodando=false; }

function backtrack(i, ocupacao, diasProf, carga){
    if(!rodando) return;
    if(i===bd.disciplinas.length){
        salvarSolucao(ocupacao); return;
    }

    let dis = bd.disciplinas[i];

    for(let prof of bd.profs){
        if(!prof.habilitadas.includes(dis.nomeDis)) continue;

        for(let blocoIndex=0; blocoIndex<bd.blocos.length; blocoIndex++){

            let b=bd.blocos[blocoIndex];

            // 🔥 REGRA NOVA → impedir duas disciplinas do mesmo curso no mesmo horário
            if(ocupacao[blocoIndex] && ocupacao[blocoIndex].curso === dis.curso) continue;

            // verificar turno do curso
            if(dis.curso !== undefined){
                let curso = bd.cursos.find(c=>c.nome===dis.curso);
                if(curso && b.turno!==curso.turno) continue;
                if(curso.sabado==="Não" && b.dia==="Sábado") continue;
            }

            if(!prof.dias[b.dia].includes(b.turno)) continue;
            if(ocupacao[blocoIndex]) continue;

            if(carga[prof.nome]>=prof.cargaMax) continue;
            if(diasProf[prof.nome].size>=3 && !diasProf[prof.nome].has(b.dia)) continue;

            // alocar
            ocupacao[blocoIndex]={curso:dis.curso, disciplina:dis.nomeDis, professor:prof.nome, lab:dis.lab};
            carga[prof.nome]++;
            diasProf[prof.nome].add(b.dia);

            testadas++;
            document.getElementById("testadas").textContent=testadas;

            backtrack(i+1, ocupacao, diasProf, carga);

            // desfazer
            ocupacao[blocoIndex]=null;
            carga[prof.nome]--;
            diasProf[prof.nome].delete(b.dia);

            if(!rodando) return;
        }
    }
}


/* ==========================================================
   SALVAR E MOSTRAR SOLUÇÕES
========================================================== */
function salvarSolucao(ocupacao){
    let sol = JSON.parse(JSON.stringify(ocupacao));
    bd.solucoes.push(sol); salvarBD();
    document.getElementById("solucoes").textContent=bd.solucoes.length;
    renderSolucoes();
}
function renderSolucoes(){
    listaSolucoes.innerHTML="";
    bd.solucoes.forEach(sol=>{
        let li=document.createElement("li");
        li.textContent="Solução com "+ sol.filter(x=>x).length +" blocos ocupados";
        listaSolucoes.appendChild(li);
    });
}
renderSolucoes();

/* LIMPAR TUDO */
function limparTudo(){
    if(confirm("Deseja APAGAR tudo e reiniciar?")){
        localStorage.removeItem("horariosBD");
        location.reload();
    }
}