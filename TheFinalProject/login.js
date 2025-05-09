// Utility to send JSON
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

// Login handler
async function onLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const data = await sendJSON("api/login.php", { email, password });
    localStorage.setItem("token", data.token);
    alert("Login successful!");
    window.location.href = "index.htm";
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}

// Register handler
async function onRegister() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields to register.");
    return;
  }

  try {
    const data = await sendJSON("api/register.php", { username, email, password });
    localStorage.setItem("token", data.token);
    alert("Registration successful!");
    window.location.href = "index.htm";
  } catch (err) {
    alert("Registration failed: " + err.message);
  }
}

// Toggle between login/register buttons
function toggleLoginType(type) {
  document.getElementById("loginButton").style.display = type === "login" ? "inline-block" : "none";
  document.getElementById("registerButton").style.display = type === "register" ? "inline-block" : "none";

  const title = document.getElementById("login-title");
  const message = document.getElementById("message");

  if (type === "login") {
    title.textContent = "Login";
    message.textContent = "Enter your email and password.";
  } else {
    title.textContent = "Register";
    message.textContent = "Create a username, email, and password.";
  }
}
