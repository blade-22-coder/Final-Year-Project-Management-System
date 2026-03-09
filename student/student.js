// ====DB DRIVEN LOGIC====
// IMPORTS
import { protectRoute } from "../auth/route-guard.js";
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

if (localStorage.getItem("onboardingCompleted") !== "true") {
    window.location.replace("../onboarding/onboarding.html");
}

window.uploadImage = () => {
    document.getElementById("profileUpload").click();
};

// DOM ELEMENTS
const profileImage = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");
const uploadInput = document.getElementById("profileUpload");
const themeToggle = document.getElementById("themeToggle");
const status = {
    waiting: "💤 Waiting",
    pending: "⏳ Pending",
    approved: "✅ Approved",
    rejected: "❌ Rejected"
};

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

    renderComments();
    renderStatus();
    renderDeadlines();

    await loadProfile();
    await renderNotifications();
    await renderSubmissions();
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
        const file = e.target.files[0];
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
        document.getElementById("sidebarName").textContent = data.user.fullName;
        document.getElementById("studentName").textContent = data.user.fullName;
        document.getElementById("regNo").textContent = data.registrationNumber;
        document.getElementById("email").textContent = data.user.email;

        const defaultAvatar = "../images/1.jpg";
        
        const imgUrl = data.profileImagePath
            ? `${API_URL}/student/profile-image/${data.profileImagePath}?t=${Date.now()}`
            : defaultAvatar;

            profileImage.src = imgUrl;
            profilePreview.src = imgUrl;
        
    } catch (err) {
        console.error("Failed to load profile:", err);
    }
}

// SUBMISSION FORM

// submissions
async function renderSubmissions() {
    const container =  document.getElementById("submissionList");
    if(!container) return;
    container.innerHTML = "Loading....";

    try {
        const res = await fetch(`${API_URL}/student/submission`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch submissions");

        const submissions = await res.json();

        container.innerHTML = "";
        const div = document.createElement("div");
        div.className = "submission-card";
        div.innerHTML = `
            <h4>${s.type}</h4>
            <small>Submitted: ${new Date(s.submittedAt).toLocaleDateString()}</small>
        `;

            container.appendChild(div);
    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>FAiled to load submissions</p>";
    }
}
//submit title
window.submitTitle = async () => {
    const title = document.querySelector("#submissions input[type=text]").value;
    const formData = new FormData();
    formData.append("title", title);

    const res = await fetch(`${API_URL}/student/submit/title`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`},
        body: formData
    });

    if (!res.ok) throw new Error ("Submission Failed");

    alert("Title submitted ✅");
    await renderSubmissions();
    await renderStatus();
};

//upload proposal
window.uploadProposal = async () => {
    const file = document.getElementById("proposalFile").files[0];

    if (!file) {
        alert("Please select a proposal file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/student/submit/proposal`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`},
        body: formData
    });

    if (!res.ok) throw new Error ("Upload Failed");

    alert("Proposal uploaded ✅");
    await renderSubmissions();
    await renderStatus();
};

//upload final report
window.uploadFinalReport = async () => {
    const file = document.getElementById("finalReportFile").files[0];

    if (!file) {
        alert("Please select a final report");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/student/submit/finalReport`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`},
        body: formData
    });

    if (!res.ok) throw new Error ("Upload Failed");

    alert("Final Report uploaded ✅");
    await renderSubmissions();
    await renderStatus();
};

//submit github link
window.submitGitHubLink = async () => {

    const link = document.getElementById("githubLink").value;

    if(!link) {
        alert("Please paste your repository link");
        return;
    }
    
    const formData = new FormData();
    formData.append("githubLink", link);

    const res = await fetch(`${API_URL}/student/submit/github`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`},
        body: formData
    });

    if (!res.ok)  throw  new Error ("Submission Failed");

    alert("GitHub Link submitted ✅");
    await renderSubmissions();
    await renderStatus();
};

