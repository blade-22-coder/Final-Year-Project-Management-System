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

    const inputs = studentForm.querySelectorAll("input");

    const body = {
        registrationNumber: inputs[0].value,
        course: inputs[1].value,
        projectTitle: inputs[2].value
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

    const inputs = supervisorForm.querySelectorAll("input");

    const body = {
        staffId: inputs[0].value,
        department: inputs[1].value,
        maxStudents: inputs[2].value ||null
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

//====DB DRIVEN LOGIC====
// //CONSTRAINTS:
// const API_URL = "http://localhost:8080/api";
// const token = localStorage.getItem("token");
// const role = localStorage.getItem("role");

// const title = document.getElementById("welcomeTitle");
// const studentForm = document.getElementById("studentForm");
// const supervisorForm = document.getElementById("supervisorForm");
// const errorState = document.getElementById("errorState");
// const onboardingBox = document.querySelector(".onboarding");

// //INIT
// document.addEventListener("DOMContentLoaded", async () => {
//     if (!token || !role) {
//         showError();
//         return;
//     }

//     await checkIfAlreadyOnboarded();
//     setupRole();
// });

// //CHECK IF USER HAS ALREADY ONBOARDED
// async function checkIfAlreadyOnboarded() {
//     try {
//         const res = await fetch(`${API_URL}/users/me`, {
//             headers: { "Authorization": `Bearer ${token}` }
//         });

//         if (res.ok) return;

//         const user = await res.json();

//         if (user.onboarded) {
//             redirectToDashboard();
//         }
//     } catch (err) {
//         console.error("Onboarding check failed:", err);
//     }
// }

// //ROLE UI
// function setupRole() {
//     if (role === "STUDENT") {
//         title.textContent = "🎓 Student Onboarding";
//         studentForm.style.display = "flex";
//     }

//     if (role === "SUPERVISOR") {
//         title.textContent = "🧑🏻‍🏫 Supervisor Onboarding";
//         supervisorForm.style.display = "flex"
//     }
//     else {
//         showError();
//     }
// }

// //STUDENT ONBOARDING
// studentForm?.addEventListener("submit", async e => {
//     e.preventDefault();

//     const formData = new FormData(studentForm);

//     const body = {
//         registrationNumber: formData.get("registrationNumber"),
//         course: formData.get("course"),
//         projectTitle: formData.get("projectTitle") || null
//     };

//     await submitOnboarding("/student/onboard", body);
// });

// //SUPERVISOR ONBOARDING
// supervisorForm?.addEventListener("submit", async e => {
//     e.preventDefault();

//     const formData = new FormData(supervisorForm);

//     const body = {
//         staffId: formData.get("staffId"),
//         department: formData.get("department"),
//         maxStudents: formData.get("maxStudents") 
//         ? parseInt(formData.get("maxStudents"))
//         : null
//     };

//     await submitOnboarding("/supervisor/onboard", body);
// });

// //COMMON ONBOARDING SUBMISSION LOGIC
// async function submitOnboarding(endpoint, body) {
//     try {
//         const res = await fetch(`${API_URL}${endpoint}`, {  
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify(body),
//         });

//         const data = await res.json();

//         if (res.ok) {
//             throw new Error(data.message || "Onboarding failed");
//         }

//         redirectToDashboard();

//     } catch (err) {
//         console.error(err);
//         showError();
//     }
// }

// //REDIRECT TO DASHBOARD
// function redirectToDashboard() {
//     if (role === "STUDENT") {
//         window.location.href = "../student/student.html";
//     } else if (role === "SUPERVISOR") {
//         window.location.href = "../supervisor/supervisor.html";
//     }
// }

// //ERROR HANDLING
// function showError() {
//     onboardingBox.style.display = "none";
//     errorState.classList.remove("hidden");
// }

// function goBack() {
//     localStorage.clear();
//     window.location.href = "../index.html";
// };