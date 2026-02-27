// //  IMPORTS 
// import { getMySubmissions } from "../api/submission.api.js";
// import { getComments } from "../api/comment.api.js";
// import { getDeadlines } from "../api/deadline.api.js";
// import { session } from "../state/session.js";

// //  APP INIT 
// window.addEventListener("load", async () => {
//     try {
//         session.submissions = await getMySubmissions();
//         session.comments = await getComments();
//         session.deadlines = await getDeadlines();
//     } catch (err) {
//         console.warn("API not ready, running in mock mode", err);
//     }

//     initSubmissionForm();
//     initThemeToggle();
//     initSidebar();
//     initProfileUpload();

//     renderComments();
//     renderStatus();
//     renderDeadlines();
// });


// //  THEME TOGGLE 
// function initThemeToggle() {
//     const toggle = document.getElementById("themeToggle");
//     if (!toggle) return;

//     let dark = true;

//     toggle.addEventListener("click", () => {
//         document.body.classList.toggle("light");
//         toggle.textContent = dark ? "🌞" : "🌙";
//         dark = !dark;
//     });
// }

// //  SIDEBAR NAVIGATION 
// function initSidebar() {
//     const nav = document.querySelector(".sidebar-nav");
//     const sections = document.querySelectorAll("main section");

//     if (!nav || !sections.length) return;

//     // Add click listener to each li individually
//     nav.querySelectorAll("li[data-target]").forEach(li => {
//         li.addEventListener("click", () => {
//             const targetId = li.dataset.target;
//             const target = document.getElementById(targetId);
//             if (!target) return;

//             // deactivate all
//             sections.forEach(s => s.classList.remove("active"));
//             nav.querySelectorAll("li").forEach(n => n.classList.remove("active"));

//             // activate selected
//             target.classList.add("active");
//             li.classList.add("active");
//         });
//     });

//     // Activate first tab by default
//     nav.querySelector("li[data-target]")?.click();
// }


// //  PROFILE IMAGE UPLOAD 
// function initProfileUpload() {
//     const uploadInput = document.getElementById("profileUpload");
//     const profileImage = document.getElementById("profileImage");
//     const preview = document.getElementById("profilePreview");

//     if (!uploadInput) return;

//     uploadInput.addEventListener("change", async (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             const res = await fetch("/api/student/upload-profile-image", {
//                 method: "PUT",
//                 headers: {
//                     "Authorization": "Bearer " + localStorage.getItem("token")
//                 },
//                 body: formData
//             });

//             if (!res.ok) {
//                 throw new Error("Failed to upload profile image");
//             }

//             //reload profile after upload
//             await loadProfile();

//         } catch (err) {
//             console.error("Error uploading profile image:", err);
//             alert("Failed to update profile image");
//         }
//     });
// }

// //load profile on page load
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

// //  MOCK SUBMISSION STATUS 
// const submissions = {
//     title: { state: "approved", comment: "Title approved" },
//     proposal: { state: "pending", comment: "Under review" },
//     report: { state: "waiting", comment: "" },
//     github: { state: "approved", comment: "Repo looks good" },
//     snapshots: { state: "rejected", comment: "UI screenshots unclear" }
// };

// const statusIcons = {
//     waiting: "💤 Waiting",
//     pending: "⏳ Pending",
//     approved: "✅ Approved",
//     rejected: "❌ Rejected"
// };


// //STATUS RENDER 
// function renderStatus() {
//     const grid = document.getElementById("statusGrid");
//     if (!grid) return;

//     grid.innerHTML = "";

//     Object.entries(submissions).forEach(([key, data]) => {
//         const card = document.createElement("div");
//         card.className = `status-card ${data.state}`;

//         card.innerHTML = `
//             <h4>${key.toUpperCase()}</h4>
//             <strong>${statusIcons[data.state]}</strong>
//             <p>${data.comment || "No feedback yet"}</p>
//         `;

//         grid.appendChild(card);
//     });

//     updateBatteryFromStatus();
// }


// // BATTERY LOGIC 
// function updateBatteryFromStatus() {
//     const batteryFill = document.getElementById("batteryFill");
//     const batteryPercent = document.getElementById("batteryPercent");

