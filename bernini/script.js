// script.js - Gerador de Horários (cliente, localStorage)

// ======= Configurações e helpers =======
const STORAGE_KEY = 'hc_v2_data';

function uid() { return Math.random().toString(36).slice(2,9); }

function dayNameToKey(name){
  const n = (name||'').toLowerCase();
  if(n.startsWith('seg')) return 'mon';
  if(n.startsWith('ter')) return 'tue';
  if(n.startsWith('qua')) return 'wed';
  if(n.startsWith('qui')) return 'thu';
  if(n.startsWith('sex')) return 'fri';
  if(n.startsWith('sáb') || n.startsWith('sab')) return 'sat';
  return null;
}

function keyToDayLabel(k){
  return ({mon:'Seg',tue:'Ter',wed:'Qua',thu:'Qui',fri:'Sex',sat:'Sáb'})[k] || k;
}

function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) {
    const base = { blocks:[], courses:[], disciplines:[], labs:[], teachers:[], solutions:[], stats:{tested:0,found:0} };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
    return base;
  }
  try { return JSON.parse(raw); } catch(e){ 
    console.error('Erro parse storage',e); 
    const empty = { blocks:[], courses:[], disciplines:[], labs:[], teachers:[], solutions:[], stats:{tested:0,found:0} }; 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empty)); 
    return empty; 
  }
}

function saveData(d){ localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); renderAll(); }

function downloadJSON(obj, filename='dados.json'){
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

// ======= UI - navegação entre abas =======
function openTab(id){
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const e = document.getElementById(id);
  if(e) e.classList.add('active');
}
window.openTab = openTab; // export to global for inline onclick from HTML

// ======= Inicialização do DOM (disponibilidade) =======
function buildAvailabilityGrid(){
  const container = document.getElementById('dispContainer');
  if(!container) return;
  container.innerHTML = '';
  const days = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  const periods = ['Manhã','Tarde','Noite'];
  days.forEach(day => {
    const dayBox = document.createElement('div');
    dayBox.style.border = '1px solid #eee';
    dayBox.style.padding = '8px';
    dayBox.style.borderRadius = '6px';
    dayBox.style.minWidth = '90px';
    dayBox.style.marginRight = '6px';
    const h = document.createElement('strong'); h.textContent = day; dayBox.appendChild(h);
    periods.forEach(p => {
      const id = `avail_${day}_${p}`;
      const label = document.createElement('label');
      label.style.display = 'block';
      const cb = document.createElement('input');
      cb.type='checkbox';
      cb.id = id;
      cb.dataset.day = dayNameToKey(day);
      cb.dataset.period = p.toLowerCase();
      label.appendChild(cb);
      label.append(' ' + p[0]);
      dayBox.appendChild(label);
    });
    container.appendChild(dayBox);
  });
}

// ======= Renderização geral das listas =======
function renderAll(){
  const data = loadData();
  renderBlocos(data);
  renderCursos(data);
  renderDisciplinas(data);
  renderLabs(data);
  renderProfessores(data);
  renderSolucoes(data);
  populateCursoSelect();
}

function renderBlocos(data){
  const ul = document.getElementById('listaBlocos'); 
  if(!ul) return;
  ul.innerHTML = '';
  if(!data.blocks.length){ ul.innerHTML = '<li>Sem blocos cadastrados.</li>'; return; }
  data.blocks.forEach(b=>{
    const li = document.createElement('li');
    const dias = b.days.map(keyToDayLabel).join(', ');
    li.innerHTML = `<strong>${b.label}</strong> — ${b.turn} — ${dias} — ${b.capacity} vagas
      <button data-id="${b.id}" class="small-btn">Remover</button>`;
    li.querySelector('button').onclick = ()=>{
      if(!confirm('Remover bloco?')) return;
      const d = loadData(); d.blocks = d.blocks.filter(x=>x.id !== b.id); saveData(d);
    };
    ul.appendChild(li);
  });
}

function renderCursos(data){
  const ul = document.getElementById('listaCursos'); 
  if(!ul) return;
  ul.innerHTML='';
  if(!data.courses.length){ ul.innerHTML = '<li>Sem cursos.</li>'; return; }
  data.courses.forEach(c=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${c.name}</strong> — ${c.turn} — semestres: ${c.sems} — sábados: ${c.allowSat ? 'Sim' : 'Não'}
      <button data-id="${c.id}" class="small-btn">Remover</button>`;
    li.querySelector('button').onclick = ()=>{
      if(!confirm('Remover curso e suas disciplinas?')) return;
      const d = loadData(); d.courses = d.courses.filter(x=>x.id !== c.id); d.disciplines = d.disciplines.filter(dd=>dd.courseId !== c.id); saveData(d);
    };
    ul.appendChild(li);
  });
}

function renderDisciplinas(data){
  const ul = document.getElementById('listaDisciplinas'); 
  if(!ul) return;
  ul.innerHTML='';
  if(!data.disciplines.length){ ul.innerHTML = '<li>Sem disciplinas.</li>'; return; }
  data.disciplines.forEach(dd=>{
    const course = data.courses.find(c=>c.id===dd.courseId);
    const li = document.createElement('li');
    li.innerHTML = `<strong>${dd.name}</strong> — ${course?course.name:'(curso?)'} — sem ${dd.sem} — ${dd.loadBlocks} blocos ${dd.labNeed? ' — Lab: '+dd.labType : ''}
      <button data-id="${dd.id}" class="small-btn">Remover</button>`;
    li.querySelector('button').onclick = ()=>{
      if(!confirm('Remover disciplina?')) return;
      const d = loadData(); d.disciplines = d.disciplines.filter(x=>x.id !== dd.id); saveData(d);
    };
    ul.appendChild(li);
  });
}

function renderLabs(data){
  const ul = document.getElementById('listaLaboratorios'); 
  if(!ul) return;
  ul.innerHTML='';
  if(!data.labs.length){ ul.innerHTML = '<li>Sem laboratórios.</li>'; return; }
  data.labs.forEach(l=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${l.type}</strong> — qtd: ${l.qty} <button data-id="${l.id}" class="small-btn">Remover</button>`;
    li.querySelector('button').onclick = ()=>{
      if(!confirm('Remover laboratório?')) return;
      const d = loadData(); d.labs = d.labs.filter(x=>x.id !== l.id); saveData(d);
    };
    ul.appendChild(li);
  });
}

