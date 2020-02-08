const cacheName = "map-pwa1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg",
  // "/images/coffee4.jpg",
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
 console.log(event.request.url);
 
  event.respondWith(
   caches.match(event.request).then(function(response) {
     console.log("##############");
     console.log(event);
     console.log(response);
     console.log("##############");
     // if (response){
        // console.log("Response!");
        // //caches.put(event.request,response.clone());
        // console.log(event);
        // console.log(response.clone());
        
     // } else { console.log("No Response!")}
     return response || fetch(event.request);
   })
 );
});