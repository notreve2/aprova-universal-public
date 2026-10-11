/* Integração OAB: preserva o curso de 2ª fase já aprovado e abre-o dentro do Aprova. */
(function(){
 const OAB2_ID='oab-47';
 const OAB2_URL='https://oab.emdestaque.ia.br/?embed=aprova';
 const OAB2_ORIGIN='https://oab.emdestaque.ia.br';
 function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[c]));}
 function ensureShell(){
  let shell=document.getElementById('aprovaOab2Shell');if(shell)return shell;
  const style=document.createElement('style');style.textContent=`
   #aprovaOab2Shell{position:fixed;inset:0;z-index:100000;background:#fff;display:flex;flex-direction:column;padding:0!important}
   #aprovaOab2Shell[hidden]{display:none!important}
   .aprova-oab2-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:calc(10px + env(safe-area-inset-top)) 14px 10px;background:#0f2747;color:#fff;box-shadow:0 2px 12px #0002;z-index:2}
   .aprova-oab2-title{min-width:0}.aprova-oab2-title small{display:block;opacity:.8;font-size:11px;font-weight:800;letter-spacing:.06em}.aprova-oab2-title b{display:block;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
   .aprova-oab2-back{border:0;border-radius:999px;padding:9px 12px;background:#fff;color:#0f2747;font-weight:800;white-space:nowrap}
   #aprovaOab2Frame{width:100%;height:100%;flex:1;border:0;background:#fff}
   body.aprova-oab2-open{overflow:hidden!important}
  `;document.head.appendChild(style);
  shell=document.createElement('section');shell.id='aprovaOab2Shell';shell.hidden=true;shell.innerHTML=`<div class="aprova-oab2-head"><div class="aprova-oab2-title"><small>APROVA • CURSO INTEGRADO</small><b>47º Exame de Ordem • 2ª Fase • Constitucional</b></div><button class="aprova-oab2-back" type="button" onclick="closeAprovaOab2Course()">← Voltar ao Aprova</button></div><iframe id="aprovaOab2Frame" title="OAB 2ª Fase Constitucional" loading="eager" allow="clipboard-write"></iframe>`;document.body.appendChild(shell);return shell;
 }
 function postOabContext(){
  const frame=document.getElementById('aprovaOab2Frame');
  if(!frame?.contentWindow)return;
  try{frame.contentWindow.postMessage({type:'aprova-oab-context',paid:!!u?.trial?.paid,leadCaptured:!!u?.trial?.leadCaptured},OAB2_ORIGIN);}catch(e){}
 }
 window.openAprovaOab2Course=function(){
  const shell=ensureShell(),frame=document.getElementById('aprovaOab2Frame');
  ['courseGate','roleGate','trialWelcome','trialGate'].forEach(id=>{const x=document.getElementById(id);if(x)x.hidden=true;});
  if(frame&&!frame.src){frame.addEventListener('load',postOabContext);frame.src=OAB2_URL;}else setTimeout(postOabContext,50);
  shell.hidden=false;document.body.classList.add('aprova-oab2-open');
  try{sessionStorage.setItem('aprova-trial-active','1')}catch(e){}
  if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('oab2_course_open',{catalog_id:OAB2_ID,target:'47º Exame de Ordem — 2ª Fase • Constitucional'});
 };
 window.closeAprovaOab2Course=function(){const shell=document.getElementById('aprovaOab2Shell');if(shell)shell.hidden=true;document.body.classList.remove('aprova-oab2-open');};
 function selectOab2(hit,trial){
  if(typeof window.applyExactCourseSelection==='function')window.applyExactCourseSelection(hit,{trial:!!trial});
  u.trial=u.trial||{};u.trial.courseChosenAt=Date.now();u.trial.courseChosenTitle=hit.title;u.trial.firstStageCompleted=false;u.trial.previewStartedAt=u.trial.previewStartedAt||Date.now();usave();
  if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('trial_course_selected',{target:hit.title,banca:hit.banca||'FGV/OAB',track:'oab2',catalog_id:hit.id,role:'Direito Constitucional'});
  if(typeof window.closeCourseChooser==='function')window.closeCourseChooser();openAprovaOab2Course();
 }
 const originalConfirm=window.confirmTrialCourse;
 if(typeof originalConfirm==='function')window.confirmTrialCourse=function(){
  const input=document.getElementById('trialCourseSearch'),raw=(input?.value||'').trim();
  const hit=(input?.dataset?.courseId&&typeof exactCatalogCourseById==='function'?exactCatalogCourseById(input.dataset.courseId):null)||(typeof exactCatalogCourseByTitle==='function'?exactCatalogCourseByTitle(raw):null);
  if(hit?.id===OAB2_ID){selectOab2(hit,true);return;}return originalConfirm.apply(this,arguments);
 };
 const originalStart=window.startFreeTrial;
 if(typeof originalStart==='function')window.startFreeTrial=function(){if(u?.profile?.catalogId===OAB2_ID){openAprovaOab2Course();return;}return originalStart.apply(this,arguments);};
 const originalCatalog=window.selectCatalogItem;
 if(typeof originalCatalog==='function')window.selectCatalogItem=function(id){if(id===OAB2_ID){const hit=(typeof exactCatalogCourseById==='function'?exactCatalogCourseById(id):null)||aprovaCatalog?.items?.find(x=>x.id===id);if(hit){selectOab2(hit,false);return;}}return originalCatalog.apply(this,arguments);};

 function trialFinalUnlocked(){
  if(u?.trial?.paid)return true;
  try{if(typeof isOabMastery==='function'&&isOabMastery())return Number(mastery?.oab?.stage||0)>=8;}catch(e){}
  try{return Number(contestState()?.masterStage||0)>=7;}catch(e){return false;}
 }
 const naturalSpeak=window.speakStudySummary;
 if(typeof naturalSpeak==='function')window.speakStudySummary=function(){
  if(!trialFinalUnlocked())return alert('O áudio é liberado no final do teste. Conclua todas as etapas primeiro.');
  try{if('speechSynthesis'in window)speechSynthesis.cancel();}catch(e){}
  return naturalSpeak.apply(this,arguments);
 };
 const naturalDownload=window.downloadMasterAudio;
 if(typeof naturalDownload==='function')window.downloadMasterAudio=function(){
  if(!trialFinalUnlocked())return alert('O áudio é liberado no final do teste.');
  return naturalDownload.apply(this,arguments);
 };
 const naturalPdf=window.generateUniversalPDF;
 if(typeof naturalPdf==='function')window.generateUniversalPDF=function(){
  if(!trialFinalUnlocked())return alert('O PDF é liberado no final do teste. Conclua todas as etapas primeiro.');
  return naturalPdf.apply(this,arguments);
 };
 if(typeof renderMasterReview==='function'){
  const baseReview=renderMasterReview;
  renderMasterReview=function(){
   if(!u?.trial?.paid&&!trialFinalUnlocked()){
    const el=document.getElementById('revisao');if(el)el.innerHTML='<div class="card"><span class="pill">REVISÃO FINAL</span><h2>Conclua o teste primeiro</h2><p class="muted">Áudio e PDF são liberados apenas no fim do teste, depois de todas as etapas.</p><div class="callout">🔒 Continue em Hoje até concluir o ciclo.</div></div>';return;
   }
   return baseReview.apply(this,arguments);
  };
 }
 if(typeof renderMasterSim==='function'){
  const baseSim=renderMasterSim;
  renderMasterSim=function(){const out=baseSim.apply(this,arguments);if(!u?.trial?.paid&&!trialFinalUnlocked())document.querySelectorAll('#simulados button').forEach(b=>{if(/pdf|mapa mental/i.test(b.textContent||''))b.remove();});return out;};
 }

 const originalCapture=window.captureTrialLead;
 if(typeof originalCapture==='function')window.captureTrialLead=function(){
  if(u?.trial?.pendingLeadFlow!=='oab-iframe')return originalCapture.apply(this,arguments);
  const phoneRaw=(document.getElementById('leadPhone')?.value||'').trim(),digits=phoneRaw.replace(/\D/g,''),national=digits.replace(/^55(?=\d{10,11}$)/,''),phone='+55'+national;
  if(national.length<10||national.length>11)return alert('Informe um WhatsApp válido com DDD.');
  u.profile={...(u.profile||{}),phone,email:u.profile?.email||'',marketingConsent:false};u.trial=u.trial||{};u.trial.leadCaptured=true;u.trial.leadCapturedAt=u.trial.leadCapturedAt||Date.now();delete u.trial.pendingLeadFlow;delete u.trial.pendingLeadStage;usave();
  if(!u.trial.leadEventTracked){u.trial.leadEventTracked=true;usave();if(typeof window.aprovaTrack==='function'){window.aprovaTrack('Lead',{content_name:'Aprova - WhatsApp apos 3 etapas',content_category:'oab2'});window.aprovaTrack('CompleteRegistration',{content_name:'Aprova - teste continuado',content_category:'oab2',status:true});}if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('trial_lead',{name:u.profile?.name||'',email:u.profile?.email||'',phone:u.profile?.phone||'',track:'oab2',target:u.profile?.target||'',after_steps:3});}
  const gate=document.getElementById('leadGate');if(gate)gate.hidden=true;
  const frame=document.getElementById('aprovaOab2Frame');try{frame?.contentWindow?.postMessage({type:'aprova-lead-captured'},OAB2_ORIGIN);}catch(e){}
 };

 window.addEventListener('message',function(event){
  if(event.origin!==OAB2_ORIGIN)return;
  const type=event.data?.type;
  if(type==='aprova-oab-lead-required'){
   if(u?.trial?.paid||u?.trial?.leadCaptured){const frame=document.getElementById('aprovaOab2Frame');try{frame?.contentWindow?.postMessage({type:'aprova-lead-captured'},OAB2_ORIGIN);}catch(e){}return;}
   u.trial=u.trial||{};u.trial.pendingLeadFlow='oab-iframe';u.trial.pendingLeadStage=3;usave();
   window.aprovaAuthorizeLeadGate?.();const gate=document.getElementById('leadGate'),p=document.getElementById('leadPhone');if(p)p.value=(u.profile?.phone||'').replace(/^\+55/,'');if(gate)gate.hidden=false;
   if(!u.trial.leadGateTracked){u.trial.leadGateTracked=true;usave();if(typeof window.aprovaTrackCustom==='function')window.aprovaTrackCustom('LeadGateView',{content_name:'Aprova OAB - tres etapas concluidas'});if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('lead_gate_view',{track:'oab2',target:u.profile?.target||'',after_steps:3});}
   return;
  }
  if(type==='aprova-oab-test-complete'&&!u?.trial?.paid){
   u.trial=u.trial||{};u.trial.firstStageCompleted=true;usave();closeAprovaOab2Course();
   if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('paywall_view',{track:'oab2',target:u.profile?.target||'',placement:'after_complete_test'});
   const pw=document.getElementById('paywall');if(pw)pw.hidden=false;
  }
 });
 try{if(typeof renderMasterAll==='function')renderMasterAll();}catch(e){}
})();
