/* OAB embedded trial flow: WhatsApp after step 3, review assets only at the end. */
(function(){
  const APROVA_ORIGIN='https://aprova.emdestaque.ia.br';
  let paidAccess=false;
  let leadReleased=sessionStorage.getItem('aprova-oab-lead-released')==='1';

  function isEmbeddedInAprova(){
    return window.parent!==window;
  }

  function finalUnlocked(){
    return paidAccess || Number(state?.guideStage||0)>=8 || !!state?.guideFinished;
  }

  function tellParent(type,extra={}){
    if(!isEmbeddedInAprova())return;
    try{window.parent.postMessage({type,...extra},APROVA_ORIGIN);}catch(e){}
  }

  const baseContinue=window.continueGuide||continueGuide;
  window.continueGuide=continueGuide=function(){
    try{
      if(Number(state?.guideStage||0)===2&&!paidAccess&&!leadReleased&&isEmbeddedInAprova()){
        tellParent('aprova-oab-lead-required',{stage:3});
        return;
      }
    }catch(e){}
    return baseContinue.apply(this,arguments);
  };

  window.addEventListener('message',function(event){
    if(event.origin!==APROVA_ORIGIN)return;
    if(event.data?.type==='aprova-oab-context'){
      paidAccess=!!event.data.paid;
      if(paidAccess||event.data.leadCaptured){
        leadReleased=true;
        sessionStorage.setItem('aprova-oab-lead-released','1');
      }
      try{renderToday();renderReview();}catch(e){}
      return;
    }
    if(event.data?.type==='aprova-lead-captured'){
      leadReleased=true;
      sessionStorage.setItem('aprova-oab-lead-released','1');
      if(Number(state?.guideStage||0)===2)baseContinue();
    }
  });

  const basePdf=window.generateStudyPDF||generateStudyPDF;
  window.generateStudyPDF=generateStudyPDF=function(){
    if(!finalUnlocked())return alert('O PDF é liberado no final do teste, depois das 8 etapas.');
    return basePdf.apply(this,arguments);
  };

  const baseAudioControls=window.audioSummaryControls||audioSummaryControls;
  window.audioSummaryControls=audioSummaryControls=function(iso,compact=false){
    if(!finalUnlocked())return '<div class="locked-summary">🔒 O resumo em áudio é liberado somente no final do teste.</div>';
    return baseAudioControls(iso,compact);
  };

  const baseReview=window.renderReview||renderReview;
  window.renderReview=renderReview=function(){
    if(!finalUnlocked()){
      const el=document.getElementById('revisao');
      if(el)el.innerHTML='<div class="card"><span class="pill">REVISÃO FINAL</span><h2>Conclua o teste primeiro</h2><p class="muted">Áudio e PDF ficam disponíveis somente depois das 8 etapas, para fechar o ciclo de estudo.</p><div class="locked-summary">🔒 Continue em Hoje até concluir o teste.</div></div>';
      return;
    }
    return baseReview.apply(this,arguments);
  };

  const baseRenderToday=window.renderToday||renderToday;
  window.renderToday=renderToday=function(){
    const out=baseRenderToday.apply(this,arguments);
    if(!finalUnlocked()){
      document.querySelectorAll('#hoje button').forEach(function(btn){
        if(/pdf/i.test(btn.textContent||''))btn.remove();
      });
    }else if(isEmbeddedInAprova()&&!paidAccess){
      const actions=document.querySelector('#hoje .done-actions')||document.querySelector('#hoje .donehero');
      if(actions&&!document.getElementById('aprovaCheckoutAfterTest')){
        const btn=document.createElement('button');
        btn.id='aprovaCheckoutAfterTest';
        btn.className='btn good';
        btn.textContent='Continuar para o acesso completo →';
        btn.addEventListener('click',function(){tellParent('aprova-oab-test-complete',{stage:8});});
        actions.appendChild(btn);
      }
    }
    return out;
  };

  try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}
  try{renderToday();renderReview();}catch(e){}
})();
