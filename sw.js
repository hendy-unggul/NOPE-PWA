const CACHE_NAME = 'nope-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/onboarding.html',
  '/inner.html',
  '/outer.html',
  '/styles.css',
  '/logo-nope.svg',
  '/manifest.json'
];

// Install: Cache semua file penting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch: Coba ambil dari cache dulu, kalau nggak ada baru ke network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return response dari cache, atau fetch dari network
        return response || fetch(event.request);
      })
  );
});
