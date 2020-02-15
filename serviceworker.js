const cacheName = "sw_0.0.9d";
console.log(cacheName);
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee5.jpg",
  // "/images/coffee4.jpg",
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
              console.log("Delete",item);
            caches.delete(item);
          }
        }
    });
    console.log("done Clearing caches");
    return true;
}
function reloadPage(){
  console.log("reloadPage");
  self.skipWaiting();
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
    console.log("Update start");
    clearOldCaches().then(results => {
      console.log("reloadPage");
      self.skipWaiting();      
    });
    // self.skipWaiting();
  }
});
