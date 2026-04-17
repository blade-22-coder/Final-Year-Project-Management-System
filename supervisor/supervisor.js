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
let proposalFile = null;
let reportFile = null;

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
        document.getElementById("department").textContent = data.department;
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
        
        const grid = document.getElementById("studentGrid");
        grid.innerHTML = "";

        students.forEach(student => {

            const card = document.createElement("div");
            card.className = "student-card";

            const imgUrl = student.profileImage
                ? `${API_URL}/student/profile-image/${student.profileImage}?t=${Date.now()}`
                : "../images/1.JPG";

            card.innerHTML = `
                <img src="${imgUrl}" class="avatar">
                <h3>${student.fullName}</h3>
                <p>${student.registrationNumber}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${student.progress}%"></div>
                </div>
                <p>${student.progress}% Complete</p>
            `;
            grid.appendChild(card);

            // open modal on click
            card.onclick = () => {
                pendingStudent = student;
                modalStudentName.textContent = student.fullName || "Unknown Student";
                modal.classList.remove("hidden");
            }
        });
    } catch (err) {
        console.error(err);
    }
}

// ====== Student Selection Modal ======
let pendingStudent = null;
let currentSubmissionId = null; 
confirmBtn.onclick = () => {
    selectedStudent = pendingStudent;

    studentContext.textContent = `Viewing: ${selectedStudent.fullName}`;

    lockedItems.forEach(item => item.classList.remove("locked"));

    loadProjectTitle(selectedStudent.id);
    loadDocumentation(selectedStudent.id);
    loadGitHub(selectedStudent.id);
    loadAnalytics(selectedStudent.id);
    loadGrades(selectedStudent.id);
    loadSnapshots(selectedStudent.id);

    modal.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    studentsView.classList.add("hidden");
};

cancelBtn.onclick = () => {
    pendingStudent = null;
    modal.classList.add("hidden");
};

// ======Load Student Title ======
async function loadProjectTitle(studentId) {
      const res = await fetch(`${API_URL}/supervisor/title/${studentId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();
      const titleText = document.getElementById("projectTitleText");
      const textarea = document.getElementById("titleComment");

      titleText.textContent = data.title || "No project title submitted";
      textarea.value = data.supervisorComment || "";
      textarea.dataset.id = data.id;

}

// === Title approval =====
async function approveTitle(studentId) {
    const res = await fetch(
        `${API_URL}/supervisor/${studentId}/title/approve`, {
            method: "PUT",
            headers : { "Authorization": `Bearer ${token}` }
        }
    );

    if (res.ok) {
        alert("Title Approved ✅");
        loadProjectTitle(selectedStudent.id);
    }
}

// ==== Title rejection =====
async function rejectTitle(studentId) {
    const res = await fetch(
        `${API_URL}/supervisor/${studentId}/title/reject`, {
            method: "PUT",
            headers : { "Authorization": `Bearer ${token}` }
        }
    );

    if (res.ok) {
        alert("Title Rejected ❌");
        loadProjectTitle(selectedStudent.id);
    }
}

// ===== Title comment =====
async function submitTitleComment() {
    const textarea = document.getElementById("titleComment");
    const titleId = textarea.dataset.id;
    const message = textarea.value;

    if (!message.trim()) {
        alert("Write a comment first");
        return;
    }

    const res = await fetch(`${API_URL}/supervisor/project-title/${titleId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message })
    });

    if (res.ok) {
        alert("Comment sent");
    } else {
        alert("Failed to submit comment");
    }
}

// ====== Load student Documentation ======
async function loadDocumentation(studentId) {

    const res = await fetch(`${API_URL}/supervisor/docs/${studentId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) return;

    const docs = await res.json();

    proposalFile = docs.proposal;
    reportFile = docs.finalReport;
}

// ====Doc comment ====
async function submitDocComment(button) {

    const textarea = button.previousElementSibling;
    const docId = textarea.dataset.id;
    const message = textarea.value;

    if (!message.trim()) {
        alert("Write a comment first");
        return;
    }

    const res = await fetch(`${API_URL}/supervisor/docs/${docId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body : JSON.stringify({
            message: message })
    });

    if (res.ok) {
        alert("Comment sent");
    } else {
        alert("Failed to submit comment");
    }
}

