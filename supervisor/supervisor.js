// const params = new URLSearchParams(window.location.search);
// const userId = params.get("id");
// const token = localStorage.getItem("token");

// if(!userId || !token) {
//   window.location.href = "../index/html";
// }

// //accessing students and activation of other sections
// const studentsBtn = document.getElementById("studentsBtn");
// const studentsView = document.getElementById("studentsView");
// const dashboardView = document.getElementById("dashboardView");
// const studentContext = document.getElementById("studentContext");
// const lockedItems = document.querySelectorAll(".locked");

// studentsBtn.onclick = () => {
//   dashboardView.classList.add("hidden");
//   studentsView.classList.remove("hidden");
// };

// document.querySelectorAll(".student-card").forEach(card => {
//   card.onclick = () => {
//     const name = card.dataset.name;
//     studentContext.textContent = `Viewing: ${name}`;

//     lockedItems.forEach(item => {
//       item.classList.remove("locked");
//     });

//     alert(`Student ${name} selected`);
//   };
// });

// //student confirmation pop up
// const modal = document.getElementById("studentModal");
// const modalStudentName = document.getElementById("modalStudentName");
// const confirmBtn = document.getElementById("confirmStudent");
// const cancelBtn = document.getElementById("cancelStudent");

// let selectedStudent = null;
// let pendingStudent = null;

// document.querySelectorAll(".student-card").forEach(card => {
//   card.onclick = () => {
//     pendingStudent = card.dataset.name;
//     modalStudentName.textContent = pendingStudent;
//     modal.classList.remove("hidden");
//   };
// });

// confirmBtn.onclick = () => {
//   selectedStudent = pendingStudent;
  
//   studentContext.textContent = `Viewing: ${selectedStudent}`;

//   lockedItems.forEach(item => {
//     item.classList.remove("locked");
//   });

//   loadAnalytics(selectedStudent);

//   modal.classList.add("hidden");
// };

// cancelBtn.onclick = () => {
//   pendingStudent = null;
//   modal.classList.add("hidden");
// };

// //section navigation
// const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
// const sections = document.querySelectorAll("main section");

// navItems.forEach(item => {
//   item.addEventListener("click", () => {

//     //prevent locked student-based section
//     if (item.classList.contains("locked")) return;

//     const targetId = item.dataset.target;

//     //hide all sections
//     sections.forEach(sec => sec.classList.add("hidden"));

//     //show target section
//     const targetSection = document.getElementById(targetId);
//     if (targetSection) {
//       targetSection.classList.remove("hidden");
//     }
//   });
// })

// //syncing sidebar image
// const uploadInput = document.getElementById("profileUpload");
// const profileImage = document.getElementById("profileImage");
// const profilePreview = document.getElementById("profilePreview");

// uploadInput.addEventListener("change", async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const formData = new FormData();
//   formData.append("file", file);
  
//   try {
//     const res = await fetch("/api/supervisor/upload-profile-image", {
//       method: "PUT",
//       headers: {
//         "Authorization": "Bearer " + localStorage.getItem("token")
//       },
//       body: formData
//     });

//     if (!res.ok) {
//       throw new Error("Failed to upload image");
//     }

//     //reload profile after upload
//     await loadProfile();

//     alert("Profile image updated successfully");

//   } catch (err) {
//     console.error("Error uploading profile image:", err);
//     alert("Failed to update profile image");
//   }

// });

// //analytics chart per student
// const studentAnalytics = {
//   "Emmanuel Kitara Okello": {
//     progress: [20, 35, 50, 65],
//     repoCommits: [2, 5, 9, 14],
//     submissions: ["On Time", "On Time", "Late", "On Time"]
//   },
//   "Stacy Martha Alowo Toto": {
//     progress: [40, 60, 75, 82],
//     repoCommits: [4, 8, 13, 21],
//     submissions: ["On Time", "On Time", "On Time", "On Time"]
//   }
// };

// //chart logic
// let progressChart = null;
// let reportChart = null;

// function loadAnalytics(studentName) {
//   const data = studentAnalytics[studentName];
//   if (!data) return;

//   const progressCanvas = document.getElementById("progressChart");
//   const reportCanvas = document.getElementById("reportChart");
  
//   if (!progressCanvas || !reportCanvas) {
//     console.error("Analtyics canvas not found");
//     return;
//   }

//   const progressCtx = progressCanvas.getContext("2d");
//   const repoCtx = reportCanvas.getContext("2d");

//   if (progressChart) progressChart.destroy();
//   if(reportChart) reportChart.destroy();
 
