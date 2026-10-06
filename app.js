const exam = new Date('2026-10-18T13:00:00-03:00');
const LS='oab47-const-v2';
let state=JSON.parse(localStorage.getItem(LS)||'{"done":{},"errors":[],"scores":[],"notes":[],"guideStage":0,"guideChoice":"","guideFinished":false,"reviews":[]}');
function save(){localStorage.setItem(LS,JSON.stringify(state));renderProgress();}

const days=[
 {date:'06/10',iso:'2026-10-06',title:'Diagnóstico + ADPF na prática',focus:'Aprender fazendo, com Vade aberto',tasks:['Concluir sessão guiada','Localizar 4 fundamentos no Vade','Fazer anotação de memória','Responder revisão ativa']},
 {date:'07/10',iso:'2026-10-07',title:'Mandado de Segurança + Ação Popular',focus:'Cabimento, legitimidade e pedidos',tasks:['Sessão guiada MS','Lei 12.016/09 no Vade','Sessão guiada Ação Popular','4 discursivas oficiais referenciadas']},
 {date:'08/10',iso:'2026-10-08',title:'MI + Habeas Data',focus:'Distinguir remédios constitucionais',tasks:['MI: CF + Lei 13.300/16','HD: CF + Lei 9.507/97','Quadro de diferenças','1 peça reduzida']},
 {date:'09/10',iso:'2026-10-09',title:'ADI, ADC, ADO e ADPF',focus:'Controle concentrado',tasks:['Art. 102 e 103 CF','Lei 9.868/99','Lei 9.882/99','20 identificações rápidas']},
 {date:'10/10',iso:'2026-10-10',title:'Controle de constitucionalidade',focus:'Competência, objeto e efeitos',tasks:['Difuso x concentrado','Legitimados art. 103','Cautelar e modulação','4 discursivas']},
 {date:'11/10',iso:'2026-10-11',title:'RE + Reclamação',focus:'Recursos e competência',tasks:['CF art. 102 III','CPC art. 988','CPC 1.029+','1 peça reduzida']},
 {date:'12/10',iso:'2026-10-12',title:'Direitos fundamentais',focus:'Discursivas',tasks:['Art. 5º','Nacionalidade','Direitos políticos','20 questões']},
 {date:'13/10',iso:'2026-10-13',title:'Estado e Poderes',focus:'Federalismo e competências',tasks:['Arts. 18–36','Competências','Processo legislativo','4 discursivas']},
 {date:'14/10',iso:'2026-10-14',title:'SIMULADO 1',focus:'5 horas como prova real',tasks:['1 peça','4 questões','Corrigir pelo espelho','Mapear perdas']},
 {date:'15/10',iso:'2026-10-15',title:'Correção + Vade',focus:'Eliminar erros repetidos',tasks:['Refazer erros','Índice/remissões','Endereçamentos','20 identificações']},
 {date:'16/10',iso:'2026-10-16',title:'SIMULADO 2',focus:'5 horas + estratégia',tasks:['1 peça','4 questões','20 min revisão final','Registrar nota']},
 {date:'17/10',iso:'2026-10-17',title:'Revisão final',focus:'Leve e objetiva',tasks:['Mapa de peças','Leis-chave','Checklist','Descanso']}
];

const pieces=[
 ['Mandado de Segurança','Direito líquido e certo + prova pré-constituída + ato/omissão de autoridade.','CF art. 5º, LXIX/LXX • Lei 12.016/09'],
 ['Ação Popular','Cidadão contra ato lesivo ao patrimônio público, moralidade, meio ambiente ou patrimônio histórico-cultural.','CF art. 5º, LXXIII • Lei 4.717/65'],
 ['Mandado de Injunção','Omissão normativa inviabiliza direito/liberdade/prerrogativa constitucional.','CF art. 5º, LXXI • Lei 13.300/16'],
 ['Habeas Data','Acesso/retificação de dado pessoal em banco público ou de caráter público.','CF art. 5º, LXXII • Lei 9.507/97'],
 ['ADI','Lei/ato normativo federal ou estadual pós-CF em controle abstrato.','CF arts. 102, I, a e 103 • Lei 9.868/99'],
 ['ADC','Confirmação da constitucionalidade de lei/ato normativo federal.','CF arts. 102, I, a e 103 • Lei 9.868/99'],
 ['ADO','Omissão inconstitucional em controle objetivo.','CF art. 103, §2º • Lei 9.868/99'],
 ['ADPF','Lesão a preceito fundamental; inclui hipóteses como normas pré-constitucionais, observada subsidiariedade.','CF art. 102, §1º • Lei 9.882/99'],
 ['Recurso Extraordinário','Decisão de única/última instância nas hipóteses constitucionais.','CF art. 102, III • CPC arts. 1.029+'],
 ['Reclamação','Preservar competência/autoridade de decisões nas hipóteses legais.','CPC art. 988']
];

