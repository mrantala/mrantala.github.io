const cacheName = "sw_0.0.02b";
console.log(cacheName);
const assets = [
  "/",
  "/index.html",
  "plugins/fontawesome-free/css/all.min.css",
  "dist/css/adminlte.min.css",
  "https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700",
  "/js/app.js",
  "/images/coffee1.jpg",
  "plugins/jquery/jquery.min.js",
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

function clearOldCaches(i){
    caches.keys().then(keylist => {
      keylist.forEach(myFunction);

        function myFunction(item, index) {
          if (item != cacheName){
            caches.delete(item);
          }
        }
      i.skipWaiting();
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
            })
    )
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    clearOldCaches(self);
    self.skipWaiting();
  }
});
