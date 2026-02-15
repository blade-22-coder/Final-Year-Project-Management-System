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

    initSidebar();
    initThemeToggle();
    initProfileUpload();
    initSubmissionForm();

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
    const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
    const sections = document.querySelectorAll(".dashboard section");

    if (!navItems.length || !sections.length) return;

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = document.getElementById(item.dataset.target);
            if (!target) return;

            sections.forEach(s => s.classList.remove("active"));
            navItems.forEach(n => n.classList.remove("active"));

            target.classList.add("active");
            item.classList.add("active");
        });
    });

    // Activate first tab by default
    navItems[0].click();
}


//  PROFILE IMAGE UPLOAD 
function initProfileUpload() {
    const upload = document.getElementById("profileUpload");
    const profileImg = document.getElementById("profileImage");
    const preview = document.getElementById("profilePreview");

    if (!upload) return;

    upload.addEventListener("change", e => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (profileImg) profileImg.src = reader.result;
            if (preview) preview.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

window.uploadImage = () => {
    document.getElementById("profileUpload")?.click();
};


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