//     if (!batteryFill || !batteryPercent) return;

//     const total = Object.keys(submissions).length;
//     const approved = Object.values(submissions)
//         .filter(s => s.state === "approved").length;

//     const percent = Math.round((approved / total) * 100);
//     animateBattery(percent);
// }

// function getBatteryColor(p) {
//     if (p < 40) return "linear-gradient(90deg, red, orange)";
//     if (p < 70) return "linear-gradient(90deg, orange, yellow)";
//     return "linear-gradient(90deg, yellow, green)";
// }

// function animateBattery(target) {
//     const batteryFill = document.getElementById("batteryFill");
//     const batteryPercent = document.getElementById("batteryPercent");

//     if (!batteryFill || !batteryPercent) return;

//     let current = 0;
//     batteryFill.classList.add("stripes");

//     const timer = setInterval(() => {
//         if (current >= target) {
//             clearInterval(timer);
//             batteryFill.classList.remove("stripes");
//             return;
//         }

//         current++;
//         batteryFill.style.height = current + "%";
//         batteryFill.style.background = getBatteryColor(current);
//         batteryPercent.textContent = current + "%";

//     }, 15);
// }


// //  COMMENTS 
// const reviewComments = {
//     title: {
//         supervisor: { message: "Title is clear.", date: "2026-01-25" },
//         student: null
//     },
//     proposal: {
//         supervisor: { message: "Expand methodology.", date: "2026-01-26" },
//         student: null
//     }
// };

// function renderComments() {
//     const container = document.getElementById("commentThreads");
//     if (!container) return;

//     container.innerHTML = "";

//     Object.entries(reviewComments).forEach(([key, thread]) => {
//         const block = document.createElement("div");
//         block.className = "comment-thread";

//         block.innerHTML = `
//             <h4>${key.toUpperCase()}</h4>
//             ${thread.supervisor ? `
//                 <div class="comment supervisor">
//                     <p>${thread.supervisor.message}</p>
//                     <small>${thread.supervisor.date}</small>
//                 </div>
//             ` : "<p>No supervisor feedback.</p>"}

//             ${thread.student ? `
//                 <div class="comment student">
//                     <p>${thread.student.message}</p>
//                 </div>
//             ` : `
//                 <textarea id="reply-${key}" placeholder="Reply..."></textarea>
//                 <button onclick="submitReply('${key}')">Send</button>
//             `}
//         `;

//         container.appendChild(block);
//     });
// }

// window.submitReply = (key) => {
//     const input = document.getElementById(`reply-${key}`);
//     if (!input || !input.value.trim()) return;

//     reviewComments[key].student = {
//         message: input.value,
//         date: new Date().toLocaleDateString()
//     };

//     renderComments();
// };


// //  DEADLINES 
// function renderDeadlines() {
//     const container = document.getElementById("deadlineList");
//     if (!container) return;

//     const deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];

//     container.innerHTML = deadlines.length
//         ? deadlines.map(d => `
//             <div class="deadline-card">
//                 <h4>${d.title}</h4>
//                 <p>${d.description || ""}</p>
//                 <small>📅 ${d.date}</small>
//             </div>
//         `).join("")
//         : "<p>No deadlines available.</p>";
// }


// // LOGOUT 
// window.openLogout = () =>
//     document.getElementById("logoutModal")?.classList.add("active");

// window.closeLogout = () =>
//     document.getElementById("logoutModal")?.classList.remove("active");

// window.confirmLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.replace("/index.html");
// };
// //closing module when clicking outside
// document.getElementById("logoutModal").addEventListener("click", e => {
//     if (e.target.id === "logoutModal") closeLogout();

// });


// //  SUBMISSION FORM 
// function initSubmissionForm() {
//     const form = document.getElementById("submitForm");
//     if (!form) return;

//     const token = localStorage.getItem("token");

//     form.addEventListener("submit", async e => {
//         e.preventDefault();

//         const file = document.getElementById("file")?.files?.[0];
//         if (!file) return alert("Select a file first");

//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             const res = await fetch("/api/submissions", {
//                 method: "POST",
//                 headers: {
//                     "Authorization": "Bearer " + token
//                 },
//                 body: formData
//             });

