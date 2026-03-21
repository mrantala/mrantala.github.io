import { initChart, renderChart } from "./weightChart.js";
import { getEntries } from "./entries.js";

let dateRange = -99; // default
let groupingType = "daily";
let calcType = "average";
let entriesZ = null;

function localGetEntries(){
	if (entriesZ == null){
		entriesZ = getEntries();
	} //else { console.log("entries already populated")}
	return entriesZ;
}
function listSettings(){
	console.log(dateRange);
	console.log(groupingType);
	console.log(calcType);
}
function setDailyRange(range) {
  dateRange = range;
  listSettings();
  renderCurrentChart();
}

function setSliderMax(maxCount) {console.log(maxCount);
  const slider = document.getElementById("span-slider");
  slider.max = maxCount;

  // If current value is above new max, clamp it
  if (parseInt(slider.value, 10) > maxCount) {
    slider.value = maxCount;
  }

  // Optional: update visible label
  document.getElementById("span-value").textContent = slider.maxCount;
}

function getSpan(entries, test) {
  if (!entries.length) return 0;
  console.log(test);
  // Convert all dates to Date objects
  const dates = entries.map(e => new Date(e.date));

  // Find earliest and latest
  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));

  const startYear = min.getFullYear();
  const endYear = max.getFullYear();

  const startMonth = min.getFullYear() * 12 + min.getMonth();
  const endMonth = max.getFullYear() * 12 + max.getMonth();

  switch (test) {
    case "weekly": {
      const msPerWeek = 1000 * 60 * 60 * 24 * 7;
      const diffWeeks = Math.floor((max - min) / msPerWeek) + 1;
      return diffWeeks;
    }

    case "monthly": {
      // Inclusive month count
      return (endMonth - startMonth) + 1;
    }

    case "yearly": {
      // Inclusive year count
      return (endYear - startYear) + 1;
    }

    default:
      return 0;
  }
}

function setPeriodGrouping(grouping) {
  console.log(grouping);
  groupingType=grouping;
  listSettings();
  const daily = document.getElementById("daily-controls");
  const periodControls = document.getElementById("period-controls");

  if (grouping=="daily"){
      daily.classList.remove("hidden");
      periodControls.classList.add("hidden");
  } else {
	  //console.log(entriesZ);
	  const entries = localGetEntries();
	  //entriesZ = entries;
	  console.log(groupingType);
	  const iSpan = getSpan(entries,groupingType);
	  console.log(iSpan);
	  setSliderMax(iSpan);
      daily.classList.add("hidden");
      periodControls.classList.remove("hidden");
	  
  }
  renderCurrentChart();
}

function setCalculationStyle(calc) {
  calcType = calc;
  listSettings();
  renderCurrentChart();
}

function getDailyRange() {//console.log(entriesZ);
  const entries = localGetEntries();
  if (!entries || entries.length === 0) {
    const today = new Date();
    return { startDate: today, endDate: today };
  }

  //Find earliest and latest dates in the dataset
  const dates = entries.map(e => new Date(e.date));
  let startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));

	console.log(dateRange,dateRange>-1);
  if (dateRange >-1){
	  startDate = new Date(endDate.getTime() - dateRange * 24 * 60 * 60 * 1000);
  }
  return { startDate, endDate };
}

function getWeeklyRange(){//console.log(entriesZ);
  const entries = localGetEntries();
  if (!entries || entries.length === 0) {
    const today = new Date();
    return { startDate: today, endDate: today };
  }

  //Find earliest and latest dates in the dataset
  const dates = entries.map(e => new Date(e.date));	
  if (dateRange >-1){
	  return dateRange;
  }	
  return 9999;
}

function showChartsView() {
  initChart();
  setupChartControls();
  renderCurrentChart();
}

function setupChartControls() {
  // const typeSelect = document.getElementById("chart-type");
  const primaryOnly = document.getElementById("primary-only");
  const includeRegression = document.getElementById("include-regression");

/*   typeSelect.addEventListener("change", () => {console.log("56");
    //updateVisibleControls();
    renderCurrentChart();
  }); */

  primaryOnly.addEventListener("change", renderCurrentChart);
  includeRegression.addEventListener("change", renderCurrentChart);

  document.querySelectorAll("#grouping-controls button[data-grouping]")
    .forEach(btn => btn.addEventListener("click", () => {       console.log("line 162");
	  console.log(btn.dataset.grouping);
      setPeriodGrouping(btn.dataset.grouping);
      renderCurrentChart();
    }));


	document.getElementById("span-slider").addEventListener("input", (e) => {
	  const value = e.target.value;
	  document.getElementById("span-value").textContent = value;

	  // Do whatever else you want when it changes
	  console.log("Slider changed to:", value);
	});

  document.querySelectorAll("#math-controls button[data-calc]")
    .forEach(btn => btn.addEventListener("click", () => { console.log("83b");
      setCalculationStyle(btn.dataset.calc);
      renderCurrentChart();
    }));
	
  document.querySelectorAll("#daily-controls button[data-range]")
    .forEach(btn => btn.addEventListener("click", () => { console.log("65");
      setDailyRange(btn.dataset.range);
      renderCurrentChart();
    }));


	
  document.querySelectorAll("#weekly-controls button[data-weeks]")
    .forEach(btn => btn.addEventListener("click", () => { console.log("71");
      setWeeklyRange(btn.dataset.weeks);
      renderCurrentChart();
    }));
	
}

function renderCurrentChart() {console.log("line 184");//console.log(entriesZ);
  const entries = localGetEntries();
  let dateRange = -99; // default

  const primaryOnly = document.getElementById("primary-only").checked;
  const includeRegression = document.getElementById("include-regression").checked;

  if (groupingType === "daily") {
    const { startDate, endDate } = getDailyRange();
	console.log(dateRange,startDate, endDate );
    renderChart(groupingType, entries, {
      startDate,
      endDate,
      primaryOnly,
      includeRegression
    });
  }

  if (groupingType === "weekly") {
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