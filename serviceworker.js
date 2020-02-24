const CACHE_NAME = "WwW_0.0.0zzzz5";
importScripts('/app/js/db.js');
swTable = "";

console.log(CACHE_NAME);
const assets = [
  "/",
  "/index.html",
  "app/css/blugold.css",
  "app/js/app.js",
  "app/js/blugold.js",
  "app/js/pwa.js",
  "app/js/db.js",  
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
  "lib/datatables.net-bs/css/dataTables.bootstrap.min.css",
  "lib/datatables.net-bs/js/dataTables.bootstrap.min.js",
  "lib/datatables.net/js/jquery.dataTables.min.js",
]

self.addEventListener("install", installEvent => {console.log("install");
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // cache.addAll(assets);
      assets.forEach(myFunction);
      
      function myFunction(iAsset){
        console.log(iAsset);
        cache.add(iAsset);
      }
    })
  )
});

/* function clearOldCaches(){
    caches.keys().then(keylist => {
      keylist.forEach(myFunction);

        function myFunction(item, index) {
          if (item != CACHE_NAME){
            // caches.delete(item);
            console.log("Delete: "+item);
          }
        }
    });
} */

//{'Content-Type': 'text/html'}
self.addEventListener('fetch', function(event) {
    var requestURL = new URL(event.request.url);
    
    if (requestURL.pathname === "/data.csv") {
        console.log("Boom!");
        console.log(swTable);
        console.log(theTable);
      event.respondWith(
          new Response(makeCSV(), {
            headers: {'Content-Type': 'application/csv',
            "Content-Disposition":"attachment; filename="+"wWw_Data.csv"}
          })
       )
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
        )
    }
});

// self.addEventListener('message', function (event) {
  // if (event.data.action === 'skipWaiting') {
    // self.skipWaiting();
  // }
// });

/* // Here we add the event listener for receiving messages
self.addEventListener('message', function(event){
    console.log("I hear you!");
    console.log(event.data);
}); */

self.addEventListener('message', function(event){
    // Receive the data from the client
    var data = event.data;
    console.log("I hear you");
    console.log(event);
    console.log(event.data);
    swTable =data;
    console.log(swTable);
    // The unique ID of the tab
    var clientId = event.source.id 

    // A function that handles the message
    self.syncTabState(data, clientId);
});

self.addEventListener("activate", function(event) {console.log("activate");
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cacheName){
                    if (CACHE_NAME !== cacheName && cacheName.startsWith("WwW")){
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
});

self.syncTabState = function(data, clientId){
    clients.matchAll().then(function(clients) {

        // Loop over all available clients
        clients.forEach(function(client) {

            // No need to update the tab that 
            // sent the data
            if (client.id !== clientId) {
                self.sendTabState(client, data)
            }
           
        })
    })
}

// clearOldCaches();