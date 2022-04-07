let CACHE_NAME = 'my-site-cache-v1';
let urlsToCache = [
  './index.html',
  './',
  './manifest.json'
];

self.addEventListener('install', async function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then( async function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', async function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(async function(response) {
        if (response) {
          return response;
        }
        return await fetch(event.request);
      }
    )
  );
});
