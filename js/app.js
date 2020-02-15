let newWorker;
const container = document.querySelector(".container")
const coffees = [
  { name: "One", image: "images/coffee1.jpg" },
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
}

document.addEventListener("DOMContentLoaded", showCoffees);

  if ('serviceWorker' in navigator) {console.log("load SW");
    // Register the service worker
    navigator.serviceWorker.register('/serviceworker.js').then(reg => {console.log("Register");
      reg.addEventListener('updatefound', () => {console.log("Update Found");
        // An updated service worker has appeared in reg.installing!
        newWorker = reg.installing;

        newWorker.addEventListener('statechange', () => {
          console.log("statechange");
          if (newWorker.state){console.log("1");
              if (newWorker.state == "installed"){console.log("2");
                  if (navigator.serviceWorker.controller) {console.log("3");
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
  console.log("reload");
  //window.location.reload();
  refreshing = true;
});
