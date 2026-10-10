let aprovaCatalog={items:[],sources:[],loaded:false};
const DETAILED_PUBLIC_COURSE_IDS=new Set([
 'fgv-2e84885794',
 'fgv-c78302f30e',
 'pcba-2026-investigador',
 'pcba-2026-escrivao'
]);
function loadAprovaScript(src){
 return new Promise((resolve,reject)=>{
  const found=[...document.scripts].find(s=>s.src&&s.src.includes(src.split('?')[0]));
  if(found){if(found.dataset.aprovaLoaded==='1')return resolve();found.addEventListener('load',resolve,{once:true});found.addEventListener('error',reject,{once:true});return;}
  const s=document.createElement('script');s.src=src;s.async=false;s.addEventListener('load',()=>{s.dataset.aprovaLoaded='1';resolve();},{once:true});s.addEventListener('error',reject,{once:true});document.head.appendChild(s);
 });
}
async function loadAprovaCatalog(){
 try{
  await loadAprovaScript('validated_course_data.js?v=2');
  if(window.APROVA_VALIDATED_COURSE_IDS)window.APROVA_VALIDATED_COURSE_IDS.forEach(id=>DETAILED_PUBLIC_COURSE_IDS.add(id));
  const [c,s]=await Promise.all([fetch('data/catalog.json?ts='+Date.now()),fetch('data/sources.json?ts='+Date.now())]);
  const cj=await c.json(),sj=await s.json(),curated=Array.isArray(window.APROVA_CURATED_COURSES)?window.APROVA_CURATED_COURSES:[],curatedIds=new Set(curated.map(x=>x.id));
  aprovaCatalog.items=[...curated,...(cj.items||[]).filter(x=>!curatedIds.has(x.id))];aprovaCatalog.sources=sj.sources||[];aprovaCatalog.loaded=true;
  enrichTargetList(); if(typeof populateTrialCourseOptions==='function')populateTrialCourseOptions(); if(typeof syncOfficialExamDate==='function'&&syncOfficialExamDate())uRenderAll(); renderCatalog();
 }catch(e){console.warn('Catálogo indisponível',e); renderCatalog(true);}
}

