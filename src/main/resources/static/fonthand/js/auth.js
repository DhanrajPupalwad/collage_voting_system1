const AUTH_API = "http://localhost:8080/api/auth";
const AUTH_ADMIN_API = "http://localhost:8080/api/admin";

function studentRegister() {
  const name = document.getElementById("regName")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const pass = document.getElementById("regPass")?.value || "";

  if (!name || !email || !pass) {
    showAlert("regAlert", "danger", "⚠️ Fill all fields");
    return;
  }

  if (pass.length < 6) {
    showAlert("regAlert", "danger", "⚠️ Password must be 6+ chars");
    return;
  }

  fetch(AUTH_API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: name,
      email,
      password: pass,
      hasVoted: false
    })
  })
    .then(async (res) => ({ ok: res.ok, text: await res.text() }))
    .then(({ ok, text }) => {
      showAlert("regAlert", ok && text.toLowerCase().includes("success") ? "success" : "danger", text);
      if (ok && text.toLowerCase().includes("success")) {
        document.getElementById("regName").value = "";
        document.getElementById("regEmail").value = "";
        document.getElementById("regPass").value = "";
        setTimeout(() => switchTab("login"), 1000);
      }
    })
    .catch(() => showAlert("regAlert", "danger", "❌ Registration failed"));
}

function studentLogin() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const pass = document.getElementById("loginPass")?.value || "";

  if (!email || !pass) {
    showAlert("loginAlert", "danger", "⚠️ Enter email and password");
    return;
  }

  fetch(AUTH_API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass })
  })
    .then((res) => res.json())
    .then((user) => {
      if (user && user.id) {
        currentUser = {
          type: "student",
          data: {
            id: user.id,
            name: user.name || user.username || "Student",
            email: user.email,
            hasVoted: !!user.hasVoted
          }
        };
        localStorage.setItem("voterId", String(user.id));
        localStorage.setItem("userName", currentUser.data.name);
        localStorage.setItem("hasVoted", String(!!user.hasVoted));
        updateNav();
        showPage("student-dash");
      } else {
        showAlert("loginAlert", "danger", "❌ Invalid login");
      }
    })
    .catch(() => showAlert("loginAlert", "danger", "❌ Login failed"));
}

function adminLogin() {
  const username = document.getElementById("adminUser")?.value.trim();
  const password = document.getElementById("adminPass")?.value || "";

  if (!username || !password) {
    showAlert("adminLoginAlert", "danger", "⚠️ Enter username and password");
    return;
  }

  fetch(AUTH_ADMIN_API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then((res) => res.text())
    .then((data) => {
      if (data.toLowerCase().includes("success")) {
        currentUser = { type: "admin", data: { username } };
        updateNav();
        showPage("admin");
      } else {
        showAlert("adminLoginAlert", "danger", "❌ Invalid admin credentials");
      }
    })
    .catch(() => showAlert("adminLoginAlert", "danger", "❌ Login failed"));
}

function logout() {
  currentUser = null;
  selectedCandId = null;
  localStorage.removeItem("voterId");
  localStorage.removeItem("userName");
  localStorage.removeItem("hasVoted");
  updateNav();
  showPage("home");
}
