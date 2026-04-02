// هذا الكود البسيط يخبر الهاتف أن التطبيق جاهز للتثبيت
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // يوجه الطلبات لكي يعمل التطبيق بسلاسة
  e.respondWith(fetch(e.request).catch(() => console.log('Network error')));
});
