// ====DB DRIVEN LOGIC====
// IMPORTS
import { getMySubmissions } from "../api/submission.api.js";
import { getComments } from "../api/comment.api.js";
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
    // await renderNotifications();
    await renderSubmissions();

    const cached = localStorage.getItem("submissionCache");
    if (cached) {
        renderCachedSubmission(JSON.parse(cached));
    } 
    
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

// LOAD PROFILE
async function loadProfile() {
    try {
        const res = await fetch(`${API_URL}/student/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        //sidebar  & profile
        document.getElementById("sidebarName").textContent = data.user.fullName;
        document.getElementById("studentName").textContent = data.user.fullName;
        document.getElementById("regNo").textContent = data.registrationNumber;
        document.getElementById("email").textContent = data.user.email;

        //supervisor details
        if (data.supervisor) {
            document.getElementById("supervisorName").textContent = data.supervisor.fullName;
            document.getElementById("supervisorImage").src = data.supervisor.profileImagePath
            ? `${API_URL}/supervisor/profile-image/${data.supervisor.profileImagePath}`
            : "../images/1.jpg";
        } else {
            document.getElementById("supervisorName").textContent = "Not Assigned";
        }

        const defaultAvatar = "../images/1.JPG";
        
        const imgUrl = data.profileImagePath
            ? `${API_URL}/student/profile-image/${data.profileImagePath}?t=${Date.now()}`
            : defaultAvatar;

            profileImage.src = imgUrl;
            profilePreview.src = imgUrl;

            setupSupervisorModal(data.supervisor);
        
    } catch (err) {
        console.error("Failed to load profile:", err);
    }
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
            alert("Profile image updated successfully ✅")

        } catch (err) {
            console.error(err);
            alert("Failed to update profile image ❌");
        }
    });
}

// SUBMISSION FORM

// submissions
async function renderSubmissions() {
    const container =  document.getElementById("submissionList");
    if(!container) return;

    try {
        const res = await fetch(`${API_URL}/student/submission`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch submissions");

        const s = await res.json();

        //persist to local storage
        localStorage.setItem("submissionCache", JSON.stringify(s));

        //title
        if (s.projectTitle) {
            document.querySelector("#submissions input[type=text]").value = s.projectTitle;
        }

        //proposal
        if (s.proposalUrl) {
            document.getElementById("proposalFile").parentElement;

            proposalDiv.insertAdjacentHTML("beforeend", `
                <p class="file-link">
                    📄 <a href="${API_URL}/student/file/proposals/${s.proposalUrl}" target="_blank">
                        ${s.proposalUrl.split("_").slice(1).join("_")}
                    </a>
                </p>
            `);
        }

        //final report
        if (s.finalReportUrl) {
            document.getElementById("finalReportFile").parentElement;

            proposalDiv.insertAdjacentHTML("beforeend", `
                <p class="file-link">
                    📄 <a href="${API_URL}/student/file/finalReport/${s.finalReportUrl}" target="_blank">
                        ${s.proposalUrl.split("_").slice(1).join("_")}
                    </a>
                </p>
            `);
        }

        //github link
        if (s.githubLink) {
            document.getElementById("githubLink").value = s.githubLink;
        }

        //snapshots
        if (s.snapshotsUrl) {
            renderSnapshots(s.snapshotsUrl);
        }
    } catch (err) {
        console.error(err);
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

    if (files.length === 0) {
        alert("Please select snapshots first");
        return;
    }

    if (files.length > 6) {
        alert("Maximum 6 snapshots allowed");
        return;
    }

    const formData = new FormData();

    for (let file of files) {
        formData.append("files", file);
    }

    const res = await fetch(`${API_URL}/student/submit/snapshots`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`},
        body: formData
    });

    if (!res.ok) throw new Error ("Upload failed");

    alert("Snapshots uploaded ✅");
    await renderSubmissions();
    await renderStatus();
    
};

//=====Snapshot review =====
function renderSnapshots(paths) {

    const grid = document.getElementById("snapshotPreview");
    if(!grid) return;

    grid.innerHTML = "";

    const files = paths.split(";").filter(Boolean);
    files.forEach(file => {

        const img = document.createElement("img");
        img.src = `${API_URL}/student/files/snapshots/${file}`;
        img.className = "snapshot-preview";

        img.onclick = () => {
            window.open(`${API_URL}/files/snapshots/${file}`, "_blank");
        }

        grid.appendChild(img)
    });

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
            `${API_URL}/student/comments/me`, {
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
            div.className="comment supervisor";

            div.innerHTML = `
                <h4>Submission #${c.submission?.id || ""}</h4>
                <div class = "comment supervisor">
                    <p>${c.message}</p>
                    <small>${new Date(c.createdAt).toLocaleString()}</small>
                </div>
            `;

            container.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

window.submitReply = async (submissionId) => {

    const input = document.getElementById(`reply-${submissionId}`);
    if (!input || !input.value.trim()) return;

    await fetch(`${API_URL}/supervisor/comments/${submissionId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            message: input.value
        })
    });

    input.value="";
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

//SUPERVISOR VIEW MODAL
function setupSupervisorModal(supervisor) {
    const modal = document.getElementById("supervisorModal");
    const btn = document.getElementById("viewSupervisorBtn");
    const close = document.querySelector(".close-supervisor");

    if (!modal || !btn || !close) return;
    btn.onclick = () => {
        if (!supervisor) {
            alert("No supervisor assigned yet.");
            return;
        }
        document.getElementById("modalSupervisorName").textContent = supervisor.fullName;
        document.getElementById("modalSupervisorEmail").textContent = supervisor.email;
        document.getElementById("modalSupervisorTelephone").textContent = supervisor.telephoneNumber;
        document.getElementById("modalSupervisorDepartment").textContent = supervisor.department;
        document.getElementById("modalSupervisorImage").src = supervisor.profileImagePath
        ? `${API_URL}/supervisor/profile-image/${supervisor.profileImagePath}`
        : "../images/1.jpg";

        modal.classList.add("active");
    };
    close.onclick = () => {
        modal.classList.remove("active");
    };
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    };
}
