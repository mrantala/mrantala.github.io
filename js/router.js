import { initChart, renderChart } from "./weightChart.js";
import { getEntries } from "./entries.js";

let dailyRange = 7; // default

function setDailyRange(range) {
  dailyRange = range;
}

// function getDailyRange() {
  // if (dailyRange === "custom") {
    // const start = document.getElementById("daily-start").value;
    // const end = document.getElementById("daily-end").value;
    // return {
      // startDate: new Date(start),
      // endDate: new Date(end)
    // };
  // }

  // const endDate = new Date();
  // const startDate = new Date();
  // startDate.setDate(startDate.getDate() - Number(dailyRange));

  // return { startDate, endDate };
// }

function getDailyRange() {
  const entries = getEntries();
  if (!entries || entries.length === 0) {
    const today = new Date();
    return { startDate: today, endDate: today };
  }

  //Find earliest and latest dates in the dataset
  const dates = entries.map(e => new Date(e.date));
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));

  return { startDate, endDate };
}



function showChartsView() {
  initChart();
  setupChartControls();
  renderCurrentChart();
}

function setupChartControls() {
  const typeSelect = document.getElementById("chart-type");
  const primaryOnly = document.getElementById("primary-only");
  const includeRegression = document.getElementById("include-regression");

  typeSelect.addEventListener("change", () => {
    updateVisibleControls();
    renderCurrentChart();
  });

  primaryOnly.addEventListener("change", renderCurrentChart);
  includeRegression.addEventListener("change", renderCurrentChart);

  document.querySelectorAll("#daily-controls button[data-range]")
    .forEach(btn => btn.addEventListener("click", () => {
      setDailyRange(btn.dataset.range);
      renderCurrentChart();
    }));

  document.querySelectorAll("#weekly-controls button[data-weeks]")
    .forEach(btn => btn.addEventListener("click", () => {
      setWeeklyRange(btn.dataset.weeks);
      renderCurrentChart();
    }));
	
	document.querySelectorAll("#daily-controls button[data-range]")
  .forEach(btn => btn.addEventListener("click", () => {
    setDailyRange(btn.dataset.range);
    renderCurrentChart();
  }));
}

function renderCurrentChart() {
  const entries = getEntries();
  const mode = document.getElementById("chart-type").value;

  const primaryOnly = document.getElementById("primary-only").checked;
  const includeRegression = document.getElementById("include-regression").checked;
  console.log(document.getElementById("include-regression").checked);

  if (mode === "daily") {
    const { startDate, endDate } = getDailyRange();
    renderChart("daily", entries, {
      startDate,
      endDate,
      primaryOnly,
      includeRegression
    });
  }

  if (mode === "weeklyMedian") {
    const weeks = getWeeklyRange();
    renderChart("weeklyMedian", entries, {
      weeks,
      primaryOnly,
      includeRegression
    });
  }
}


  
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
	// if (name === "charts") {
	  // requestAnimationFrame(() => {
		// requestAnimationFrame(() => {
		  // initTestChart();
		// });
	  // });
	// }
	if (name === "charts") {
	  showChartsView();
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