function renderProfessores(data){
  const ul = document.getElementById('listaDocentes'); 
  if(!ul) return;
  ul.innerHTML='';
  if(!data.teachers.length){ ul.innerHTML = '<li>Sem docentes.</li>'; return; }
  data.teachers.forEach(t=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${t.name}</strong> — max: ${t.maxLoad} blocos — disciplinas: ${t.discNames.join(', ')}
      <button data-id="${t.id}" class="small-btn">Remover</button>
      <div class="small muted">Disponibilidade: ${availabilitySummary(t)}</div>`;
    li.querySelector('button').onclick = ()=>{
      if(!confirm('Remover docente?')) return;
      const d = loadData(); d.teachers = d.teachers.filter(x=>x.id !== t.id); saveData(d);
    };
    ul.appendChild(li);
  });
}

function availabilitySummary(t){
  const parts = [];
  ['mon','tue','wed','thu','fri','sat'].forEach(k=>{
    const day = t.availability[k];
    if(!day) return;
    const per = [];
    if(day.manha) per.push('M'); if(day.tarde) per.push('T'); if(day.noite) per.push('N');
    if(per.length) parts.push(`${keyToDayLabel(k)}:${per.join('')}`);
  });
  return parts.join(' ');
}

function renderSolucoes(data){
  const statTested = document.getElementById('testadas');
  const statFound = document.getElementById('solucoes');
  const ul = document.getElementById('listaSolucoes'); 
  if(statTested) statTested.textContent = data.stats?.tested||0;
  if(statFound) statFound.textContent = (data.solutions||[]).length;
  if(!ul) return;
  ul.innerHTML='';
  if(!data.solutions || !data.solutions.length){ ul.innerHTML = '<li>Sem soluções encontradas.</li>'; return; }
  data.solutions.forEach((s,idx)=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>Solução #${idx+1}</strong> — gerado: ${new Date(s.generatedAt).toLocaleString()} 
      <button data-idx="${idx}" class="small-btn">Baixar</button>`;
    li.querySelector('button').onclick = ()=> downloadJSON(s, `solucao_${idx+1}.json`);
    ul.appendChild(li);
  });
}

// ======= Populares campos/seleções =======
function populateCursoSelect(){
  const sel = document.getElementById('selCursoDis');
  if(!sel) return;
  sel.innerHTML = '';
  const data = loadData();
  data.courses.forEach(c=>{
    const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o);
  });
  // ajustar semestre default
  const semIn = document.getElementById('semestreDis');
  if(semIn && sel.options.length && !semIn.value) semIn.value = 1;
}

