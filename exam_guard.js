/* Trava de compatibilidade entre o formato do edital atual e questões históricas oficiais. */
(function(){
 try{
  if(typeof OFFICIAL_BANK_QUESTIONS!=='undefined'){
   if(OFFICIAL_BANK_QUESTIONS.fgv)OFFICIAL_BANK_QUESTIONS.fgv.format='abcde';
   if(OFFICIAL_BANK_QUESTIONS.aocp)OFFICIAL_BANK_QUESTIONS.aocp.format='abcde';
   if(OFFICIAL_BANK_QUESTIONS.cebraspe)OFFICIAL_BANK_QUESTIONS.cebraspe.format='ce';
   if(OFFICIAL_BANK_QUESTIONS.idecan)OFFICIAL_BANK_QUESTIONS.idecan.format='abcde';
   if(OFFICIAL_BANK_QUESTIONS.vunesp)OFFICIAL_BANK_QUESTIONS.vunesp.format='abcde';
  }
  if(typeof OFFICIAL_COURSE_QUESTIONS!=='undefined'&&OFFICIAL_COURSE_QUESTIONS['oab-48'])OFFICIAL_COURSE_QUESTIONS['oab-48'].format='abcd';
  if(typeof officialBankQuestion==='function'){
   const originalOfficialBankQuestion=officialBankQuestion;
   officialBankQuestion=function(){
    const q=originalOfficialBankQuestion();
    if(!q)return q;
    const courseFormat=u?.profile?.questionFormat||'';
    if(courseFormat&&q.format&&courseFormat!==q.format)return null;
    return q;
   };
  }
  const ui=document.createElement('script');ui.src='validated_course_ui.js?v=2';ui.async=false;
  ui.addEventListener('load',()=>{
   const patch=document.createElement('script');patch.src='trial_lead_patch.js?v=2';patch.async=false;
   patch.addEventListener('load',()=>{
    const guard=document.createElement('script');guard.src='trial_quality_guard.js?v=1';guard.async=false;document.head.appendChild(guard);
   },{once:true});
   document.head.appendChild(patch);
  },{once:true});
  document.head.appendChild(ui);
 }catch(e){console.warn('Trava de formato de questão indisponível',e);}
})();
