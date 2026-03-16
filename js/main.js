import { initRouter, showView } from "./router.js";
import { initEntries } from "./entries.js";
import { initSettings } from "./settings.js";

console.log("MAIN sees Chart:", Chart);
console.log("window.Chart:", window.Chart);


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