//             if (res.ok) {
//                 alert("Submitted successfully");
//             } else {
//                 alert("Submission failed");
//             }
//         } catch (err) {
//             console.error(err);
//             alert("Network error"); 
//         }
//     });
// }


// ====DB DRIVEN LOGIC====
// IMPORTS
import { getMySubmissions } from "../api/submission.api.js";
import { getComments } from "../api/comment.api.js";
import { getDeadlines } from "../api/deadline.api.js";
import { session } from "../state/session.js";

// GLOBALS
const API_URL = "http://localhost:8080/api";
const token = localStorage.getItem("token");
if (!token) {
    window.location.replace("../index.html");
}

if (localStorage.getItem("onboarded") !== "true") {
    window.location.replace("../onboarding/onboarding.html");
}

// DOM ELEMENTS
const profileImage = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");
const themeToggle = document.getElementById("themeToggle");

// APP INIT
window.addEventListener("load", async () => {
    try {
        session.submissions = await getMySubmissions();
        session.comments = await getComments();
        session.deadlines = await getDeadlines();
    } catch (err) {
        console.warn("API not ready, running in mock mode", err);
    }

    initSidebar();
    initThemeToggle();
    initProfileUpload();
    initSubmissionForm();

    renderComments();
    renderStatus();
    renderDeadlines();
    await loadProfile();
});

// THEME TOGGLE
function initThemeToggle() {
    if (!themeToggle) return;
    let dark = true;

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        themeToggle.textContent = dark ? "🌞" : "🌙";
        dark = !dark;
    });
}

// SIDEBAR NAVIGATION
function initSidebar() {
    const nav = document.querySelector(".sidebar-nav");
    const sections = document.querySelectorAll("main section");
    if (!nav || !sections.length) return;

    nav.querySelectorAll("li[data-target]").forEach(li => {
        li.addEventListener("click", () => {
            const targetId = li.dataset.target;
            const target = document.getElementById(targetId);
            if (!target) return;

            // deactivate all
            sections.forEach(s => s.classList.remove("active"));
            nav.querySelectorAll("li").forEach(n => n.classList.remove("active"));

            // activate selected
            target.classList.add("active");
            li.classList.add("active");
        });
    });

    // default first tab active
    nav.querySelector("li[data-target]")?.click();
}

// PROFILE IMAGE UPLOAD
function initProfileUpload() {
    const uploadInput = document.getElementById("profileUpload");
    if (!uploadInput) return;

    uploadInput.addEventListener("change", async e => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_URL}/student/upload-profile-image`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error("Failed to upload profile image");
            await loadProfile();

        } catch (err) {
            console.error(err);
            alert("Failed to update profile image");
        }
    });
}

// LOAD PROFILE
async function loadProfile() {
    try {
        const res = await fetch(`${API_URL}/student/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        document.querySelector(".student-info h3").textContent = data.user.fullName;
        document.getElementById("course").textContent = data.course;
        document.getElementById("email").textContent = data.user.email;

        if (data.profileImagePath) {
            const imgUrl = `${API_URL}/student/profile-image/${data.profileImagePath}`;
            profileImage.src = imgUrl;
            profilePreview.src = imgUrl;
        }
    } catch (err) {
        console.error("Failed to load profile:", err);
    }
}

