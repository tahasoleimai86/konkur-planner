const C='konkur-planner-v23';const F=['./','./index.html','./theme.css','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./config.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=='kp-meta').map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin||u.pathname.endsWith('admin.html'))return;
 e.respondWith(fetch(r).then(n=>{if(n.ok){const cp=n.clone();caches.open(C).then(c=>c.put(r,cp))}return n}).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))))});
// web push without payload: wake up, fetch the waiting texts from the server, show them
self.addEventListener('push',e=>{e.waitUntil((async()=>{let notes=[];
 try{const m=await (await caches.open('kp-meta')).match('./kp-meta');const k=m?await m.json():null;
  if(k){const j=await (await fetch(k.sync+'?action=notes&id='+encodeURIComponent(k.id)+'&t='+Date.now(),{cache:'no-store'})).json();notes=(j&&j.notes)||[]}}catch(x){}
 if(!notes.length)notes=[{t:'پیام تازه در برنامه‌ساز کنکور داری.'}];
 const n=notes.slice(-3);for(let i=0;i<n.length;i++){const t=String(n[i].t||'');const ln=t.split('\n');
  await self.registration.showNotification(ln[0].slice(0,80)||'برنامه‌ساز کنکور',{body:ln.slice(1).join('\n').slice(0,300),icon:'icon-192.png',badge:'icon-192.png',lang:'fa',dir:'rtl',tag:'kp-'+(n[i].at||i),data:{url:'./'}})}})())});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(w=>{for(const c of w){if('focus'in c)return c.focus()}return clients.openWindow('./')}))});
