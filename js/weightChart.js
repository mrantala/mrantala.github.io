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
export function renderChart(groupingType,calcType, entries, options) {
		
  const { points, regression } = prepareData(groupingType,calcType, entries, options);
  
  const fixedPoints = points.map(p => ({
	  x: new Date(p.x),   // force rehydration
	  y: p.y
  }));
  
  const firstDate = fixedPoints[0]?.x;
  const lastDate = fixedPoints[fixedPoints.length - 1]?.x;

  const spansMultipleYears =
  firstDate && lastDate && firstDate.getFullYear() !== lastDate.getFullYear();
  
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

	const xScale = chart.options.scales.x;

	if (groupingType === "daily") {
	  xScale.time.unit = "day";
	  xScale.time.displayFormats = spansMultipleYears
		? { day: "MMM yyyy" }
		: { day: "M/d" };
	}

	if (groupingType === "weekly") {
	  xScale.time.unit = "week";
	  xScale.time.displayFormats = spansMultipleYears
		? { week: "MMM yyyy" }
		: { week: "M/d" };
	}

	if (groupingType === "monthly") {
	  xScale.time.unit = "month";
	  xScale.time.displayFormats = { month: "MMM yyyy" };
	}

	if (groupingType === "yearly") {
	  xScale.time.unit = "year";
	  xScale.time.displayFormats = { year: "yyyy" };
	}

  chart.update();
  window.chart = chart;
console.log("REAL CHART:", chart);
}

function prepareData(groupingType, calcType, entries, { primaryOnly, includeRegression }) {
  if (!entries || entries.length === 0) return { points: [] };

  console.log(groupingType);
  console.log(calcType);
  console.log(entries.length);
  console.log(primaryOnly);
  console.log(includeRegression);

/*   const filtered = entries.filter(e => {
    if (primaryOnly && !e.primary) return false;
    // const d = new Date(e.date);
    // return d >= startDate && d <= endDate;
  }); */
  
  // Convert all dates once  
  const normalized = entries.map(e => ({
    ...e,
    dateObj: new Date(e.date)
  }));

  // Grouping function
  const groups = new Map();

  for (const e of normalized) {
    let key;

	const w = Number(e.weight);
	if (!Number.isFinite(w) || w === 0) continue;

    switch (groupingType) {
      case "daily": {
        // YYYY-MM-DD
        key = e.dateObj.toISOString().slice(0, 10);
        break;
      }

      case "weekly": {
        const monday = startOfWeek(e.dateObj);
        key = monday.toISOString().slice(0, 10);
        break;
      }

      case "monthly": {
        const y = e.dateObj.getFullYear();
        const m = e.dateObj.getMonth(); // 0–11
        key = `${y}-${m}`;
        break;
      }

      case "yearly": {
        const y = e.dateObj.getFullYear();
        key = `${y}`;
        break;
      }

      default:
        throw new Error("Unknown groupingType: " + groupingType);
    }

	  if (!groups.has(key)) groups.set(key, []);
	  groups.get(key).push(w);

  }

  // Compute average or median for each group
	const points = [];

	for (const [key, weights] of groups.entries()) {
	  if (weights.length === 0) continue; // <-- prevents empty buckets

	  const y = calcType === "median"
		? median(weights)
		: average(weights);

	  const x = keyToDate(key, groupingType);

	  points.push({ x, y });
	}


  // Sort by x (Date)
  points.sort((a, b) => a.x - b.x);

  //Compute regression on weekly points
  const regression = includeRegression
    ? computeRegression(points)
    : null;

  return { points, regression };;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function keyToDate(key, groupingType) {
  switch (groupingType) {
    case "daily":
    case "weekly":
      return new Date(key); // already YYYY-MM-DD

    case "monthly": {
      const [y, m] = key.split("-").map(Number);
      return new Date(y, m, 1);
    }

    case "yearly": {
      const y = Number(key);
      return new Date(y, 0, 1);
    }
  }
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

/* function prepareWeeklyMedian(entries, { weeks, primaryOnly, includeRegression }) {
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
} */


// Dispatcher
/* function prepareData_old(groupingType,calcType, entries, options) {
	console.log(groupingType);
	console.log(calcType);
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
} */


/* function prepareDaily(entries, { startDate, endDate, primaryOnly, includeRegression }) {
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

} */