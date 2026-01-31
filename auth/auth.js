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

    const fullName = e.target.fullname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value; //student or supervisor
    const inputs = e.target.querySelectorAll("input");
    const payload = { 
        fullName, email, password, role
    };
    const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {"content-Type": "application/json"},
        body: JSON.stringify(payload)
    });
    if (res.ok) {
        localStorage.setItem("role", role)
        alert("Signup successful! Please log in.");
        window.location.href = "../onboarding/onboarding.html";
    } else {
        alert("Signup failed. Please try again.");
    } 
});

//login
document.getElementById("login-form")?.addEventListener("submit",async e => {
    e.preventDefault();

    const email = e.target.email.value;

    const password = e.target.password.value;

    const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        alert("Invalid credentials");
        return;
        
    }
    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    //role-based redirect
    if(data.role === "ADMIN") {
        window.location.href = "../admin/admin.html";
    } else if (data.role === "SUPERVISOR") {
        window.localStorage.href = "../supervisor/supervisor.html";
    }else {
        window.localStorage.href = "..student/student.html"
    }
    
});
