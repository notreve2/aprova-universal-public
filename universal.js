const ULS='aprova-universal-v4';
let u=JSON.parse(localStorage.getItem(ULS)||'{}');
u.profile=u.profile||{};u.trial=u.trial||{};u.notes=u.notes||[];u.errors=u.errors||[];u.reviews=u.reviews||[];u.flashRatings=u.flashRatings||{};u.stage=u.stage||0;u.choice=u.choice||'';u.noteDraft=u.noteDraft||'';u.daySessions=u.daySessions||{};
const trackLabels={concurso:'Concurso público',oab2:'OAB — 2ª fase',oab1:'OAB — 1ª fase',magistratura:'ENAM / Carreiras Jurídicas',saude:'Residência / Saúde',educacao:'ENEM / Vestibular',certificacao:'Certificação / Exame profissional',outro:'Outra prova'};
const areaLabels={geral:'Plano geral do edital',constitucional:'Direito Constitucional',administrativo:'Direito Administrativo',civil:'Direito Civil',empresarial:'Direito Empresarial',penal:'Direito Penal',processopenal:'Processo Penal',trabalho:'Direito do Trabalho',tributario:'Direito Tributário',portugues:'Português',informatica:'Informática',raciocinio:'Raciocínio Lógico / Estatística'};
let universalExam=u.profile.examDate?new Date(u.profile.examDate+'T13:00:00-03:00'):null;
let trialTicker=null;
function usave(){persistUDaySession();localStorage.setItem(ULS,JSON.stringify(u));}
function targetName(){return u.profile.target||trackLabels[u.profile.track]||'Sua prova';}
function localDateKey(d=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(d);}
function studyDateObj(){return new Date((u.activeStudyDate||localDateKey())+'T12:00:00-03:00');}
function persistUDaySession(){if(!u.activeStudyDate)return;u.daySessions=u.daySessions||{};u.daySessions[u.activeStudyDate]={stage:Number(u.stage)||0,choice:u.choice||'',noteDraft:u.noteDraft||'',flashRatings:{...(u.flashRatings||{})},completed:Number(u.stage)>=5};}
function loadUDaySession(key){u.daySessions=u.daySessions||{};const x=u.daySessions[key]||{};u.stage=Number(x.stage)||0;u.choice=x.choice||'';u.noteDraft=x.noteDraft||'';u.flashRatings=x.flashRatings||{};}
function syncUniversalStudyDay(){const today=localDateKey();u.daySessions=u.daySessions||{};if(!u.daySessionVersion){const legacy={stage:Number(u.stage)||0,choice:u.choice||'',noteDraft:u.noteDraft||'',flashRatings:{...(u.flashRatings||{})},completed:Number(u.stage)>=5};if(legacy.stage||legacy.choice||legacy.noteDraft||Object.keys(legacy.flashRatings).length)u.daySessions[today]=legacy;u.daySessionVersion=1;}if(!u.activeStudyDate||u.lastOpenedDate!==today){u.activeStudyDate=today;u.lastOpenedDate=today;}loadUDaySession(u.activeStudyDate);localStorage.setItem(ULS,JSON.stringify(u));}
function openUniversalDate(key){persistUDaySession();const today=localDateKey(),examKey=u.profile.examDate||null;if(key<today||(examKey&&key>examKey))return;u.activeStudyDate=key;loadUDaySession(key);localStorage.setItem(ULS,JSON.stringify(u));uRenderAll();window.scrollTo({top:0,behavior:'smooth'});}
function shiftUniversalDay(delta){if(!u.profile.examDate&&delta>0)return;const d=studyDateObj();d.setDate(d.getDate()+delta);openUniversalDate(localDateKey(d));}
function studyDayOffset(){const a=new Date(localDateKey()+'T12:00:00-03:00'),b=studyDateObj();return Math.max(0,Math.round((b-a)/86400000));}
function escapeU(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function udays(){if(!universalExam||Number.isNaN(universalExam.getTime()))return null;return Math.max(0,Math.ceil((universalExam-new Date())/86400000));}
function updateTrackFields(){const t=document.getElementById('trialTrack')?.value,a=document.getElementById('trialArea');if(!a)return;if(t==='oab2')a.value='constitucional';else if(t==='concurso')a.value='geral';}
function applyLandingParams(){
 const p=new URLSearchParams(window.location.search);
 if(u.trial?.startedAt||u.profile?.name)return;
 const track=p.get('track'),target=p.get('target'),area=p.get('area');
 const trackEl=document.getElementById('trialTrack'),targetEl=document.getElementById('trialTarget'),areaEl=document.getElementById('trialArea');
 if(track&&trackLabels[track]&&trackEl){trackEl.value=track;updateTrackFields();}
 if(target&&targetEl)targetEl.value=target;
 if(area&&areaLabels[area]&&areaEl)areaEl.value=area;
}
function findCatalogTarget(target,catalogId){const items=window.aprovaCatalog?.items||[],n=typeof norm==='function'?norm(target):(target||'').trim().toLowerCase(),byTitle=n?items.find(x=>(typeof norm==='function'?norm(x.title):String(x.title||'').trim().toLowerCase())===n):null,byId=catalogId?items.find(x=>x.id===catalogId):null;if(byTitle)return byTitle;if(byId&&!target)return byId;return null;}
function applyOfficialExamMeta(target){const hit=findCatalogTarget(target,u.profile?.catalogId);if(hit){u.profile.target=hit.title;u.profile.banca=hit.banca||'';u.profile.catalogId=hit.id;u.profile.examDate=hit.exam_date||null;u.profile.examDateSource=hit.exam_date?'official':null;universalExam=hit.exam_date?new Date(hit.exam_date+'T13:00:00-03:00'):null;const input=document.getElementById('trialExamDate');if(input)input.value=hit.exam_date||'';}return hit;}
function syncOfficialExamDate(){if(!u.profile?.target)return false;const hit=applyOfficialExamMeta(u.profile.target);if(hit){usave();return true;}return false;}
function startFreeTrial(){const name=document.getElementById('trialName').value.trim(),email=document.getElementById('trialEmail').value.trim(),track=document.getElementById('trialTrack').value,target=document.getElementById('trialTarget').value.trim(),area=document.getElementById('trialArea').value,manualDate=document.getElementById('trialExamDate').value;if(!name||!email)return alert('Preencha nome e e-mail.');u.profile={name,email,track,target:target||trackLabels[track],area,examDate:manualDate||null};u.daySessions={};u.activeStudyDate=localDateKey();u.lastOpenedDate=localDateKey();u.stage=0;u.choice='';u.noteDraft='';u.flashRatings={};const hit=applyOfficialExamMeta(u.profile.target);if(!hit&&manualDate){u.profile.examDate=manualDate;u.profile.examDateSource='manual';universalExam=new Date(manualDate+'T13:00:00-03:00');}else if(!hit&&!manualDate){u.profile.examDate=null;u.profile.examDateSource='unknown';universalExam=null;}u.sessionLoggedOut=false;u.trial.startedAt=u.trial.startedAt||Date.now();u.trial.mode='first-stage';u.trial.firstStageCompleted=!!u.trial.firstStageCompleted;usave();document.getElementById('trialGate').hidden=true;uRenderAll();}
function startTrialClock(){}
function restoreTrialUniversal(){if(u.sessionLoggedOut)return;const gate=document.getElementById('trialGate');if(!gate)return;if(u.trial?.paid){gate.hidden=true;return;}if(!u.trial?.startedAt||sessionStorage.getItem('aprova-trial-active')!=='1'){gate.hidden=false;return;}gate.hidden=true;}
const PAYMENT_API='https://aprova-payments-production.up.railway.app';
const APROVA_AUTH_TOKEN_KEY='aprova-auth-token-v1';
const APROVA_DEVICE_KEY='aprova-device-v1';
let selectedCheckoutPlan='';

function aprovaDeviceId(){let id=localStorage.getItem(APROVA_DEVICE_KEY);if(!id){id=(crypto.randomUUID?crypto.randomUUID():(Date.now()+'-'+Math.random().toString(36).slice(2)+'-'+Math.random().toString(36).slice(2)));localStorage.setItem(APROVA_DEVICE_KEY,id);}return id;}
function aprovaAuthToken(){return localStorage.getItem(APROVA_AUTH_TOKEN_KEY)||'';}
function aprovaAuthHeaders(){const token=aprovaAuthToken();return {'Content-Type':'application/json','X-Device-Id':aprovaDeviceId(),...(token?{'Authorization':'Bearer '+token}:{})};}
function setAccountMessage(text=''){const el=document.getElementById('accountMessage');if(!el)return;el.textContent=text;el.hidden=!text;}
window.showAprovaAccountMode=function(mode='login',message=''){const gate=document.getElementById('accountGate'),a=document.getElementById('accountActivatePanel'),l=document.getElementById('accountLoginPanel');if(!gate)return;if(a)a.hidden=mode!=='activate';if(l)l.hidden=mode==='activate';setAccountMessage(message);const email=(u.profile?.email||document.getElementById('checkoutEmail')?.value||'').trim();const ae=document.getElementById('activateEmail'),le=document.getElementById('loginEmail');if(ae&&!ae.value)ae.value=email;if(le&&!le.value)le.value=email;gate.hidden=false;document.body.classList.add('modal-open');};
window.openAprovaLogin=function(){showAprovaAccountMode('login');};
window.closeAprovaAccountGate=function(){const gate=document.getElementById('accountGate');if(gate)gate.hidden=true;document.body.classList.remove('modal-open');};
function clearAprovaPaidSession(){localStorage.removeItem(APROVA_AUTH_TOKEN_KEY);u.trial=u.trial||{};u.trial.paid=false;u.account=null;usave();}
function applyAuthenticatedAccount(data,token){if(token)localStorage.setItem(APROVA_AUTH_TOKEN_KEY,token);u.trial=u.trial||{};u.trial.paid=true;u.trial.plan=data?.account?.plan||u.trial.plan||'';u.account=data?.account||{};u.sessionLoggedOut=false;usave();const gate=document.getElementById('trialGate'),pay=document.getElementById('paywall');if(gate)gate.hidden=true;if(pay)pay.hidden=true;closeAprovaAccountGate();if(typeof renderMasterAll==='function')renderMasterAll();else if(typeof uRenderAll==='function')uRenderAll();if(!u.profile?.hoursConfigured)setTimeout(()=>window.showPaidStudySetup?.(),80);}
window.hasAprovaPaidSession=function(){return !!aprovaAuthToken();};

window.rateTrialExperience=function(feedback){
 u.trial=u.trial||{};u.trial.feedback=feedback;u.trial.feedbackAt=Date.now();usave();
 if(typeof window.aprovaTrackCustom==='function')window.aprovaTrackCustom('TrialFeedback',{feedback});
 if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('trial_feedback',{...((typeof analyticsLeadIdentity==='function')?analyticsLeadIdentity():{}),feedback,track:u.profile?.track||'',target:u.profile?.target||''});
 const first=document.getElementById('trialFeedbackBlock'),opts=document.getElementById('checkoutOptions');if(first)first.hidden=true;if(opts)opts.hidden=false;
};
window.selectCheckoutPlan=function(plan){
 selectedCheckoutPlan=plan==='monthly'?'monthly':'lifetime';
 document.querySelectorAll('.plan-card').forEach(x=>x.classList.remove('selected'));
 const cards=document.querySelectorAll('.plan-card');if(selectedCheckoutPlan==='monthly')cards[0]?.classList.add('selected');else cards[1]?.classList.add('selected');
 const box=document.getElementById('checkoutEmailBox'),btn=document.getElementById('checkoutContinueBtn');if(box)box.hidden=false;if(btn)btn.textContent=selectedCheckoutPlan==='monthly'?'Assinar por R$ 99,90/mês →':'Comprar vitalício por R$ 199,99 →';
 if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('checkout_plan_select',{plan:selectedCheckoutPlan,value:selectedCheckoutPlan==='monthly'?99.90:199.99});
};
window.continueSelectedCheckout=function(){if(!selectedCheckoutPlan)return alert('Escolha Mensal ou Vitalício.');return goToCheckout(selectedCheckoutPlan);};
async function goToCheckout(plan='lifetime'){
 try{
  plan=plan==='monthly'?'monthly':'lifetime';
  const email=((document.getElementById('checkoutEmail')?.value||'').trim()||(u.profile?.email||'').trim());
  if(!/^\S+@\S+\.\S+$/.test(email))return alert('Informe um e-mail válido para liberar e recuperar seu acesso.');
  u.profile={...(u.profile||{}),email};usave();
  const price=plan==='monthly'?99.90:199.99,ident={name:u.profile?.name||'',email,phone:u.profile?.phone||'',marketing_consent:!!u.profile?.marketingConsent};
  if(typeof window.aprovaTrack==='function')window.aprovaTrack('InitiateCheckout',{content_name:plan==='monthly'?'Aprova - plano mensal':'Aprova - acesso vitalicio',content_category:plan,value:price,currency:'BRL'});
  if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('checkout_start',{...ident,plan,value:price,feedback:u.trial?.feedback||''});
  const res=await fetch(PAYMENT_API+'/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan,email,name:u.profile?.name||'',phone:u.profile?.phone||''})});
  const data=await res.json().catch(()=>({}));
  if(!res.ok||!data.checkout_url)throw new Error(data.error||'Checkout indisponível.');
  localStorage.setItem('aprova-pending-order',data.order_id||'');
  localStorage.setItem('aprova-pending-kind',data.kind||'order');
  localStorage.setItem('aprova-pending-plan',data.plan||plan);
  if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('checkout_created',{...ident,plan,value:price,order_id:data.order_id||'',kind:data.kind||'order'});
  window.location.href=data.checkout_url;
 }catch(err){alert((err&&err.message)||'Não foi possível abrir o Mercado Pago agora. Tente novamente em instantes.');}
}
async function verifyAprovaPayment(showPending=false){
 const id=localStorage.getItem('aprova-pending-order');
 if(!id)return false;
 const kind=localStorage.getItem('aprova-pending-kind')||'order';
 const plan=localStorage.getItem('aprova-pending-plan')||(kind==='subscription'?'monthly':'lifetime');
 try{
  const endpoint=kind==='subscription'?'/subscription?id=':'/order?id=';
  const res=await fetch(PAYMENT_API+endpoint+encodeURIComponent(id),{cache:'no-store'});
  const data=await res.json().catch(()=>({}));
  if(data.approved){
   u.trial=u.trial||{};u.trial.paymentConfirmed=true;u.trial.plan=plan;u.trial.pendingEntitlementId=id;u.trial.pendingEntitlementKind=kind;usave();
   const value=Number(data.total_amount||(plan==='monthly'?99.90:199.99));
   if(!u.trial.purchaseTracked){u.trial.purchaseTracked=true;usave();if(typeof window.aprovaTrack==='function')window.aprovaTrack('Purchase',{content_name:plan==='monthly'?'Aprova - mensal':'Aprova - vitalicio',value,currency:'BRL'});if(typeof window.aprovaAnalytics==='function')window.aprovaAnalytics('purchase',{name:u.profile?.name||'',email:u.profile?.email||'',phone:u.profile?.phone||'',marketing_consent:!!u.profile?.marketingConsent,plan,value,order_id:id,kind});}
   history.replaceState({},document.title,location.pathname);
   showAprovaAccountMode('activate','Pagamento confirmado. Agora crie sua senha pessoal para liberar o acesso.');
   return true;
  }
  if(showPending)alert(kind==='subscription'?'Sua assinatura ainda não foi autorizada. Conclua o pagamento no Mercado Pago e tente novamente.':'Pagamento ainda não confirmado. Se você acabou de pagar, aguarde alguns segundos e tente novamente.');
 }catch(e){if(showPending)alert('Não foi possível confirmar o pagamento agora. Tente novamente em instantes.');}
 return false;
}
window.verifyAprovaPayment=()=>verifyAprovaPayment(true);

window.activateAprovaAccount=async function(){
 const id=localStorage.getItem('aprova-pending-order')||u.trial?.pendingEntitlementId||'',kind=localStorage.getItem('aprova-pending-kind')||u.trial?.pendingEntitlementKind||'order';
 const email=(document.getElementById('activateEmail')?.value||u.profile?.email||'').trim(),p1=document.getElementById('activatePassword')?.value||'',p2=document.getElementById('activatePassword2')?.value||'';
 if(!id)return setAccountMessage('Não encontrei o pagamento confirmado neste aparelho. Entre com sua conta se você já criou a senha.');
 if(!/^\S+@\S+\.\S+$/.test(email))return setAccountMessage('Informe o mesmo e-mail usado no pagamento.');
 if(p1.length<8||!/\d/.test(p1)||!/[A-Za-zÀ-ÿ]/.test(p1))return setAccountMessage('Crie uma senha com pelo menos 8 caracteres, contendo letra e número.');
 if(p1!==p2)return setAccountMessage('As duas senhas precisam ser iguais.');
 try{
  setAccountMessage('Criando sua conta segura…');
  const res=await fetch(PAYMENT_API+'/account/activate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,id,email,password:p1,name:u.profile?.name||'',device_id:aprovaDeviceId()})});
  const data=await res.json().catch(()=>({}));
  if(!res.ok){if(data.code==='ALREADY_ACTIVATED'||data.code==='ACCOUNT_EXISTS'){showAprovaAccountMode('login',data.error||'Esta conta já foi criada. Entre com sua senha.');const le=document.getElementById('loginEmail');if(le)le.value=email;return;}throw new Error(data.error||'Não foi possível criar a conta.');}
  localStorage.removeItem('aprova-pending-order');localStorage.removeItem('aprova-pending-kind');localStorage.removeItem('aprova-pending-plan');
  u.profile={...(u.profile||{}),email};u.trial.paymentConfirmed=true;usave();applyAuthenticatedAccount(data,data.token);
  alert('Conta criada. Seu acesso individual está liberado neste dispositivo e rede.');
 }catch(e){setAccountMessage(e?.message||'Não foi possível criar sua conta agora.');}
};

window.loginAprovaAccount=async function(){
 const email=(document.getElementById('loginEmail')?.value||'').trim(),password=document.getElementById('loginPassword')?.value||'';
 if(!email||!password)return setAccountMessage('Informe e-mail e senha.');
 try{
  setAccountMessage('Confirmando seu acesso…');
  const res=await fetch(PAYMENT_API+'/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,device_id:aprovaDeviceId()})});
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw new Error(data.error||'Não foi possível entrar.');
  u.profile={...(u.profile||{}),email};applyAuthenticatedAccount(data,data.token);
 }catch(e){setAccountMessage(e?.message||'Não foi possível entrar agora.');}
};

window.logoutPaidAccount=async function(){
 const token=aprovaAuthToken();
 try{if(token)await fetch(PAYMENT_API+'/logout',{method:'POST',headers:aprovaAuthHeaders()});}catch(e){}
 clearAprovaPaidSession();u.sessionLoggedOut=true;usave();const gate=document.getElementById('trialGate');if(gate)gate.hidden=false;const pay=document.getElementById('paywall');if(pay)pay.hidden=true;if(typeof renderMasterAll==='function')renderMasterAll();window.scrollTo({top:0,behavior:'smooth'});
};

async function restoreAprovaAccountSession(){
 const token=aprovaAuthToken();
 if(!token){if(u.trial?.paid){u.trial.paid=false;usave();}return false;}
 try{
  u.trial.paid=false;usave();
  const res=await fetch(PAYMENT_API+'/session',{headers:aprovaAuthHeaders(),cache:'no-store'});
  const data=await res.json().catch(()=>({}));
  if(res.ok&&data.ok){applyAuthenticatedAccount(data,token);return true;}
  localStorage.removeItem(APROVA_AUTH_TOKEN_KEY);u.trial.paid=false;usave();
  if(data.code==='IP_CHANGED_RELOGIN')showAprovaAccountMode('login','Sua rede/IP mudou. Por segurança, faça login novamente para confirmar que é você.');
  else if(data.code==='DEVICE_BLOCKED')showAprovaAccountMode('login','Este acesso está protegido por dispositivo. Encerre a sessão anterior antes de entrar em outro aparelho.');
  else if(data.code==='SUBSCRIPTION_INACTIVE')showAprovaAccountMode('login','Sua assinatura mensal não está ativa. Regularize o pagamento para continuar.');
  return false;
 }catch(e){return false;}
}

async function verifyActiveSubscription(){return restoreAprovaAccountSession();}
async function handleAprovaPaymentReturn(){
 const state=new URLSearchParams(location.search).get('mp');
 if(!state)return false;
 if(state==='failure'){alert('O pagamento não foi concluído. Você pode tentar novamente.');history.replaceState({},document.title,location.pathname);return false;}
 for(let i=0;i<8;i++){
  if(await verifyAprovaPayment(false))return true;
  if(i<7)await new Promise(r=>setTimeout(r,2200));
 }
 if(state==='pending'||state==='success'||state==='subscription')alert('Recebemos o retorno do Mercado Pago, mas a confirmação ainda está pendente. Seu progresso está salvo; tente verificar novamente em instantes.');
 return false;
}
function closePaywallPreview(){document.getElementById('paywall').hidden=true;}
const guides={
 geral:{title:'Diagnóstico guiado',q:'Antes de estudar teoria, qual é a melhor primeira ação para descobrir como sua prova cobra o conteúdo?',choices:['Resolver uma questão diagnóstica','Ler todo o edital de uma vez','Comprar vários cursos','Memorizar resumos sem questões'],ok:'Resolver uma questão diagnóstica',why:'O diagnóstico revela padrão da prova e lacunas antes de distribuir seu tempo.',steps:['Resolva sem consultar','Corrija imediatamente','Classifique o erro','Transforme o erro em flashcard'],note:'Questão → correção → fonte → anotação → flashcard → revisão.',flash:[['Qual é o ciclo-base?','Questão → correção → fonte → anotação → flashcard → revisão'],['O que fazer com um erro?','Entender a causa e agendar revisão']]},
 constitucional:{title:'Questão guiada — Constitucional',q:'Qual alternativa contém apenas princípios expressos no caput do art. 37 da Constituição?',choices:['Legalidade, impessoalidade, moralidade, publicidade e eficiência','Legalidade, razoabilidade, proporcionalidade, publicidade e eficiência','Moralidade, autotutela, publicidade, eficiência e supremacia','Legalidade, motivação, segurança jurídica, publicidade e eficiência'],ok:'Legalidade, impessoalidade, moralidade, publicidade e eficiência',why:'O art. 37, caput, traz os princípios LIMPE.',steps:['Abra a Constituição Federal','Localize o art. 37, caput','Leia os princípios expressos','Compare com as alternativas'],note:'LIMPE = Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência.',flash:[['Quais são os princípios expressos do art. 37?','Legalidade, impessoalidade, moralidade, publicidade e eficiência'],['Qual mnemônico ajuda?','LIMPE']]},
 portugues:{title:'Questão guiada — Português',q:'Na frase “Os candidatos que estudam com constância evoluem”, o “que” introduz qual tipo de oração?',choices:['Subordinada adjetiva','Subordinada substantiva','Coordenada sindética','Oração reduzida'],ok:'Subordinada adjetiva',why:'O “que” retoma “candidatos” e introduz oração com valor adjetivo.',steps:['Revise pronomes relativos','Localize oração subordinada adjetiva','Compare restritiva x explicativa','Crie um exemplo próprio'],note:'Se “que” retoma substantivo anterior e o caracteriza, avalie oração adjetiva.',flash:[['O que caracteriza oração subordinada adjetiva?','Ela exerce função de adjetivo'],['O “que” pode funcionar como quê?','Pronome relativo']]},
 informatica:{title:'Questão guiada — Informática',q:'Qual prática reduz o impacto do comprometimento de uma única senha?',choices:['Autenticação multifator','Desativar atualizações','Reutilizar a mesma senha','Compartilhar credenciais'],ok:'Autenticação multifator',why:'A MFA exige mais de um fator de autenticação.',steps:['Revise autenticação x autorização','Leia sobre fatores de autenticação','Compare senha x MFA','Anote um exemplo de 2FA'],note:'MFA combina dois ou mais fatores independentes.',flash:[['O que significa MFA?','Autenticação multifator'],['Qual o principal ganho?','Reduzir o risco quando um fator é comprometido']]}
};
function currentStudyPhase(){const raw=udays();if(raw===null)return phases[0];const total=Math.max(1,raw),i=studyDayOffset(),idx=Math.min(phases.length-1,Math.floor((i/Math.max(1,total-1))*(phases.length-1)));return phases[idx];}
function currentGuide(){const base=guides[u.profile.area]||guides.geral,p=currentStudyPhase();if(p[0]==='Diagnóstico')return {...base,title:`${p[0]} • ${base.title}`,steps:[`Objetivo do dia: ${p[1]}`,...base.steps].slice(0,4),note:`${p[0]} — ${p[1]}. ${base.note}`};const q=`No bloco ${p[0]}, qual ação corresponde melhor ao objetivo de hoje?`;const ok=p[1];return {...base,title:`${p[0]} • ${areaLabels[u.profile.area]||'Plano do edital'}`,q,choices:[ok,'Repetir o bloco anterior sem critério','Ignorar o calendário e estudar assunto aleatório','Pular a atividade sem registrar progresso'],ok,why:`O sistema selecionou este bloco para ${p[1].toLowerCase()} conforme o dia atual do plano.`,steps:[`Objetivo do dia: ${p[1]}`,...base.steps].slice(0,4),note:`${p[0]} — ${p[1]}. ${base.note}`};}
function scheduleReview(days,topic){const d=new Date();d.setDate(d.getDate()+days);const due=localDateKey(d);if(!u.reviews.some(r=>r.due===due&&r.topic===topic))u.reviews.push({topic,due,done:false});}
function flashHtml(f,i){const r=u.flashRatings[i]||'';return `<details class="flash"><summary>${f[0]}</summary><p><b>${f[1]}</b></p><div class="reviewchips"><button class="btn secondary" onclick="rateFlash(event,${i},'erro')">Errei</button><button class="btn secondary" onclick="rateFlash(event,${i},'duvida')">Tive dúvida</button><button class="btn good" onclick="rateFlash(event,${i},'facil')">Acertei fácil</button></div>${r?`<small class="muted">Classificação: ${r}</small>`:''}</details>`;}
function rateFlash(e,i,r){e.preventDefault();u.flashRatings[i]=r;scheduleReview(r==='erro'?1:r==='duvida'?3:7,`Flashcard ${i+1}: ${currentGuide().flash[i][0]}`);usave();uRenderToday();uRenderReview();}
function chooseUniversal(v){u.choice=decodeURIComponent(v);usave();uRenderToday();}
function saveUniversalDraft(v){u.noteDraft=v;usave();}
function nextUniversal(){u.stage=Math.min(5,u.stage+1);usave();uRenderToday();window.scrollTo({top:0,behavior:'smooth'});}
function saveUniversalNote(){const el=document.getElementById('uNote'),t=(el?.value||u.noteDraft||'').trim();if(!t)return alert('Escreva ao menos uma frase com suas palavras.');u.noteDraft=t;const topic=`${currentStudyPhase()[0]} — ${u.activeStudyDate}`;const existing=u.notes.find(n=>n.topic===topic);if(existing){existing.text=t;existing.date=new Date().toLocaleDateString('pt-BR');}else u.notes.unshift({date:new Date().toLocaleDateString('pt-BR'),topic,text:t});[1,3,7].forEach(d=>scheduleReview(d,`Revisão: ${currentStudyPhase()[0]}`));u.stage=4;usave();uRenderToday();uRenderReview();}
function restartUniversal(){u.stage=0;u.choice='';u.noteDraft='';u.flashRatings={};usave();uRenderToday();}
function universalGuideStep(){const g=currentGuide(),s=Math.max(0,Math.min(5,u.stage));if(s===0)return `<div class="do-now">FAÇA AGORA • PASSO 1 DE 6</div><h2>${g.title}</h2><div class="casebox"><p>${g.q}</p></div><h3>Escolha uma resposta</h3><div class="choice-grid">${g.choices.map(c=>`<button class="choice ${u.choice===c?'selected':''}" onclick="chooseUniversal('${encodeURIComponent(c)}')">${c}</button>`).join('')}</div>${u.choice?'<button class="btn good nextbtn" onclick="nextUniversal()">Corrigir →</button>':''}`;
if(s===1){const ok=u.choice===g.ok;return `<div class="do-now">PASSO 2 DE 6 • CORREÇÃO</div><h2>${ok?'✅ Acertou':'❌ Vamos corrigir'}</h2><p><b>Resposta:</b> ${g.ok}</p><p>${g.why}</p><button class="btn good nextbtn" onclick="nextUniversal()">Abrir a fonte certa →</button>`;}
if(s===2)return `<div class="do-now">PASSO 3 DE 6 • FONTE</div><h2>Agora confira na fonte</h2>${g.steps.map((x,i)=>`<div class="task"><span class="stepnum">${i+1}</span><span>${x}</span></div>`).join('')}<button class="btn good nextbtn" onclick="nextUniversal()">Já conferi →</button>`;
if(s===3)return `<div class="do-now">PASSO 4 DE 6 • ANOTAÇÃO</div><h2>Guarde a regra essencial</h2><div class="callout"><b>${g.note}</b></div><textarea id="uNote" rows="4" placeholder="Explique com suas palavras o que aprendeu." oninput="saveUniversalDraft(this.value)">${escapeU(u.noteDraft)}</textarea><button class="btn good nextbtn" onclick="saveUniversalNote()">Salvar e gerar flashcards →</button>`;
if(s===4)return `<div class="do-now">PASSO 5 DE 6 • FLASHCARDS</div><h2>Recuperação ativa</h2><p class="muted">Responda mentalmente antes de abrir cada cartão.</p>${g.flash.map((f,i)=>flashHtml(f,i)).join('')}<button class="btn good nextbtn" onclick="nextUniversal()">Concluir bloco →</button>`;
return `<div class="donehero"><div class="checkbig">✓</div><h2>Bloco concluído</h2><p>O conteúdo entrou automaticamente no seu ciclo de revisão.</p><div class="reviewchips"><span>24h</span><span>3 dias</span><span>7 dias</span></div><button class="btn good" onclick="generateUniversalPDF()">Gerar mapa mental em PDF</button> <button class="btn secondary" onclick="restartUniversal()">Refazer este dia</button> ${u.profile.examDate&&u.activeStudyDate<u.profile.examDate?'<button class="btn good" onclick="shiftUniversalDay(1)">Próximo dia →</button>':''}</div>`;}
function uRenderToday(){const first=u.profile.name?u.profile.name.split(' ')[0]:'',p=currentStudyPhase(),activeKey=u.activeStudyDate||localDateKey(),active=new Date(activeKey+'T12:00:00-03:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),today=localDateKey(),canNext=!!u.profile.examDate&&activeKey<u.profile.examDate;document.getElementById('hoje').innerHTML=`<div class="guide-layout"><div class="card guide-main"><div class="calendar-note"><b>${active} • ${p[0]}</b> — ${p[1]}</div>${universalGuideStep()}</div><aside class="card guide-side"><span class="pill">PLANO DO DIA • ${active}</span><h3>Você não precisa decidir o que estudar${first?', '+first:''}</h3><p>Ao abrir em uma nova data, o sistema reconhece automaticamente o dia e carrega o material correspondente. O progresso de cada dia fica separado.</p><div class="mini-flow"><b>1.</b> Questão → <b>2.</b> Correção → <b>3.</b> Fonte → <b>4.</b> Anotação → <b>5.</b> Flashcards → <b>6.</b> Revisão</div><hr><h3>Material reconhecido</h3><p><b>${p[0]}</b></p><p class="muted">${p[1]} • ${areaLabels[u.profile.area]||'Plano personalizado'}</p><hr><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn secondary" onclick="shiftUniversalDay(-1)" ${activeKey<=today?'disabled':''}>← Dia anterior</button><button class="btn secondary" onclick="shiftUniversalDay(1)" ${canNext?'':'disabled'}>Próximo dia →</button></div>${!u.profile.examDate?'<p class="muted smallgap">O próximo dia será liberado quando a data da prova estiver definida no certame.</p>':''}<hr><button class="btn secondary full" onclick="generateUniversalPDF()">Gerar mapa mental em PDF</button></aside></div>`;}
const phases=[['Diagnóstico','Descobrir pontos fortes e fracos'],['Questões da banca','Entender o padrão de cobrança'],['Teoria essencial','Ler só o que aumenta acerto'],['Fonte primária','Conferir lei, norma ou manual'],['Caderno de erros','Transformar falhas em revisão'],['Flashcards','Recuperação ativa'],['Revisão 24h','Evitar esquecimento rápido'],['Revisão 3 dias','Consolidar'],['Revisão 7 dias','Memória de longo prazo'],['Simulado','Treinar pressão e tempo'],['Correção final','Eliminar erros recorrentes'],['Revisão pré-prova','Concentrar no que mais cai']];
function calendarRows(){const raw=udays();if(raw===null)return [];const total=Math.max(1,raw),visible=Math.min(total,21),rows=[];for(let i=0;i<visible;i++){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+i);const idx=Math.min(phases.length-1,Math.floor((i/Math.max(1,total-1))*(phases.length-1))),iso=localDateKey(d);rows.push({date:d,iso,p:phases[idx],today:i===0,active:iso===u.activeStudyDate});}return rows;}
function uRenderSchedule(){const left=udays(),rows=calendarRows();if(left===null){document.getElementById('cronograma').innerHTML=`<div class="card"><h2>Calendário automático</h2><div class="callout"><b>Data da prova ainda não definida.</b><br>Assim que houver data oficial no edital ou retificação, a contagem e o cronograma serão recalculados automaticamente.</div></div>`;return;}document.getElementById('cronograma').innerHTML=`<div class="card"><div class="auto-calendar-head"><div><h2>Calendário automático</h2><p class="muted">Criado conforme os dias restantes para <b>${targetName()}</b>. Cada data abre seu próprio bloco.</p></div><div class="kpi">${left}<small>dias restantes</small></div></div><div class="calendar-note">Ao voltar em um novo dia, o sistema reconhece a data automaticamente e carrega o material correspondente. Você também pode abrir outro dia manualmente.</div>${rows.map(r=>`<button class="day ${r.active?'auto-today':''}" style="width:100%;text-align:left;border:0;cursor:pointer" onclick="openUniversalDate('${r.iso}')"><div class="date">${r.date.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</div><div><b>${r.p[0]}</b><div class="muted">${r.p[1]}</div></div><span class="module-count">${r.active?'ABERTO':(u.daySessions?.[r.iso]?.completed?'✓':(r.today?'HOJE':''))}</span></button>`).join('')}${left>21?'<p class="muted">Mostrando os próximos 21 dias; o restante continuará sendo recalculado.</p>':''}</div>`;}
function uRenderContent(){document.getElementById('pecas').innerHTML=`<div class="card"><h2>Mapa do conteúdo</h2><p class="muted">O edital vira uma sequência de ações, não uma lista solta de matérias.</p>${phases.map(p=>`<details class="piece"><summary>${p[0]}</summary><p>${p[1]}</p></details>`).join('')}</div>`;}
function uRenderMaterial(){const g=currentGuide(),isOab=u.profile.track==='oab2';document.getElementById('vade').innerHTML=`<div class="grid"><div class="card span-8"><h2>${isOab?'Vade Mecum guiado':'Fonte certa na hora certa'}</h2><p>${isOab?'A plataforma mostra onde localizar a base legal e o que observar, sem substituir a consulta permitida em prova.':'Cada bloco indica a fonte adequada: lei, norma, manual, edital ou material-base.'}</p>${g.steps.map((x,i)=>`<div class="task"><span class="stepnum">${i+1}</span><span>${x}</span></div>`).join('')}</div><div class="card span-4"><h3>Regra do método</h3><p>Uma ação por vez. Você não precisa montar sozinho a ordem do estudo.</p></div></div>`;}
function uRenderQuestions(){document.getElementById('questoes').innerHTML=`<div class="card"><h2>Questões por banca, prova e assunto</h2><p>O catálogo será organizado por <b>banca → órgão → cargo → edital → matéria → assunto</b>. Quando a prova oficial estiver disponível publicamente, a plataforma referencia a fonte original; questões próprias serão marcadas como autorais.</p><div class="qbox"><span class="pill">Seu alvo</span><h3>${targetName()}</h3><p>${areaLabels[u.profile.area]||'Plano geral'} • diagnóstico, treino, revisão e simulados.</p></div></div>`;}
function uRenderReview(){const today=localDateKey(),due=u.reviews.filter(r=>!r.done&&r.due<=today),g=currentGuide();document.getElementById('revisao').innerHTML=`<div class="grid"><div class="card span-8"><h2>Revisão automática + flashcards</h2>${due.length?due.map((r,i)=>`<label class="task"><input type="checkbox" onchange="completeUniversalReview('${r.due}','${encodeURIComponent(r.topic)}')"><span><b>${r.topic}</b><br><span class="muted">Programada para ${new Date(r.due+'T12:00:00').toLocaleDateString('pt-BR')}</span></span></label>`).join(''):'<div class="callout"><b>Nenhuma revisão vencida agora.</b><br>Continue o estudo guiado para alimentar seu calendário.</div>'}<h3 style="margin-top:18px">Flashcards do bloco atual</h3>${g.flash.map((f,i)=>flashHtml(f,i)).join('')}</div><div class="card span-4"><h3>Memória de longo prazo</h3><p><b>Errou:</b> volta antes.<br><b>Dúvida:</b> intervalo curto.<br><b>Fácil:</b> intervalo maior.</p><button class="btn good full" onclick="generateUniversalPDF()">Mapa mental + revisão em PDF</button></div></div>`;}
function completeUniversalReview(due,topic){const t=decodeURIComponent(topic),r=u.reviews.find(x=>x.due===due&&x.topic===t&&!x.done);if(r)r.done=true;usave();uRenderReview();}
function uRenderErrors(){document.getElementById('erros').innerHTML=`<div class="card"><h2>Caderno de erros</h2><p class="muted">Erro registrado vira revisão futura.</p><div style="display:flex;gap:8px;margin-bottom:12px"><input id="uError" type="text" placeholder="O que fez você errar?"><button class="btn" onclick="addUniversalError()">Adicionar</button></div>${u.errors.length?u.errors.map((e,i)=>`<div class="task"><span>⚠️</span><span style="flex:1"><b>${e.text}</b><br><small class="muted">${e.at}</small></span><button class="btn secondary" onclick="solveUniversalError(${i})">Resolvido</button></div>`).join(''):'<p class="muted">Nenhum erro registrado ainda.</p>'}</div>`;}
function addUniversalError(){const el=document.getElementById('uError');if(!el.value.trim())return;u.errors.unshift({text:el.value.trim(),at:new Date().toLocaleString('pt-BR')});scheduleReview(1,'Caderno de erros');usave();uRenderErrors();uRenderReview();}
function solveUniversalError(i){u.errors.splice(i,1);usave();uRenderErrors();}
function uRenderSim(){document.getElementById('simulados').innerHTML=`<div class="grid"><div class="card span-8"><h2>Simulado inteligente</h2><p>O simulado será montado conforme a estrutura da prova escolhida, priorizando matérias e tipos de questão com maior necessidade de revisão.</p><div class="timer">02:00:00</div><button class="btn" onclick="alert('O modo completo de simulado será liberado na versão comercial.')">Iniciar simulado</button></div><div class="card span-4"><h3>Depois do simulado</h3><p>Os erros entram automaticamente no caderno e geram novos flashcards e revisões.</p></div></div>`;}
function generateUniversalPDF(){const g=currentGuide();if(!(window.jspdf&&window.jspdf.jsPDF))return alert('Gerador carregando. Tente novamente em alguns segundos.');const {jsPDF}=window.jspdf,doc=new jsPDF({orientation:'landscape'}),W=297,H=210,cx=W/2,cy=92;doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text('Mapa mental de revisão',12,14);doc.setFontSize(10);doc.text(targetName(),12,21);doc.roundedRect(cx-35,cy-12,70,24,5,5);doc.setFontSize(13);doc.text('CONTEÚDO ESTUDADO',cx,cy+1,{align:'center'});const branches=[['Regra-chave',g.note],['Fonte',g.steps.slice(0,2).join(' • ')],['Flashcards',g.flash.map(x=>x[0]).join(' • ')],['Erros',u.errors.slice(0,3).map(x=>x.text).join(' • ')||'Nenhum erro registrado'],['Minha anotação',u.notes[0]?.text||'Faça sua anotação no bloco guiado']];const pts=[[18,40],[18,135],[194,35],[194,120],[105,155]];branches.forEach((b,i)=>{const [x,y]=pts[i];doc.line(cx,cy,x+(i<2?55:0),y+16);doc.roundedRect(x,y,85,32,4,4);doc.setFontSize(10);doc.setFont('helvetica','bold');doc.text(b[0],x+4,y+6);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(doc.splitTextToSize(b[1],77).slice(0,4),x+4,y+12);});doc.setFontSize(7);doc.text('Revisão gerada pela plataforma de estudo guiado.',12,H-7);doc.save('mapa-mental-revisao.pdf');}
function uCountdown(){const e=document.getElementById('countdown'),d=udays();if(!e)return;const s=document.getElementById('smartStrip');if(d===null){e.innerHTML='DATA<br><small>A CONFIRMAR</small>';if(s)s.innerHTML=`<b>Plano automático:</b> ${targetName()} • aguardando data oficial da prova no edital.`;return;}const h=Math.max(0,Math.floor(((universalExam-new Date())%86400000)/3600000));e.innerHTML=d===0?'DIA DA PROVA':`${d} dias<br><small>${h}h restantes</small>`;if(s)s.innerHTML=`<b>Plano automático:</b> ${d} dias até ${targetName()} • data vinculada ao certame selecionado.`;}
function uRenderAll(){if(!u.activeStudyDate)syncUniversalStudyDay();universalExam=u.profile.examDate?new Date(u.profile.examDate+'T13:00:00-03:00'):null;const title=document.getElementById('areaTitle'),eye=document.getElementById('examEyebrow');if(title)title.textContent=u.profile.target||'Sua próxima aprovação';if(eye)eye.textContent=`${trackLabels[u.profile.track]||'PLANO INTELIGENTE'} • ESTUDO GUIADO`;uRenderToday();uRenderSchedule();uRenderContent();uRenderMaterial();uRenderQuestions();uRenderSim();uRenderReview();uRenderErrors();uCountdown();const p=document.getElementById('progressText');if(p)p.textContent=`Bloco atual: ${Math.min(6,u.stage+1)}/6 etapas`;}
applyLandingParams();restoreTrialUniversal();syncUniversalStudyDay();if(u.trial?.paid&&!aprovaAuthToken())u.trial.paid=false;uRenderAll();(async()=>{const paymentReturn=await handleAprovaPaymentReturn();if(!paymentReturn)await restoreAprovaAccountSession();})();setInterval(uCountdown,60000);
