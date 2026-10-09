/* Integra cursos validados ao funil sem pular a escolha de cargo. */
(function(){
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
 function currentItems(){try{return typeof publicCatalogItems==='function'?publicCatalogItems():[]}catch(e){return[]}}
 window.populateTrialCourseOptions=function(){
  const dl=document.getElementById('trialCourseOptions'),quick=document.getElementById('courseQuickChoices');if(!dl)return;
  const items=currentItems(),uniq=new Map();items.forEach(x=>{if(x?.title&&!uniq.has(x.id))uniq.set(x.id,x)});const list=[...uniq.values()];
  dl.innerHTML=list.map(x=>`<option value="${esc(x.title)}">${esc(x.banca||'')}</option>`).join('');
  if(quick)quick.innerHTML=list.map(x=>`<button type="button" onclick="pickTrialCourse('${String(x.id).replace(/'/g,"\\'")}')"><b>${esc(x.title)}</b><small>${esc(x.banca||'')} ${x.exam_date?'• prova '+new Date(x.exam_date+'T12:00:00').toLocaleDateString('pt-BR'):''}</small></button>`).join('');
 };
 window.openRoleChooser=function(hit,profile,mode='trial'){
  const course=document.getElementById('courseGate'),gate=document.getElementById('roleGate'),box=document.getElementById('roleChoices'),title=document.getElementById('roleGateTitle'),sub=document.getElementById('roleGateSubtitle');if(!gate||!box||!hit||!profile?.roles?.length)return false;
  u.trial=u.trial||{};u.trial.pendingCourseId=hit.id;gate.dataset.mode=mode;
  if(title)title.textContent='Qual cargo você vai disputar?';
  if(sub)sub.textContent=`${hit.title} • ${hit.banca}. Escolha o cargo para carregar somente as matérias e a estrutura correspondentes.`;
  box.innerHTML=profile.roles.map(r=>`<button type="button" onclick="selectValidatedRole('${String(hit.id).replace(/'/g,"\\'")}','${String(r.id).replace(/'/g,"\\'")}','${mode}')"><b>${esc(r.label)}</b><small>Ver matérias deste cargo →</small></button>`).join('');
  if(course)course.hidden=true;gate.hidden=false;document.body.classList.add('modal-open');return true;
 };
 window.selectValidatedRole=function(courseId,roleId,mode='trial'){
  const hit=exactCatalogCourseById(courseId),profile=hit&&roleProfileForCourse(hit),role=profile?.roles?.find(r=>r.id===roleId);if(!hit||!role)return alert('Cargo não encontrado. Escolha novamente.');
  const paid=!!u?.trial?.paid,isTrial=mode!=='paid'&&!paid,selectedTrack=trackForCatalogHit(hit);
  u.profile={...(u.profile||{}),track:selectedTrack,target:hit.title,banca:hit.banca||'',catalogId:hit.id,examDate:hit.exam_date||null,examDateSource:hit.exam_date?'official':null};applyCourseProfile(hit,role);
  universalExam=hit.exam_date?new Date(hit.exam_date+'T13:00:00-03:00'):null;u.trial=u.trial||{};u.trial.courseChosenAt=Date.now();u.trial.courseChosenTitle=hit.title;ae.day={};aesave();usave();
  if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('trial_course_selected',{target:hit.title,banca:hit.banca||'',track:u.profile.track,catalog_id:hit.id,role:role.label||''});
  const rg=document.getElementById('roleGate');if(rg)rg.hidden=true;const cg=document.getElementById('courseGate');if(cg)cg.hidden=true;document.body.classList.remove('modal-open');
  if(isTrial){u.trial.firstStageCompleted=false;u.trial.leadCaptured=false;u.trial.previewStartedAt=0;u.trial.startedAt=0;usave();return startFreeTrial();}
  if(typeof uRenderAll==='function')uRenderAll();document.querySelector('[data-tab="hoje"]')?.click();window.scrollTo({top:0,behavior:'smooth'});
 };
 window.selectTrialRole=function(courseId,roleId){return window.selectValidatedRole(courseId,roleId,'trial')};
 window.selectCatalogItem=function(id){
  const x=exactCatalogCourseById(id);if(!x||typeof isUpcomingCatalogItem==='function'&&!isUpcomingCatalogItem(x))return;
  const rp=roleProfileForCourse(x);if(rp?.roles?.length)return openRoleChooser(x,rp,u?.trial?.paid?'paid':'trial');
  const paid=!!u?.trial?.paid;applyExactCourseSelection(x,{trial:!paid});u.trial=u.trial||{};u.trial.courseChosenAt=Date.now();u.trial.courseChosenTitle=x.title;usave();
  if(!paid){u.trial.firstStageCompleted=false;u.trial.leadCaptured=false;u.trial.previewStartedAt=0;u.trial.startedAt=0;usave();return startFreeTrial();}
  if(typeof uRenderAll==='function')uRenderAll();document.querySelector('[data-tab="hoje"]')?.click();window.scrollTo({top:0,behavior:'smooth'});
 };
 window.populateTrialCourseOptions();
})();
