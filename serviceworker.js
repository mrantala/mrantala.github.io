const cacheName = "WwW_0";
console.log(cacheName);
const assets = [
  "/",
  "/index.html",
  "app/css/blugold.css",
  "app/js/app.js",
  "app/js/blugold.js",
  "app/js/pwa.js",
  "https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700",
  "lib/bootstrap/js/bootstrap.min.js",
  "lib/bootstrap-datepicker/css/bootstrap-datepicker.min.css",
  "lib/bootstrap-datepicker/js/bootstrap-datepicker.min.js",
  "lib/adminlte/css/AdminLTE.min.css",
  "lib/adminlte/css/skins/skin-blue.min.css",
  "lib/adminlte/js/adminlte.min.js",
  "lib/font-awesome/css/font-awesome.min.css",
  "lib/jquery/jquery.min.js",
  "lib/jquery-ui/jquery-ui.min.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      // cache.addAll(assets);
      assets.forEach(myFunction);
      
      function myFunction(iAsset){
        console.log(iAsset);
        cache.add(iAsset);
      }
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