const official={
 exam46:'https://oab.fgv.br/arq/649/519639_OAB46%20-%20B003%20(DIREITO%20CONSTITUCIONAL).pdf',
 answer43:'https://oab.fgv.br/arq/646/1409692_OAB%2043%20-%20GABARITO%20JUSTIFICADO%20-%20B003%20-%20DIREITO%20CONSTITUCIONAL_2.pdf'
};

const guide={
 source:'46º Exame de Ordem — Constitucional — FGV',
 sourceUrl:official.exam46,
 title:'Treino guiado 01 — descubra a peça com o Vade na mão',
 summary:'Um partido político com representação no Congresso quer levar ao STF, em controle concentrado, uma lei estadual editada em 1984 e confrontá-la com a Constituição de 1988. A lei continua formalmente em vigor e voltará a ser exigida.',
 choices:['ADI','ADC','ADPF','Mandado de Segurança'],
 correct:'ADPF',
 why:'A norma é anterior à Constituição de 1988. No controle concentrado perante o STF, esse é um forte gatilho para ADPF, desde que atendidos os requisitos legais, inclusive a subsidiariedade.',
 vade:[
  ['1','Constituição Federal','Abra o art. 102, §1º','Leia até entender qual instrumento constitucional está previsto ali.'],
  ['2','Lei 9.882/1999','Abra o art. 1º e seu parágrafo único','Procure a hipótese envolvendo controvérsia constitucional sobre ato normativo anterior à Constituição.'],
  ['3','Lei 9.882/1999','Abra o art. 4º, §1º','Leia a regra da subsidiariedade: a ADPF não é usada quando houver outro meio eficaz.'],
  ['4','Constituição Federal','Abra o art. 103, VIII','Confirme a legitimidade do partido político com representação no Congresso Nacional.']
 ],
 notebook:[
  'NORMA PRÉ-CF/88 + controle concentrado no STF → lembre de ADPF.',
  'Sempre verificar subsidiariedade: Lei 9.882/99, art. 4º, §1º.',
  'Partido com representação no Congresso: legitimado do art. 103, VIII, CF.',
  'Na prova, fundamento + explicação valem mais do que apenas jogar o número do artigo.'
 ],
 memory:[
  ['Qual peça tende a caber para discutir, no STF e em controle concentrado, norma anterior à CF/88?','ADPF'],
  ['Onde está a subsidiariedade da ADPF?','Lei 9.882/99, art. 4º, §1º'],
  ['Qual dispositivo da CF prevê a ADPF?','CF, art. 102, §1º'],
  ['Partido com representação no Congresso é legitimado em qual artigo?','CF, art. 103, VIII']
 ]
};

const affiliateProduct={
 name:'Vade Mecum Saraiva Tradicional — 42ª Edição 2026 (2º semestre)',
 priceHint:'Preço pode variar na Shopee',
 productUrl:'https://shopee.com.br/product/393775679/21197223800',
 affiliateUrl:'',
 note:'Opção de compra para estudo. Antes de usar na prova, confira as regras do edital vigente e se a edição atende ao conteúdo permitido.'
};

function todayKey(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(new Date());}
function currentDay(){return days.find(d=>d.iso===todayKey())||days[0];}
function taskId(d,i){return `${d.iso}-${i}`;}
function renderProgress(){const total=days.reduce((s,d)=>s+d.tasks.length,0);const done=Object.values(state.done).filter(Boolean).length;const pct=Math.round(done/total*100);const el=document.getElementById('progressText');if(el)el.textContent=`Progresso: ${done}/${total} tarefas (${pct}%)`;}
function markToday(i){const d=currentDay();state.done[taskId(d,i)]=true;save();}

