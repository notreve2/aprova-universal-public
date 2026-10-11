/* Aprova — quality gate das questões e do teste gratuito.
   Mantém questão oficial separada de treino autoral, respeita o formato da prova
   e evita padrão previsível de gabarito. */
(function(){
  const QUALITY_VERSION='2026-10-11.2';
  let installed=false;

  function hash(s){
    let h=2166136261;
    s=String(s||'');
    for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function stripEnd(s){return String(s||'').replace(/[?:\s]+$/,'').trim();}
  function originalQuestion(q){
    if(!q)return null;
    if(!q.__aprovaBase){
      Object.defineProperty(q,'__aprovaBase',{value:{q:q.q,choices:[...(q.choices||[])],ok:Number(q.ok)||0,why:q.why||''},enumerable:false,writable:true,configurable:true});
    }
    return q.__aprovaBase;
  }
  function safeExplanation(sub,q,correctText){
    const existing=String(q?.why||'').trim();
    if(existing.length>=35&&!/alinhado ao tópico do edital|delimitado pelo conteúdo/i.test(existing))return existing;
    const anchors=(sub?.keywords||[]).slice(0,3).join(', ');
    const base=existing?existing.replace(/\s+/g,' '):`A regra correta é: ${correctText}.`;
    return `${base} O ponto decisivo é reconhecer a regra de ${sub?.name||'conteúdo'}${anchors?` ligada a ${anchors}`:''}; as demais opções alteram ou afastam um elemento essencial da regra cobrada.`;
  }
  function arrangeMultiple(sub,q,index,count){
    const b=originalQuestion(q)||{q:'',choices:[],ok:0,why:''};
    let choices=[...b.choices],correctIndex=Math.max(0,Math.min(Number(b.ok)||0,choices.length-1));
    const correct=choices[correctIndex];
    const wrong=choices.filter((_,i)=>i!==correctIndex);
    while(wrong.length<count-1){
      const fillers=[
        'Nenhuma das alternativas anteriores corresponde à regra aplicável.',
        'A conclusão depende exclusivamente de ato discricionário, independentemente da norma.',
        'A regra apresentada não possui exceções nem requisitos.'
      ];
      const candidate=fillers[wrong.length%(fillers.length)];
      if(!wrong.includes(candidate)&&candidate!==correct)wrong.push(candidate);else wrong.push(`Alternativa incompatível com a regra jurídica ${wrong.length+1}.`);
    }
    const seed=hash(`${sub?.name}|${b.q}|${index}|${count}`);
    // Distribui A/B/C/D/E. A pode ser correta em alguns itens, mas nunca em todos.
    const target=seed%count;
    const out=wrong.slice(0,count-1);
    out.splice(target,0,correct);
    return {
      ...q,
      q:b.q,
      choices:out,
      ok:target,
      why:safeExplanation(sub,{...q,why:b.why},correct),
      authorial:true,
      authorialLabel:'Treino autoral no estilo da banca'
    };
  }
  function arrangeCE(sub,q,index){
    const b=originalQuestion(q)||{q:'',choices:[],ok:0,why:''};
    const choices=[...b.choices],correctIndex=Math.max(0,Math.min(Number(b.ok)||0,choices.length-1));
    const correct=choices[correctIndex];
    const wrongIndex=choices.findIndex((_,i)=>i!==correctIndex);
    const makeFalse=(hash(`${sub?.name}|${b.q}|${index}|ce`)%2)===1 && wrongIndex>=0;
    const shown=makeFalse?choices[wrongIndex]:correct;
    const statement=`Julgue o item: ${stripEnd(b.q)} — ${String(shown||'').replace(/^./,c=>c.toLowerCase())}.`;
    const explanation=safeExplanation(sub,{...q,why:b.why},correct);
    return {
      ...q,
      q:statement,
      choices:['Certo','Errado'],
      ok:makeFalse?1:0,
      why:makeFalse?`Errado. ${explanation}`:`Certo. ${explanation}`,
      authorial:true,
      authorialLabel:'Treino autoral • padrão Cebraspe C/E'
    };
  }
  function qualityFormatter(base){
    const fmt=typeof courseQuestionFormat==='function'?courseQuestionFormat():(window.u?.profile?.questionFormat||'');
    const qs=Array.isArray(base?.questions)?base.questions:[];
    if(fmt==='ce')return qs.map((q,i)=>arrangeCE(base,q,i));
    if(fmt==='abcde')return qs.map((q,i)=>arrangeMultiple(base,q,i,5));
    if(fmt==='abcd')return qs.map((q,i)=>arrangeMultiple(base,q,i,4));
    return qs.map((q,i)=>arrangeMultiple(base,q,i,Math.max(4,Math.min(5,q?.choices?.length||4))));
  }

  function installFormatter(){
    if(installed)return true;
    if(typeof SUBJECTS==='undefined'||typeof formattedTrainingQuestions!=='function')return false;
    formattedTrainingQuestions=qualityFormatter;
    try{window.formattedTrainingQuestions=qualityFormatter;}catch(e){}
    installed=true;
    window.APROVA_QUESTION_QUALITY_VERSION=QUALITY_VERSION;
    return true;
  }

  function decorateAuthorial(){
    try{
      document.querySelectorAll('#hoje .do-now').forEach(el=>{
        if(/TREINO DO EDITAL/i.test(el.textContent||'')){
          const banca=window.u?.profile?.banca||'banca';
          el.textContent=(el.textContent||'').replace(/TREINO DO EDITAL/i,`TREINO AUTORAL • ${banca}`);
        }
      });
    }catch(e){}
  }

  function subjectKeysForCurrentCourse(){
    try{return Object.keys(typeof weightsForUser==='function'?weightsForUser():(window.u?.profile?.subjectWeights||{})).filter(k=>SUBJECTS[k]);}catch(e){return [];}
  }

  window.runAprovaQualityAudit=async function(){
    installFormatter();
    const issues=[],warnings=[];
    const keys=subjectKeysForCurrentCourse();
    const format=window.u?.profile?.questionFormat||'';
    if(!keys.length)issues.push('Nenhuma matéria válida foi carregada para o curso selecionado.');
    const correctPositions=[];
    for(const k of keys){
      const sub=typeof subjectView==='function'?subjectView(k):SUBJECTS[k];
      if(!sub){issues.push(`Matéria ausente: ${k}`);continue;}
      if(!Array.isArray(sub.questions)||sub.questions.length<2){issues.push(`${sub.name}: menos de 2 questões autorais.`);continue;}
      sub.questions.forEach((q,i)=>{
        if(!Array.isArray(q.choices)||q.choices.length<2)issues.push(`${sub.name} Q${i+1}: alternativas inválidas.`);
        if(Number(q.ok)<0||Number(q.ok)>=q.choices.length)issues.push(`${sub.name} Q${i+1}: gabarito fora das alternativas.`);
        if(!q.why||String(q.why).trim().length<35)warnings.push(`${sub.name} Q${i+1}: explicação curta.`);
        correctPositions.push(Number(q.ok));
        if(format==='ce'&&q.choices.join('|')!=='Certo|Errado')issues.push(`${sub.name} Q${i+1}: formato diferente de C/E.`);
        if(format==='abcd'&&q.choices.length!==4)issues.push(`${sub.name} Q${i+1}: deveria ter 4 alternativas.`);
        if(format==='abcde'&&q.choices.length!==5)issues.push(`${sub.name} Q${i+1}: deveria ter 5 alternativas.`);
      });
    }
    if(correctPositions.length>3&&correctPositions.every(x=>x===correctPositions[0]))issues.push('O gabarito permanece concentrado na mesma posição.');

    const audioMissing=[];
    for(const k of keys){
      try{
        const res=await fetch(`audio/subjects/${encodeURIComponent(k)}.mp3`,{method:'HEAD',cache:'no-store'});
        if(!res.ok)audioMissing.push(k);
      }catch(e){audioMissing.push(k);}
    }
    if(audioMissing.length)warnings.push(`Áudios não localizados para: ${audioMissing.join(', ')}`);

    const result={version:QUALITY_VERSION,ok:issues.length===0,course:window.u?.profile?.target||'',banca:window.u?.profile?.banca||'',role:window.u?.profile?.role||'',format,subjects:keys.length,questions:correctPositions.length,correctPositions,issues,warnings,audioMissing};
    window.__APROVA_LAST_QUALITY_AUDIT=result;
    try{localStorage.setItem('aprova-last-quality-audit',JSON.stringify({...result,at:new Date().toISOString()}));}catch(e){}
    return result;
  };

  function boot(){
    if(installFormatter()){
      decorateAuthorial();
      try{if(typeof renderMasterAll==='function')renderMasterAll();}catch(e){}
      return;
    }
    setTimeout(boot,120);
  }
  boot();
  const observer=new MutationObserver(()=>decorateAuthorial());
  document.addEventListener('DOMContentLoaded',()=>{try{observer.observe(document.body,{subtree:true,childList:true});}catch(e){}},{once:true});
})();
