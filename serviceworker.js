const cacheName = "sw_0.0.5r";
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
      caches.keys().then(keylist => {
      keylist.forEach(myFunction);

        function myFunction(item, index) {
          console.log(item,cacheName);
          if (item != cacheName){
            caches.delete(item);
          }
        }    
      });
    })
  )
})

self.addEventListener('fetch', function(event) {console.log(event);
    event.respondWith(

        caches.match(event.request)
            .then(function(response) {
// console.log(event.request.url.toLowerCase());
        // if (event.request.url.toLowerCase().includes("index.html")){console.log("Use new index.html");
            // return response;
        // }
        
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );        
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {console.log("Jimmy");
    self.skipWaiting();
  }
});
