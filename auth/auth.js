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

      try {
        const data = await signup(payload);

        //save these
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

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

      if (data.role === "ADMIN") {
         location.href = "../admin/admin.html";
      } else  if (data.role === "SUPERVISOR") {
        location.href = "../supervisor/supervisor.html";
      } else {
        location.href = "../student/student.html"
      }
    });
})

//=====DB DRIVEN LOGIC====
// //constants
// document.addEventListener("DOMContentLoaded", () => {
//   const API_URL = "http://localhost:8080/api";
//   const container = document.getElementById("container");

//   //THEME TOGGLE
//   const toggle = document.getElementById("themeToggle");
//   toggle?.addEventListener("click", () => {
//     document.body.classList.toggle("light");
//     toggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
//   });

//   //PASSWORD TOGGLE
//   document.querySelectorAll(".eye-icon").forEach(icon => {
//     icon.addEventListener("click", () => {
//       const input = icon.previousElementSibling;
//       input.type = input.type === "password" ? "text" : "password";
//       icon.textContent = input.type === "password" ? "🫣" : "😲";
//     });
//   });

//   //PANEL TOGGLE
//   document.getElementById("signupBtn").onclick = () =>
//     container.classList.add("right-panel-active");

//   document.getElementById("loginBtn").onclick = () =>
//     container.classList.remove("right-panel-active");

//   //API HELPERS
//   async function apiRequest(endpoint, body) {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method: "POST",
//       headers: { 
//           "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     }); 

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Request failed");
//   }
//     return data;
//   }

//   function storeSession(data) {
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("role", data.role);
//     localStorage.setItem("userId", data.user.id);
//     localStorage.setItem("onboarded", data.user.onboarded);
//   }

//   function redirectUser(user) {
//     if (!user.onboarded) {
//       window.location.replace("../onboarding/onboarding.html");
//       return;
//     }

//     switch (user.role) {
//       case "ADMIN":
//         window.location.replace("../admin/admin.html");
//         break;
//       case "SUPERVISOR":
//         window.location.replace("../supervisor/supervisor.html");
//         break;
//       case "STUDENT":
//         window.location.replace("../student/student.html");
//         break;
//       default:
//         alert("Unknown role. Contact support.");
//     }
//   }

//   //SIGNUP
//   document.querySelector(".signup-form")
//     ?.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const form = new FormData(e.target);

//       const payload = {
//         fullName: form.get("fullname"),
//         email: form.get("email"),
//         password: form.get("password"),
//         role: form.get("role"),
//       };

//       try {
//         const data = await apiRequest("/auth/signup", payload);

//         storeSession(data);
//         redirectUser(data.user);

//       } catch (err) {
//         alert(err.message || "Signup failed. Please try again.");
//       }

//     });


//   //LOGIN
//   document.querySelector(".login-form")
//     ?.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const form = new FormData(e.target);

//       const payload = {
//         email: form.get("email"),
//         password: form.get("password"),
//       };

//       try {
//         const data = await apiRequest("/auth/login", payload);

//         storeSession(data);
//         redirectUser(data.user);

//       } catch (err) {
//         alert(err.message || "Login failed. Please try again.");
//       }
//     });


// })
