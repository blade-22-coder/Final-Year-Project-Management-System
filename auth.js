function goToSignUp() {
    window.location.href = "signup.html";
}
function goToLogIn() {
    window.location.href = "login.html";
}

//Toggling to display password

// const togglePassword = document.getElementById
// ('togglePassword');
// const passwordInput =document.querySelector('#password');
// togglePassword.addEventListener('click', function () {
//     const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//     passwordInput.setAttribute('type', type);
//     togglePassword.textContent = type === 'password' ? '😲' : '🫣';
// });

document.querySelectorAll(".eye-icon").forEach(icon => {
    icon.addEventListener("click", () => {
        const input = icon.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
        icon.textContent = input.type === "password" ? "🫣" : "😲";
    });
});

//Toggling to change theme light/dark
const toggle = document.getElementById("themeToggle");
toggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    toggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});

//toggled theme saved in local storage
// if (localStorage.getItem("theme") === "light") {
//     document.body.classList.add("light");
//     toggle.textContent = "🌞";
// }
// toggle?.addEventListener("click", () => {
//     document.body.classList.toggle("light");

//     const isLight = document.body.classList.contains("light");
//     toggle.textContent = isLight ? "🌞" : "🌙";
//     localStorage.setItem("theme", isLight ? "light" : "dark");
// });

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

//active transition btn login/signup
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("authContainer");
    const toSignUp = document.getElementById("toSignUp");
    const toLogIn = document.getElementById("toLogIn");

    if (!container || !toSignUp || !toLogIn) {
        console.error("Auth elements not found");
    return;
    }

    toSignUp.addEventListener("click", () => {
        container.classList.add("active");
    });

    toLogIn.addEventListener("click", () => {
        container.classList.remove("active");
    });     
});