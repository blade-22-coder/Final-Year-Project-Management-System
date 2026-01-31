const role = localStorage.getItem("role");

const title = document.getElementById("welcomeTitle");
const studentForm = document.getElementById("studentForm");
const supervisorForm = document.getElementById("supervisor Form");
const errorState = document.getElementById("errorState");
const onboardingBox = document.querySelector(".onboarding");

//safety check
if (!role) {
    onboardingBox.style.display = "none";
    errorState.classList.remove("hidden");
}

//show correct form
if (role === "STUDENT") {
    title.textContent = "🎓 Student Onboarding";
    studentForm.style.display = "flex";
}

if (role === "SUPERVISOR") {
    title.textContent = "🧑🏻‍🏫 Supervisor Onboarding";
    supervisorForm.style.display = "flex"
}

//submit handlers 
studentForm?.addEventListener("submit", e => {
    e.preventDefault();
    localStorage.setItem("onboarded", "true");
    window.location.href = "../student/student.html";
});
supervisorForm?.addEventListener("submit", e => {
    e.preventDefault();
    localStorage.setItem("onboarded", "true");
    window.location.href = "../supervisor/supervisor.html";
});
function goBack() {
    localStorage.clear();
    window.location.href = "../index.html";
};