// ======= Ações - adicionar entidades =======
function formatBlockLabel(inicio, fim){
  return `${inicio} - ${fim}`;
}
window.addBloco = function(){
  const dia = document.getElementById('diaBloco').value;
  const inicio = document.getElementById('inicioBloco').value;
  const fim = document.getElementById('fimBloco').value;
  const turno = document.getElementById('turnoBloco').value;
  if(!inicio || !fim){ alert('Informe início e fim do bloco'); return; }
  const dayKey = dayNameToKey(dia);
  const label = formatBlockLabel(inicio, fim);
  const data = loadData();
  const b = { id: uid(), label, turn: turno.toLowerCase(), days: [dayKey], capacity: 1e6 }; // capacity alto por padrão
  data.blocks.push(b); saveData(data);
  document.getElementById('inicioBloco').value=''; document.getElementById('fimBloco').value='';
};

window.addCurso = function(){
  const name = document.getElementById('nomeCurso').value.trim();
  const turn = document.getElementById('turnoCurso').value.toLowerCase();
  const allowSat = document.getElementById('sabadoCurso').value === 'Sim';
  const sems = parseInt(document.getElementById('semestresCurso').value) || 1;
  if(!name){ alert('Nome do curso obrigatório'); return; }
  const d = loadData();
  d.courses.push({ id: uid(), name, turn, allowSat, sems });
  saveData(d);
  document.getElementById('nomeCurso').value='';
};

window.addDisciplina = function(){
  const courseId = document.getElementById('selCursoDis').value;
  const sem = parseInt(document.getElementById('semestreDis').value) || 1;
  const name = document.getElementById('nomeDis').value.trim();
  const load = parseInt(document.getElementById('cargaDis').value) || 1;
  const needLab = document.getElementById('precisaLabDis').value === 'Sim';
  const labType = document.getElementById('tipoLabDis').value.trim();
  if(!courseId){ alert('Selecione um curso'); return; }
  if(!name){ alert('Nome da disciplina'); return; }
  if(load < 1){ alert('Carga mínima 1 bloco'); return; }
  if(needLab && !labType){ alert('Informe tipo de laboratório'); return; }
  const d = loadData();
  d.disciplines.push({ id: uid(), courseId, sem, name, loadBlocks: load, labNeed: needLab, labType });
  saveData(d);
  document.getElementById('nomeDis').value=''; document.getElementById('cargaDis').value='1'; document.getElementById('tipoLabDis').value='';
};

window.addLaboratorio = function(){
  const type = document.getElementById('tipoLab').value.trim();
  const qty = parseInt(document.getElementById('qtdLab').value) || 1;
  if(!type){ alert('Tipo do laboratório'); return; }
  const d = loadData();
  d.labs.push({ id: uid(), type, qty });
  saveData(d);
  document.getElementById('tipoLab').value=''; document.getElementById('qtdLab').value='';
};

window.addDocente = function(){
  const name = document.getElementById('nomeProf').value.trim();
  const discStr = document.getElementById('habDisProf').value.trim();
  const maxLoad = parseInt(document.getElementById('cargaProf').value) || 1;
  if(!name){ alert('Nome do docente'); return; }
  const discNames = discStr ? discStr.split(',').map(s => s.trim()).filter(Boolean) : [];
  // coletar disponibilidade dos checkboxes
  const availability = {};
  ['mon','tue','wed','thu','fri','sat'].forEach(k => availability[k] = {manha:false, tarde:false, noite:false});
  const dispContainer = document.getElementById('dispContainer');
  if(dispContainer){
    dispContainer.querySelectorAll('input[type=checkbox]').forEach(cb=>{
      if(cb.checked){
        const day = cb.dataset.day;
        const per = cb.dataset.period;
        if(day && per) availability[day][per] = true;
      }
    });
  }
  const d = loadData();
  d.teachers.push({ id: uid(), name, discNames, maxLoad, availability });
  saveData(d);
  document.getElementById('nomeProf').value=''; document.getElementById('habDisProf').value=''; document.getElementById('cargaProf').value='';
  // limpar checkboxes
  if(dispContainer) dispContainer.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.checked = false);
};

