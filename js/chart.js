// chart.js
let chart = null;

export function initChart() {console.log("initChart");
  const canvas = document.getElementById("weight-chart");
  if (!canvas) {
    console.warn("No #weight-chart canvas found");
    return;
  }

  if (chart) chart.destroy();

  chart = new Chart(canvas, {
    type: "line",
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { autoSkip: true, maxRotation: 0 } },
        y: { beginAtZero: false }
      }
    }
  });
}

// Main entry point
export function renderChart(mode, entries, options) {console.log("renderChart");
  const { labels, data, regression } = prepareData(mode, entries, options);

console.log("labels:", labels);
console.log("data:", data);
console.log("typeof first weight:", typeof data[0]);

  chart.data.labels = labels;
  chart.data.datasets = [
    {
      label: modeLabel(mode),
      data,
      borderColor: "#444",
      borderWidth: 2,
      tension: 0.2,
      pointRadius: 0
    }
  ];

  if (regression) {
    chart.data.datasets.push({
      label: "Trend",
      data: regression,
      borderColor: "#888",
      borderWidth: 1,
      borderDash: [4, 4],
      pointRadius: 0
    });
  }

  chart.update();
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

  const filtered = entries.filter(e => {
    if (primaryOnly && !e.primary) return false;
    const d = new Date(e.date);
    return d >= startDate && d <= endDate;
  });

  const labels = filtered.map(e => e.date);
  const data = filtered.map(e => e.weight);

  const regression = includeRegression
    ? computeRegression(labels, data)
    : null;

  return { labels, data, regression };
}

function prepareWeeklyMedian(entries, { weeks, primaryOnly, includeRegression }) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - weeks * 7);

  const filtered = entries.filter(e => {
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

  const labels = [];
  const data = [];

  for (const [weekStart, weights] of [...weekMap.entries()].sort()) {
    labels.push(weekStart);
    data.push(median(weights));
  }

  const regression = includeRegression
    ? computeRegression(labels, data)
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

function computeRegression(labels, data) {
  if (labels.length < 2) return null;

  const xs = labels.map((_, i) => i);
  const ys = data;

  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, b, i) => a + b * ys[i], 0);
  const sumX2 = xs.reduce((a, b) => a + b * b, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return xs.map(x => slope * x + intercept);
}