let aprovaCatalog={items:[],sources:[],loaded:false};
async function loadAprovaCatalog(){
 try{
  const [c,s]=await Promise.all([fetch('data/catalog.json?ts='+Date.now()),fetch('data/sources.json?ts='+Date.now())]);
  const cj=await c.json(),sj=await s.json(); aprovaCatalog.items=cj.items||[]; aprovaCatalog.sources=sj.sources||[]; aprovaCatalog.loaded=true;
  enrichTargetList(); if(typeof syncOfficialExamDate==='function'&&syncOfficialExamDate())uRenderAll(); renderCatalog();
 }catch(e){console.warn('Catálogo indisponível',e); renderCatalog(true);}
}

function isUpcomingCatalogItem(x){
 const today=new Date(); today.setHours(0,0,0,0);
 const status=norm(x.status||'');
 if(status.includes('historico')||status.includes('realizada')||status.includes('encerrado')) return false;
 if(x.exam_date){
   const d=new Date(x.exam_date+'T00:00:00');
   if(!Number.isNaN(d.getTime()) && d < today) return false;
   return true;
 }
 // Sem data: só mantém certames atuais/2026+ ou explicitamente abertos/publicados.
 const blob=norm([x.id,x.title,x.source_url].join(' '));
 const oldOnly=/(?:^|[^0-9])(2022|2023|2024|2025)(?:[^0-9]|$)/.test(blob) && !/(?:^|[^0-9])(2026|2027)(?:[^0-9]|$)/.test(blob);
 if(oldOnly) return false;
 if(/(?:^|[^0-9])(2026|2027)(?:[^0-9]|$)/.test(blob)) return true;
 if(/inscricoes abertas|edital publicado|calendario publicado|previsto|iminente/.test(status)) return true;
 return false;
}
function publicCatalogItems(){return aprovaCatalog.items.filter(isUpcomingCatalogItem);}
function norm(s){return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function enrichTargetList(){const dl=document.getElementById('popularTargets'); if(!dl)return; const existing=new Set([...dl.options].map(o=>o.value)); publicCatalogItems().slice(0,150).forEach(x=>{if(!existing.has(x.title)){const o=document.createElement('option');o.value=x.title;dl.appendChild(o);}});}
function selectCatalogItem(id){const x=aprovaCatalog.items.find(i=>i.id===id);if(!x)return; u.profile=u.profile||{};u.profile.target=x.title;u.profile.banca=x.banca;u.profile.catalogId=x.id;if(x.exam_date){u.profile.examDate=x.exam_date;universalExam=new Date(x.exam_date+'T13:00:00-03:00');}usave();uRenderAll();document.querySelector('[data-tab="hoje"]')?.click();}
function renderCatalog(failed=false){const el=document.getElementById('catalogo');if(!el)return;if(failed){el.innerHTML='<div class="card"><h2>Catálogo</h2><p>Não foi possível carregar o catálogo agora. Tente novamente em instantes.</p></div>';return;}
 const visible=publicCatalogItems();const bancas=[...new Set(visible.map(x=>x.banca))].sort();
 el.innerHTML=`<div class="card"><div class="catalog-head"><div><h2>Catálogo de provas e concursos</h2><p class="muted">Pesquise por órgão, cargo, prova ou banca. A plataforma usa a fonte oficial para manter o alvo organizado.</p></div><div class="kpi">${visible.length}<small>provas futuras/ativas</small></div></div><div class="catalog-tools"><input id="catalogSearch" type="search" placeholder="Ex.: Polícia Civil, DATAPREV, FGV, TRT..." oninput="filterCatalog()"><select id="catalogBanca" onchange="filterCatalog()"><option value="">Todas as bancas</option>${bancas.map(b=>`<option>${b}</option>`).join('')}</select></div><div class="source-strip">${aprovaCatalog.sources.length} fontes oficiais cadastradas • atualização automática ativa nas fontes compatíveis</div><div id="catalogList"></div></div>`;filterCatalog();}
function filterCatalog(){const q=norm(document.getElementById('catalogSearch')?.value),b=document.getElementById('catalogBanca')?.value||'';const list=publicCatalogItems().filter(x=>(!b||x.banca===b)&&(!q||norm([x.title,x.banca,x.status,...(x.tags||[])].join(' ')).includes(q))).slice(0,100);const el=document.getElementById('catalogList');if(!el)return;el.innerHTML=list.length?list.map(x=>{const dateLabel=x.exam_date?`Prova: ${new Date(x.exam_date+'T12:00:00').toLocaleDateString('pt-BR')}`:'Data da prova: aguardando publicação oficial';return `<article class="catalog-card"><div><span class="pill">${x.banca}</span><h3>${x.title}</h3><p class="muted">${dateLabel} • ${x.status}</p></div><div class="catalog-actions"><button class="btn good" onclick="selectCatalogItem('${x.id}')">Estudar este</button><a class="btn secondary linkbtn" href="${x.source_url}" target="_blank" rel="noopener">Fonte oficial ↗</a></div></article>`}).join(''):'<p class="muted">Nenhuma prova futura validada encontrada com esse filtro.</p>';}
loadAprovaCatalog();