// ======= Operações de limpeza/reset =======
window.limparTudo = function(){
  if(!confirm('Apagar tudo do armazenamento local?')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderAll();
  alert('Tudo apagado.');
};

// ======= SOLVER: backtracking com pausas e parada controlada =======
let solverRunning = false;
let solverStopRequested = false;

window.iniciarGeracao = async function(){
  if(solverRunning){ alert('Busca já em execução'); return; }
  const data = loadData();
  // validações rápidas
  if(!data.blocks.length){ alert('Cadastre ao menos 1 bloco'); return; }
  if(!data.disciplines.length){ alert('Cadastre disciplinas'); return; }
  if(!data.teachers.length){ if(!confirm('Não há docentes cadastrados. Deseja continuar (nenhuma solução possível)?')) return; }

  // reset das soluções anteriores (opcional)
  data.solutions = [];
  data.stats = {tested:0, found:0};
  saveData(data);

  solverRunning = true;
  solverStopRequested = false;
  try {
    await runSolver();
  } finally {
    solverRunning = false;
    solverStopRequested = false;
  }
};

window.pararGeracao = function(){
  if(!solverRunning){ alert('Nenhuma busca em execução'); return; }
  solverStopRequested = true;
};

// O coração do resolvedor
async function runSolver(){
  const data = loadData();

  // Preparar sessions: cada disciplina -> N sessões (loadBlocks)
  const sessions = [];
  for(const disc of data.disciplines){
    const course = data.courses.find(c=>c.id === disc.courseId);
    if(!course) continue;
    for(let i=0;i<disc.loadBlocks;i++){
      sessions.push({
        id: uid(),
        discId: disc.id,
        courseId: disc.courseId,
        discName: disc.name,
        labNeed: disc.labNeed,
        labType: disc.labType,
        courseTurn: course.turn,
        allowSat: !!course.allowSat
      });
    }
  }

  // Preparar placements: cada bloco x dia (apenas dias definidos por blocos)
  const placements = []; // {id, blockId, label, day, turn, capacity}
  data.blocks.forEach(b=>{
    (b.days || []).forEach(d=>{
      placements.push({ id: uid(), blockId: b.id, label: b.label, day: d, turn: b.turn, capacity: b.capacity || 1e6 });
    });
  });
  if(!placements.length){ alert('Sem placements (blocos/dias) configurados.'); return; }

  // Preparar teacher map
  const teachers = data.teachers.map(t => ({ ...t })); // shallow copy

  function teachersForDisc(name){
    return teachers.filter(t => t.discNames.includes(name));
  }

  // Estado do backtracking
  const S = sessions.length;
  const P = placements.length;
  const assigned = new Array(S).fill(null); // for each session -> {placementIdx, teacherId}
  const placementLoad = new Array(P).fill(0);
  const teacherLoad = {}; // teacherId -> number blocks assigned
  const teacherDays = {}; // teacherId -> Set days assigned
  teachers.forEach(t => { teacherLoad[t.id] = 0; teacherDays[t.id] = new Set(); });

  // Estatísticas
  let tested = 0;
  let found = 0;

  // Heurística: ordenar sessions por número de professores candidatos (fail-first)
  sessions.sort((a,b) => {
    const ca = teachersForDisc(a.discName).length || 100;
    const cb = teachersForDisc(b.discName).length || 100;
    return ca - cb;
  });

  // Precompute candidate placements per session (respect turn and saturday rule)
  const candidatesPerSession = sessions.map(ses => {
    const cand = [];
    placements.forEach((pl, idx) => {
      if(pl.turn !== ses.courseTurn) return;
      if(!ses.allowSat && pl.day === 'sat') return;
      cand.push(idx);
    });
    return cand;
  });

  // For lab accounting: track per placement how many labs of each type are used
  const placementLabUsage = Array.from({length:P}, () => ({})); // [{labType: count}, ...]

  // Função para serializar solução
  function serializeSolution(){
    const assignments = [];
    for(let i=0;i<S;i++){
      const a = assigned[i];
      if(!a) continue;
      const ses = sessions[i];
      const pl = placements[a.placementIdx];
      const t = data.teachers.find(tt => tt.id === a.teacherId);
      assignments.push({ courseId: ses.courseId, discipline: ses.discName, day: pl.day, block: pl.label, turn: pl.turn, teacher: t? t.name : a.teacherId, lab: ses.labNeed ? ses.labType : null });
    }
    return { generatedAt: (new Date()).toISOString(), assignments };
  }

  // Backtracking recursivo (com yield para UI)
  let stop = false;
  async function backtrack(i){
    if(stop || solverStopRequested){ stop = true; return; }
    if(i === S){
      // Encontrou solução
      found++; tested++;
      const dNow = loadData();
      dNow.solutions.push(serializeSolution());
      dNow.stats = { tested, found };
      saveData(dNow);
      // atualiza estatísticas na UI
      const statTestedEl = document.getElementById('testadas');
      const statFoundEl = document.getElementById('solucoes');
      if(statTestedEl) statTestedEl.textContent = tested;
      if(statFoundEl) statFoundEl.textContent = found;
      // continue buscando (para encontrar todas)
      return;
    }
    const ses = sessions[i];
    const candPlacements = candidatesPerSession[i];
    // se não houver candidatos, corta
    if(!candPlacements.length) return;

    for(const pIdx of candPlacements){
      if(stop || solverStopRequested){ stop = true; return; }
      // capacidade do placement
      if(placementLoad[pIdx] >= placements[pIdx].capacity) continue;

      // checar laboratório (se necessário)
      if(ses.labNeed){
        const lab = data.labs.find(l => l.type === ses.labType);
        if(!lab) continue; // não existe lab desse tipo
        const used = placementLabUsage[pIdx][ses.labType] || 0;
        if(used >= lab.qty) continue; // lab esgotado nesse horário
      }

      // professores candidatos
      const candTeachers = teachersForDisc(ses.discName);
      if(!candTeachers.length) continue;

      for(const t of candTeachers){
        if(stop || solverStopRequested){ stop = true; return; }
        const teacher = t;
        // disponibilidade do teacher nesse dia/turn
        const pl = placements[pIdx];
        if(!teacher.availability[pl.day] || !teacher.availability[pl.day][pl.turn]) continue;
        // carga máxima
        if(teacherLoad[teacher.id] + 1 > teacher.maxLoad) continue;
        // limite rígido de dias (máx 3 dias distintos)
        const daysSet = new Set(Array.from(teacherDays[teacher.id] || []));
        daysSet.add(pl.day);
        if(daysSet.size > 3) continue;

        // --- Nova checagem importante: evitar colisão de TURMA (mesmo curso) no mesmo bloco ---
        

   // Verificar se já existe alguma atribuição no mesmo placement que pertence ao mesmo courseId
        let conflictWithSameCourse = false;
        for(let k=0;k<i;k++){
          const aPrev = assigned[k];
          if(!aPrev) continue;
          const prevPl = placements[aPrev.placementIdx];
          if(prevPl.id === placements[pIdx].id){
            // session k is already occupying same placement (same block+day)
            const prevSes = sessions[k];
            if(prevSes.courseId === ses.courseId){
              conflictWithSameCourse = true;
              break;
            }
          }
        }
        if(conflictWithSameCourse) continue;

        // --- realizar atribuição ---
        assigned[i] = { placementIdx: pIdx, teacherId: teacher.id };
        placementLoad[pIdx] += 1;
        teacherLoad[teacher.id] += 1;
        teacherDays[teacher.id].add(pl.day);
        if(ses.labNeed){
          placementLabUsage[pIdx][ses.labType] = (placementLabUsage[pIdx][ses.labType] || 0) + 1;
        }

        tested++;
        // atualização periódica da UI (a cada 200 testes)
        if(tested % 200 === 0){
          const dNow = loadData();
          dNow.stats = { tested, found };
          saveData(dNow);
          const statTestedEl = document.getElementById('testadas');
          const statFoundEl = document.getElementById('solucoes');
          if(statTestedEl) statTestedEl.textContent = tested;
          if(statFoundEl) statFoundEl.textContent = found;
          // yielding to event loop to keep UI responsiva
          await new Promise(r => setTimeout(r, 0));
        }

        // recursão
        await backtrack(i+1);
        if(stop || solverStopRequested) return;

        // desfazer atribuição
        assigned[i] = null;
        placementLoad[pIdx] -= 1;
        teacherLoad[teacher.id] -= 1;
        // remover dia se não existir outra atribuição desse professor nesse dia
        let stillHasDay = false;
        for(let k=0;k<S;k++){
          if(assigned[k] && assigned[k].teacherId === teacher.id){
            const otherPl = placements[assigned[k].placementIdx];
            if(otherPl && otherPl.day === pl.day){ stillHasDay = true; break; }
          }
        }
        if(!stillHasDay) teacherDays[teacher.id].delete(pl.day);
        if(ses.labNeed){
          placementLabUsage[pIdx][ses.labType] -= 1;
        }
      } // fim for cada teacher
    } // fim for cada placement
  } // fim função backtrack

  // iniciar busca
  await backtrack(0);

  // salvar estatísticas finais
  const final = loadData();
  final.stats = { tested: (final.stats?.tested || 0), found: (final.solutions || []).length };
  saveData(final);
  alert('Busca finalizada. Testadas (último batch): ' + final.stats.tested + ' — Soluções: ' + final.stats.found);
}

// ======= Inicialização ao carregar a página =======
(function init(){
  buildAvailabilityGrid();
  renderAll();
})();