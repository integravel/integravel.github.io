let docentes = [];
let disciplinas = [];
let turmas = [];
let horarios = []; // Parte 0 — intervalos semanais

//--------------------------------------//
//  CADASTRO DE HORÁRIOS (parte 0)
//--------------------------------------//
document.getElementById("addHorario").addEventListener("click", () => {
    const ini = document.getElementById("horaInicio").value;
    const fim = document.getElementById("horaFim").value;

    if(!ini || !fim ){ alert("Defina início e fim!"); return;}

    horarios.push({inicio:ini, fim:fim});
    renderHorarios();
});

function renderHorarios(){
    const list = document.getElementById("listaHorarios");
    list.innerHTML="";
    horarios.forEach((h,i)=>{
        list.innerHTML+=
        `<div>${h.inicio} - ${h.fim} 
            <button onclick="delHorario(${i})">X</button>
        </div>`;
    });

    atualizarSelectsHorarios(); // permite uso nos cadastros
}

function delHorario(i){
    horarios.splice(i,1)
    renderHorarios();
}

//--------------------------------------//
//       CADASTRO DE DOCENTES
//--------------------------------------//
document.getElementById("addDocente").addEventListener("click",()=>{
    const nome = document.getElementById("docenteNome").value;
    const dias = Array.from(document.querySelectorAll(".checkDia:checked")).map(i=>i.value);
    const disp = document.getElementById("docenteHorarios").value;

    if(!nome || dias.length==0 || !disp){
        alert("Preencha nome, dias e horários!");
        return;
    }
    
    docentes.push({
        nome:nome,
        dias:dias,
        horariosPermitidos:disp.split(",").map(v=>parseInt(v)) // transforma índices selecionados
    });
    renderDocentes();
});

function renderDocentes(){
    const box=document.getElementById("listaDocentes");
    box.innerHTML="";
    docentes.forEach((d,i)=>{
        box.innerHTML+=`
            <div class="card">
                <b>${d.nome}</b><br>
                Dias: ${d.dias.join(", ")}<br>
                Horários: ${d.horariosPermitidos.join(", ")}<br>
                <button onclick="remDocente(${i})">Excluir</button>
            </div>`;
    });
}
function remDocente(i){ docentes.splice(i,1); renderDocentes(); }


//--------------------------------------//
//   ATUALIZA SELECT DE DISPONIBILIDADE
//--------------------------------------//
function atualizarSelectsHorarios(){
    const sel = document.getElementById("docenteHorarios");
    sel.innerHTML="";
    horarios.forEach((h,i)=>{
        sel.innerHTML+= `<option value="${i}">${h.inicio} - ${h.fim}</option>`;
    });
}
atualizarSelectsHorarios();


//--------------------------------------//
//          CADASTRO DE TURMAS
//--------------------------------------//
document.getElementById("addTurma").addEventListener("click",()=>{
    let nome = document.getElementById("turmaNome").value;
    if(!nome){alert("Informe nome da turma"); return;}
    turmas.push({nome:nome});
    renderTurmas();
});
function renderTurmas(){
    const b=document.getElementById("listaTurmas");
    b.innerHTML="";
    turmas.forEach((t,i)=>{
        b.innerHTML+=`<div>${t.nome} <button onclick="delTurma(${i})">X</button></div>`;
    });
}
function delTurma(i){ turmas.splice(i,1); renderTurmas(); }


//--------------------------------------//
//          CADASTRO DISCIPLINAS
//--------------------------------------//
document.getElementById("addDisciplina").addEventListener("click",()=>{
    const nome=document.getElementById("discNome").value;
    const turma=document.getElementById("discTurma").value;
    const bloco=parseInt(document.getElementById("discBlocos").value);

    if(!nome || !turma || bloco<1){
        alert("Preencha tudo");
        return;
    }

    disciplinas.push({
        nome:nome,
        turma:turma,
        blocos:bloco
    });

    renderDisciplinas();
});

function renderDisciplinas(){
    const b=document.getElementById("listaDisciplinas");
    b.innerHTML="";
    disciplinas.forEach((d,i)=>{
        b.innerHTML+=`
            <div>${d.nome} - turma ${d.turma} (${d.blocos} blocos)
            <button onclick="delDisc(${i})">X</button></div>`;
    });
}
function delDisc(i){ disciplinas.splice(i,1); renderDisciplinas(); }


//--------------------------------------//
//     GERAÇÃO DA GRADE — corrigida
//--------------------------------------//
document.getElementById("gerarGrade").addEventListener("click",()=>{

    let resultado = [];
    let usoTurmaDiaHora = {}; // evita choque entre disciplinas da mesma turma

    disciplinas.forEach(disc =>{

        docentes.some(doc => {

            // docente não pode ter mais de 3 dias
            if(doc.dias.length > 3) return false;

            for(let dia of doc.dias){
                for(let h of doc.horariosPermitidos){

                    let chave = `${disc.turma}-${dia}-${h}`;

                    if(!usoTurmaDiaHora[chave]){ // se turma já não usa o horário
                        usoTurmaDiaHora[chave]=true;

                        resultado.push({
                            turma:disc.turma,
                            disciplina:disc.nome,
                            docente:doc.nome,
                            dia:dia,
                            horario:horarios[h]
                        });        
                        
                        return true;
                    }
                }
            }
        });

    });

    mostrarResultado(resultado);
});


function mostrarResultado(r){

    const box=document.getElementById("resultado");
    box.innerHTML="";

    if(r.length===0){
        box.innerHTML="<b>Nenhuma solução possível.</b>";
        return;
    }

    r.forEach(item=>{
        box.innerHTML+=`
            <div class="card">
                Turma: ${item.turma}<br>
                Disciplina: ${item.disciplina}<br>
                Docente: <b>${item.docente}</b><br>
                Dia: ${item.dia}<br>
                Horário: ${item.horario.inicio} - ${item.horario.fim}
            </div>
        `;
    });
}