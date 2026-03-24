// chart.js


let chart = null;
const Chart = window.Chart;
Chart.register(
  Chart.LineController,
  Chart.LineElement,
  Chart.PointElement,
  Chart.LinearScale,
  Chart.TimeScale,
  Chart.CategoryScale,
  Chart.Legend,
  Chart.Tooltip
);

export function initChart() {
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
		animation: false,
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
		},
		plugins: {
		  legend: {
			labels: {
			  usePointStyle: true,
			  pointStyle: 'line',
			  pointStyleWidth: 40   // optional: makes the line longer
			}
		  }
		}
    }
  }
  );

}

// Main entry point
export function renderChart(mode, entries, options) {
	
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

      borderColor: "#333",
      borderWidth: 1.5,
      tension: 0.2,
      pointRadius: 0,
	  order: 10,
	  fill: false,
	  backgroundColor: "rgba(0,0,0,0)"   // <— REQUIRED
    }
  );

  if (regression) {
	    // Rehydrate regression dates
  const fixedRegression = regression.map(p => ({
	x: new Date(p.x),
	y: p.y
  }));


	const first = fixedRegression[0].y;
	const last = fixedRegression[fixedRegression.length - 1].y;

	const isIncreasing = last < first;
	const trendColor = isIncreasing ? "#00cc44" : "#ff3333";

	chart.data.datasets.push({
	  type: "line",
	  label: "Trend",
	  data: fixedRegression,
	  parsing: {
		xAxisKey: "x",
		yAxisKey: "y"
	  },

	  // Bright, high-contrast colors
	  borderColor: trendColor,
	  borderWidth: window.innerWidth < 500 ? 2 : 3,

	  // Dashed line
	  borderDash: window.innerWidth < 500 ? [4, 3] : [6, 4],

	  // ⭐ HALO / GLOW EFFECT ⭐
	  borderShadowColor: trendColor + "55",   // same color, 33% opacity
	  borderShadowBlur: 80,                    // size of the glow

	  pointRadius: 0,
	  tension: 0.1,

	  // Force it to draw last
	  order: 9999,
	  z: 9999,

	  borderCapStyle: "round",
	  borderJoinStyle: "round",
	  fill: false,
	  backgroundColor: "rgba(0,0,0,0)"
	});
  }

  chart.update();
  window.chart = chart;
console.log("REAL CHART:", chart);
}

// Dispatcher
function prepareData(mode, entries, options) {
	console.log(mode);
	console.log(entries);
	console.log(options);
  switch (mode) {
    case "daily":
      return prepareDaily(entries, options);
    case "weeklyMedian":
      return prepareWeeklyMedian(entries, options);
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

function prepareWeeklyMedian(entries, { weeks, primaryOnly, includeRegression }) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - weeks * 7);

  // Filter entries
  const filtered = entries.filter(e => {
    if (primaryOnly && !e.primary) return false;
    const d = new Date(e.date);
    return d >= start;
  });

  // Group weights by Monday-of-week
  const weekMap = new Map();

  for (const e of filtered) {
    const d = new Date(e.date);
    const monday = startOfWeek(d); // returns a Date
    const key = monday.toISOString().slice(0, 10); // YYYY-MM-DD

    if (!weekMap.has(key)) weekMap.set(key, []);
    weekMap.get(key).push(e.weight);
  }

  // Build points array: { x: Date(monday), y: median }
  const points = [...weekMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, weights]) => ({
      x: new Date(weekStart),     // Monday of that week
      y: median(weights)
    }));

  // Compute regression on weekly points
  const regression = includeRegression
    ? computeRegression(points)
    : null;

  return { points, regression };
}

function prepareDaily(entries, { startDate, endDate, primaryOnly, includeRegression }) {
  const filtered = entries.filter(e => {
    if (primaryOnly && !e.primary) return false;
    const d = new Date(e.date);
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