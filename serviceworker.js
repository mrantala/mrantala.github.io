const cacheName = "sw_5";
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
  // "https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofAjsOUYevI.woff2",
  // "https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKofINeaB.woff2",
  // "/images/coffee5.jpg",
  // "/images/coffee6.jpg",
  // "/images/coffee7.jpg",
  // "/images/coffee8.jpg",
  // "/images/coffee9.jpg",
]

// self.addEventListener("install", installEvent => {console.log("waitUntil");
  // installEvent.waitUntil(
    // caches.open(cacheName).then(cache => {console.log("addall");
      // cache.addAll(assets);
    // })
  // )
// })

// self.addEventListener("fetch", fetchEvent => {
  // fetchEvent.respondWith(
    // caches.match(fetchEvent.request).then(res => {
        // if (res) {
            // return res;
        // }
        // console.log("fetch: "+fetchEvent.request);
        // return fetch(fetchEvent.request);
    // })
  // )
// })

// self.addEventListener('fetch', function(event) {
    // event.respondWith(
        // caches.match(event.request)
            // .then(function(response) {  
                // if (response) {
                    // return response;
                // }
                // return fetch(event.request);
            // }
        // )
    // );        
// });

// self.addEventListener('message', function (event) {
  // console.log(event);
  // if (event.data.action === 'skipWaiting') {
    // self.skipWaiting();
  // }
// })

// self.addEventListener('controllerchange', function () {console.log("controllerChange trigger 2");
    // if (refreshing) return;
    // window.location.reload();
    // refreshing = true;
// });
    