// ======Load Student Github Link =====
async function loadGitHub(studentId) {
    const res = await fetch(`${API_URL}/supervisor/github/${studentId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
        console.warn("Github data not found");
        return;
    }

    const github = await res.json();

    const link = document.querySelector(".repo-box a");
    const textarea = document.querySelector(".repo-box textarea");

    if(github.githubLink) {
        link.href = github.githubLink;
        link.textContent = github.githubLink;
    } else {
        link.textContent = "No repository submitted"
        link.removeAttribute("href")
    }
}

// === Github approval =====
async function approveGithubLink(studentId) {
    const res = await fetch(
        `${API_URL}/supervisor/${studentId}/githubLink/approve`, {
            method: "PUT",
            headers : { "Authorization": `Bearer ${token}` }
        }
    );

    if (res.ok) {
        alert("Github Link Approved ✅");
        loadGitHub(selectedStudent.id);
    }
}

// ==== Github rejection =====
async function rejectGithubLink(studentId) {
    const res = await fetch(
        `${API_URL}/supervisor/${studentId}/githubLink/reject`, {
            method: "PUT",
            headers : { "Authorization": `Bearer ${token}` }
        }
    );

    if (res.ok) {
        alert("Github Link Rejected ❌");
        loadGitHub(selectedStudent.id);
    }
}

// ====Github comment ====
async function submitGithubComment(Id) {

    const message = document.getElementById("githubComment").value;
    if (!message) {
        alert("Write a comment first");
        return;
    }

    const res = await fetch(`${API_URL}/supervisor/github/${Id}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body : JSON.stringify({ 
            message: message })
    });

    if (res.ok) {
        alert("Comment sent");
    } else {
        alert("Failed to submit comment");
    }
}

