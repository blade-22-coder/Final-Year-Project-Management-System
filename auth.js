//Toggling to change theme light/dark
const toggle = document.getElementById("themeToggle");
toggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    toggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});

//toggle password visibility
document.querySelectorAll(".eye-icon").forEach(icon => {
    icon.addEventListener("click", () => {
        const input = icon.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
        icon.textContent = input.type === "password" ? "🫣" : "😲";
    });
});

//active toggle for login/signup forms
const container = document.getElementById("container");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");

signupBtn.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

//signup
document.getElementById("signup-form")?.addEventListener("submit",async e => {
    e.preventDefault();
    const inputs = e.target.querySelectorAll("input");
    const payload = { 
        fullName: inputs[0].value,
        email: inputs[1].value,
        password: inputs[2].value
    };
    const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(payload)
    });
    if (res.ok) {
        alert("Signup successful! Please log in.");
        window.location.href = "login.html";
    } else {
        alert("Signup failed. Please try again.");
    } 
});

//login
document.getElementById("login-form")?.addEventListener("submit",async e => {
    e.preventDefault();
    const email = e.target.querySelector("input[type='email']").value;

    const password = e.target.querySelector("input[type='password']").value;

    const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } else {
        alert("Login failed. Please check your credentials and try again.");
    }
});
