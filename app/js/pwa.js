console.log("pwa.js");

if ('serviceWorker' in navigator) {
    // Register the service worker
    navigator.serviceWorker.register('/serviceworker.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        // An updated service worker has appeared in reg.installing!
        newWorker = reg.installing;

        newWorker.addEventListener('statechange', () => {
          
          if (newWorker.state){
              if (newWorker.state == "installed"){
                  if (navigator.serviceWorker.controller) {
                      console.log("dbg Show Update is Available");
                    // let notification = document.getElementById('notification');
                    // notification.className = 'show';
                  }
              }
          }
        });
      });
    }).catch(err => console.log("service worker not registered", err));

}