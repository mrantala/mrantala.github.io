import { initRouter, showView } from "./router.js";
import { initEntries } from "./entries.js";
import { initSettings } from "./settings.js";

//Wait until DOM is loaded so that when I read the entries, storage is ready
document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  initEntries();
  initSettings();
});


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
  });
}

window.addEventListener("orientationchange", () => {
  // Force Safari to recalc layout
  document.body.style.display = "none";
  requestAnimationFrame(() => {
    document.body.style.display = "";
  });
});

//window.addEventListener("orientationchange", () => {
  // setTimeout(() => {
    // applyLayout();   // or whatever your layout function is called
  // }, 50);
// });
//showView("view-entry");

// if ("serviceWorker" in navigator) {
  // navigator.serviceWorker.register("./sw.js");
// }