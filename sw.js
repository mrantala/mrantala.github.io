const CACHE_NAME = "weight-tracker-v1";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/base.css",
  "./css/layout.css",
  "./js/main.js",
  "./js/router.js",
  "./js/storage.js",
  "./js/entries.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});