const CACHE_NAME = 'nope-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/onboarding.html',
  '/inner.html',
  '/luar.html', // <-- ganti jadi "luar" karena di repo kamu pakai ini
  '/register.html',
  '/artefak-upload.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