function guideStep(stage){
 const s=Math.max(0,Math.min(6,stage));
 if(s===0)return `<div class="do-now">FAÇA AGORA • PASSO 1 DE 6</div><h2>${guide.title}</h2><p class="source">Questão oficial referenciada: <a href="${guide.sourceUrl}" target="_blank">${guide.source} ↗</a></p><div class="casebox"><b>Resumo fiel do caso para treino:</b><p>${guide.summary}</p></div><h3>Qual é a peça?</h3><p class="muted">Escolha uma opção. Você só avança depois de responder.</p><div class="choice-grid">${guide.choices.map(c=>`<button class="choice ${state.guideChoice===c?'selected':''}" onclick="choosePiece('${c}')">${c}</button>`).join('')}</div>${state.guideChoice?`<button class="btn good nextbtn" onclick="nextGuide()">Corrigir minha escolha →</button>`:''}`;
 if(s===1){const ok=state.guideChoice===guide.correct;return `<div class="do-now">PASSO 2 DE 6 • CORREÇÃO</div><h2>${ok?'✅ Acertou: ADPF':'❌ A peça correta é ADPF'}</h2><p>${guide.why}</p><div class="callout"><b>Não memorize só a resposta.</b> Agora você vai provar para si mesmo no Vade Mecum por que é ADPF.</div><button class="btn good nextbtn" onclick="nextGuide()">Abrir roteiro do Vade →</button>`;}
 if(s===2)return `<div class="do-now">PASSO 3 DE 6 • VADE MECUM</div><h2>Abra seu Vade agora</h2><p class="muted">Faça na ordem abaixo. Marque cada item somente depois de localizar e ler.</p>${guide.vade.map((v,i)=>`<label class="vade-step"><input type="checkbox" onchange="checkVade(${i},this.checked)" ${state.done['vade-'+i]?'checked':''}><span class="stepnum">${v[0]}</span><span><b>${v[1]}</b><br><strong>${v[2]}</strong><br><span class="muted">${v[3]}</span></span></label>`).join('')}<div id="vadeAdvance">${guide.vade.every((_,i)=>state.done['vade-'+i])?`<button class="btn good nextbtn" onclick="nextGuide()">Já localizei e li tudo →</button>`:`<p class="hint">⬆️ Comece pelo item 1. O botão de avançar aparece quando os 4 estiverem marcados.</p>`}</div>`;
 if(s===3)return `<div class="do-now">PASSO 4 DE 6 • ANOTAÇÃO</div><h2>Anote isto no seu caderno de revisão</h2><p class="warning-inline"><b>Não escreva roteiro de peça no Vade.</b> Estas anotações são para seu caderno/arquivo de estudo.</p>${guide.notebook.map(x=>`<div class="note-line">✍️ ${x}</div>`).join('')}<textarea id="myNote" rows="4" placeholder="Escreva com suas palavras o que você entendeu. Isso melhora a retenção."></textarea><button class="btn good nextbtn" onclick="saveStudyNote()">Salvar minha anotação e continuar →</button>`;
 if(s===4)return `<div class="do-now">PASSO 5 DE 6 • MEMÓRIA ATIVA</div><h2>Feche o Vade e tente lembrar</h2><p class="muted">Clique em cada cartão só depois de responder mentalmente.</p>${guide.memory.map((m,i)=>`<details class="flash"><summary>${i+1}. ${m[0]}</summary><p><b>${m[1]}</b></p></details>`).join('')}<button class="btn good nextbtn" onclick="nextGuide()">Concluí a revisão sem consultar →</button>`;
 if(s===5)return `<div class="do-now">PASSO 6 DE 6 • QUESTÃO OFICIAL</div><h2>Agora vá à fonte da FGV</h2><p>Abra o caderno oficial do 46º Exame e leia a peça completa. Seu objetivo agora é reconhecer no texto real os mesmos gatilhos que acabou de estudar.</p><a class="btn linkbtn" href="${guide.sourceUrl}" target="_blank">Abrir prova oficial FGV ↗</a><p class="muted smallgap">Depois volte aqui e conclua. Não hospedar a questão dentro da plataforma preserva a fonte oficial e evita alterações no enunciado.</p><button class="btn good nextbtn" onclick="finishGuide()">Concluí a sessão →</button>`;
 return `<div class="donehero"><div class="checkbig">✓</div><h2>Sessão concluída</h2><p>Você identificou a peça, comprovou no Vade, anotou os gatilhos e fez recuperação ativa.</p><div class="reviewchips"><span>Revisar amanhã</span><span>+3 dias</span><span>+7 dias</span></div><button class="btn good" onclick="generateStudyPDF()">Baixar resumo em PDF</button> <button class="btn secondary" onclick="restartGuide()">Refazer sessão</button></div>`;
}

