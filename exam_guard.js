/* Trava de compatibilidade entre o formato do edital atual e questões históricas oficiais. */
(function(){
 try{
  if(typeof OFFICIAL_BANK_QUESTIONS!=='undefined'&&OFFICIAL_BANK_QUESTIONS.cebraspe)OFFICIAL_BANK_QUESTIONS.cebraspe.format='ce';
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
  const ui=document.createElement('script');ui.src='validated_course_ui.js?v=1';ui.async=false;
  ui.addEventListener('load',()=>{
   const patch=document.createElement('script');patch.src='trial_lead_patch.js?v=1';patch.async=false;document.head.appendChild(patch);
  },{once:true});
  document.head.appendChild(ui);
 }catch(e){console.warn('Trava de formato de questão indisponível',e);}
})();
