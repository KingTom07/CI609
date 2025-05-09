document.addEventListener("DOMContentLoaded", () => {
  const leaderboardEntries = document.getElementById("leaderboardEntries");
  const resultChartCanvas = document.getElementById("resultChart");
  let currentChart;

  // Retrieve the leaderboard data from localStorage
  // (Assumed format: [ { username: "user1", wpm: 80 }, ... ])
  const leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Sort descending by wpm
  leaderboardData.sort((a, b) => b.wpm - a.wpm);

  // Function to get graph data for a given user
  function getUserGraphData(username) {
    // Try to retrieve stored graph data for the user
    const dataString = localStorage.getItem("userResults_" + username);
    if (dataString) {
      return JSON.parse(dataString);
    } else {
      // Create dummy data if not available
      return {
        labels: ["0s", "15s", "30s", "45s", "60s"],
        wpmData: [
          Math.floor(Math.random() * 50) + 20,
          Math.floor(Math.random() * 50) + 30,
          Math.floor(Math.random() * 50) + 40,
          Math.floor(Math.random() * 50) + 50,
          Math.floor(Math.random() * 50) + 60,
        ],
        accuracyData: [90, 92, 94, 93, 95],
      };
    }
  }

  // Function to render the chart for a given user
  function renderChartForUser(username) {
    const graphData = getUserGraphData(username);
    if (currentChart) {
      currentChart.destroy();
    }
    currentChart = new Chart(resultChartCanvas, {
      type: "line",
      data: {
        labels: graphData.labels,
        datasets: [
          {
            label: "WPM",
            data: graphData.wpmData,
            borderColor: "blue",
            fill: false,
          },
          {
            label: "Accuracy (%)",
            data: graphData.accuracyData,
            borderColor: "green",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Time (s)" } },
          y: { title: { display: true, text: "Value" }, min: 0, max: 100 },
        },
      },
    });
  }

  // Populate the leaderboard list
  leaderboardData.forEach((entry) => {
    const li = document.createElement("li");
    li.classList.add("leaderboard-entry");
    li.dataset.username = entry.username;
    li.innerHTML = `<span>${entry.username}</span><span>${entry.wpm} WPM</span>`;
    li.addEventListener("click", function () {
      // Remove "active" from all entries
      document.querySelectorAll(".leaderboard-entry").forEach((el) => el.classList.remove("active"));
      li.classList.add("active");
      renderChartForUser(entry.username);
    });
    leaderboardEntries.appendChild(li);
  });

  // Default: if leaderboard data exists, select the top score's chart
  if (leaderboardData.length > 0) {
    const topUser = leaderboardData[0].username;
    const firstEntry = document.querySelector(".leaderboard-entry");
    if (firstEntry) {
      firstEntry.classList.add("active");
    }
    renderChartForUser(topUser);
  } else {
    leaderboardEntries.innerHTML = "<li>No leaderboard data available.</li>";
  }
});
