const CACHE = 'nope-pwa-v1';
const FILES = [
  '/index.html',
  '/onboarding.html',
  '/inner.html',
  '/outer.html',
  '/manifest.json',
  '/style.css',
  '/script.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
