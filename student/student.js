//  IMPORTS 
import { getMySubmissions } from "../api/submission.api.js";
import { getComments } from "../api/comment.api.js";
import { getDeadlines } from "../api/deadline.api.js";
import { session } from "../state/session.js";

//  APP INIT 
window.addEventListener("load", async () => {
    try {
        session.submissions = await getMySubmissions();
        session.comments = await getComments();
        session.deadlines = await getDeadlines();
    } catch (err) {
        console.warn("API not ready, running in mock mode", err);
    }

    initSubmissionForm();
    initThemeToggle();
    initSidebar();
    initProfileUpload();

    renderComments();
    renderStatus();
    renderDeadlines();
});


//  THEME TOGGLE 
function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    let dark = true;

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        toggle.textContent = dark ? "🌞" : "🌙";
        dark = !dark;
    });
}

//  SIDEBAR NAVIGATION 
function initSidebar() {
    const nav = document.querySelector(".sidebar-nav");
    const sections = document.querySelectorAll("main section");

    if (!nav || !sections.length) return;

    // Add click listener to each li individually
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

    // Activate first tab by default
    nav.querySelector("li[data-target]")?.click();
}


//  PROFILE IMAGE UPLOAD 
function initProfileUpload() {
    const uploadInput = document.getElementById("profileUpload");
    const profileImage = document.getElementById("profileImage");
    const preview = document.getElementById("profilePreview");

    if (!uploadInput) return;

    uploadInput.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/student/upload-profile-image", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: formData
            });

            if (!res.ok) {
                throw new Error("Failed to upload profile image");
            }

            //reload profile after upload
            await loadProfile();

        } catch (err) {
            console.error("Error uploading profile image:", err);
            alert("Failed to update profile image");
        }
    });
}

