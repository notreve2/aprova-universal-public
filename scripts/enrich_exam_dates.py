from __future__ import annotations
import io,json,re,time,unicodedata
from pathlib import Path
from datetime import date,datetime
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
CAT=ROOT/'data/catalog.json'
TODAY=date(2026,10,6)
UA={'User-Agent':'Mozilla/5.0 (compatible; AprovaDates/1.0; +https://aprova.emdestaque.ia.br)'}
DATE_RE=re.compile(r'(?<!\d)([0-3]?\d)[/.-]([01]?\d)[/.-](20\d{2})(?!\d)')
KEYS=(
 'realizacao da prova','realização da prova','aplicacao da prova','aplicação da prova',
 'realizacao das provas','realização das provas','aplicacao das provas','aplicação das provas',
 'prova objetiva','provas objetivas','prova objetiva e discursiva','provas objetiva e discursiva',
 'prova escrita','prova discursiva','exame objetivo','aplicacao do exame','aplicação do exame'
)
BAD=('gabarito','resultado','recurso','local de prova','consulta ao local','inscricao','inscrição','isenção','homologação','homologacao')

def norm(s:str)->str:
 s=unicodedata.normalize('NFD',s or '')
 return ''.join(c for c in s if unicodedata.category(c)!='Mn').lower()

def get(url,timeout=25):
 r=requests.get(url,headers=UA,timeout=timeout); r.raise_for_status(); return r

def parse_date(s):
 m=DATE_RE.search(s)
 if not m:return None
 try:return date(int(m.group(3)),int(m.group(2)),int(m.group(1)))
 except:return None

def candidate_contexts(text:str):
 n=norm(text)
 out=[]
 for m in DATE_RE.finditer(text):
  d=parse_date(m.group(0));
  if not d: continue
  a=max(0,m.start()-180);b=min(len(text),m.end()+180)
  ctx=text[a:b]; nc=norm(ctx)
  score=0
  for k in KEYS:
   if norm(k) in nc: score+=3
  for k in BAD:
   if norm(k) in nc: score-=2
  if 'cronograma' in nc: score+=1
  if score>0: out.append((score,d,ctx.replace('\n',' ')))
 return out

def pdf_text(url):
 try:
  r=get(url,30)
  rd=PdfReader(io.BytesIO(r.content))
  return '\n'.join((p.extract_text() or '') for p in rd.pages[:80])
 except Exception:return ''

def page_text_and_docs(url):
 try:
  r=get(url,30); soup=BeautifulSoup(r.text,'html.parser')
 except Exception:return '',[]
 text='\n'.join(soup.stripped_strings)
 docs=[]
 for a in soup.find_all('a',href=True):
  label=' '.join(a.stripped_strings); href=urljoin(url,a['href'])
  nl=norm(label); nh=href.lower()
  if nh.endswith('.pdf') and any(k in nl for k in ('edital','cronograma','retifica','calendario','calendário')):
   prio=0
   if 'cronograma' in nl or 'calend' in nl: prio+=5
   if 'retific' in nl: prio+=3
   if 'edital' in nl: prio+=2
   docs.append((prio,label,href))
 docs.sort(reverse=True)
 return text,docs[:5]

def infer(url,banca):
 text,docs=page_text_and_docs(url)
 cands=candidate_contexts(text)
 evidence=url
 # FGV/other direct page: inspect official edital/cronograma docs
 for _,label,href in docs:
  tx=pdf_text(href)
  for c in candidate_contexts(tx):
   cands.append((c[0]+4,c[1],c[2]))
   # evidence should point to the document containing the date
  if candidate_contexts(tx): evidence=href
 # choose: future date highest confidence; if tied earliest future
 future=[c for c in cands if c[1]>=TODAY]
 if future:
  future.sort(key=lambda x:(-x[0],x[1]))
  return future[0][1],evidence,future[0][0],future[0][2]
 past=[c for c in cands if c[1]<TODAY]
 if past:
  # only classify historical using most recent plausible exam date
  past.sort(key=lambda x:(-x[0],-x[1].toordinal()))
  return past[0][1],evidence,past[0][0],past[0][2]
 return None,None,0,''

def similar_key(title):
 t=norm(title)
 for x in ['concurso publico para ','concurso publico ','concurso ','processo seletivo para ','exame nacional da ','edital n 01/2026']:
  t=t.replace(x,'')
 t=re.sub(r'\b20\d{2}\b','',t)
 t=re.sub(r'[^a-z0-9]+',' ',t).strip()
 return t

def main():
 from concurrent.futures import ThreadPoolExecutor, as_completed
 data=json.loads(CAT.read_text(encoding='utf-8'))
 items=data['items']; report=[]
 jobs=[]
 for idx,x in enumerate(items):
  if x.get('exam_date'): continue
  url=x.get('source_url','')
  generic=url.rstrip('/').endswith(('/concursos','/concursos/em-andamento')) or url.endswith('link.institutoaocp.org.br/')
  if generic: continue
  if not any(h in url for h in ('fgv.br','quadrix.org.br','institutoaocp.org.br','cebraspe.org.br','examedeordem.oab.org.br')): continue
  jobs.append((idx,x['id'],x['title'],url,x.get('banca','')))
 def run(job):
  idx,i,t,u,b=job
  try:
   d,src,score,ctx=infer(u,b)
   return idx,i,t,d,src,score,ctx,None
  except Exception as e:
   return idx,i,t,None,None,0,'',str(e)
 print(f'Scanning {len(jobs)} official pages...', flush=True)
 with ThreadPoolExecutor(max_workers=8) as ex:
  futs=[ex.submit(run,j) for j in jobs]
  done=0
  for f in as_completed(futs):
   idx,i,t,d,src,score,ctx,err=f.result(); done+=1
   x=items[idx]
   if d:
    x['exam_date']=d.isoformat();x['exam_date_source']=src;x['exam_date_confidence']='official-extracted'
    if d<TODAY:x['status']='Prova realizada / histórico'
    report.append((i,t,d.isoformat(),score,ctx[:170]))
   elif err:
    report.append((i,t,'ERROR',0,err[:170]))
   print(f'[{done}/{len(jobs)}] {i}: {d.isoformat() if d else "sem data"}', flush=True)
 # propagate dates among aliases / duplicates
 dated=[x for x in items if x.get('exam_date')]
 for x in items:
  if x.get('exam_date'): continue
  a=set(similar_key(x['title']).split())
  if not a:continue
  best=None
  for y in dated:
   if x.get('banca')!=y.get('banca'):continue
   b=set(similar_key(y['title']).split()); j=len(a&b)/(len(a|b) or 1)
   if j>=.55 and (best is None or j>best[0]):best=(j,y)
  if best:
   y=best[1];x['exam_date']=y['exam_date'];x['exam_date_source']=y.get('exam_date_source',y.get('source_url'));x['exam_date_confidence']='alias-propagated'
   if y.get('status')=='Prova realizada / histórico':x['status']=y['status']
 for x in items:
  if not x.get('exam_date'):
   x['exam_date']=None;x['exam_date_source']=None;x['exam_date_confidence']='unknown'
 data['updated_at']=datetime.utcnow().isoformat()+'Z'
 data['date_enrichment']={'run_at':data['updated_at'],'dated':sum(bool(x.get('exam_date')) for x in items),'unknown':sum(not x.get('exam_date') for x in items)}
 CAT.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps(data['date_enrichment'],ensure_ascii=False), flush=True)
 for row in report: print(' | '.join(map(str,row)), flush=True)

if __name__=='__main__':main()
