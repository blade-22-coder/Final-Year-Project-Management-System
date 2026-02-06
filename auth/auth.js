document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "http://localhost:8080/api";

  // theme toggle
  const toggle = document.getElementById("themeToggle");
  toggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
  });

  // password toggle
  document.querySelectorAll(".eye-icon").forEach(icon => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling;
      input.type = input.type === "password" ? "text" : "password";
      icon.textContent = input.type === "password" ? "🫣" : "😲";
   });
  });

  // panel toggle
  const container = document.getElementById("container");
  document.getElementById("signupBtn").onclick = () =>
    container.classList.add("right-panel-active");
  document.getElementById("loginBtn").onclick = () =>
    container.classList.remove("right-panel-active");

  // API calls
  async function signup(userData) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error("SignUp failed");
    }
    return res.json();
  }

  async function login(credentials) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }
    return res.json();
  }

  // SIGNUP
  document.querySelector(".signup-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        fullName: e.target.fullname.value,
        email: e.target.email.value,
        password: e.target.password.value,
        role: e.target.role.value,
      };

      const data = await signup(payload);

      if (data.role === "ADMIN") {
        location.href = "../admin/admin.html";
      } else if (data.role === "SUPERVISOR") {
        location.href = "../supervisor/supervisor.html";
      } else {
        location.href = "../student/student.html";
      }
    });

    //LOGIN
    document.querySelector(".login-form")
      ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        email: e.target.email.value,
          password: e.target.password.value,
      };

      const data = await login(payload);

      if (data.role === "ADMIN") {
        location.href = "../admin/admin.html";
      } else  if (data.role === "SUPERVISOR") {
        location.href = "../supervisor/supervisor.html";
      } else {
        location.href = "../student/student.html"
      }
    });


})