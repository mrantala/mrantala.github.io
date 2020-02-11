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

document.addEventListener("DOMContentLoaded", showCoffees)

if ("serviceWorker" in navigator) {
  console.log("service Work rocks");   
}

// The click event on the notification
document.getElementById('InstallButton').addEventListener('click', function(){console.log("Click 2");
    // newWorker.postMessage({ action: 'skipWaiting' });
});