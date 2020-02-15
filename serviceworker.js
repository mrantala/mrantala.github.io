const cacheName = "sw_0.0.88b";
console.log(cacheName);
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee5.jpg",
  "/plugins/fontawesome-free/css/all.min.css",
  "plugins/jquery/jquery.min.js",
  "/dist/css/adminlte.min.css",
  "plugins/bootstrap/js/bootstrap.bundle.min.js",
  "dist/js/adminlte.js",
  "plugins/chart.js/Chart.min.js",
  "dist/js/demo.js",
  "dist/js/pages/dashboard3.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  )
});

function clearOldCaches(){
    caches.keys().then(keylist => {
      keylist.forEach(myFunction);

        function myFunction(item, index) {
          if (item != cacheName){
            caches.delete(item);
          }
        }
    });
}
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
    clearOldCaches();
    self.skipWaiting();
  }
});
