let newWorker;
const container = document.querySelector(".container")
const coffees = [
  { name: "One", image: "images/coffee1.jpg" },
  { name: "Two", image: "images/coffee2.jpg" },
  { name: "Three", image: "images/coffee5.jpg" },
  // { name: "Rchitecto", image: "images/coffee4.jpg" },
  // { name: " Beatae", image: "images/coffee5.jpg" },
  // { name: " Vitae", image: "images/coffee6.jpg" },
  // { name: "Inventore", image: "images/coffee7.jpg" },
  // { name: "Veritatis", image: "images/coffee8.jpg" },
  // { name: "Accusantium", image: "images/coffee9.jpg" },
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

document.addEventListener("DOMContentLoaded", showCoffees);

  if ('serviceWorker' in navigator) {
    // Register the service worker
    navigator.serviceWorker.register('/serviceworker.js').then(reg => {
      reg.addEventListener('updatefound', () => {console.log("Update found");
        // An updated service worker has appeared in reg.installing!
        newWorker = reg.installing;

        newWorker.addEventListener('statechange', () => {
          
          if (newWorker.state){
              if (newWorker.state == "installed"){
                  if (navigator.serviceWorker.controller) {
                    let notification = document.getElementById('notification');
                    notification.className = 'show';
                  }
              }
          }
        });
      });
    }).catch(err => console.log("service worker not registered", err));

  }


document.getElementById('reload').addEventListener('click', function(){console.log("click");console.log(newWorker);
    newWorker.postMessage({ action: 'skipWaiting' });
});

let refreshing;
// The event listener that is fired when the service worker updates
// Here we reload the page
navigator.serviceWorker.addEventListener('controllerchange', function () {
  if (refreshing) {
      refreshing = false;
      return;
  }
  window.location.reload();
  refreshing = true;
});
