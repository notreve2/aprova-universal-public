/* Aprova — lead no início + proteção de QA do teste gratuito */
(function(){
  const KNOWN_SUBJECT_AUDIO=new Set(['administracaopoliticas','administracaopublica','administrativo','afo','ambiental','analisedemonstracoes','arquiteturasistemas','arquivologia','atuacao','atualidades','auditoriaavaliacao','auditoriacontratacoes','auditoriafiscal','auditoriagovernamental','biologia','ciberseguranca','cienciadados','cienciasnatureza','cienciassociais','civil','conhecimentosalagoas','constitucional','consumidor','contabilidade','contabilidadegeral','contabilidadepublica','controleexterno','desenvolvimentoseguro','desenvolvimentosistemas','direitopublicocontrole','direitoshumanos','eca','economia','economiasetorpublico','eleitoral','empresarial','engenhariadados','engenhariasoftware','especificos','estadodemocracia','estatistica','estatisticaprogramacao','eticaoab','eticapublica','evidenciasdadosia','filosofia','financascontpublica','financaspublicas','financeiro','fisica','gestaodadosia','gestaoservicosdigitais','governancariscos','igualdade','informatica','infraestruturatic','ingles','integridaderesponsabilizacao','inteligenciaartificial','internacional','legislacao','legislacaocbmal','legislacaogeral','legislacaoguarda','legislacaopenal','legislacaopmal','legislacaotribestadual','machinelearning','matematica','matematicafinanceira','mecanicageral','medicinalegal','nuvemvirtualizacao','pedagogia','penal','penalmilitar','penalprocessual','persistenciadados','politicasavaliacao','portugues','previdenciario','processocivil','processocontas','processopenal','processopenalmilitar','processotrabalho','quimica','raciocinio','realidadeacre','redessistemasdados','reformatributaria','sociedadebrasileira','trabalho','transparenciaouvidoria','tributario']);
  const fmtByBanca=b=>{b=String(b||'').toLowerCase();if(b.includes('cebraspe'))return'ce';if(b.includes('fgv')||b.includes('aocp'))return'abcde';return'';};
  const save=()=>{try{if(typeof usave==='function')usave();else localStorage.setItem('aprova-universal-v4',JSON.stringify(u));}catch(e){}};
  const identity=()=>({name:u?.profile?.name||'',email:u?.profile?.email||'',phone:u?.profile?.phone||'',marketing_consent:!!u?.profile?.marketingConsent});

  function normalizePhone(raw){
    const digits=String(raw||'').replace(/\D/g,'');
    const national=digits.replace(/^55(?=\d{10,11}$)/,'');
    if(national.length<10||national.length>11)return'';
    return '+55'+national;
  }
  function updateLeadCopy(){
    const gate=document.getElementById('leadGate');if(!gate)return;
    const badge=gate.querySelector('.trial-badge'),h2=gate.querySelector('h2'),p=gate.querySelector('p'),btn=gate.querySelector('.btn'),small=gate.querySelector('small'),label=gate.querySelector('label');
    if(badge)badge.textContent='ANTES DE COMEÇAR';
    if(h2)h2.textContent='Salve seu teste no WhatsApp';
    if(p)p.textContent='Informe seu WhatsApp para liberar o teste completo, salvar seu progresso e chegar ao resumo, áudio e PDF no final.';
    if(label&&label.childNodes[0])label.childNodes[0].textContent='Seu WhatsApp';
    if(btn)btn.textContent='Liberar meu teste completo →';
    if(small)small.textContent='Sem cobrança. O número identifica seu progresso. Mensagens promocionais só podem ser enviadas com consentimento apropriado.';
  }
  function openLeadGate(flow='start',nextStage=0){
    if(u?.trial?.paid||u?.profile?.phone)return false;
    u.trial=u.trial||{};u.trial.pendingLeadFlow=flow;u.trial.pendingLeadStage=Number(nextStage)||0;save();
    updateLeadCopy();
    ['trialWelcome','courseGate','roleGate'].forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=true;});
    const gate=document.getElementById('leadGate');if(!gate)return false;
    const phone=document.getElementById('leadPhone');if(phone)phone.value='';
    gate.hidden=false;document.body.classList.add('modal-open');
    if(!u.trial.leadGateTracked){
      u.trial.leadGateTracked=true;save();
      try{window.aprovaTrackCustom?.('LeadGateView',{content_name:'Aprova - WhatsApp antes do teste'});}catch(e){}
      try{window.aprovaAnalytics?.('lead_gate_view',{track:u.profile?.track||'',target:u.profile?.target||'',catalog_id:u.profile?.catalogId||'',role:u.profile?.role||'',before_test:true});}catch(e){}
    }
    setTimeout(()=>phone?.focus(),60);return true;
  }

  const originalStart=window.startFreeTrial;
  if(typeof originalStart==='function'){
    window.startFreeTrial=function(){
      if(!u?.trial?.paid&&u?.trial?.courseChosenAt&&u?.profile?.target&&!u?.profile?.phone){openLeadGate('start',0);return;}
      if(u?.profile?.phone){u.trial=u.trial||{};u.trial.leadCaptured=true;if(!u.profile.questionFormat)u.profile.questionFormat=fmtByBanca(u.profile.banca);save();}
      return originalStart.apply(this,arguments);
    };
  }

  window.requireTrialLeadCapture=function(flow,nextStage){
    if(u?.trial?.paid||u?.profile?.phone){if(u?.profile?.phone){u.trial=u.trial||{};u.trial.leadCaptured=true;}return false;}
    return openLeadGate(flow||'contest',nextStage);
  };

  window.captureTrialLead=function(){
    const phone=normalizePhone(document.getElementById('leadPhone')?.value||'');
    if(!phone)return alert('Informe um WhatsApp válido com DDD.');
    u.profile={...(u.profile||{}),phone,email:u.profile?.email||'',marketingConsent:false};
    if(!u.profile.questionFormat)u.profile.questionFormat=fmtByBanca(u.profile.banca);
    u.trial=u.trial||{};u.trial.leadCaptured=true;u.trial.leadCapturedAt=u.trial.leadCapturedAt||Date.now();
    const flow=u.trial.pendingLeadFlow||'start',next=Number(u.trial.pendingLeadStage)||0;delete u.trial.pendingLeadFlow;delete u.trial.pendingLeadStage;
    if(!u.trial.leadEventTracked){
      u.trial.leadEventTracked=true;
      try{window.aprovaTrack?.('Lead',{content_name:'Aprova - WhatsApp antes do teste',content_category:u.profile?.track||''});window.aprovaTrack?.('CompleteRegistration',{content_name:'Aprova - teste liberado',content_category:u.profile?.track||'',status:true});}catch(e){}
      try{window.aprovaAnalytics?.('trial_lead',{...identity(),track:u.profile?.track||'',target:u.profile?.target||'',banca:u.profile?.banca||'',catalog_id:u.profile?.catalogId||'',role:u.profile?.role||'',before_test:true});}catch(e){}
    }
    save();const gate=document.getElementById('leadGate');if(gate)gate.hidden=true;document.body.classList.remove('modal-open');
    if(flow==='start')return originalStart?.call(window);
    if(flow==='oab'&&typeof setOabStage==='function')return setOabStage(next);
    if(flow==='contest'&&typeof setContestStage==='function')return setContestStage(next);
    if(typeof setEngineStage==='function')return setEngineStage(next);
  };

  function subjectHealthy(key){
    try{const s=SUBJECTS[key];return !!(s&&s.name&&Array.isArray(s.questions)&&s.questions.length>=2&&s.questions.every(q=>q&&q.q&&Array.isArray(q.choices)&&q.choices.length>=2&&Number.isInteger(q.ok)&&q.ok>=0&&q.ok<q.choices.length)&&Array.isArray(s.flash)&&s.flash.length>=1);}catch(e){return false;}
  }
  function profileHealthy(p){
    if(!p||!p.subjectWeights)return false;const keys=Object.keys(p.subjectWeights).filter(k=>Number(p.subjectWeights[k])>0);if(!keys.length||!keys.every(subjectHealthy))return false;if(p.recommendedStart&&!keys.includes(p.recommendedStart))return false;return true;
  }
  function courseHealth(hit){
    try{
      const direct=(typeof DIRECT_COURSE_PROFILES!=='undefined'&&DIRECT_COURSE_PROFILES[hit.id])||null;
      const parent=(typeof COURSE_ROLE_PROFILES!=='undefined'&&COURSE_ROLE_PROFILES[hit.id])||null;
      if(direct)return {ok:profileHealthy(direct),roles:1};
      if(parent?.roles?.length)return {ok:parent.roles.every(profileHealthy),roles:parent.roles.length};
      return {ok:false,roles:0};
    }catch(e){return {ok:false,roles:0};}
  }
  window.aprovaCourseHealthReport=function(){
    let items=[];try{items=typeof publicCatalogItems==='function'?publicCatalogItems():[];}catch(e){}
    const report=items.map(x=>({id:x.id,title:x.title,banca:x.banca,...courseHealth(x)}));
    const failures=report.filter(x=>!x.ok);
    try{window.aprovaAnalytics?.('course_health_check',{courses:report.length,failed:failures.length,failed_ids:failures.map(x=>x.id).join(',')});}catch(e){}
    return report;
  };

  function noNaturalAudio(){
    alert('O áudio natural desta matéria está sendo preparado. O Aprova não usa mais a voz automática do navegador.');
  }
  const baseSpeak=window.speakStudySummary;
  window.speakStudySummary=function(){
    try{
      if(typeof isOabMastery==='function'&&isOabMastery())return baseSpeak?.apply(this,arguments);
      const key=typeof currentSubjectKey==='function'?currentSubjectKey():'';
      if(KNOWN_SUBJECT_AUDIO.has(key)&&typeof baseSpeak==='function')return baseSpeak.apply(this,arguments);
      return noNaturalAudio();
    }catch(e){return noNaturalAudio();}
  };
  const baseDownload=window.downloadMasterAudio;
  window.downloadMasterAudio=function(){
    try{if(typeof isOabMastery==='function'&&isOabMastery())return baseDownload?.apply(this,arguments);const key=typeof currentSubjectKey==='function'?currentSubjectKey():'';if(KNOWN_SUBJECT_AUDIO.has(key)&&typeof baseDownload==='function')return baseDownload.apply(this,arguments);}catch(e){}
    alert('O arquivo de áudio natural desta matéria ainda não está disponível para download.');
  };

  function repairAudioElements(root=document){
    if(typeof isOabMastery==='function'&&isOabMastery())return;
    let key='';try{key=typeof currentSubjectKey==='function'?currentSubjectKey():'';}catch(e){}
    if(KNOWN_SUBJECT_AUDIO.has(key))return;
    root.querySelectorAll?.('audio').forEach(a=>{a.style.display='none';const next=a.nextElementSibling;if(next&&next.matches('a[download]')){next.removeAttribute('href');next.removeAttribute('download');next.textContent='▶ Ouvir resumo';next.onclick=e=>{e.preventDefault();window.speakStudySummary();};}});
  }
  const obs=new MutationObserver(()=>repairAudioElements());
  document.addEventListener('DOMContentLoaded',()=>{updateLeadCopy();repairAudioElements();setTimeout(()=>{const report=window.aprovaCourseHealthReport();const bad=report.filter(x=>!x.ok);if(bad.length)console.error('Aprova QA: cursos com perfil incompleto',bad);},300);obs.observe(document.body,{childList:true,subtree:true});},{once:true});
  if(document.readyState!=='loading'){updateLeadCopy();repairAudioElements();setTimeout(()=>window.aprovaCourseHealthReport(),300);obs.observe(document.body,{childList:true,subtree:true});}
})();
