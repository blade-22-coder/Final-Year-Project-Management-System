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
<<<<<<< HEAD
      icon.textContent = input.type === "password" ? "😎" : "😲";
=======
      icon.textContent = input.type === "password" ? "🫣" : "😲";
>>>>>>> 359f3908c1a06fa3790356db28fd626c89c5fdc4
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
        fullName: e.target.fullname.value.toUpperCase(),
        email: e.target.email.value,
        password: e.target.password.value,
        role: e.target.role.value.toUpperCase()
      };

      try {
        const data = await signup(payload);

        //save these
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("onboardingCompleted", data.onboarded);

        location.href = "../onboarding/onboarding.html";

      } catch (err) {
        alert("Signup failed. Please try again.");
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

      //save these
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("onboardingCompleted", data.onboarded);

      if(!data.onboarded) {
        location.href = "../onboarding/onboarding.html";
        return;
      }

      if (data.role === "ADMIN") {
         location.href = "../admin/admin.html";
      } else  if (data.role === "SUPERVISOR") {
        location.href = `../supervisor/supervisor.html?id=${data.userId}`;
      } else {
        location.href = `../student/student.html?id=${data.userId}`;
      }
    });
});

