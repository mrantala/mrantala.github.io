import { initRouter, showView } from "./router.js";
import { initEntries } from "./entries.js";
import { initSettings } from "./settings.js";

initRouter();
initEntries();
initSettings();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
  });
}

//showView("view-entry");

// if ("serviceWorker" in navigator) {
  // navigator.serviceWorker.register("./sw.js");
// }