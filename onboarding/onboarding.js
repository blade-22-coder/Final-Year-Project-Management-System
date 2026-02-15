 const API_URL = "http://localhost:8080/api";
const role = localStorage.getItem("role");

const title = document.getElementById("welcomeTitle");
const studentForm = document.getElementById("studentForm");
const supervisorForm = document.getElementById("supervisorForm");
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
        //student form submit handler
studentForm?.addEventListener("submit", async e => {
    e.preventDefault();

    const input = studentForm.querySelector("input");

    const body = {
        registrationNumber: input[0].value,
        course: input[1].value,
        projectTitle: input[2].value
    };

    const res =  await fetch(`${API_URL}/student/onboard`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(body),
    });
    if (res.ok) {
        localStorage.setItem("onboarded", "true");
        location.href = "../student/student.html";
    } else {
        errorState.classList.remove("hidden");
        onboardingBox.style.display = "none";
    }
});
     //supervisor form submit handler
supervisorForm?.addEventListener("submit", async e => {
    e.preventDefault();

    const input = supervisorForm.querySelector("input");

    const body = {
        staffId: input[0].value,
        department: input[1].value,
        maxStudents: input[2].value ||null
    };

    const res = await fetch(`${API_URL}/supervisor/onboard`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(body),
    });
    if (res.ok) {
        localStorage.setItem("onboarded", "true");
        location.href = "../supervisor/supervisor.html";
    } else {
        errorState.classList.remove("hidden");
        onboardingBox.style.display = "none";
    }
});
function goBack() {
    localStorage.clear();
    window.location.href = "../index.html";
};