function isUpcomingCatalogItem(x){
 if(x.public_hidden) return false;
 // Fail-closed: o robô pode descobrir novos editais, mas eles só aparecem ao aluno depois de cargo, matérias e estrutura serem validados no Aprova.
 if(!DETAILED_PUBLIC_COURSE_IDS.has(x.id)) return false;
 // Cursos curados adicionais só entram quando o motor de cargos/disciplinas já terminou de carregar.
 if(window.APROVA_VALIDATED_COURSE_IDS?.has(x.id)&&!window.APROVA_VALIDATED_ENGINE_READY)return false;
 if(['aocp-saebba26','pcba-2026-inv-esc','fgv-37a4b75e30','fgv-cpnu2','fgv-pcpr26','fgv-seplagrj26','fgv-tjap-juiz26','fgv-ebserh26','aocp-sadpe-educ26','quad-sedesdf26','fgv-tjpe-juiz26'].includes(x.id)) return false;
 const today=new Date(); today.setHours(0,0,0,0);
 const status=norm(x.status||'');
 if(/historico|realizada|encerrado|finalizado|homologado|prova realizada/.test(status)) return false;
 // Regra principal: havendo data oficial da prova, qualquer prova anterior a hoje sai do catálogo público.
 if(x.exam_date){
   const d=new Date(x.exam_date+'T00:00:00');
   if(Number.isNaN(d.getTime())) return false;
   return d>=today;
 }
 // Sem data de prova, só permanece se estiver explicitamente ativo e tiver sido visto recentemente.
 const blob=norm([x.id,x.title,x.source_url].join(' '));
 const hasCurrentYear=/(?:^|[^0-9])(2026|2027)(?:[^0-9]|$)/.test(blob)||/(?:^|[-_])(26|27)(?:$|[-_])/.test(norm(x.id||''));
 const oldOnly=/(?:^|[^0-9])(2022|2023|2024|2025)(?:[^0-9]|$)/.test(blob) && !hasCurrentYear;
 const legacyId=/(?:^|[-_])(22|23|24|25)(?:$|[-_])/.test(norm(x.id||''))&&!hasCurrentYear;
 const legacySourceSlug=/(?:[a-z._-])(22|23|24|25)$/.test(norm(String(x.source_url||'').replace(/\/$/,'')))&&!hasCurrentYear;
 if(oldOnly||legacyId||legacySourceSlug) return false;
 const active=/inscricoes abertas|edital publicado|calendario publicado|previsto|iminente|em andamento/.test(status);
 if(!active) return false;
 if(x.last_seen){
   const seen=new Date(x.last_seen+'T00:00:00');
   if(!Number.isNaN(seen.getTime())){
     const ageDays=(today-seen)/86400000;
     if(ageDays>45) return false;
   }
 }
 return true;
}
function publicCatalogItems(){
 const filtered=aprovaCatalog.items.filter(isUpcomingCatalogItem),specificSource=new Map(),out=[];
 for(const x of filtered){
  const src=String(x.source_url||'').replace(/\/$/,'');
  const canDedupe=/\/concursos\/[^/?#]+$/i.test(src);
  if(canDedupe&&specificSource.has(src)){
   const i=specificSource.get(src),prev=out[i];
   const prevScore=(prev.exam_date?50:0)+(String(prev.title||'').length)+(prev.id?.match(/(?:26|27)$/)?5:0);
   const curScore=(x.exam_date?50:0)+(String(x.title||'').length)+(x.id?.match(/(?:26|27)$/)?5:0);
   if(curScore>prevScore)out[i]=x;
  }else{if(canDedupe)specificSource.set(src,out.length);out.push(x);}
 }
 return out.sort((a,b)=>{
  const da=a.exam_date?new Date(a.exam_date+'T00:00:00').getTime():Number.MAX_SAFE_INTEGER;
  const db=b.exam_date?new Date(b.exam_date+'T00:00:00').getTime():Number.MAX_SAFE_INTEGER;
  return da-db||String(a.title||'').localeCompare(String(b.title||''),'pt-BR');
 });
}
function norm(s){return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function enrichTargetList(){const dl=document.getElementById('popularTargets'); if(!dl)return; const existing=new Set([...dl.options].map(o=>o.value)); publicCatalogItems().slice(0,150).forEach(x=>{if(!existing.has(x.title)){const o=document.createElement('option');o.value=x.title;dl.appendChild(o);}});}
function selectCatalogItem(id){const x=aprovaCatalog.items.find(i=>i.id===id);if(!x||!isUpcomingCatalogItem(x))return; u.profile=u.profile||{};u.profile.target=x.title;u.profile.banca=x.banca;u.profile.catalogId=x.id;if(x.exam_date){u.profile.examDate=x.exam_date;universalExam=new Date(x.exam_date+'T13:00:00-03:00');}usave();uRenderAll();document.querySelector('[data-tab="hoje"]')?.click();}
function renderCatalog(failed=false){const el=document.getElementById('catalogo');if(!el)return;if(failed){el.innerHTML='<div class="card"><h2>Catálogo</h2><p>Não foi possível carregar o catálogo agora. Tente novamente em instantes.</p></div>';return;}
 const visible=publicCatalogItems();const bancas=[...new Set(visible.map(x=>x.banca))].sort();
 el.innerHTML=`<div class="card"><div class="catalog-head"><div><h2>Catálogo de provas e concursos</h2><p class="muted">Pesquise por órgão, cargo, prova ou banca. Só liberamos cursos cuja estrutura já foi validada no edital.</p></div><div class="kpi">${visible.length}<small>cursos validados</small></div></div><div class="catalog-tools"><input id="catalogSearch" type="search" placeholder="Ex.: Polícia Civil, Guarda Municipal..." oninput="filterCatalog()"><select id="catalogBanca" onchange="filterCatalog()"><option value="">Todas as bancas</option>${bancas.map(b=>`<option>${b}</option>`).join('')}</select></div><div class="source-strip">${aprovaCatalog.sources.length} fontes oficiais monitoradas • novos concursos ficam ocultos até validarmos cargo, matérias e estrutura</div><div id="catalogList"></div></div>`;filterCatalog();}
function filterCatalog(){const q=norm(document.getElementById('catalogSearch')?.value),b=document.getElementById('catalogBanca')?.value||'';const list=publicCatalogItems().filter(x=>(!b||x.banca===b)&&(!q||norm([x.title,x.banca,x.status,...(x.tags||[])].join(' ')).includes(q))).slice(0,100);const el=document.getElementById('catalogList');if(!el)return;el.innerHTML=list.length?list.map(x=>{const dateLabel=x.exam_date?`Prova: ${new Date(x.exam_date+'T12:00:00').toLocaleDateString('pt-BR')}`:'Data da prova: aguardando publicação oficial';return `<article class="catalog-card"><div><span class="pill">${x.banca}</span><h3>${x.title}</h3><p class="muted">${dateLabel} • ${x.status}</p></div><div class="catalog-actions"><button class="btn good" onclick="selectCatalogItem('${x.id}')">Estudar este</button><a class="btn secondary linkbtn" href="${x.source_url}" target="_blank" rel="noopener">Fonte oficial ↗</a></div></article>`}).join(''):'<p class="muted">Nenhum curso já validado encontrado com esse filtro.</p>';}
async function bootValidatedCourseEngine(){
 try{
  await loadAprovaScript('validated_course_engine.js?v=3');window.APROVA_VALIDATED_ENGINE_READY=true;
  await loadAprovaScript('exam_guard.js?v=2');
  if(typeof populateTrialCourseOptions==='function')populateTrialCourseOptions();
  if(aprovaCatalog.loaded){enrichTargetList();renderCatalog();}
 }catch(e){console.warn('Perfis adicionais validados não puderam ser carregados',e);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootValidatedCourseEngine,{once:true});else bootValidatedCourseEngine();
loadAprovaCatalog();
