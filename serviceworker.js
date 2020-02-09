console.log("serviceworker! 2");
const cacheName = "map-pwa1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg"
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
    console.log("SELF");
    
    try {
        // console.log(" START XXXXXXXXXXXXXXXXX");
        console.log(event.request);
        // console.log(fetch(event.request));
        // console.log(caches);
        // console.log(" END XXXXXXXXXXXXXXXXXX");
    } catch(err) {
        console.log(err.message);
    }
                    var z = fetch(event.request);
                    console.log(z);
                    
    if (event.request.url.includes("app.js")){ console.log("section 1");
         event.respondWith(
            fetch(event.request).then(function(response){
              console.log(response);
              if (response){
                return response;
              }
              caches.match(event.request)
                .then(function(response) {
                    console.log("response 2!");
                    console.log(response);
                    return response;
                })
            })
         )
        // );
    } else {console.log("section 2");
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {  
                    if (response) {
                        console.log("response 2!");
                        return response;
                    }
                    console.log("fetch 2!");
                    return fetch(event.request);
         //return response || fetch(event.request);
                }
            )
        );        
    }
});

// self.addEventListener('fetch', function(event) {
 // console.log(event.request.url);
 
  // event.respondWith(
   // caches.match(event.request).then(function(response) {
/*      console.log("START ##############");
     console.log(event);
     console.log(response);
     
     if (response){
        console.log("Response!");
        console.log(caches);
        // //caches.put(event.request,response.clone());
        console.log(response.clone());
        
     } else { console.log("No Response!")};
     
     console.log("END ##############"); */
     // return response || fetch(event.request);
   // })
 // );
// });