console.log("serviceworker! 9d");
const cacheName = "map-pwa1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg",
  "/images/coffee4.jpg",
  // "/images/coffee5.jpg",
  // "/images/coffee6.jpg",
  // "/images/coffee7.jpg",
  // "/images/coffee8.jpg",
  // "/images/coffee9.jpg",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {  
                if (response) {
                    console.log("response");
                    return response;
                }
                console.log(event.request);
                console.log("fetch");
                return fetch(event.request);
            }
        )
    );        
});
