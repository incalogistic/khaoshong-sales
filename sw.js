// เก็บไฟล์หน้าแอปไว้ในเครื่อง เปิดแอปได้เร็ว (ข้อมูลขายยังต้องต่ออินเทอร์เน็ต)
const CACHE = 'sales-app-v2';
const SHELL = ['./', 'index.html', 'css/app.css', 'js/app.js', 'config.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // คำสั่งถึง DMS ไม่แคช
  // network first → ได้ไฟล์ใหม่ทันทีที่อัปเดต, ออฟไลน์ค่อยใช้ของในเครื่อง
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request)));
});
