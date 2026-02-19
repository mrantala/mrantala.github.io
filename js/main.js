import { initRouter } from "./router.js";
import { initEntries } from "./entries.js";

initRouter();
initEntries();

// if ("serviceWorker" in navigator) {
  // navigator.serviceWorker.getRegistrations().then(regs => {
    // regs.forEach(reg => reg.unregister());
  // });
//}
// if ("serviceWorker" in navigator) {
  // navigator.serviceWorker.register("./sw.js");
// }