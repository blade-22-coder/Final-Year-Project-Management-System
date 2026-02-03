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
    e.preventDefault();  //stops page reload

    //collecting values from the inputs 
    const fullName = e.target.fullname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value; //student or supervisor

    //preparing payload(JSON body)
    const payload = { 
        fullName, email, password, role
    };

//BACKEND
const API_URL = "http://localhost:8080/api";

async function signup(userData) {
    const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return res.json();
}

async function login(credentials) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    return res.json();
}

    //role-based redirect
    if(data.role === "ADMIN") {
        window.location.href = "../admin/admin.html";
    } else if (data.role === "SUPERVISOR") {
        window.location.href = "../supervisor/supervisor.html";
    }else {
        window.location.href = "../student/student.html"
    }
    
});
