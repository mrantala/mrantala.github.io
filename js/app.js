const container = document.querySelector(".container")
const coffees = [
  { name: "One", image: "images/coffee1.jpg" },
  { name: "Two", image: "images/coffee2.jpg" },
  { name: "Three", image: "images/coffee3.jpg" },
  { name: "Rchitecto", image: "images/coffee4.jpg" },
  // { name: " Beatae", image: "images/coffee5.jpg" },
  // { name: " Vitae", image: "images/coffee6.jpg" },
  // { name: "Inventore", image: "images/coffee7.jpg" },
  // { name: "Veritatis", image: "images/coffee8.jpg" },
  // { name: "Accusantium", image: "images/coffee9.jpg" },
]

const showCoffees = () => {
  let output = ""
  coffees.forEach(
    ({ name, image }) =>
      (output += `
              <div class="card">
                <img class="card--avatar" src=${image} />
                <h1 class="card--title">${name}</h1>
                <a class="card--link" href="#">Taste</a>
              </div>
              `)
  )
  container.innerHTML = output
  doNew();
}

document.addEventListener("DOMContentLoaded", showCoffees)

let refreshing;

if ("serviceWorker" in navigator) {

  function reg(res){
   console.log("service worker registered");
   console.log(res);
    return res;   
  }
  function eee(res){
    console.log("eee");   
  }
  function addControllerChange(res){
      console.log("set controllerChange");
      console.log(res);
    // The event listener that is fired when the service worker updates
   // Here we reload the page
       navigator.serviceWorker.oncontrollerchange = function () {console.log("controllerChange trigger");
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    };
    
    // navigator.serviceWorker.addEventListener('controllerchange', function () {console.log("controllerChange trigger");
        // if (refreshing) return;
        // window.location.reload();
        // refreshing = true;
    // }); 
  }
  
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceworker.js")
      .then(reg).then(addControllerChange).then(eee)
      .catch(err => console.log("service worker not registered", err))
  })
}

/* if ("serviceWorker" in navigator) {

  function reg(){
  
  }
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceworker.js")
      .then(res => {
          console.log("service worker registered");
          console.log(res);
          // res.addEventListener('updatefound', () => {
            // console.log("UpdateFound");
            // let newWorker;
            // newWorker = res.installing;
            // newWorker.addEventListener('statechange', () => {

                // //Has service worker state changed?
                // switch (newWorker.state) {
                    // case 'installed':
                    // console.log("installed");
                    // //There is a new service worker available, show the notification
                    // if (navigator.serviceWorker.controller) {
                        // let notification = document.getElementById('notification');
                        // notification.className = 'show';
                    // }
                    // break;
                // }
            // });
          // })
      })
      .catch(err => console.log("service worker not registered", err))
  })

   
   // The event listener that is fired when the service worker updates
   // Here we reload the page
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
} */