let testChart = null;

export function initTestChart() {
  const canvas = document.getElementById("test-chart");
  if (!canvas) {
    console.warn("No #test-chart canvas found");
    return;
  }

  // Avoid creating multiple charts if user revisits the view
  if (testChart) {
    testChart.destroy();
  }

  testChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{
        label: "Test Data",
        data: [3, 1, 4, 2, 5],
        borderColor: "#444",
        borderWidth: 2,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}