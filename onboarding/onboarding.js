document.addEventListener("DOMContentLoaded", () => {

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

    if(!token) {
        window.location.replace("../index.html");
        return;
    }

    if (localStorage.getItem("onboarded") !== "true") {
        window.location.replace("..'/onboarding/onboarding.html");
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
            registrationNumber: document.getElementById("registrationNumber").value,
            course: document.getElementById("course").value,
            projectTitle: document.getElementById("projectTitle").value
        };

        const res = await fetch(`${API_URL}/onboarding/student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
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
        localStorage.setItem("onboarded", user.onboarded);

        window.location.href = "../student/student.html";
})

     //supervisor form submit handler
    supervisorForm?.addEventListener("submit", async e => {
        e.preventDefault();

        const inputs = supervisorForm.querySelectorAll("input");

        const body = {
            staffId: document.getElementById("staffId").value,
            department: document.getElementById("department").value,
            maxStudents: document.getElementById("maxStudents").value || null
        };

        const res = await fetch(`${API_URL}/onboarding/supervisor`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
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
        localStorage.setItem("onboarded", user.onboarded);

        window.location.href = "../supervisor/supervisor.html";
    });


    function goBack() {
        localStorage.clear();
        window.location.href = "../index.html";
    };

});



// //====DB DRIVEN LOGIC====
// const API_URL = "http://localhost:8080/api";
// const token = localStorage.getItem("token");
// const role = localStorage.getItem("role");

// const title = document.getElementById("welcomeTitle");
// const studentForm = document.getElementById("studentForm");
// const supervisorForm = document.getElementById("supervisorForm");
// const errorState = document.getElementById("errorState");
// const onboardingBox = document.querySelector(".onboarding");

// // Safety check
// if (!token || !role) {
//     onboardingBox.style.display = "none";
//     errorState.classList.remove("hidden");
// }

// // Show correct form
// if (role === "STUDENT") {
//     title.textContent = "🎓 Student Onboarding";
//     studentForm.style.display = "flex";
// } else if (role === "SUPERVISOR") {
//     title.textContent = "🧑🏻‍🏫 Supervisor Onboarding";
//     supervisorForm.style.display = "flex";
// }

// // Redirect helper
// function redirectToDashboard(user) {
//     localStorage.setItem("onboarded", user.onboarded);
//     localStorage.setItem("role", user.role);
//     localStorage.setItem("userId", user.id);

//     if (user.role === "STUDENT") {
//         location.href = `../student/student.html?id=${user.id}`;
//     } else if (user.role === "SUPERVISOR") {
//         location.href = `../supervisor/supervisor.html?id=${user.id}`;
//     } else {
//         window.location.href = "../index.html";
//     }
// }

// // Show error helper
// function showError() {
//     onboardingBox.style.display = "none";
//     errorState.classList.remove("hidden");
// }

// // Student form submit
// studentForm?.addEventListener("submit", async e => {
//     e.preventDefault();

//     const inputs = studentForm.querySelectorAll("input");
//     const body = {
//         registrationNumber: inputs[0].value,
//         course: inputs[1].value,
//         projectTitle: inputs[2].value || null
//     };

//     try {
//         const res = await fetch(`${API_URL}/onboarding/student`, {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify(body),
//         });

//         if (!res.ok) throw new Error("Student onboarding failed");

//         const user = await res.json(); // Backend returns full user object
//         redirectToDashboard(user);

//     } catch (err) {
//         console.error(err);
//         showError();
//     }
// });

// // Supervisor form submit
// supervisorForm?.addEventListener("submit", async e => {
//     e.preventDefault();

//     const inputs = supervisorForm.querySelectorAll("input");
//     const body = {
//         staffId: inputs[0].value,
//         department: inputs[1].value,
//         maxStudents: inputs[2].value ? parseInt(inputs[2].value) : null
//     };

//     try {
//         const res = await fetch(`${API_URL}/onboarding/supervisor`, {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify(body),
//         });

//         if (!res.ok) throw new Error("Supervisor onboarding failed");

//         const user = await res.json();
//         redirectToDashboard(user);

//     } catch (err) {
//         console.error(err);
//         showError();
//     }
// });

// // Go back button
// function goBack() {
//     localStorage.clear();
//     window.location.href = "../index.html";
// }

