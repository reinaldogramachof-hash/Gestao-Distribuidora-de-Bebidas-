const CACHE_NAME = 'plena-bebidas-v1-rc2';
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
  'https://cdn-icons-png.flaticon.com/512/766/766023.png'
];

// Install Event
self.addEventListener('install', (event) => {
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

// Activate Event (Cleanup old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});