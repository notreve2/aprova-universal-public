/* Aprova — proteção do fluxo gratuito + qualidade das questões de reforço. */
(function(){
 const VERSION='2026-10-11.5';
 function h(s){let x=2166136261;s=String(s||'');for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,16777619);}return x>>>0;}
 function fmt(){try{return typeof courseQuestionFormat==='function'?courseQuestionFormat():(u?.profile?.questionFormat||'');}catch(e){return'';}}
 function explain(q,correct){const old=String(q?.why||'').trim();if(old.length>=35)return old;return `${old?old+' ':''}A alternativa correta é “${correct}”. Compare a regra com cada opção: as demais alteram um requisito, uma consequência ou um conceito essencial do conteúdo cobrado.`;}
 function formatQuestion(q,seed){
   if(!q)return q;const f=fmt(),base={...q,choices:[...(q.choices||[])]},ok=Math.max(0,Math.min(Number(q.ok)||0,(q.choices||[]).length-1)),correct=(q.choices||[])[ok];
   if(f==='ce'){
     const wrong=(q.choices||[]).find((_,i)=>i!==ok),makeFalse=(h(seed+'|ce')%2)===1&&wrong!==undefined,shown=makeFalse?wrong:correct;
     return {...base,q:`Julgue o item: ${String(q.q||'').replace(/[?:\s]+$/,'')} — ${String(shown||'').replace(/^./,c=>c.toLowerCase())}.`,choices:['Certo','Errado'],ok:makeFalse?1:0,why:(makeFalse?'Errado. ':'Certo. ')+explain(q,correct),authorial:true};
   }
   const count=f==='abcde'?5:4,wrong=(q.choices||[]).filter((_,i)=>i!==ok);
   const fillers=['Nenhuma das alternativas corresponde integralmente à regra aplicável.','A conclusão independe dos requisitos previstos na norma.','A regra não admite qualquer condição ou exceção.'];
   while(wrong.length<count-1){const v=fillers[wrong.length%fillers.length];if(!wrong.includes(v)&&v!==correct)wrong.push(v);else wrong.push(`Alternativa incompatível com a regra ${wrong.length+1}.`);}
   const pos=h(seed+'|multi')%count,out=wrong.slice(0,count-1);out.splice(pos,0,correct);
   return {...base,choices:out,ok:pos,why:explain(q,correct),authorial:true};
 }
 function flowNow(){try{return u?.trial?.pendingLeadFlow||'contest'}catch(e){return'contest'}}
 function resetLeadOverlay(){try{const g=document.getElementById('leadGate');if(g)g.hidden=true;document.body?.classList.remove('aprova-lead-authorized');if(u?.trial){delete u.trial.pendingLeadFlow;delete u.trial.pendingLeadStage;}}catch(e){}}
 function completedThree(flow){
   try{
     if(flow==='contest')return Number(contestState()?.masterStage||0)>=2;
     if(flow==='oab')return Number(mastery?.oab?.stage||0)>=2;
     if(flow==='oab-iframe')return true;
     const d=ensureDay(),idx=typeof engineStageIndex==='function'?engineStageIndex(d.stage||0):0;return idx>=2;
   }catch(e){return false;}
 }
 function gateAuthorized(){try{return completedThree(flowNow())}catch(e){return false}}
 function installLeadGuard(){
   if(!document.getElementById('aprovaLeadGuardStyle')){const st=document.createElement('style');st.id='aprovaLeadGuardStyle';st.textContent='#leadGate{display:none!important}body.aprova-lead-authorized #leadGate:not([hidden]){display:grid!important}';document.head.appendChild(st);}
   const gate=document.getElementById('leadGate');if(!gate||gate.dataset.guardInstalled==='1')return;gate.dataset.guardInstalled='1';
   const guard=()=>{if(!gate.hidden&&!gateAuthorized()){gate.hidden=true;document.body?.classList.remove('aprova-lead-authorized');}else if(!gate.hidden&&gateAuthorized())document.body?.classList.add('aprova-lead-authorized');};
   new MutationObserver(guard).observe(gate,{attributes:true,attributeFilter:['hidden']});guard();
 }
 function updateAuthorizedLeadCopy(){
   const gate=document.getElementById('leadGate');if(!gate)return;
   const badge=gate.querySelector('.trial-badge'),h2=gate.querySelector('h2'),p=gate.querySelector('p'),btn=gate.querySelector('.btn'),back=gate.querySelector('.text-btn'),small=gate.querySelector('small');
   if(badge)badge.textContent='3 ETAPAS CONCLUÍDAS';
   if(h2)h2.textContent='Salve seu progresso e continue';
   if(p)p.textContent='Informe seu WhatsApp para salvar o progresso destas 3 etapas e continuar o teste até o resumo final, áudio e PDF.';
   if(btn)btn.textContent='Salvar e continuar o teste →';
   if(back)back.textContent='← Voltar ao teste';
   if(small)small.textContent='Sem cobrança. O número identifica seu progresso. Mensagens de novidades e ofertas só serão enviadas se você marcar a autorização acima.';
 }
 function addConsent(){
   const box=document.querySelector('#leadGate .lead-gate-modal');if(!box||document.getElementById('leadMarketingConsent'))return;
   const small=box.querySelector('small');const label=document.createElement('label');label.className='lead-consent';label.style.cssText='display:flex;gap:10px;align-items:flex-start;text-align:left;margin:12px 0;font-size:13px;line-height:1.35';
   label.innerHTML='<input id="leadMarketingConsent" type="checkbox" style="width:auto;margin-top:2px"><span>Quero receber no WhatsApp lembretes de estudo, novidades e ofertas do Aprova. <b>Opcional.</b></span>';
   if(small)box.insertBefore(label,small);else box.appendChild(label);
 }
 function loadQaSuite(){
   if(new URLSearchParams(location.search).get('qa_suite')!=='1')return;
   if([...document.scripts].some(s=>s.src&&s.src.includes('qa_suite.js')))return;
   const s=document.createElement('script');s.src='qa_suite.js?v=20261011-1';s.async=false;document.head.appendChild(s);
 }
 function boot(){
   if(typeof window.requireTrialLeadCapture!=='function'||typeof window.captureTrialLead!=='function'||typeof u==='undefined'){setTimeout(boot,120);return;}
   if(window.__APROVA_EXPERIENCE_QUALITY===VERSION){installLeadGuard();loadQaSuite();return;}
   window.__APROVA_EXPERIENCE_QUALITY=VERSION;
   const baseRequire=window.requireTrialLeadCapture;
   window.requireTrialLeadCapture=function(flow,nextStage){
     if(u.trial?.paid||u.trial?.leadCaptured)return false;
     if(!completedThree(flow||'contest')){resetLeadOverlay();return false;}
     updateAuthorizedLeadCopy();
     document.body?.classList.add('aprova-lead-authorized');
     return baseRequire.apply(this,arguments);
   };
   const baseCapture=window.captureTrialLead;
   window.captureTrialLead=function(){
     const consent=!!document.getElementById('leadMarketingConsent')?.checked;
     const r=baseCapture.apply(this,arguments);
     try{u.profile={...(u.profile||{}),marketingConsent:consent};usave();}catch(e){}
     document.body?.classList.remove('aprova-lead-authorized');
     return r;
   };
   const close=window.closeTrialLead;if(typeof close==='function')window.closeTrialLead=function(){const r=close.apply(this,arguments);document.body?.classList.remove('aprova-lead-authorized');return r;};
   if(typeof reinforcementQuestions==='function'&&typeof REINFORCEMENT_BANK!=='undefined'){
     reinforcementQuestions=function(k,group){const arr=REINFORCEMENT_BANK[k]||[];return arr.slice(group*2,group*2+2).map((q,i)=>formatQuestion(q,`${k}|${group}|${i}|${q.q}`));};
     try{window.reinforcementQuestions=reinforcementQuestions;}catch(e){}
   }
   const start=window.startFreeTrial;if(typeof start==='function')window.startFreeTrial=function(){resetLeadOverlay();return start.apply(this,arguments);};
   const role=window.selectTrialRole;if(typeof role==='function')window.selectTrialRole=function(){resetLeadOverlay();return role.apply(this,arguments);};
   addConsent();installLeadGuard();loadQaSuite();
   try{if(typeof renderMasterAll==='function')renderMasterAll();}catch(e){}
 }
 boot();
 document.addEventListener('DOMContentLoaded',()=>{addConsent();installLeadGuard();loadQaSuite();},{once:true});
})();
