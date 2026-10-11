/* Aprova — suíte de QA pré-campanha. Executa apenas com ?qa_suite=1 */
(async function(){
 if(new URLSearchParams(location.search).get('qa_suite')!=='1')return;
 const wait=(fn,ms=12000)=>new Promise(resolve=>{const t=Date.now();(function tick(){try{if(fn())return resolve(true)}catch(e){}if(Date.now()-t>ms)return resolve(false);setTimeout(tick,120)})()});
 const ready=await wait(()=>typeof SUBJECTS!=='undefined'&&typeof subjectView==='function'&&typeof applyCourseProfile==='function'&&typeof exactCatalogCourseById==='function'&&typeof reinforcementQuestions==='function'&&window.APROVA_QUESTION_QUALITY_VERSION);
 const report={version:'2026-10-11.1',at:new Date().toISOString(),ready,scenarios:[],global:{issues:[],warnings:[]}};
 if(!ready){report.global.issues.push('Motores do Aprova não ficaram prontos para a suíte.');return finish();}
 const ids=['oab-48','ceb-cgu26-affc','ceb-sefazal26-afte','ceb-cbmal26','ceb-pmal26','ceb-tceac26-auditor','fgv-c78302f30e','pcba-2026-investigador','pcba-2026-escrivao'];
 function expectedCount(fmt){return fmt==='ce'?2:fmt==='abcd'?4:fmt==='abcde'?5:0;}
 function roleCases(hit){const p=typeof roleProfileForCourse==='function'?roleProfileForCourse(hit):null;return p?.roles?.length?p.roles:[null];}
 async function exists(url){try{const r=await fetch(url,{method:'HEAD',cache:'no-store'});return r.ok}catch(e){return false}}
 const oldProfile=JSON.parse(JSON.stringify(u.profile||{})),oldTrial=JSON.parse(JSON.stringify(u.trial||{})),oldDay=JSON.parse(JSON.stringify(ae.day||{}));
 for(const id of ids){
   const hit=exactCatalogCourseById(id);if(!hit){report.scenarios.push({id,status:'FAIL',issues:['Curso não encontrado no catálogo público.']});continue;}
   for(const role of roleCases(hit)){
     const issues=[],warnings=[],positions=[],reinforcementPositions=[],missingAudio=[];
     u.profile={...(u.profile||{}),target:hit.title,banca:hit.banca||'',catalogId:hit.id,track:typeof trackForCatalogHit==='function'?trackForCatalogHit(hit):'concurso'};
     applyCourseProfile(hit,role);
     const format=u.profile.questionFormat||role?.questionFormat||'';
     const keys=Object.keys(u.profile.subjectWeights||{}).filter(k=>SUBJECTS[k]);
     if(!keys.length)issues.push('Nenhuma matéria válida carregada.');
     for(const k of keys){
       const sub=subjectView(k),n=expectedCount(format);
       if(!sub?.questions?.length)issues.push(`${k}: sem questões principais.`);
       for(const [i,q] of (sub?.questions||[]).entries()){
         if(n&&q.choices?.length!==n)issues.push(`${k} Q${i+1}: ${q.choices?.length||0} alternativas; esperado ${n}.`);
         if(Number(q.ok)<0||Number(q.ok)>=q.choices.length)issues.push(`${k} Q${i+1}: gabarito inválido.`);
         if(String(q.why||'').trim().length<35)issues.push(`${k} Q${i+1}: explicação insuficiente.`);
         positions.push(Number(q.ok));
       }
       for(let g=0;g<2;g++)for(const [i,q] of (reinforcementQuestions(k,g)||[]).entries()){
         if(n&&q.choices?.length!==n)issues.push(`${k} reforço ${g+1}.${i+1}: formato incompatível.`);
         if(String(q.why||'').trim().length<35)issues.push(`${k} reforço ${g+1}.${i+1}: explicação insuficiente.`);
         reinforcementPositions.push(Number(q.ok));
       }
       if(!(await exists(`audio/subjects/${encodeURIComponent(k)}.mp3`)))missingAudio.push(k);
     }
     if(format!=='ce'&&positions.length>3&&positions.every(x=>x===0))issues.push('Questões principais mantêm resposta correta sempre na primeira posição.');
     if(format!=='ce'&&reinforcementPositions.length>3&&reinforcementPositions.every(x=>x===0))issues.push('Questões de reforço mantêm resposta correta sempre na primeira posição.');
     if(format==='ce'&&positions.length>3&&!positions.includes(1))issues.push('Itens C/E principais não variam entre Certo e Errado.');
     if(format==='ce'&&reinforcementPositions.length>3&&!reinforcementPositions.includes(1))issues.push('Itens C/E de reforço não variam entre Certo e Errado.');
     if(missingAudio.length)issues.push(`Áudio natural ausente para: ${missingAudio.join(', ')}.`);
     if(!u.profile.examStructure)warnings.push('Estrutura da prova não descrita no perfil.');
     report.scenarios.push({id,course:hit.title,role:role?.label||role?.role||u.profile.role||'',banca:hit.banca,format,subjects:keys.length,mainQuestions:positions.length,reinforcementQuestions:reinforcementPositions.length,mainAnswerPositions:[...new Set(positions)].sort(),reinforcementAnswerPositions:[...new Set(reinforcementPositions)].sort(),missingAudio,status:issues.length?'FAIL':'PASS',issues,warnings});
   }
 }
 // Testa a trava do WhatsApp em estado limpo: antes de 3 etapas não pode abrir; na saída da etapa 3 deve abrir.
 try{
   u.trial={paid:false,leadCaptured:false};ae.day={};const d=ensureDay();d.masterStage=0;const gate=document.getElementById('leadGate');if(gate)gate.hidden=true;
   const early=window.requireTrialLeadCapture('contest',1);const earlyVisible=gate?!gate.hidden:false;
   if(early||earlyVisible)report.global.issues.push('WhatsApp abre antes de 3 etapas em estado limpo.');
   d.masterStage=2;if(gate)gate.hidden=true;const after3=window.requireTrialLeadCapture('contest',3);const after3Visible=gate?!gate.hidden:false;
   if(!after3||!after3Visible)report.global.issues.push('WhatsApp não abre após a 3ª etapa em estado limpo.');
   if(gate)gate.hidden=true;
 }catch(e){report.global.issues.push('Falha ao simular a trava do WhatsApp: '+String(e.message||e));}
 // OAB 2ª fase usa módulo integrado próprio.
 const oabChecks={page:await exists('https://oab.emdestaque.ia.br/'),audio:await exists('https://oab.emdestaque.ia.br/audio/2026-10-11.mp3')};
 report.scenarios.push({id:'oab-47',course:'47º Exame de Ordem — 2ª Fase • Constitucional',role:'Direito Constitucional',banca:'FGV/OAB',format:'prático-profissional',status:oabChecks.page&&oabChecks.audio?'PASS':'FAIL',issues:[...(!oabChecks.page?['Módulo integrado indisponível.']:[]),...(!oabChecks.audio?['Áudio MP3 natural do módulo indisponível.']:[])],checks:oabChecks});
 u.profile=oldProfile;u.trial=oldTrial;ae.day=oldDay;try{usave();aesave()}catch(e){}
 finish();
 function finish(){report.pass=report.ready&&report.global.issues.length===0&&report.scenarios.every(x=>x.status==='PASS');document.title=report.pass?'Aprova QA PASS':'Aprova QA FAIL';document.body.innerHTML=`<main style="font-family:system-ui;padding:20px;white-space:pre-wrap"><h1>${document.title}</h1><pre id="qaReport">${JSON.stringify(report,null,2).replace(/</g,'&lt;')}</pre></main>`;window.__APROVA_FULL_QA=report;}
})();
