/* Aprova — QA fail-closed: só expõe curso/cargo com perfil íntegro e impede pular o WhatsApp inicial. */
(function(){
 const QA=new URLSearchParams(location.search).get('qa')==='1';
 window.APROVA_QA_MODE=QA;
 if(QA){
  ['aprovaAnalytics','aprovaTrack','aprovaTrackCustom'].forEach(name=>{if(typeof window[name]==='function'){const original=window[name];window[name]=function(){return undefined;};window[name].__aprovaOriginal=original;}});
 }
 const allowedFormats=new Set(['ce','abcd','abcde','practical']);
 const expectedChoices=fmt=>fmt==='ce'?2:fmt==='abcd'?4:fmt==='abcde'?5:0;
 const rawSubjectHealthy=k=>{try{const s=SUBJECTS[k];return !!(s&&s.name&&s.summary&&Array.isArray(s.questions)&&s.questions.length>=2&&s.questions.every(q=>q&&q.q&&Array.isArray(q.choices)&&q.choices.length>=2&&Number.isInteger(q.ok)&&q.ok>=0&&q.ok<q.choices.length&&q.why)&&Array.isArray(s.flash)&&s.flash.length>=1);}catch(e){return false;}};
 const profileHealth=(p,parentFormat='')=>{
  if(!p?.subjectWeights)return {ok:false,reason:'perfil sem matérias'};
  const keys=Object.keys(p.subjectWeights).filter(k=>Number(p.subjectWeights[k])>0),fmt=p.questionFormat||parentFormat||'';
  if(!keys.length)return {ok:false,reason:'perfil sem matérias'};
  const missing=keys.filter(k=>!rawSubjectHealthy(k));if(missing.length)return {ok:false,reason:'matéria sem questões/flashcards',missing};
  if(p.recommendedStart&&!keys.includes(p.recommendedStart))return {ok:false,reason:'matéria inicial fora do edital'};
  if(!allowedFormats.has(fmt))return {ok:false,reason:'formato de prova não validado',format:fmt};
  const n=expectedChoices(fmt);return {ok:true,format:fmt,choiceCount:n||null,subjects:keys.length};
 };
 const courseHealth=hit=>{try{
  const direct=typeof DIRECT_COURSE_PROFILES!=='undefined'?DIRECT_COURSE_PROFILES[hit?.id]:null,parent=typeof COURSE_ROLE_PROFILES!=='undefined'?COURSE_ROLE_PROFILES[hit?.id]:null;
  if(direct)return {...profileHealth(direct),roles:1};
  if(parent?.roles?.length){const roles=parent.roles.map(r=>({id:r.id,label:r.label,...profileHealth(r,parent.questionFormat||'')})),bad=roles.filter(r=>!r.ok);return {ok:!bad.length,format:parent.questionFormat||'',roles:roles.length,roleHealth:roles,reason:bad.length?'cargo incompleto':''};}
  return {ok:false,roles:0,reason:'curso sem perfil validado'};
 }catch(e){return {ok:false,roles:0,reason:'erro ao validar perfil'};}};
 window.aprovaCourseHealth=courseHealth;
 const basePublic=typeof window.publicCatalogItems==='function'?window.publicCatalogItems:null;
 if(basePublic){window.publicCatalogItems=function(){return basePublic().filter(x=>courseHealth(x).ok);};}
 window.aprovaCourseHealthReport=function(){let all=[];try{all=basePublic?basePublic():[];}catch(e){}return all.map(x=>({id:x.id,title:x.title,banca:x.banca,...courseHealth(x)}));};
 const selectedHit=()=>{try{return typeof exactCatalogCourseById==='function'?exactCatalogCourseById(u?.profile?.catalogId||''):null}catch(e){return null}};
 const baseStart=window.startFreeTrial;
 if(typeof baseStart==='function')window.startFreeTrial=function(){
  const hit=selectedHit();
  if(u?.trial?.courseChosenAt&&(!hit||!courseHealth(hit).ok)){alert('Este curso está em revisão técnica e foi retirado temporariamente do teste para evitar conteúdo incorreto. Escolha outro curso disponível.');try{u.trial.courseChosenAt=0;u.trial.courseChosenTitle='';if(typeof usave==='function')usave();}catch(e){}return window.openCourseChooser?.();}
  return baseStart.apply(this,arguments);
 };
 const baseClose=window.closeTrialLead;
 window.closeTrialLead=function(){
  if(!u?.trial?.paid&&!u?.profile?.phone&&u?.trial?.pendingLeadFlow==='start'){
   const gate=document.getElementById('leadGate');if(gate)gate.hidden=true;document.body.classList.remove('modal-open');
   return window.openCourseChooser?.();
  }
  return typeof baseClose==='function'?baseClose.apply(this,arguments):undefined;
 };
 // Mesmo se alguma função antiga tentar esconder o modal, cliques no conteúdo não liberam o teste sem WhatsApp.
 document.addEventListener('click',e=>{
  const needsPhone=!u?.trial?.paid&&!!u?.trial?.courseChosenAt&&!!u?.profile?.target&&!u?.profile?.phone;
  if(!needsPhone)return;
  if(e.target?.closest?.('#leadGate,#courseGate,#roleGate,#trialGate,#accountGate'))return;
  if(e.target?.closest?.('main,.tabs,.topbar')){e.preventDefault();e.stopImmediatePropagation();window.requireTrialLeadCapture?.('start',0);}
 },true);
 const baseCountdown=typeof window.uCountdown==='function'?window.uCountdown:null;
 if(baseCountdown)window.uCountdown=function(){
  if(!u?.profile?.catalogId&&!u?.trial?.paid){const e=document.getElementById('countdown'),s=document.getElementById('smartStrip');if(e)e.innerHTML='ESCOLHA<br><small>SUA PROVA</small>';if(s)s.innerHTML='<b>Plano automático:</b> escolha seu concurso e cargo para carregar apenas o edital correto.';return;}
  return baseCountdown.apply(this,arguments);
 };
 function refreshPublicUi(){try{window.populateTrialCourseOptions?.();if(typeof renderCatalog==='function')renderCatalog();}catch(e){console.warn('Aprova QA: não foi possível atualizar catálogo',e)}}
 function runtimeProbe(){
  const report=window.aprovaCourseHealthReport(),bad=report.filter(x=>!x.ok),gate=!!document.getElementById('leadGate'),pdf=typeof window.generateUniversalPDF==='function',audio=typeof window.speakStudySummary==='function';
  const out={ok:!bad.length&&gate&&pdf&&audio,courses:report.length,bad,leadGate:gate,pdf,audio,generatedAt:new Date().toISOString()};window.APROVA_QA_REPORT=out;if(bad.length)console.error('Aprova QA: cursos ocultados por falha',bad);return out;
 }
 window.aprovaRuntimeQa=runtimeProbe;
 const ready=()=>{refreshPublicUi();runtimeProbe();window.uCountdown?.();};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ready,150),{once:true});else setTimeout(ready,150);
})();
