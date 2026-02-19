import { initRouter } from "./router.js";
import { initEntries } from "./entries.js";

initRouter();
initEntries();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}