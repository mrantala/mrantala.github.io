import { initTestChart } from "./chart.js";


export function showView(name) {
  const buttons = document.querySelectorAll("nav button");
  const views = document.querySelectorAll(".view");

  const targetId = `view-${name}`;
  const targetView = document.getElementById(targetId);

  // If no matching view exists, do nothing
  if (!targetView) {
    console.warn(`showView: no view found for "${name}"`);
    return;
  }

  views.forEach(v => v.classList.toggle("hidden", v.id !== targetId));
  buttons.forEach(b => b.classList.toggle("active", b.dataset.view === name));

  // 👉 Hook chart initialization here
	if (name === "charts") {
	  requestAnimationFrame(() => {
		requestAnimationFrame(() => {
		  initTestChart();
		});
	  });
	}



  //0.0.17: No longer show where we lef off, localStorage.setItem("activeView", name);
}


export function initRouter() {
  const buttons = document.querySelectorAll("nav button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });

  // Restore last view or default to entry
  //0.0.17: No longer show where we lef off, const saved = localStorage.getItem("activeView") || "entry";
  //0.0.17: No longer show where we lef off, showView(saved);
  showView("entry");
}