function renderToday(){const d=currentDay();document.getElementById('hoje').innerHTML=`<div class="guide-layout"><div class="card guide-main">${guideStep(state.guideStage)}</div><aside class="card guide-side"><h3>Você não precisa decidir o que estudar</h3><p>O sistema libera uma ação por vez.</p><div class="mini-flow"><b>1.</b> Caso → <b>2.</b> Peça → <b>3.</b> Vade → <b>4.</b> Anotação → <b>5.</b> Memória → <b>6.</b> FGV</div><hr><h3>Objetivo de hoje</h3><p><b>${d.title}</b></p><p class="muted">${d.focus}</p><hr><button class="btn secondary full" onclick="generateStudyPDF()">Gerar PDF do que já estudei</button></aside></div>`;renderProgress();}
function choosePiece(c){state.guideChoice=c;save();renderToday();}
function nextGuide(){state.guideStage=Math.min(6,state.guideStage+1);save();renderToday();window.scrollTo({top:0,behavior:'smooth'});}
function checkVade(i,checked){state.done['vade-'+i]=checked;if(checked)markToday(1);save();renderToday();}
function saveStudyNote(){const el=document.getElementById('myNote');const txt=el.value.trim();if(!txt)return alert('Escreva ao menos uma frase com suas palavras antes de continuar.');state.notes.unshift({date:new Date().toLocaleDateString('pt-BR'),topic:'ADPF — 46º EOU',text:txt});markToday(2);state.guideStage=4;save();renderToday();}
function finishGuide(){state.guideFinished=true;state.guideStage=6;markToday(0);markToday(3);scheduleReviews();save();renderToday();}
function restartGuide(){state.guideStage=0;state.guideChoice='';state.guideFinished=false;save();renderToday();}
function scheduleReviews(){const now=new Date();[1,3,7].forEach(days=>{const d=new Date(now);d.setDate(d.getDate()+days);const iso=d.toISOString().slice(0,10);if(!state.reviews.some(r=>r.topic==='ADPF — 46º EOU'&&r.due===iso))state.reviews.push({topic:'ADPF — 46º EOU',due:iso,done:false});});}

function renderSchedule(){document.getElementById('cronograma').innerHTML=`<div class="card"><h2>Plano intensivo até a prova</h2><p class="muted">Cada dia terá o mesmo formato guiado: caso → peça → Vade → anotação → memória → questão oficial.</p>${days.map(d=>`<div class="day"><div class="date">${d.date}</div><div><b>${d.title}</b><div class="muted">${d.focus}</div></div></div>`).join('')}</div>`;}
function renderPieces(){document.getElementById('pecas').innerHTML=`<div class="card"><h2>Mapa de peças</h2><p class="muted">Use para revisão rápida, não como substituto dos casos guiados.</p>${pieces.map(p=>`<details class="piece"><summary>${p[0]}</summary><p>${p[1]}</p><p><span class="law">${p[2]}</span></p></details>`).join('')}</div>`;}

function renderVade(){const url=affiliateProduct.affiliateUrl||affiliateProduct.productUrl;const affiliate=!!affiliateProduct.affiliateUrl;document.getElementById('vade').innerHTML=`<div class="grid"><div class="card span-8"><h2>Como usar o Vade sem ficar perdido</h2><p>O sistema sempre vai dizer <b>qual diploma abrir, qual artigo localizar, o que procurar no texto e o que anotar no caderno</b>.</p>${guide.vade.map(v=>`<div class="task"><span class="stepnum">${v[0]}</span><span><b>${v[1]}</b><br>${v[2]}<br><span class="muted">${v[3]}</span></span></div>`).join('')}</div><div class="card span-4 product-card"><span class="pill">Vade recomendado</span><h3>${affiliateProduct.name}</h3><p>${affiliateProduct.note}</p><a class="btn full linkbtn" href="${url}" target="_blank">Ver opção de compra ↗</a><p class="affiliate-note">${affiliate?'Link de afiliado: a plataforma pode receber comissão, sem custo adicional para o comprador.':'O link afiliado está sendo convertido; até lá o botão abre a página do produto.'}</p></div><div class="card span-12 warning"><h3>Na prova</h3><p>Use apenas materiais e marcações permitidos pelo edital vigente. As anotações que o sistema manda fazer são para o <b>caderno de revisão</b>, não para criar roteiro de peça dentro do Vade.</p></div></div>`;}

