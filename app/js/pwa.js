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


    
function stateToServiceWorker(dd){
    theString = "guid,date,weight,units";console.log(theString);
    console.log(dd);
    for (var property in dd) {console.log(property);
      if (dd.hasOwnProperty(property)) {
        tempTable = dd[property];console.log(tempTable);
        thisLine = "\n"+tempTable["guid"]+","+tempTable["date"]+","+tempTable["weight"]+","+tempTable["units"];
        theString+=thisLine;console.log(theString);
      }
    }
    console.log(theString);
    var dd2 = JSON.stringify(theString);
    return stateToServiceWorker2(dd2);
}
function stateToServiceWorker2(dd){
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        console.log("before");console.log(dd);
        // console.log(JSON.stringify(dd));
        // dd="guid,data,weight,units\n01489dfe-0b85-49ed-b13a-b5f3d6933120,03/08/1978,142.2,lb";
        // var d2 = JSON.stringify(dd);
        console.log(dd);
        navigator.serviceWorker.controller.postMessage(dd);
        console.log("affter");
    }
}