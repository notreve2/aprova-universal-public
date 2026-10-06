#!/usr/bin/env python3
from __future__ import annotations
import json,re,hashlib
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]; CAT=ROOT/'data/catalog.json'
UA={'User-Agent':'Mozilla/5.0 (compatible; AprovaCatalog/1.0; +https://aprova.emdestaque.ia.br)'}
TODAY=lambda: datetime.now(timezone.utc).date().isoformat()
def clean(s): return re.sub(r'\s+',' ',s or '').strip()
def hid(prefix,title): return prefix+'-'+hashlib.sha1(title.casefold().encode()).hexdigest()[:10]
def get(url):
 r=requests.get(url,headers=UA,timeout=30); r.raise_for_status(); return r.text

def mk(prefix,banca,title,url,status='Detectado na fonte oficial'):
 return {'id':hid(prefix,title),'title':title,'banca':banca,'status':status,'category':'Concurso / exame','source_url':url,'official':True,'exam_date':None,'tags':[banca],'last_seen':TODAY()}
def scan_fgv():
 url='https://conhecimento.fgv.br/concursos?categoria=Em+andamento'; soup=BeautifulSoup(get(url),'html.parser'); out=[];seen=set()
 for a in soup.select('.views-field-title a[href], a[href^="/concursos/"], a[href^="/exames/"]'):
  title=clean(a.get_text(' ',strip=True)); href=a.get('href','')
  if len(title)<8 or title.casefold() in seen: continue
  if not ('/concursos/' in href or '/exames/' in href): continue
  seen.add(title.casefold()); out.append(mk('fgv','FGV',title,urljoin(url,href),'Em andamento'))
 return out

def scan_quadrix():
 url='https://quadrix.org.br/index/todos/'; soup=BeautifulSoup(get(url),'html.parser'); out=[];seen=set()
 for a in soup.select('h3 a[href*="/informacoes/"]'):
  title=clean(a.get_text(' ',strip=True));
  if len(title)<8 or title.casefold() in seen: continue
  seen.add(title.casefold()); out.append(mk('quadrix','Quadrix',title,urljoin(url,a['href']),'Em andamento / histórico'))
 return out

def scan_placeholder(name,url,prefix):
 # Alguns portais montam o catálogo via JavaScript. Mantemos os registros seed
 # e a fonte oficial cadastrada até o conector dedicado ficar disponível.
 try: get(url)
 except Exception: pass
 return []
SCANNERS=[('FGV',scan_fgv),('Quadrix',scan_quadrix),('Cebraspe',lambda:scan_placeholder('Cebraspe','https://www.cebraspe.org.br/concursos/em-andamento/','cebraspe')),('Instituto AOCP',lambda:scan_placeholder('AOCP','https://link.institutoaocp.org.br/','aocp'))]
def main():
 old=json.loads(CAT.read_text(encoding='utf-8')) if CAT.exists() else {'items':[]}
 # Remove apenas descobertas automáticas antigas das fontes já reprocessadas; preserva o seed curado.
 base=[x for x in old.get('items',[]) if x.get('status')!='Detectado na fonte oficial' and x.get('status')!='Em andamento / histórico']
 merged={x['id']:x for x in base}; title_index={(x.get('banca','').casefold(),x.get('title','').casefold()):x['id'] for x in base}; report=[]
 for label,fn in SCANNERS:
  try:
   found=fn(); new=0
   for item in found:
    key=(item['banca'].casefold(),item['title'].casefold())
    if key in title_index:
     merged[title_index[key]].update({'last_seen':item['last_seen'],'source_url':item['source_url']})
    else:
     merged[item['id']]=item; title_index[key]=item['id']; new+=1
   report.append({'banca':label,'found':len(found),'new':new,'ok':True})
  except Exception as e: report.append({'banca':label,'found':0,'new':0,'ok':False,'error':str(e)[:160]})
 items=sorted(merged.values(),key=lambda x:(0 if 'abert' in x.get('status','').lower() else 1,x.get('banca',''),x.get('title','')))
 CAT.write_text(json.dumps({'updated_at':datetime.now(timezone.utc).isoformat(),'count':len(items),'scan_report':report,'items':items},ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps({'count':len(items),'report':report},ensure_ascii=False))
if __name__=='__main__': main()
