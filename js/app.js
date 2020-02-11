const container = document.querySelector(".container");
const coffees = [
  { name: "One", image: "images/coffee1.jpg" },
  { name: "Two", image: "images/coffee2.jpg" },
  { name: "Three", image: "images/coffee3.jpg" },
  { name: "Rchitecto", image: "images/coffee4.jpg" },
]

const showCoffees = () => {
    console.log("showCoffees");
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

// document.addEventListener("DOMContentLoaded", showCoffees);

  // if ('serviceWorker' in navigator) {
    // Register the service worker
    // console.log("service Work rocks2");
    // navigator.serviceWorker.register('/serviceWorker.js').then(reg => {
      // reg.addEventListener('updatefound', () => {

        // //An updated service worker has appeared in reg.installing!
        // newWorker = reg.installing;

        // newWorker.addEventListener('statechange', () => {

          // //Has service worker state changed?
          // switch (newWorker.state) {
            // case 'installed':

    // //There is a new service worker available, show the notification
              // if (navigator.serviceWorker.controller) {
                // let notification = document.getElementById('notification');
                // notification.className = 'show';
              // }

              // break;
          // }
        // });
      // });
    // }).catch(err => console.log("service worker not registered", err));

  // }
  
// let newWorker;

// document.getElementById('reload').addEventListener('click', function(){
    // newWorker.postMessage({ action: 'skipWaiting' });
// });