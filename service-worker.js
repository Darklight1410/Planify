const CACHE_NAME = 'planify-v1';
const urlsToCache = [
  './index.html',
  './daily.html',
  './storage.html',
  './monthly.html',
  './about.html',
  './planer.html',
  './habit-tracker.html',
  './productivity.html',
  './styles/style.css',
  './scripts/daily.js',
  './scripts/monthly.js',
  './scripts/habit-tracker.js',
  './scripts/planner.js',
  './scripts/savefiles.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './img/icon.ico',
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
