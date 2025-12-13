// NOPE Service Worker — Offline-First, Cache-Only-Static
const CACHE_NAME = 'nope-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/jejak.html',
  '/jalan.html',
  '/dunia.html',
  '/onboarding.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo-nope-192.png',
  '/logo-nope-512.png',
  // Tambahkan asset statis lain jika perlu
];

// Install: cache semua file dasar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.warn('Gagal cache asset:', err);
      })
  );
  self.skipWaiting();
});

// Activate: bersihkan cache lama
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: offline-first
self.addEventListener('fetch', (event) => {
  // Jangan cache API atau request yang mengandung ? atau =
  if (event.request.method !== 'GET' || 
      event.request.url.includes('/api/') || 
      event.request.url.includes('?') || 
      event.request.url.includes('chrome-extension')) {
    return;
  }

  // Hanya cache asset statis (HTML, JS, CSS, gambar, JSON)
  const isStatic = /\.(html|js|css|png|jpg|jpeg|ico|json|txt)$/i.test(event.request.url);

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return dari cache jika ada
        if (response) {
          return response;
        }
        // Jika tidak, fetch dari jaringan
        return fetch(event.request).then((networkResponse) => {
          // Simpan ke cache untuk next time
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Jika offline & tidak di cache → tampilkan jejak.html sebagai fallback
          return caches.match('/jejak.html') || caches.match('/');
        });
      })
    );
  }
});

// Pesan dari client (opsional)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