//   progressChart = new Chart(progressCtx, {
//     type: "line",
//     data: {
//       labels: ["Proposal", "GitHub", "Snapshots", "Report"],
//       datasets: [{
//         label: "Project Progress (%)",
//         data: data.progress,
//         fill: true,
//         tension: 0.4
//       }]
//     }
//   });
//   reportChart = new Chart(repoCtx, {
//     type: "bar",
//     data: {
//       labels: ["week 1", "Week 2", "Week 3", "Week 4"],
//       datasets: [{
//         label: "Repository Activity (Commits)",
//         data: data.repoCommits
//       }]
//     }
//   });
// }

// //logout
// function openLogout() {
//     document.getElementById("logoutModal").classList.add("active");
// }

// function closeLogout() {
//     document.getElementById("logoutModal").classList.remove("active");
// }

// function confirmLogout() {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.replace("/index.html");
// }

// //closing module when clicking outside
// document.getElementById("logoutModal").addEventListener("click", e => {
//     if (e.target.id === "logoutModal") closeLogout();

// });

// //loading deadlines 
// document.addEventListener("DOMContentLoaded", () => {
//     const container = document.getElementById("deadlineList");

//     if (!container) {
//         console.error("deadlineList container not found");
//         return;
//     }

//     const deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];

//     console.log("Deadlines loaded:", deadlines);

//     if (deadlines.length === 0) {
//         container.innerHTML = "<p>No deadlines available.</p>";
//         return;
//     }

//     deadlines.forEach(dl => {
//         if (!dl.audience.includes("supervisors")) return;

//         const card = document.createElement("div");
//         card.className = "deadline-card";

//         card.innerHTML = `
//             <h4>${dl.title}</h4>
//             <p>${dl.description || ""}</p>
//             <small>📅 ${dl.date}</small>
//         `;

//         container.appendChild(card);
//     });

//     //load profile on page load
//     async function loadProfile() {
//       try {
//         const res = await fetch("/api/supervisor/me", {
//           headers: {
//             "Authorization": "Bearer " + localStorage.getItem("token")
//           }
//         });

//         if (!res.ok) {
//           throw new Error("Unauthorized");
//         }

//         const data = await res.json();

//         //sidebar
//         document.querySelector(".supervisor-info h3").textContent = data.fullName;

//         //profile section
//         document.getElementById("supervisorName").textContent = data.fullName;
//         document.getElementById("department").textContent = data.department;
//         document.getElementById("email").textContent = data.email;

//         if (data.profileImagePath) {
//           const ImageUrl = `/api/supervisor/profile-image/${data.profileImagePath}`;
//           profileImage.src = ImageUrl;
//           profilePreview.src = ImageUrl;
//         }

//       } catch (err) {
//         console.error("Failed to load profile:", err);
//       }
//     }

//     loadProfile();
// });

// //files
// function preview(id) {
//     window.open(`/api/files/submissions/${id}`, "_blank");
// }

// function download(id) {
//     const link = document.createElement("a");
//     link.href = `/api/files/submissions/${id}`;
//     link.download = "";
//     link.click();
// }

// //grading
// async function submitGrade(submissionId) {
//     const score = document.getElementById("score").value;
//     const comment = document.getElementById("comment").value;
//     const status = document.getElementById("status").value;

//     const res = await fetch(`/api/grades/${submissionId}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + localStorage.getItem("token")
//         },
//         body: JSON.stringify({ score, comment, status })
//     });

//     if (res.ok) {
//         alert("Graded successfully");
//     } else {
//         alert("Failed to grade");
//     }
// }

// //Auto total calculation
// const gradeInputs = document.querySelectorAll(".grade-row input");
// const totalDisplay = document.getElementById("gradeTotal");

// function computeTotal() {
//     let total = 0;

//     gradeInputs.forEach(input => {
//       const value = parseInt(input.value) || 0;
//       total += value;
//     });

//     totalDisplay.textContent = total;
// }

// gradeInputs.forEach(input => {
//     input.addEventListener("input", computeTotal);
// });


//======DB DRIVEN LOGIC=====
//====== Globals & Params ======
const API_URL = "http://localhost:8080/api";
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

if (!userId || !token) {
    window.location.href = "../index.html"; // safety redirect
} 

let selectedStudent = null; // current selected student
let progressChart = null;
let reportChart = null;

