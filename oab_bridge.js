/* Integração OAB: preserva o curso de 2ª fase já aprovado e abre-o dentro do Aprova. */
(function(){
 const OAB2_ID='oab-47';
 const OAB2_URL='https://oab.emdestaque.ia.br/?embed=aprova';
 function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
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
 window.openAprovaOab2Course=function(){
  const shell=ensureShell(),frame=document.getElementById('aprovaOab2Frame');
  ['courseGate','roleGate','trialWelcome','trialGate'].forEach(id=>{const x=document.getElementById(id);if(x)x.hidden=true;});
  if(frame&&!frame.src)frame.src=OAB2_URL;
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
})();
