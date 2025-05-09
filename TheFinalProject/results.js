// Utility to send JSON, with optional token
async function sendJSON(url, data, needsAuth = false) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (needsAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    } else {
      throw new Error("Missing token — user is not logged in.");
    }
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) throw new Error(json.error || "Request failed");
    return json;
  } catch {
    throw new Error("Invalid JSON: " + text);
  }
}

// Submit typing test results when page loads
document.addEventListener("DOMContentLoaded", async () => {
  const results = JSON.parse(localStorage.getItem("typingTestResults"));
  if (!results) {
    console.warn("No results found.");
    return;
  }

  try {
    const response = await sendJSON("api/score.php", {
      wpm: results.wpm,
      accuracy: results.accuracy
    }, true); // ✅ token required

    console.log("Score saved:", response);
  } catch (err) {
    console.error("Error saving score:", err.message);
  }
});
