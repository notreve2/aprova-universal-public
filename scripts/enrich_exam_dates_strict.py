from __future__ import annotations
import io,json,re,time,unicodedata,logging
from pathlib import Path
from datetime import date,datetime,timezone
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor,as_completed
import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader
logging.getLogger('pypdf').setLevel(logging.ERROR)
ROOT=Path(__file__).resolve().parents[1]; CAT=ROOT/'data/catalog.json'; TODAY=date(2026,10,6)
UA={'User-Agent':'Mozilla/5.0 (compatible; AprovaDates/2.0; +https://aprova.emdestaque.ia.br)'}
DR=r'([0-3]?\d[/.-][01]?\d[/.-](?:20)?\d{2})'

def norm(s):
 s=unicodedata.normalize('NFD',s or '');return ''.join(c for c in s if unicodedata.category(c)!='Mn').lower()
def parse(ds):
 m=re.match(r'([0-3]?\d)[/.-]([01]?\d)[/.-]((?:20)?\d{2})',ds)
 if not m:return None
 y=int(m.group(3)); y=y if y>=2000 else 2000+y
 try:return date(y,int(m.group(2)),int(m.group(1)))
 except:return None
def get(u,t=25):
 r=requests.get(u,headers=UA,timeout=t);r.raise_for_status();return r

def explicit_events(text):
 t=re.sub(r'\s+',' ',text or ' '); n=norm(t); out=[]
 # phrase followed by date; deliberately excludes Resultado/Gabarito because phrase itself must be application/realization
 patterns=[
  rf'(?P<ev>aplica(?:cao|ção)|realiza(?:cao|ção))\s+(?:da|das|do|dos)?\s*(?P<kind>prova(?:s)?[^.;:]{{0,100}}?|exame[^.;:]{{0,100}}?)\s*[:\-–—]?\s*{DR}',
  rf'(?P<ev>aplica(?:cao|ção)|realiza(?:cao|ção))\s+(?:da|das|do|dos)?\s*(?P<kind>prova(?:s)?|exame)\s*[:\-–—]?\s*{DR}',
 ]
 # operate on accent-normalized string so indexing not used for evidence exactly
 nn=re.sub(r'\s+',' ',norm(text or ' '))
 for pat in patterns:
  for m in re.finditer(pat,nn,re.I):
   ds=m.group(m.lastindex) if False else m.groups()[-1]
   d=parse(ds)
   if not d:continue
   kind=m.group('kind')
   ctx=nn[max(0,m.start()-100):min(len(nn),m.end()+100)]
   if any(b in kind for b in ('resultado','gabarito','recurso','local de prova')):continue
   score=5
   if 'objetiv' in kind:score=20
   elif 'escrita' in kind:score=12
   elif 'discursiv' in kind:score=10
   elif 'pratica' in kind:score=6
   out.append((score,d,ctx))
 # table style: date before event
 pat2=rf'{DR}\s*[:\-–—]?\s*(?P<ev>aplica(?:cao|ção)|realiza(?:cao|ção))\s+(?:da|das|do|dos)?\s*(?P<kind>prova(?:s)?[^.;:]{{0,100}}?|exame[^.;:]{{0,100}}?)'
 for m in re.finditer(pat2,nn,re.I):
  d=parse(m.group(1));kind=m.group('kind')
  if not d:continue
  score=20 if 'objetiv' in kind else 12 if 'escrita' in kind else 10 if 'discursiv' in kind else 5
  out.append((score,d,nn[max(0,m.start()-100):min(len(nn),m.end()+100)]))
 # remove absurd duplicates
 uniq={}
 for s,d,c in out:
  k=(d,c[:80]);
  if k not in uniq or s>uniq[k][0]:uniq[k]=(s,d,c)
 return list(uniq.values())

def pdf_text(u):
 try:
  r=get(u,25);rd=PdfReader(io.BytesIO(r.content));return '\n'.join((p.extract_text() or '') for p in rd.pages[:70])
 except:return ''