function renderQuestions(){document.getElementById('questoes').innerHTML=`<div class="card"><h2>Banco oficial FGV — acesso pela fonte</h2><p class="muted">A plataforma referencia a prova oficial e guia o treino. Assim você sempre estuda o enunciado original da banca.</p><div class="qbox"><span class="pill">46º EOU • peça</span><h3>Controle concentrado + norma pré-1988</h3><p>Use a sessão guiada para estudar a questão e depois abra o caderno oficial.</p><a class="btn linkbtn" target="_blank" href="${official.exam46}">Abrir caderno oficial FGV ↗</a></div><div class="qbox"><span class="pill">43º EOU • padrão oficial</span><h3>Direitos fundamentais + ADPF/ADI</h3><p>Material oficial para conferir a forma como a FGV pontua fundamento e conclusão.</p><a class="btn linkbtn" target="_blank" href="${official.answer43}">Abrir padrão de resposta FGV ↗</a></div></div>`;}

function renderErrors(){document.getElementById('erros').innerHTML=`<div class="card"><h2>Caderno de erros e revisão automática</h2><p class="muted">Tudo que você registrar vira material do PDF e pode voltar nas revisões espaçadas.</p><div style="display:flex;gap:8px;margin-bottom:14px"><input id="manualError" type="text" placeholder="Ex.: esqueci subsidiariedade da ADPF"><button class="btn" onclick="addManualError()">Adicionar</button></div>${state.errors.length?state.errors.map((e,i)=>`<div class="task"><span>⚠️</span><span style="flex:1"><b>${e.text}</b><br><small class="muted">${e.at}</small></span><button class="btn secondary" onclick="removeError(${i})">Resolvido</button></div>`).join(''):'<p class="muted">Nenhum erro registrado ainda.</p>'}<hr><h3>Revisões programadas</h3>${state.reviews.length?state.reviews.map((r,i)=>`<label class="task"><input type="checkbox" onchange="toggleReview(${i},this.checked)" ${r.done?'checked':''}><span><b>${r.topic}</b><br><span class="muted">Revisar em ${new Date(r.due+'T12:00:00').toLocaleDateString('pt-BR')}</span></span></label>`).join(''):'<p class="muted">Conclua a primeira sessão para gerar revisões de +1, +3 e +7 dias.</p>'}</div>`;}
function addManualError(){const el=document.getElementById('manualError');if(!el.value.trim())return;state.errors.unshift({at:new Date().toLocaleString('pt-BR'),text:el.value.trim()});save();renderErrors();}
function removeError(i){state.errors.splice(i,1);save();renderErrors();}
function toggleReview(i,v){state.reviews[i].done=v;save();}

let simTimer=null,remaining=5*60*60;
function fmt(s){return [Math.floor(s/3600),Math.floor((s%3600)/60),s%60].map(x=>String(x).padStart(2,'0')).join(':');}
function tick(){remaining--;const e=document.getElementById('simTimer');if(e)e.textContent=fmt(Math.max(0,remaining));if(remaining<=0)pauseSim();}
function startSim(){if(!simTimer)simTimer=setInterval(tick,1000)}function pauseSim(){clearInterval(simTimer);simTimer=null}function resetSim(){pauseSim();remaining=5*60*60;const e=document.getElementById('simTimer');if(e)e.textContent=fmt(remaining)}
function saveScore(){const v=parseFloat(document.getElementById('score').value.replace(',','.'));if(!Number.isFinite(v)||v<0||v>10)return alert('Digite nota entre 0 e 10.');state.scores.unshift({date:new Date().toLocaleDateString('pt-BR'),score:v});save();renderSim();}
function renderSim(){document.getElementById('simulados').innerHTML=`<div class="grid"><div class="card span-8"><h2>Simulado de 5 horas</h2><p>15 min triagem → 2h15 peça → 2h questões → 30 min revisão/margem.</p><div id="simTimer" class="timer">${fmt(remaining)}</div><button class="btn" onclick="startSim()">Iniciar</button> <button class="btn secondary" onclick="pauseSim()">Pausar</button> <button class="btn secondary" onclick="resetSim()">Resetar</button></div><div class="card span-4"><h3>Nota estimada</h3><input id="score" type="text" placeholder="Ex.: 6,4"><button class="btn good" style="margin-top:8px" onclick="saveScore()">Salvar nota</button>${state.scores.slice(0,5).map(s=>`<p><b>${s.score.toFixed(1)}</b> <span class="muted">• ${s.date}</span></p>`).join('')}</div></div>`;}

