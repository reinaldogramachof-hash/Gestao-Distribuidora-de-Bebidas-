const CACHE_NAME = 'plena-bebidas-v3-bottle-fix';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // External Libraries (CDNs) - Important for UI
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.1/',
  'https://aistudiocdn.com/react@^19.2.1',
  'https://aistudiocdn.com/react-dom@^19.2.1/',
  'https://aistudiocdn.com/lucide-react@^0.556.0',
  'https://aistudiocdn.com/recharts@^3.5.1',
  // New Bottle Icon
  'https://cdn-icons-png.flaticon.com/512/2405/2405479.png'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force activation immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Alguns assets não puderam ser cacheados na instalação:', err);
      });
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback behavior if needed
      });
    })
  );
});

// Activate Event (Cleanup old caches - CRITICAL for fixing white screen)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});