const CACHE='aprova-universal-v29-teste-rapido';
const ASSETS=['./','./index.html','./styles.css','./app.js','./universal.js','./catalog.js','./subject_engine.js','./mastery.js','./oab_bridge.js','./validated_course_data.js','./validated_course_engine.js','./validated_course_ui.js','./exam_guard.js','./trial_lead_patch.js','./trial_quality_guard.js','./trial_conversion_patch.js','./manifest.webmanifest','./data/catalog.json','./data/sources.json'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))]))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))});