//load profile on page load
    async function loadProfile() {
      try {
        const res = await fetch("/api/supervisor/me", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();

        //sidebar
        document.querySelector(".supervisor-info h3").textContent = data.fullName;

        //profile section
        document.getElementById("supervisorName").textContent = data.fullName;
        document.getElementById("department").textContent = data.department;
        document.getElementById("email").textContent = data.email;

        if (data.profileImagePath) {
          const ImageUrl = `/api/supervisor/profile-image/${data.profileImagePath}`;
          profileImage.src = ImageUrl;
          profilePreview.src = ImageUrl;
        }

      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }

    loadProfile();

//  MOCK SUBMISSION STATUS 
const submissions = {
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


//STATUS RENDER 
function renderStatus() {
    const grid = document.getElementById("statusGrid");
    if (!grid) return;

    grid.innerHTML = "";

    Object.entries(submissions).forEach(([key, data]) => {
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


// BATTERY LOGIC 
function updateBatteryFromStatus() {
    const batteryFill = document.getElementById("batteryFill");
    const batteryPercent = document.getElementById("batteryPercent");

    if (!batteryFill || !batteryPercent) return;

    const total = Object.keys(submissions).length;
    const approved = Object.values(submissions)
        .filter(s => s.state === "approved").length;

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


//  COMMENTS 
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
            ${thread.supervisor ? `
                <div class="comment supervisor">
                    <p>${thread.supervisor.message}</p>
                    <small>${thread.supervisor.date}</small>
                </div>
            ` : "<p>No supervisor feedback.</p>"}

            ${thread.student ? `
                <div class="comment student">
                    <p>${thread.student.message}</p>
                </div>
            ` : `
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

    reviewComments[key].student = {
        message: input.value,
        date: new Date().toLocaleDateString()
    };

    renderComments();
};


//  DEADLINES 
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
window.openLogout = () =>
    document.getElementById("logoutModal")?.classList.add("active");

window.closeLogout = () =>
    document.getElementById("logoutModal")?.classList.remove("active");

window.confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/index.html");
};


//  SUBMISSION FORM 
function initSubmissionForm() {
    const form = document.getElementById("submitForm");
    if (!form) return;

    const token = localStorage.getItem("token");

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const file = document.getElementById("file")?.files?.[0];
        if (!file) return alert("Select a file first");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/submissions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token
                },
                body: formData
            });

            if (res.ok) {
                alert("Submitted successfully");
            } else {
                alert("Submission failed");
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    });
}

//===DB DRIVEN LOGIC====
// import { session } from "../state/session.js";
//import {protectRoute} from "../auth/protectRoute.js";

//document.addEventListener("DOMContentLoaded", () => {
//     protectRoute("student");



// //  APP INIT
// window.addEventListener("load", async () => {
//     try {
//         await Promise.all([
//             loadProfile(),
//             loadsubmissions(),
//             renderStatus(),
//             renderComments(),
//             renderDeadlines(),
//             renderNotifications()
//         ]);
//     } catch (err) {
//         console.warn("API not ready, running in mock mode", err);
//     }

//     initThemeToggle();
//     initSidebar();
//     initProfileUpload();
// });

// //THEME TOGGLE
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

// //SIDEBAR NAVIGATION
// function initSidebar() {
//     const nav = document.querySelector(".sidebar-nav");
//     const sections = document.querySelectorAll("main section");

//     if (!nav || !sections.length) return;

//     // Add click listener to each li individually
//     nav.querySelectorAll("li[data-target]").forEach(li => {
//         li.addEventListener("click", () => {
//             const target = document.getElementById(li.dataset.target);
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

// //PROFILE 
// async function loadProfile() {
//     const token = localStorage.getItem("token");
//     try {
//         const res = await fetch("/api/student/me", {
//             headers: {
//                 "Authorization": "Bearer " + token
//             }
//         });
//         if (!res.ok) throw new Error("Unauthorized");
//         const student = await res.json();

//         //sidebar
//         document.querySelector(".student-info h3").textContent = student.fullName;
//         document.getElementById("profileImage").textContent = student.profileImage || "../images/default-avatar.png";

//         //profile section
//         document.getElementById("studentName").textContent = student.fullName;
//         document.getElementById("regNo").textContent = student.regNo;
//         document.getElementById("email").textContent = student.email;
//         document.getElementById("profilePreview").textContent = student.profileImage || "../images/default-avatar.png" ;

//     } catch (err) {
//         console.error("Failed to load profile:", err);
//     }
// }

// function initProfileUpload() {
//     const uploadInput = document.getElementById("profileUpload");
//     if (!uploadInput) return;

//         uploadInput.addEventListener("change", async (e) => {
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
//             if (!res.ok) throw new Error("Failed to upload profile image");

//             //reload profile after upload
//             await loadProfile();
//         } catch (err) {
//             console.error("Error uploading profile image:", err);
//             alert("Failed to update profile image");
//         }
//     }); 
// }

// //SUBMISSIONS
// async function loadsubmissions() {
//     const container = document.getElementById("submission");
//     container.innerHTML = "";
//     const token = localStorage.getItem("token");

//     try {
//         const res = await fetch("/api/student/submissions", {
//             headers: {
//                 "Authorization": "Bearer " + token
//             }
//         });
//         const submissions = await res.json();

//         submissions.forEach(sub => {
//             const card = document.createElement("div");
//             card.className = "submission-card";

//             if (sub.type === "github") {
//                 card.innerHTML = `
//                     <h4>${sub.type}</h4>
//                     <input placeholder="Enter GitHub URL" value="${sub.githubLink || ''}">
//                     <button onclick="saveGithub('${sub.id}')">Save</button>
//                     <small>Status: ${sub.status}</small>
//                 `;
//             } else {
//                 card.innerHTML = `
//                     <h4>${sub.type}</h4>
//                     <input type="file" accept="${sub.accept || "*/*"}">
//                     <button onclick="uploadFile('${sub.id}')">Upload</button>
//                     <small>Status: ${sub.status}</small>
//                 `;
//             }

//             container.appendChild(card);
//         }); 
//     } catch (err) {
//         console.error(err);
//     }
// }

// //UPLOAD FILE DYNAMICALLY
// window.uploadFile = async (id) => {
//     const card = document.querySelector(`.submission-card button[onclick="uploadFile('${id}')"]`).parentElement;
//     const fileInput = card.querySelector('input[type="file"]');
//     const file = fileInput.files?.[0];
//     if (!file) return alert("Select a file first");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//         const res = await fetch(`/api/student/submissions/${id}`, {
//             method: "POST",
//             headers: {
//                 " Authorization": "Bearer " + localStorage.getItem("token")
//             },
//             body: formData
//         });
//         if (res.ok) 
//             alert("File uploaded successfully");
//             else alert("Upload failed");
//         } catch (err) {
//             console.error(err);
//             alert("Network error");
//         }
// }

// //SAVE GITHUB LINK DYNAMICALLY
// window.saveGithub = async (id) => {
//     const card = document.querySelector(`.submission-card button[onclick="saveGithub('${id}')"]`).parentElement;
//     const url = card.querySelector('input').value;
//     if (!url) return alert("Enter GitHub URL");

//     try {
//         const res = await fetch(`/api/student/submissions/${id}`, {
//             method: "POST",
//             headers: {
//                 "Authorization": "Bearer " + localStorage.getItem("token"),
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ githubLink: url })
//         });
//         if (res.ok) alert("GitHub link saved");
//         else alert("Failed to save GitHub link");
//     } catch (err) {
//         console.error(err);
//         alert("Network error");
//         }
//     }

//     //STATUS
//     const statusIcons = {
//     waiting: "💤 Waiting",
//     pending: "⌛ Pending",
//     approved: "✅ Approved",
//     rejected: "❌ Rejected"
//     };

//     async function renderStatus() {
//         const grid = document.getElementById("statusGrid");
//         grid.innerHTML = "";
//         const token = localStorage.getItem("token");

//         try {
//             const res = await fetch("/api/student/status", {
//                 headers: {
//                     "Authorization": "Bearer " + token
//                 }
//             });
//             const statusData = await res.json();

//             Object.entries(statusData).forEach(([key, data]) => {
//                 const card = document.createElement("div");
//                 card.className = `status-card ${data.state}`;

//                 card.innerHTML = `
//                     <h4>${key.toUpperCase()}</h4>
//                     <strong>${statusIcons[data.state]}</strong>
//                     <p>${data.comment || "No feedback yet"}</p>
//                 `;
//                 grid.appendChild(card);
//             });

//             updateBatteryFromStatus();
//         } catch (err) {
//             console.error(err);
//         }
//     }

//     function updateBatteryFromStatus(statuses) {
//         const batteryFill = document.getElementById("batteryFill");
//         const batteryPercent = document.getElementById("batteryPercent");
//         if (!batteryFill || !batteryPercent) return;

//         const total = Object.keys(statuses).length;
//         const approved = Object.values(statuses).filter(s => s.state === "approved").length;
//         animateBattery(Math.round((approved / total) * 100));
//     }

//     function getBatteryColor(p) {
//         if (p < 40) return "linear-gradient(90deg, red, orange)";
//         if (p < 70) return "linear-gradient(90deg, orange, yellow)";
//         return "linear-gradient(90deg, yellow, green)";
//     }

//     function animateBattery(target) {
//         const batteryFill = document.getElementById("batteryFill");
//         const batteryPercent = document.getElementById("batteryPercent");
//         let current = 0;
//         batteryFill.classList.add("stripes");

//         const timer = setInterval(() => {
//             if (current >= target) {
//                 clearInterval(timer);
//                 batteryFill.classList.remove("stripes");
//                 return;
//             }
//             current++;
//             batteryFill.style.height = current + "%";
//             batteryFill.style.background = getBatteryColor(current);
//             batteryPercent.textContent = current + "%";
//         }, 15);
//     }

//     //COMMENTS
//     async function renderComments() {
//         const container = document.getElementById("commentThreads");
//         container.innerHTML = "";
//         const token = localStorage.getItem("token");

//         try {
//             const res = await fetch("/api/student/comments", {
//                 headers: {
//                     "Authorization": "Bearer " + token
//                 }
//             });
//             const commentsData = await res.json();

//             Object.entries(commentsData).forEach(([key, thread]) => {
//                 const block = document.createElement("div");
//                 block.className = "comment-thread";
//                 let html = `<h4>${key.toUpperCase()}</h4>`;

//                 comments.forEach(c => {
//                     html += ` <div class="comment ${c.by}"><p>${c.msg}</p><small>${c.date}</small></div>`;
//                 });

//                 if (!comments.some(c => c.by === "student")) {
//                     html += `<textarea id="reply-${key}" placeholder="Reply..."></textarea>
//                     <button onclick="submitReply('${key}')">Send</button>`;
//                 }

//                 block.innerHTML = html;
//                 container.appendChild(block);
//             }); 
//         } catch (err) {
//             console.error(err);
//         }
//     }

//     window.submitReply = async (key) => {
//         const input = document.getElementById(`reply-${key}`);
//         if (!input || !input.value.trim()) return;

//         try {
//             const res = await fetch(`/api/student/comments/${key}`, {
//                 method: "POST",
//                 headers: {
//                     "Authorization": "Bearer " + localStorage.getItem("token"),
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ message: input.value })
//             });
//             if (res.ok) renderComments();
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     //DEADLINES
//     async function renderDeadlines() {
//         const container = document.getElementById("deadlineList");
//         container.innerHTML = "";
//         const token = localStorage.getItem("token");

//         try {
//             const res = await fetch("/api/student/deadlines", {
//                 headers: {
//                     "Authorization": "Bearer " + token
//                 }
//             });
//             const deadlines = await res.json();

//             if (deadlines.length === 0) container.innerHTML = "<p>No deadlines yet.</p>";
//             else deadlines.forEach(dl => {
//                 const card = document.createElement("div");
//                 card.className = "deadline-card";
//                 card.innerHTML = `
//                     <h4>${dl.title}</h4>
//                     <p>${dl.description || ""}</p>
//                     <small>📅 ${dl.date}</small>
//                 `;
//                 container.appendChild(card);
//             });
//         } catch (err) { console.error(err); }
//         }

//         //NOTIFICATIONS
//         async function renderNotifications() {
//             const container = document.getElementById("notificationList");
//             container.innerHTML = "";
//             const token = localStorage.getItem("token");

//             try {
//                 const res = await fetch("/api/student/notifications", {
//                     headers: {
//                         "Authorization": "Bearer " + token
//                     }
//                 });
//                 const notifications = await res.json();

//                 notifications.forEach(n => {
//                     const li = document.createElement("li");
//                     li.className = `notify ${n.type}`;
//                     li.textContent = `${n.icon || ""} ${n.message}`;
//                     container.appendChild(li);
//                 });
//             } catch (err) { console.error(err); }
//         }

//         //LOGOUT
//         window.openLogout = () => document.getElementById("logoutModal")?.classList.add("active");
//         window.closeLogout = () => document.getElementById("logoutModal")?.classList.remove("active");
//         window.confirmLogout = () => { localStorage.clear(); sessionStorage.clear(); window.location.replace("/index.html"); };











