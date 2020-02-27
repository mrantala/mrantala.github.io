const CACHE_NAME = "WwW_0.0.0z5";
self.csv = "";
console.log(CACHE_NAME);

const assets = [
  "/",
  "/index.html",
  "app/css/blugold.css",
  "app/js/app.js",
  "app/js/settings.js", 
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
        console.log("helloo");
        console.log(self.csv);
        var date = new Date();
        var dateStr =
          date.getFullYear() + 
          ("00" + (date.getMonth() + 1)).slice(-2) +
          ("00" + date.getDate()).slice(-2) + "_" +
          ("00" + date.getHours()).slice(-2) +
          ("00" + date.getMinutes()).slice(-2) +
          ("00" + date.getSeconds()).slice(-2);
     console.log(dateStr);

        event.respondWith(
            new Response(self.csv, {
                headers: {'Content-Type': 'application/csv',
                          "Content-Disposition":"attachment; filename="+"wWw_Data_"+dateStr+".csv"}
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

self.addEventListener('message', function(event){
    // console.log("boom");
    // console.log(event);
    // Receive the data from the client
    var data = event.data;
    // console.log(data);
    self.csv =data;
    // console.log(self.csv);
    // The unique ID of the tab
    var clientId = event.source.id 

    // A function that handles the message
    //self.syncTabState(data, clientId);
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

// function returnCSV(){console.log("hi");
    // return self.csv;
// }

/* self.syncTabState = function(data, clientId){
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
} */