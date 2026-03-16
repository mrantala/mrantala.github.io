// chart.js
let chart = null;
 
Chart.register(
  Chart.LineController,
  Chart.LineElement,
  Chart.PointElement,
  Chart.LinearScale,
  Chart.CategoryScale,
  Chart.TimeScale,
  Chart.Filler,        // ← REQUIRED
  Chart.Decimation     // ← REQUIRED

);

export function initChart() {console.log("initChart");
  const canvas = document.getElementById("weight-chart");
  if (!canvas) {
    console.warn("No #weight-chart canvas found");
    return;
  }

  if (chart) chart.destroy();

  chart = new Chart(canvas, {
    type: "line",
    data: { datasets: [] },
    options: {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
		  x: {
			type: "time",
			time: {
			  parser: "M/d/yyyy",
			  unit: "day",
			  tooltipFormat: "MMM d, yyyy"
			}
		  },
		  y: {
			beginAtZero: false
		  }
		}
    }
  }
  );
  
  window.chart1 = chart;

}

// Main entry point
export function renderChart(mode, entries, options) {console.log("renderChart");

console.log("Chart inside module:", Chart);
console.log("window.Chart:", window.Chart);

  const { points, regression } = prepareData(mode, entries, options);
  
  const fixedPoints = points.map(p => ({
  x: new Date(p.x),   // force rehydration
  y: p.y
}));
  chart.data.datasets.length = 0;
  chart.data.datasets.push(
    {
      type: "line",
	  label: "Daily Weight",
      data: fixedPoints,
	  parsing: {
       xAxisKey: "x",
       yAxisKey: "y"
      },

      borderColor: "#444",
      borderWidth: 2,
      tension: 0.2,
      pointRadius: 0,
	  order: 10,
	  fill: false,
	  backgroundColor: "rgba(0,0,0,0)"   // <— REQUIRED
    }
  );
console.log("Dataset count:", chart.data.datasets.length);
console.log("Dataset object:", chart.data.datasets[0]);

  if (regression) {
	    // Rehydrate regression dates
  const fixedRegression = regression.map(p => ({
    x: new Date(p.x),
    y: p.y
  }));


	const first = fixedRegression[0].y;console.log(first);
	const last = fixedRegression[fixedRegression.length - 1].y;console.log(last);

	const isIncreasing = last > first;console.log(isIncreasing);
	const trendColor = isIncreasing ? "#2e8b57" : "#c0392b" ;

    chart.data.datasets.push({
	  type: "line",
	  label: "Trend",
	  data: fixedRegression,
	  parsing: {
		xAxisKey: "x",
		yAxisKey: "y"
	  },

		borderColor: "#000",     // or any color
		borderWidth: 2,
		pointRadius: 0,
	  tension: 0.1,
	  order: 999,
	  z: 999,
	  borderCapStyle: "round",
	  borderJoinStyle: "round",
	  fill: false,
      backgroundColor: "rgba(0,0,0,0)"     // <— REQUIRED
    });
  }
  window.chart = chart;
  console.log(chart.data.datasets);
console.log(chart.config.options.scales.x.type);
console.log(chart.data.datasets.map(d => d.type));

console.log(chart.data.datasets.map(d => d.fill));
console.log(chart.data.datasets.map(d => d.backgroundColor));
console.log(chart.data.datasets.map(d => d.borderColor));
console.log(chart.data.datasets.map(d => d.borderWidth));
console.log(chart.data.datasets[0].data.slice(0,10));
console.log(chart.options.parsing);
console.log(chart.getDatasetMeta(0).data.length);
console.log("dataset parsing:", chart.data.datasets[0].parsing);
console.log("First point:", chart.data.datasets[0].data[0]);
console.log(chart.data.datasets[0].data[0].x instanceof Date);
console.log(typeof chart.data.datasets[0].data[0].x);
console.log(chart.getDatasetMeta(0).dataset);
console.log("Meta BEFORE update:", chart.getDatasetMeta(0));
console.log("Meta.dataset BEFORE update:", chart.getDatasetMeta(0).dataset);

  chart.update();
console.log("Scale class:", chart.scales.x.constructor.name);

console.log("Meta AFTER update:", chart.getDatasetMeta(0));
console.log("Meta.dataset AFTER update:", chart.getDatasetMeta(0).dataset);
console.log("Renderer:", chart.getDatasetMeta(0).dataset?.constructor?.name);

console.log("Dataset type:", chart.data.datasets[0].type);
console.log("Meta:", chart.getDatasetMeta(0));
console.log("Meta.dataset:", chart.getDatasetMeta(0).dataset);



}

// Dispatcher
function prepareData(mode, entries, options) {
  switch (mode) {
    case "daily":
      return prepareDaily(entries, options);
    case "weeklyMedian":
      return prepareWeeklyMedian(entries, options);
    // future:
    // case "monthlyMedian": ...
    // case "yearlySummary": ...
    default:
      return { labels: [], data: [] };
  }
}

function modeLabel(mode) {
  switch (mode) {
    case "daily": return "Daily Weight";
    case "weeklyMedian": return "Weekly Median Weight";
    default: return "Chart";
  }
}

function prepareDaily(entries, { startDate, endDate, primaryOnly, includeRegression }) {
	console.log("entries passed to prepareDaily:", entries);
	console.log("startDate:", startDate, "endDate:", endDate);
    console.log(includeRegression);
  const filtered = entries.filter(e => {
    if (primaryOnly && !e.primary) return false;
    const d = new Date(e.date);//console.log(d);
    return d >= startDate && d <= endDate;
  });

  //const labels = filtered.map(e => e.date);
  const labels = filtered.map(e => new Date(e.date));

  const data = filtered.map(e => e.weight);

  const points = filtered.map(e => {
    const [month, day, year] = e.date.split('/');
    return {
      x: new Date(year, month - 1, day),
      y: e.weight
    };
  });


  const regression = includeRegression
    ? computeRegression(points)
    : null;

  return { points, regression };

  //return { labels, data, regression };
}

function prepareWeeklyMedian(entries, { weeks, primaryOnly, includeRegression }) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - weeks * 7);

  const filtered = entries.filter(e => { console.log(e);
    if (primaryOnly && !e.primary) return false;
    const d = new Date(e.date);
    return d >= start;
  });

  const weekMap = new Map();

  for (const e of filtered) {
    const d = new Date(e.date);
    const monday = startOfWeek(d);
    const key = monday.toISOString().slice(0, 10);

    if (!weekMap.has(key)) weekMap.set(key, []);
    weekMap.get(key).push(e.weight);
  }

  const data = [];

  for (const [weekStart, weights] of [...weekMap.entries()].sort()) {
    labels.push(weekStart);
    data.push(median(weights));
  }

  const regression = includeRegression
    ? computeRegression(points)
    : null;

  return { labels, data, regression };
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function computeRegression(points) {
  if (points.length < 2) return null;

  const xs = points.map((_, i) => i);
  const ys = points.map(p => p.y);

  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, b, i) => a + b * ys[i], 0);
  const sumX2 = xs.reduce((a, b) => a + b * b, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return xs.map((x, i) => ({
    x: points[i].x,          // EXACT SAME DATE OBJECT
    y: slope * x + intercept
  }));
}