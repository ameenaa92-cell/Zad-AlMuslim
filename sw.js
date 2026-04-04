const CACHE_NAME = 'zad-almuslim-cache-v1';

// الملفات التي نريد حفظها في ذاكرة الهاتف ليعمل التطبيق بدون إنترنت
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png'
];

// حدث التثبيت: حفظ الملفات الأساسية في الكاش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('[Service Worker] جاري حفظ الملفات الأساسية');
      return cache.addAll(urlsToCache);
    })
  );
  // إجبار المتصفح على تفعيل ملف الـ Service Worker فوراً
  self.skipWaiting();
});

// حدث التفعيل: مسح أي كاش قديم إذا قمنا بتحديث التطبيق لاحقاً
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] مسح الكاش القديم');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// حدث الجلب (الإنترنت): محاولة جلب البيانات من الإنترنت أولاً، وإذا انقطع الإنترنت يجلبها من الكاش
self.addEventListener('fetch', (event) => {
  // استثناء طلبات قاعدة البيانات (Firebase) ومواقيت الصلاة من الكاش لكي تتحدث دائماً
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('api.aladhan.com')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});