// ===== Load Student Snapshot ======
async function loadSnapshots(studentId) {
    const res = await fetch(`${API_URL}/supervisor/snapshots/${studentId}`, {
        headers: { "Authorization": `Bearer ${token}`}
    });

    if(!res.ok) return;

    const snapshots = await res.json();
    const grid = document.querySelector("#snapshotGrid");

    grid.innerHTML = "";

    snapshots.forEach(snap => {

        const file = snap.fileName || snap;

        const wrapper = document.createElement("div");
        wrapper.className = "snapshot-card";

        wrapper.innerHTML = `

            <img src = "${API_URL}/supervisor/snapshots/file/${file}" class="snapshot">
        `;
        
        const img = wrapper.querySelector("img");
        img.onclick = async () => {
            const res = await fetch(img.src, {
                headers: { 
                    "Authorization": `Bearer ${token}`
                }
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(
                `preview.html?file=${encodeURIComponent(url)}&studentId=${selectedStudent.id}&type=snapshot`,
                "_blank"
            );
        };
        
        grid.appendChild(wrapper);

    });   
}

// ======= snapshot approval =====
async function approveSnapshot() {
    const res = await fetch(
        `${API_URL}/supervisor/${selectedStudent.id}/snapshots/approve`, {
            method: "PUT",
            headers:{ "Authorization": `Bearer ${token}` }
        }
    );

    if(res.ok) {
         alert("Snapshots Approved ✅");
         loadSnapshots(selectedStudent.id);
    }
}

// ====== snapshot rejection =======
async function rejectSnapshot() {
    const res = await fetch(
        `${API_URL}/supervisor/${selectedStudent.id}/snapshots/reject`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}`}
        }
    );

    if(res.ok) {
        alert("Snapshots Rejected ❌");
        loadSnapshots(selectedStudent.id);
    }
}
// ====== Load Student Analytics ======
async function loadAnalytics(studentId) {
    try {
        const res = await fetch(`${API_URL}/supervisor/analytics/${studentId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load analytics");

        const text = await res.text();
        if (!text) return;

        const data = JSON.parse(text); // { progress: [], repoCommits: [], submissions: [] }

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
        
    const res = await fetch(`${API_URL}/supervisor/grades/${studentId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) return;

    const grades = await res.json();

    document.querySelector('[data-part="proposal"]').value = grades.proposal || 0;
    document.querySelector('[data-part="progress"]').value = grades.progress || 0;
    document.querySelector('[data-part="finalReport"]').value = grades.finalReport || 0;
    document.querySelector('[data-part="presentation"]').value = grades.presentation || 0;

    computeTotal();
    
}

// ====== Submitting to admin ======
document.getElementById("submitGrade").onclick = async () => {

    const payload = {
        proposal: document.querySelector('[data-part="proposal"]').value,
        progress: document.querySelector('[data-part="progress"]').value,
        finalReport: document.querySelector('[data-part="finalReport"]').value,
        presentation: document.querySelector('[data-part="presentation"]').value,
        comment: document.querySelector("#gradeComment").value
    };

    const res = await fetch(`${API_URL}/supervisor/grades/${selectedStudent.id}/submit`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (res.ok) alert("Grades saved");
};

// === saving grade draft =====
document.getElementById("saveGrade").onclick = async () => {

    const payload = {
        proposal: document.querySelector('[data-part="proposal"]').value,
        progress: document.querySelector('[data-part="progress"]').value,
        finalReport: document.querySelector('[data-part="finalReport"]').value,
        presentation: document.querySelector('[data-part="presentation"]').value,
    };
    await fetch(`${API_URL}/supervisor/grades/${selectedStudent.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    alert("Draft saved");
};

// =====Auto compilation =====
function computeTotal() {
    let total = 0;
    gradeInputs.forEach(input => total += parseInt(input.value) || 0);
    totalDisplay.textContent = `${total} / 100`;
}
gradeInputs.forEach(input => input.addEventListener("input", computeTotal));

// ====== Files ======
async function preview(type) {
    let fileName = type === "proposal" ? proposalFile : reportFile;

    if (!fileName) {
        alert("File not submitted yet");
        return;
    }

    try {

        const encodedFile = encodeURIComponent(fileName);
        const res = await fetch(`${API_URL}/supervisor/file/${encodedFile}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Failed to load file");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        window.open(`preview.html?file=${encodeURIComponent(url)}&studentId=${selectedStudent.id}&type=${type}`,"_blank");
    } catch (err) {
        console.error(err);
        alert("Unable to preview file");
    }
}

 async function download(type) {
    let fileName = type === "proposal" ? proposalFile : reportFile;

    if (!fileName) {
        alert("File not submitted yet");
        return;
    }

    try {

        const encodedFile = encodeURIComponent(fileName);
        const res = await fetch(`${API_URL}/supervisor/file/${encodedFile}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Download failed");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
    } catch (err) {
        console.error(err);
        alert("Download failed");
    }
}

//========Comments========
async function submitComment(type) {

    if (!selectedStudent) {
        alert("Select a student first");
        return;
    }

    const textareaMap = {
        TITLE: document.getElementById("titleComment"),
        PROPOSAL: document.querySelector("#documentView .doc-card:nth-child(2) textarea"),
        REPORT: document.querySelector("#documentView .doc-card:nth-child(3) textarea"),
        GITHUB: document.querySelector("#repoView .repo-box textarea"),
        SNAPSHOT: document.querySelector("#repoView .snapshot-grid textarea")
    }

    const textarea = textareaMap[type];
    const message = textarea.value;

    if (!message) {
        alert("Write a comment first");
        return;
    }

    const res = await fetch(`${API_URL}/supervisor/comments/${currentSubmissionId}`, {
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
        alert("Comment submitted 💬");
        textarea.value = "";
        loadComments(type);
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
                <p>${dl.description || ""}</p>
                <small>📆 ${dl.deadlineDate ? new Date(dl.deadlineDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }): "TBA"}</small>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Deadline load failed:", err);
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



 
