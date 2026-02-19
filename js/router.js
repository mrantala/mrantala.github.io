export function initRouter() {
  const buttons = document.querySelectorAll("nav button");
  const views = document.querySelectorAll(".view");

  function showView(name) {
    views.forEach(v => v.classList.toggle("hidden", v.id !== `view-${name}`));
    buttons.forEach(b => b.classList.toggle("active", b.dataset.view === name));
    localStorage.setItem("activeView", name);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });

  // Restore last view or default to entry
  const saved = localStorage.getItem("activeView") || "entry";
  showView(saved);
}