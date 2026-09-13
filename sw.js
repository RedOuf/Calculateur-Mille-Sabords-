const CACHE_NAME = 'mille-sabords-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'Logo.jpg',
  'Bruit de pieces.mp3',
  'Bruit de canon.mp3',
  'Bruit Rire diabolique.mp3',
  'Bruit Victoire Zombie.mp3',
  'Bruit zombie defaite.mp3',
  'Bruit de levier.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});

