const cacheName = "sw_0.0.5d";
console.log(cacheName);
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg",
  "/images/coffee4.jpg",
]

self.addEventListener("install", installEvent => {console.log("waitUntil");
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {console.log("addall");
      cache.addAll(assets);
    })
  )
})

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {  
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );        
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

let refreshing;
// The event listener that is fired when the service worker updates
// Here we reload the page
self.addEventListener('controllerchange', function () {
  if (refreshing) return;
  window.location.reload();
  refreshing = true;
});