def page_docs(u):
 try:r=get(u,25);s=BeautifulSoup(r.text,'html.parser')
 except:return '',[]
 text='\n'.join(s.stripped_strings); docs=[]
 for a in s.find_all('a',href=True):
  tx=' '.join(a.stripped_strings);h=urljoin(u,a['href']);nl=norm(tx)
  if h.lower().endswith('.pdf') and any(k in nl for k in ('cronograma','edital','retifica','calendario')):
   p=(10 if 'cronograma' in nl or 'calendario' in nl else 6)+(3 if 'retific' in nl else 0)
   docs.append((p,tx,h))
 docs=sorted(docs,reverse=True)
 # unique urls max 3
 seen=set();out=[]
 for x in docs:
  if x[2] in seen:continue
  seen.add(x[2]);out.append(x)
  if len(out)>=3:break
 return text,out

def infer(u):
 text,docs=page_docs(u); candidates=[]
 for e in explicit_events(text):candidates.append((*e,u))
 for _,label,h in docs:
  tx=pdf_text(h)
  for e in explicit_events(tx):candidates.append((*e,h))
 if not candidates:return None
 # objective first; within same type earliest date. If no objective, highest type then earliest.
 candidates.sort(key=lambda x:(-x[0],x[1]))
 return candidates[0]

def generic(u):
 ur=u.rstrip('/');return ur.endswith('/concursos') or ur.endswith('/concursos/em-andamento') or ur=='https://link.institutoaocp.org.br'

def main():
 d=json.loads(CAT.read_text(encoding='utf-8'));items=d['items'];jobs=[]
 # clear only prior machine-extracted dates, preserve curated/manual dates (PCBA/OAB47)
 for x in items:
  if x.get('exam_date_confidence') in ('official-extracted','alias-propagated'):
   x['exam_date']=None;x['exam_date_source']=None;x['exam_date_confidence']='unknown'
 for i,x in enumerate(items):
  u=x.get('source_url','')
  if x.get('exam_date') or generic(u):continue
  if any(h in u for h in ('fgv.br','quadrix.org.br','institutoaocp.org.br','cebraspe.org.br')):jobs.append((i,x['id'],u))
 print('strict jobs',len(jobs),flush=True)
 def work(j):
  i,id,u=j
  try:return i,id,infer(u),None
  except Exception as e:return i,id,None,str(e)
 with ThreadPoolExecutor(max_workers=8) as ex:
  fs=[ex.submit(work,j) for j in jobs]
  for k,f in enumerate(as_completed(fs),1):
   i,id,res,err=f.result();x=items[i]
   if res:
    score,dt,ctx,src=res
    x['exam_date']=dt.isoformat();x['exam_date_source']=src;x['exam_date_confidence']='official-explicit-event'
    x['exam_event_context']=ctx[:260]
    if dt<TODAY:x['status']='Prova principal realizada / histórico'
    print(f'[{k}/{len(jobs)}] {id} {dt} score={score}',flush=True)
   else:print(f'[{k}/{len(jobs)}] {id} sem data',flush=True)
 # known aliases: propagate only if strong normalized token overlap
 def toks(s):return set(re.findall(r'[a-z0-9]+',norm(s)))-{'concurso','publico','para','do','da','de','estado','2026'}
 dated=[x for x in items if x.get('exam_date')]
 for x in items:
  if x.get('exam_date'):continue
  a=toks(x['title']);best=(0,None)
  for y in dated:
   if x.get('banca')!=y.get('banca'):continue
   b=toks(y['title']);j=len(a&b)/(len(a|b) or 1)
   if j>best[0]:best=(j,y)
  if best[0]>=.72:
   y=best[1];x['exam_date']=y['exam_date'];x['exam_date_source']=y.get('exam_date_source');x['exam_date_confidence']='alias-propagated'
   if y.get('status','').startswith('Prova principal'):x['status']=y['status']
 for x in items:
  if not x.get('exam_date'):
   x['exam_date']=None;x['exam_date_source']=None;x['exam_date_confidence']='unknown'
 d['updated_at']=datetime.now(timezone.utc).isoformat();d['date_enrichment']={'run_at':d['updated_at'],'dated':sum(bool(x.get('exam_date')) for x in items),'unknown':sum(not x.get('exam_date') for x in items),'method':'strict-explicit-event'}
 CAT.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
 print(d['date_enrichment'],flush=True)
if __name__=='__main__':main()
