const cacheName = "sw_0.0.6d";
console.log(cacheName);
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg",
  // "/images/coffee4.jpg",
]

self.addEventListener("install", installEvent => {console.log("waitUntil");
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {console.log("addall");
      cache.addAll(assets);
/*       caches.keys().then(keylist => {
      keylist.forEach(myFunction);

        function myFunction(item, index) {
          console.log(item,cacheName);
          if (item != cacheName){
            caches.delete(item);
          }
        }    
      }); */
    })
  )
})

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
    //console.log(event);
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
    clearOldCaches();//.then(function(nullItem){console.log(nullItem);
        self.skipWaiting();
    //});
  }
});
