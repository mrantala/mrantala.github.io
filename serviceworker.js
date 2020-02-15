const cacheName = "ww_01c";
console.log(cacheName);
const assets = [
  "/",
  "/index.html",
  "app/pages/widgets.html",
  "plugins/adminlte/css/adminlte.min.css",
  "plugins/adminlte/js/adminlte.js",
  "plugins/adminlte/js/demo.js",
  "https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700",
  "plugins/bootstrap/js/bootstrap.bundle.min.js",
  "plugins/chartjs/Chart.min.js",
  "plugins/fontawesome-free/css/all.min.css",
  "plugins/jquery/jquery.min.js",
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
            // caches.delete(item);
            console.log("Delete: "+item);
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
            })
    )
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

clearOldCaches();