// DOM Elements
const studentsBtn = document.getElementById("studentsBtn");
const studentsView = document.getElementById("studentsView");
const dashboardView = document.getElementById("dashboardView");
const studentContext = document.getElementById("studentContext");
const lockedItems = document.querySelectorAll(".locked");
const modal = document.getElementById("studentModal");
const modalStudentName = document.getElementById("modalStudentName");
const confirmBtn = document.getElementById("confirmStudent");
const cancelBtn = document.getElementById("cancelStudent");
const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
const sections = document.querySelectorAll("main section");
const uploadInput = document.getElementById("profileUpload");
const profileImage = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");
const gradeInputs = document.querySelectorAll(".grade-row input");
const totalDisplay = document.getElementById("gradeTotal");

// ====== Sidebar Navigation ======
studentsBtn.onclick = () => {
    dashboardView.classList.add("hidden");
    studentsView.classList.remove("hidden");
};

navItems.forEach(item => {
    item.addEventListener("click", () => {
        if (item.classList.contains("locked")) return;
        const targetId = item.dataset.target;
        sections.forEach(sec => sec.classList.add("hidden"));
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.classList.remove("hidden");
    });
});

// ====== Load Supervisor Profile ======
async function loadProfile() {
    try {
        const res = await fetch(`${API_URL}/supervisor/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load supervisor profile");

        const data = await res.json();

        // Sidebar & profile
        document.querySelector(".supervisor-info h3").textContent = data.user.fullName;
        document.getElementById("supervisorName").textContent = data.user.fullName;
        document.getElementById("department").textContent = data.user.department;
        document.getElementById("email").textContent = data.user.email;

        const defaultAvatar = "../images/1.JPG";

        const imgUrl = data.profileImagePath
            ? `${API_URL}/supervisor/profile-image/${data.profileImagePath}?t=${Date.now()}`
            : defaultAvatar;

            profileImage.src = imgUrl;
            profilePreview.src = imgUrl;
        

        // Load assigned students
        loadStudents();

    } catch (err) {
        console.error(err);
        alert("Failed to load supervisor profile");
    }
}

// ====== Upload Profile Image ======
uploadInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`${API_URL}/supervisor/upload-profile-image`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });

        if (!res.ok) throw new Error("Failed to upload image");

        await loadProfile();
        alert("Profile image updated successfully");
    } catch (err) {
        console.error(err);
        alert("Failed to update profile image");
    }
});

// ====== Load Assigned Students ======
async function loadStudents() {
    try {
        const res = await fetch(`${API_URL}/supervisor/my-students`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load students");

        const students = await res.json();
        studentsView.innerHTML = ""; // clear old cards

        const grid = document.getElementById("studentGrid");
        grid.innerHTML = "";

        students.forEach(student => {
            const card = document.createElement("div");
            card.className = "student-card";
            card.dataset.id = student.id;
            card.dataset.name = student.fullName;
            card.innerHTML = `
                <h3>${student.fullName}</h3>
                <p>${student.registrationNumber}</p>
                <p>Progress: ${student.progress}%</p>
            `;
            grid.appendChild(card);

            // open modal on click
            card.onclick = () => {
                pendingStudent = student;
                modalStudentName.textContent = student.fullName;
                modal.classList.remove("hidden");
            }
        });
    } catch (err) {
        console.error(err);
    }
}

// ====== Student Selection Modal ======
let pendingStudent = null;
confirmBtn.onclick = () => {
    selectedStudent = pendingStudent;

    studentContext.textContent = `Viewing: ${selectedStudent.fullName}`;

    lockedItems.forEach(item => item.classList.remove("locked"));

    loadSubmissions(selectedStudent.id);
    loadAnalytics(selectedStudent.id);
    loadGrades(selectedStudent.id);

    modal.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    studentsView.classList.add("hidden");
};

cancelBtn.onclick = () => {
    pendingStudent = null;
    modal.classList.add("hidden");
};

// ======Load Student Submissions ======
async function loadSubmissions() {

    if (!selectedStudent) return;

    const res = await fetch(
        `${API_URL}/supervisor/submissions/${selectedStudent.id}`, 
        {
            headers: { "Authorization": `Bearer ${token}` }
        }
    );

    if (!res.ok) {
        alert("Failed to load submissions");
        return;
    }

    const submissions = await res.json();
    const table = document.querySelector("#submissionsTable tbody");

    table.innerHTML = "";

    submissions.forEach(sub => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sub.title}</td>
            <td>${sub.date}</td>
            <td>
                <button onclick="preview(${sub.id})">View</button>
                <button onclick="download(${sub.id})">Download</button>
            </td>
            
            <td>
                <textarea id="comment-${sub.id}" placeholder="Write feedback..."></textarea>
            </td>
        `;

        table.appendChild(row);

    });
}

