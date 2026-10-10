/* Aprova — teste gratuito curto para conversão; estudo pago permanece completo. */
(function(){
  const validPhone=()=>String(u?.profile?.phone||'').replace(/\D/g,'').length>=12;
  const save=()=>{try{typeof usave==='function'&&usave();}catch(e){}};
  const esc=v=>typeof escM==='function'?escM(v):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function hash(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
  function rand(seed){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed>>>0;}
  function shuffled(q,key='q'){
    const a=(q?.choices||[]).map((text,original)=>({text,original}));
    let seed=hash([u?.profile?.catalogId||'',u?.profile?.role||'',typeof currentSubjectKey==='function'?currentSubjectKey():'',key,q?.q||''].join('|'))||1;
    for(let i=a.length-1;i>0;i--){seed=rand(seed);const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]];}
    return a;
  }
  function authoredChoices(q,selected,result,onpick,key){
    return shuffled(q,key).map(x=>{
      const i=x.original,cls=result?(i===q.ok?'choice-correct':selected===i?'choice-wrong':'choice-locked'):(selected===i?'selected':'');
      return `<button class="choice ${cls}" ${result?'disabled':''} onclick="${onpick}(${i})">${esc(x.text)}</button>`;
    }).join('');
  }
  window.aprovaShuffledChoices=shuffled;

  function ensurePhone(){
    if(u?.trial?.paid||validPhone())return true;
    u.trial=u.trial||{};u.trial.leadCaptured=false;save();
    if(typeof window.requireTrialLeadCapture==='function')window.requireTrialLeadCapture('start',0);
    return false;
  }

  window.openFastTrialOffer=function(){
    if(u?.trial?.paid)return false;
    if(!ensurePhone())return false;
    u.trial=u.trial||{};
    const first=!u.trial.firstStageCompleted;u.trial.firstStageCompleted=true;save();
    if(first){
      try{window.aprovaTrackCustom?.('FreeStageComplete',{content_name:'Aprova - teste rápido concluído'});}catch(e){}
      try{window.aprovaAnalytics?.('free_stage_complete',{...(typeof analyticsLeadIdentity==='function'?analyticsLeadIdentity():{}),track:u.profile?.track||'',target:u.profile?.target||'',fast_trial:true});}catch(e){}
    }
    try{window.aprovaAnalytics?.('paywall_view',{...(typeof analyticsLeadIdentity==='function'?analyticsLeadIdentity():{}),placement:'after_fast_trial'});}catch(e){}
    const fb=document.getElementById('trialFeedbackBlock'),opts=document.getElementById('checkoutOptions'),pw=document.getElementById('paywall');
    if(fb)fb.hidden=true;if(opts)opts.hidden=false;if(pw)pw.hidden=false;document.body.classList.add('modal-open');
    return true;
  };

  const baseContestStageHtml=window.contestStageHtml;
  const baseContestNav=window.contestNav;
  const baseContestCanNext=window.contestCanNext;
  const baseSetContestStage=window.setContestStage;

  window.setContestStage=function(s){
    if(u?.trial?.paid)return baseSetContestStage?.apply(this,arguments);
    if(!ensurePhone())return;
    const d=contestState();s=Math.max(0,Math.min(2,Number(s)||0));d.masterStage=s;aesave();renderMasterAll();window.scrollTo({top:0,behavior:'smooth'});
  };
  window.contestCanNext=function(){
    if(u?.trial?.paid)return baseContestCanNext?.apply(this,arguments);
    const d=contestState();if(d.masterStage===0)return true;if(d.masterStage===1)return d.masterAnswers?.[0]!==undefined;return false;
  };
  window.contestNav=function(){
    if(u?.trial?.paid)return baseContestNav?.apply(this,arguments);
    const d=contestState(),s=Number(d.masterStage)||0;
    if(s>=2)return '';
    return `<div class="master-nav"><button class="btn secondary" ${s<=0?'disabled':''} onclick="setContestStage(${s-1})">← Voltar</button><span>${s+1}/3</span><button class="btn good" ${window.contestCanNext()?'':'disabled'} onclick="setContestStage(${s+1})">${s===0?'Experimentar uma questão →':'Ver meu resumo →'}</button></div>`;
  };
  window.contestStageHtml=function(){
    const d=contestState(),sub=currentSubject(),s=Number(d.masterStage)||0;
    if(u?.trial?.paid){
      if((s===2||s===4)&&sub?.questions?.[s===2?0:1]){
        const qi=s===2?0:1,q=sub.questions[qi],sel=d.masterAnswers?.[qi],r=d.masterResults?.[qi];
        return `<div class="do-now">${s===2?'ETAPA 3':'ETAPA 5'} • TREINO DO EDITAL • QUESTÃO ${qi+1}</div><h2>${esc(q.q)}</h2><div class="choice-grid">${authoredChoices(q,sel,r,`masterAnswer.bind(null,${qi})`,'paid-'+qi).replace(/onclick="masterAnswer\.bind\(null,(\d+)\)\((\d+)\)"/g,'onclick="masterAnswer($1,$2)"')}</div>${r&&typeof buildQuestionFeedback==='function'?buildQuestionFeedback(sub,qi,r.ok,true):'<p class="muted center">Toque em uma alternativa para receber a correção na hora.</p>'}${r&&typeof reinforcementBlock==='function'?reinforcementBlock(qi):''}`;
      }
      return baseContestStageHtml?.apply(this,arguments)||'';
    }
    if(s===0){
      if(d.index===0&&!d.startChosen)return `<div class="do-now">TESTE GRÁTIS • ESCOLHA SUA MATÉRIA</div><h2>Veja como o Aprova ensina em poucos minutos</h2><p class="muted center">Escolha uma matéria. O teste tem só 3 passos: uma explicação curta, uma questão e o resumo final com áudio e mapa mental em PDF.</p>${startSubjectChooser()}`;
      return `${typeof examStructureCard==='function'?examStructureCard():''}<div class="do-now">1 DE 3 • ENTENDA RÁPIDO</div><h2>${sub.icon||'📘'} ${esc(sub.name)}</h2><div class="master-lesson"><div class="sticker">💡</div><div><b>Em linguagem simples</b><p>${esc(sub.summary)}</p></div></div><div class="master-finish-actions"><button class="text-btn" onclick="openFastTrialOffer()">Já quero ver os planos →</button></div>`;
    }
    if(s===1){
      const q=sub.questions[0],sel=d.masterAnswers?.[0],r=d.masterResults?.[0];
      return `<div class="do-now">2 DE 3 • UMA QUESTÃO PARA SENTIR O MÉTODO</div><h2>${esc(q.q)}</h2><div class="choice-grid">${shuffled(q,'free-0').map(x=>{const i=x.original,cls=r?(i===q.ok?'choice-correct':sel===i?'choice-wrong':'choice-locked'):(sel===i?'selected':'');return `<button class="choice ${cls}" ${r?'disabled':''} onclick="masterAnswer(0,${i})">${esc(x.text)}</button>`;}).join('')}</div>${r&&typeof buildQuestionFeedback==='function'?buildQuestionFeedback(sub,0,r.ok,false):'<p class="muted center">Marque uma alternativa. A correção aparece na hora.</p>'}${r?'<div class="callout"><b>Pronto.</b> No plano completo o estudo continua com todas as matérias, questões, revisões e simulados normalmente.</div>':''}`;
    }
    return `<div class="donehero"><div class="checkbig">✓</div><h2>Você já viu como o Aprova funciona</h2><p>Leve o resumo com você e continue sem perder tempo.</p>${typeof contestMap==='function'?contestMap(sub):''}<div class="master-finish-actions"><button class="btn secondary" onclick="speakStudySummary()">🎧 Ouvir resumo</button><button class="btn secondary" onclick="generateUniversalPDF()">🎨 Mapa mental em PDF</button><button class="btn good" onclick="openFastTrialOffer()">Ver planos e continuar →</button></div><p class="muted center">Depois do pagamento, o estudo volta ao modo completo, com todas as etapas e recursos.</p></div>`;
  };

  const baseOabStageHtml=window.oabStageHtml;
  const baseOabNav=window.oabNav;
  const baseSetOabStage=window.setOabStage;
  window.setOabStage=function(s){
    if(u?.trial?.paid)return baseSetOabStage?.apply(this,arguments);
    if(!ensurePhone())return;
    mastery.oab.stage=Math.max(0,Math.min(2,Number(s)||0));msave();renderMasterAll();window.scrollTo({top:0,behavior:'smooth'});
  };
  window.oabNav=function(){
    if(u?.trial?.paid)return baseOabNav?.apply(this,arguments);
    const s=Number(mastery.oab.stage)||0;if(s>=2)return '';
    return `<div class="master-nav"><button class="btn secondary" ${s<=0?'disabled':''} onclick="setOabStage(${s-1})">← Voltar</button><span>${s+1}/3</span><button class="btn good" onclick="setOabStage(${s+1})">${s===0?'Ver exemplo prático →':'Ver resumo final →'}</button></div>`;
  };
  window.oabStageHtml=function(){
    if(u?.trial?.paid)return baseOabStageHtml?.apply(this,arguments)||'';
    const m=oabCurrent(),s=Number(mastery.oab.stage)||0;
    if(s===0)return `<div class="do-now">1 DE 3 • OAB EM POUCOS MINUTOS</div><h2>${esc(m.title)}</h2><div class="master-lesson"><div class="sticker">🧠</div><div><b>Entenda em uma frase</b><p>${esc(m.hook)}</p></div></div>${oabMap(m)}<div class="master-finish-actions"><button class="text-btn" onclick="openFastTrialOffer()">Já quero ver os planos →</button></div>`;
    if(s===1){const q=m.qa?.[0]||['Qual é o ponto central deste tema?',m.hook];return `<div class="do-now">2 DE 3 • EXEMPLO PRÁTICO</div><h2>${esc(q[0])}</h2><div class="qa-answer"><b>Resposta-modelo:</b><p>${esc(q[1])}</p></div><div class="callout"><b>Assim funciona no plano completo:</b> peça, fundamento, questões, correção e revisão ficam organizados em sequência.</div>`;}
    return `<div class="donehero"><div class="checkbig">✓</div><h2>Teste concluído</h2><p>Você já viu o método sem precisar atravessar nove telas.</p>${oabMap(m)}<div class="master-finish-actions"><button class="btn secondary" onclick="speakStudySummary()">🎧 Ouvir resumo</button><button class="btn secondary" onclick="generateUniversalPDF()">🎨 Mapa mental em PDF</button><button class="btn good" onclick="openFastTrialOffer()">Ver planos e continuar →</button></div><p class="muted center">Após o pagamento, o estudo completo da OAB volta ao fluxo normal.</p></div>`;
  };

  // Qualquer teste gratuito que tente renderizar conteúdo sem telefone volta ao gate.
  const baseRenderMasterAll=window.renderMasterAll;
  if(typeof baseRenderMasterAll==='function')window.renderMasterAll=function(){
    if(!u?.trial?.paid&&u?.trial?.startedAt&&!validPhone())setTimeout(()=>ensurePhone(),0);
    return baseRenderMasterAll.apply(this,arguments);
  };
})();