// SUBMISSION FORM
function initSubmissionForm() {
    const form = document.getElementById("submitForm");
    if (!form) return;

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const file = document.getElementById("file")?.files?.[0];
        if (!file) return alert("Select a file first");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_URL}/student/submit`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert("Submitted successfully");
                session.submissions = await getMySubmissions(); // refresh submissions
            } else {
                alert("Submission failed");
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    });
}

// SUBMISSION STATUS
const submissionsMock = {
    title: { state: "approved", comment: "Title approved" },
    proposal: { state: "pending", comment: "Under review" },
    report: { state: "waiting", comment: "" },
    github: { state: "approved", comment: "Repo looks good" },
    snapshots: { state: "rejected", comment: "UI screenshots unclear" }
};

const statusIcons = {
    waiting: "💤 Waiting",
    pending: "⏳ Pending",
    approved: "✅ Approved",
    rejected: "❌ Rejected"
};

function renderStatus() {
    const grid = document.getElementById("statusGrid");
    if (!grid) return;

    grid.innerHTML = "";

    Object.entries(submissionsMock).forEach(([key, data]) => {
        const card = document.createElement("div");
        card.className = `status-card ${data.state}`;
        card.innerHTML = `
            <h4>${key.toUpperCase()}</h4>
            <strong>${statusIcons[data.state]}</strong>
            <p>${data.comment || "No feedback yet"}</p>
        `;
        grid.appendChild(card);
    });

    updateBatteryFromStatus();
}

// async function renderStatus() {
//     const res = await fetch(`${API_URL}/student/status`, {
//         headers: { "Authorization": `Bearer ${token}` }
//     });

//     if (!res.ok) return;

//     const data = await res.json();

//     console.log("Real status:", data);
// }

function updateBatteryFromStatus() {
    const batteryFill = document.getElementById("batteryFill");
    const batteryPercent = document.getElementById("batteryPercent");
    if (!batteryFill || !batteryPercent) return;

    const total = Object.keys(submissionsMock).length;
    const approved = Object.values(submissionsMock).filter(s => s.state === "approved").length;
    const percent = Math.round((approved / total) * 100);
    animateBattery(percent);
}

function getBatteryColor(p) {
    if (p < 40) return "linear-gradient(90deg, red, orange)";
    if (p < 70) return "linear-gradient(90deg, orange, yellow)";
    return "linear-gradient(90deg, yellow, green)";
}

function animateBattery(target) {
    const batteryFill = document.getElementById("batteryFill");
    const batteryPercent = document.getElementById("batteryPercent");
    if (!batteryFill || !batteryPercent) return;

    let current = 0;
    batteryFill.classList.add("stripes");

    const timer = setInterval(() => {
        if (current >= target) {
            clearInterval(timer);
            batteryFill.classList.remove("stripes");
            return;
        }
        current++;
        batteryFill.style.height = current + "%";
        batteryFill.style.background = getBatteryColor(current);
        batteryPercent.textContent = current + "%";
    }, 15);
}

// COMMENTS
const reviewComments = {
    title: {
        supervisor: { message: "Title is clear.", date: "2026-01-25" },
        student: null
    },
    proposal: {
        supervisor: { message: "Expand methodology.", date: "2026-01-26" },
        student: null
    }
};

function renderComments() {
    const container = document.getElementById("commentThreads");
    if (!container) return;

    container.innerHTML = "";

    Object.entries(reviewComments).forEach(([key, thread]) => {
        const block = document.createElement("div");
        block.className = "comment-thread";
        block.innerHTML = `
            <h4>${key.toUpperCase()}</h4>
            ${thread.supervisor ? `<div class="comment supervisor"><p>${thread.supervisor.message}</p><small>${thread.supervisor.date}</small></div>` : "<p>No supervisor feedback.</p>"}
            ${thread.student ? `<div class="comment student"><p>${thread.student.message}</p></div>` : `
                <textarea id="reply-${key}" placeholder="Reply..."></textarea>
                <button onclick="submitReply('${key}')">Send</button>
            `}
        `;
        container.appendChild(block);
    });
}

window.submitReply = (key) => {
    const input = document.getElementById(`reply-${key}`);
    if (!input || !input.value.trim()) return;

    reviewComments[key].student = { message: input.value, date: new Date().toLocaleDateString() };
    renderComments();
};

// DEADLINES
function renderDeadlines() {
    const container = document.getElementById("deadlineList");
    if (!container) return;

    const deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
    container.innerHTML = deadlines.length
        ? deadlines.map(d => `
            <div class="deadline-card">
                <h4>${d.title}</h4>
                <p>${d.description || ""}</p>
                <small>📅 ${d.date}</small>
            </div>
        `).join("")
        : "<p>No deadlines available.</p>";
}


// LOGOUT
window.openLogout = () => document.getElementById("logoutModal")?.classList.add("active");
window.closeLogout = () => document.getElementById("logoutModal")?.classList.remove("active");
window.confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("../index.html");
};
document.getElementById("logoutModal").addEventListener("click", e => {
    if (e.target.id === "logoutModal") closeLogout();
});
