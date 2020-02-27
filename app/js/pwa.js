console.log("pwa.js");

if ('serviceWorker' in navigator) {
    // Register the service worker
    navigator.serviceWorker.register('/serviceworker.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        // An updated service worker has appeared in reg.installing!
        newWorker = reg.installing;

// Here we add the event listener for receiving messages
newWorker.addEventListener('message', function(event){
    console.log("I hear you!");
    console.log(event.data);
});

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
console.log("DBG-todo: Disable Download if no servie worker support");
function sendToServiceWorker(i){console.log("sendToServiceWorker");
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        console.log("before send");
        console.log(i);
        navigator.serviceWorker.controller.postMessage(i);
        console.log("after send");
    }
}