//upload snapshots
window.uploadSnapshots = async () => {
    
    const files = document.getElementById("snapshotFiles").files;

    if (!files.length) {
        alert("Please select snapshots first");
        return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    try {
        const res = await fetch(`${API_URL}/student/submit/snapshots`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`},
            body: formData
        });

        if (!res.ok) throw new Error ("Upload failed");

        alert("Snapshots uploaded");
        await renderSubmissions();
        await renderStatus();
        previewSnapshots(files);

    } catch (err) {
        console.error(err);
        alert("Failed to upload snapshots");
    }
    
  
};

//=====Snapshot review =====
function previewSnapshots(files) {

    const grid = document.getElementById("snapshotPreview");
    if(!grid) return;

    grid.innerHTML = "";

    for (let file of files) {
        const img = document.createElement("img");

        img.src = URL.createObjectURL(file);
        img.className = "snapshot-preview";

        grid.appendChild(img);
    }
}

// SUBMISSION STATUS
async function renderStatus() {

    const grid =  document.getElementById("statusGrid");
    grid.innerHTML = "Loading...";

    try {

        const res = await fetch(`${API_URL}/student/status`, {
            headers: { "Authorization": `Bearer ${token}`}
        });

        if (!res.ok) throw new Error("Failed to fetch status");
    
        const data = await res.json();
        const items = [
            ["Title", data.titleStatus],
            ["Proposal", data.proposalStatus],
            ["GitHubLink", data.githubLinkStatus],
            ["Final Report", data.finalReportStatus],
            ["Snapshots", data.snapshotsStatus]
        ];

        grid.innerHTML = "";

        items.forEach(([name, state]) => {

            const card = document.createElement("div");
            const lower = state.toLowerCase();

            card.className = `status-card ${lower}`;
            card.innerHTML = `
                <h4>${name}</h4>
                <strong>${status[lower]}</strong>
            `;

            grid.appendChild(card);
        });

        animateBattery(data.battery)

    } catch (error) {

        console.error("Error loading status:", error);
        grid.innerHTML = `<p>⚠️ Couldn't load status</p>`;
    }
    
}

// BATTERY
function updateBatteryFromStatus(submissions) {

    const batteryFill = document.getElementById("batteryFill");
    const batteryPercent = document.getElementById("batteryPercent");

    if (!batteryFill || !batteryPercent) return;

    const total = submissions.length;
    const approved = submissions.filter(s => s.state === "APPROVED").length;
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
async function renderComments() {

    try {

        const res = await fetch(
            `${API_URL}/student/comments`, {
                headers:{ "Authorization": `Bearer ${token}` }
            }
        );
        if (!res.ok) throw new Error("Failed to fetch comments");
        const comments = await res.json();

        const container = document.getElementById("commentThreads");
        if (!container) return;

        container.innerHTML = "";

        comments.forEach (c => {

            const div = document.createElement("div");
            div.className="Comment supervisor";

            div.innerHTML = `
                <h4>${c.submissionType || "Submission"}</h4>
                <div class = "comment supervisor">
                    <p>${c.comment}</p>
                    <small>${new Date(c.createdAt).toLocaleString()}</small>
                </div>
            `;

            container.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

window.submitReply = (key) => {
    const input = document.getElementById(`reply-${key}`);
    if (!input || !input.value.trim()) return;

    reviewComments[key].student = { message: input.value, date: new Date().toLocaleDateString() };
    renderComments();
};

// DEADLINES
async function renderDeadlines() {
    const container = document.getElementById("deadlineList");
    if (!container) return;

    const res = await fetch(`${API_URL}/student/deadlines`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const deadlines = await res.json();
    container.innerHTML = "";

    deadlines.forEach(d => {
        const card = document.createElement("div");
        card.className = "deadline-card";

        card.innerHTML = `
            <h4>${d.title}</h4>
            <p>${d.description || ""}</p>
            <small>📅 ${d.deadlineDate ? new Date(d.deadlineDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }) : "TBA"}</small>
            
        `;
    
        container.appendChild(card);
    });
}

//NOTIFICATIONS
async function renderNotifications() {

    const res = await fetch(`${API_URL}/student/notifications`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    const list  = document.getElementById("notificationsList");

    list.innerHTML = "";
    data.forEach(n => {
        const li = document.createElement("li");
        li.className = `notify ${n.type}`;
        li.textContent = n.message;
        list.appendChild(li);
    });
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