function generateStudyPDF(){
 const lines=[
  'OAB 2ª Fase — Constitucional',
  'Resumo de revisão — ADPF / 46º EOU',
  '',
  'GATILHO PRINCIPAL',
  'Norma anterior à CF/88 + controle concentrado perante o STF: avaliar ADPF.',
  '',
  'VADE MECUM',
  'CF art. 102, §1º — previsão da ADPF.',
  'Lei 9.882/99 art. 1º — cabimento.',
  'Lei 9.882/99 art. 4º, §1º — subsidiariedade.',
  'CF art. 103, VIII — partido político com representação no Congresso.',
  '',
  'ANOTAÇÕES-CHAVE',...guide.notebook.map(x=>'• '+x),
  '',
  'MINHAS ANOTAÇÕES',...(state.notes.length?state.notes.map(n=>'• '+n.text):['• Nenhuma anotação pessoal registrada.']),
  '',
  'ERROS PARA REVISAR',...(state.errors.length?state.errors.map(e=>'• '+e.text):['• Nenhum erro registrado.']),
  '',
  'REVISÃO ATIVA',...guide.memory.flatMap(m=>['P: '+m[0],'R: '+m[1]]),
  '',
  'Fonte oficial de treino: 46º EOU — FGV — Direito Constitucional.'
 ];
 if(window.jspdf&&window.jspdf.jsPDF){const {jsPDF}=window.jspdf;const doc=new jsPDF();doc.setFontSize(16);doc.text(lines[0],14,18);doc.setFontSize(11);let y=28;for(const line of lines.slice(1)){const parts=doc.splitTextToSize(line,180);if(y+parts.length*6>285){doc.addPage();y=18;}doc.text(parts,14,y);y+=Math.max(6,parts.length*6);}doc.save('revisao-oab-constitucional-adpf.pdf');}
 else{const w=window.open('','_blank');w.document.write(`<pre style="white-space:pre-wrap;font-family:Arial;padding:30px">${lines.join('\n').replace(/</g,'&lt;')}</pre>`);w.document.close();w.print();}
}

function countdown(){const ms=exam-new Date();const e=document.getElementById('countdown');if(ms<=0){e.innerHTML='DIA DA PROVA';return}const d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000);e.innerHTML=`${d} dias<br><small>${h}h restantes</small>`;}
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab).classList.add('active')}));
renderToday();renderSchedule();renderPieces();renderVade();renderQuestions();renderSim();renderErrors();countdown();setInterval(countdown,60000);

function renderReview(){
 const today=todayKey();
 const due=state.reviews.filter(r=>!r.done&&r.due<=today);
 document.getElementById('revisao').innerHTML=`<div class="grid"><div class="card span-8"><h2>Revisão automática</h2><p class="muted">O sistema reapresenta os pontos estudados em +1, +3 e +7 dias.</p>${due.length?due.map(r=>`<div class="task"><span>🧠</span><span style="flex:1"><b>${r.topic}</b><br><span class="muted">Revisão: ${new Date(r.due+'T12:00:00').toLocaleDateString('pt-BR')}</span></span></div>`).join(''):'<div class="callout"><b>Nenhuma revisão vencida agora.</b><br>Conclua a sessão guiada de hoje para alimentar a repetição espaçada.</div>'}<h3 style="margin-top:20px">Cartões de memória</h3>${guide.memory.map((m,i)=>`<details class="flash"><summary>${i+1}. ${m[0]}</summary><p><b>${m[1]}</b></p></details>`).join('')}</div><div class="card span-4"><h3>Seu resumo</h3><p>Gere um PDF com fundamentos, suas anotações, erros e cartões de memória.</p><button class="btn good full" onclick="generateStudyPDF()">Baixar PDF de revisão</button><hr><h3>Próximas revisões</h3>${state.reviews.length?state.reviews.filter(r=>!r.done).slice(0,6).map(r=>`<p><b>${r.topic}</b><br><span class="muted">${new Date(r.due+'T12:00:00').toLocaleDateString('pt-BR')}</span></p>`).join(''):'<p class="muted">Ainda não há revisões agendadas.</p>'}</div></div>`;
}
renderReview();
