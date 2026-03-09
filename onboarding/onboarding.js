document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:8080/api";
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const title = document.getElementById("welcomeTitle");
    const studentForm = document.getElementById("studentForm");
    const supervisorForm = document.getElementById("supervisorForm");
    const errorState = document.getElementById("errorState");
    const onboardingBox = document.querySelector(".onboarding");

    //safety check
    if (!role) {
        onboardingBox.style.display = "none";
        errorState.classList.remove("hidden");
        return;
    }

    if(!token) {
        alert("Session expired. Please login again.");
        window.location.replace("../index.html");
        return;
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

    
        const body = {
            registrationNumber: document.getElementById("registrationNumber").value.toUpperCase(),
            course: document.getElementById("course").value.toUpperCase(),
            projectTitle: document.getElementById("projectTitle").value.toUpperCase()
        };

        const res = await fetch(`${API_URL}/onboarding/student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        if(!res.ok) {
            errorState.classList.remove("hidden");
            onboardingBox.style.display = "none";
            return;
        }

        const user = await res.json();

        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("onboardingCompleted", user.onboarded);

        window.location.href = "../student/student.html";
})

     //supervisor form submit handler
    supervisorForm?.addEventListener("submit", async e => {
        e.preventDefault();

        const inputs = supervisorForm.querySelectorAll("input");

        const body = {
            staffId: document.getElementById("staffId").value.toUpperCase(),
            department: document.getElementById("department").value.toUpperCase(),
            maxStudents: Number(document.getElementById("maxStudents").value) || null
        };

        const res = await fetch(`${API_URL}/onboarding/supervisor`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            errorState.classList.remove("hidden");
            onboardingBox.style.display = "none";
            return;
        }

        const user = await res.json();

        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("onboardingCompleted", user.onboarded);

        window.location.href = "../supervisor/supervisor.html";
    });


    window.goBack = () => {
        localStorage.clear();
        window.location.href = "../index.html";
    };

});