// ====== Load Student Analytics ======
async function loadAnalytics(studentId) {
    try {
        const res = await fetch(`${API_URL}/supervisor/analytics/${studentId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load analytics");

        const data = await res.json(); // { progress: [], repoCommits: [], submissions: [] }

        const progressCanvas = document.getElementById("progressChart");
        const reportCanvas = document.getElementById("reportChart");
        if (!progressCanvas || !reportCanvas) return;

        const progressCtx = progressCanvas.getContext("2d");
        const repoCtx = reportCanvas.getContext("2d");

        if (progressChart) progressChart.destroy();
        if (reportChart) reportChart.destroy();

        progressChart = new Chart(progressCtx, {
            type: "line",
            data: {
                labels: ["Proposal", "GitHub", "Snapshots", "Report"],
                datasets: [{
                    label: "Project Progress (%)",
                    data: data.progress,
                    fill: true,
                    tension: 0.4
                }]
            }
        });

        reportChart = new Chart(repoCtx, {
            type: "bar",
            data: {
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [{
                    label: "Repository Activity (Commits)",
                    data: data.repoCommits
                }]
            }
        });

    } catch (err) {
        console.error(err);
    }
}

// ====== Grades Submission ======
async function loadGrades(studentId) {
    
    const res = await fetch(`${API_URL}/grades/${studentId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) return;

    const grades = await res.json();

    document.querySelector('[data-part="proposal"]').value = grades.proposal || 0;
    document.querySelector('[data-part="progress"]').value = grades.progress || 0;
    document.querySelector('[data-part="final"]').value = grades.finalReport || 0;
    document.querySelector('[data-part="presentation"]').value = grades.presentation || 0;

    computeTotal();
    
}

// ====== Saving ======
document.getElementById("submitGrade").onclick = async () => {

    const payload = {
        studentId: selectedStudent.id,
        proposal: document.querySelector('[data-part="proposal"]').value,
        progress: document.querySelector('[data-part="progress"]').value,
        finalReport: document.querySelector('[data-part="final"]').value,
        presentation: document.querySelector('[data-part="presentation"]').value,
        comment: document.querySelector("gradeComment").value
    };

    const res = await fetch(`${API_URL}/supervisor/grades`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (res.ok) alert("Grades saved");
};

// =====Auto compilation =====
function computeTotal() {
    let total = 0;
    gradeInputs.forEach(input => total += parseInt(input.value) || 0);
    totalDisplay.textContent = `${total} / 100`;
}
gradeInputs.forEach(input => input.addEventListener("input", computeTotal));

// ====== Files ======
function preview(id) {
    window.open(`${API_URL}/files/submissions/${id}`, "_blank");
}

function download(id) {
    const link = document.createElement("a");
    link.href = `${API_URL}/files/submissions/${id}`;
    link.download = "";
    link.click();
}

//========Comments========
async function submitComment(submissionId) {

    const textarea = document.getElementById(`comment-${submissionId}`)

    const message = textarea.value;

    if (!message) {
        alert("Write a comment first");
        return;
    }

    const res = await fetch(`${API_URL}/supervisor/comments/${submissionId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            message: message,
            studentId: selectedStudent.id
        })
    });

    if (res.ok) {
        alert("Comment submitted");
        textarea.value = "";
    } else {
        alert("Failed to submit comment");
    }
}

// ====== Deadlines ======
async function loadDeadlines() {
    try {
        const res = await fetch (`${API_URL}/supervisor/deadlines`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Failed to load deadlines");
        const deadlines = await res.json();

        const container = document.getElementById("deadlineList");
        if (!container) return;

        container.innerHTML = "";

        if (deadlines.length === 0) {
            container.innerHTML = "<p>No deadlines available</p>";
            return;
        }

        deadlines.forEach(dl => {
            const card = document.createElement("div");
            card.className = "deadline-card";

            card.innerHTML = `
                <h4>${dl.title}</h4>
                <p>$${dl.description || ""}</p>
                <small>📆 ${dl.date}</small>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Deadlinev load failed:", err);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    
    loadProfile();
    loadDeadlines();
});

// ====== Logout ====
function openLogout() { document.getElementById("logoutModal").classList.add("active"); }
function closeLogout() { document.getElementById("logoutModal").classList.remove("active"); }
function confirmLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("../index.html");
}
document.getElementById("logoutModal").addEventListener("click", e => {
    if (e.target.id === "logoutModal") closeLogout();
});



 
