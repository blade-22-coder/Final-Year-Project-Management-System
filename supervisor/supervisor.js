//accessing students and activation of other sections
const studentsBtn = document.getElementById("studentsBtn");
const studentsView = document.getElementById("studentsView");
const dashboardView = document.getElementById("dashboardView");
const studentContext = document.getElementById("studentContext");
const lockedItems = document.querySelectorAll(".locked");


studentsBtn.onclick = () => {
  dashboardView.classList.add("hidden");
  studentsView.classList.remove("hidden");
};

document.querySelectorAll(".student-card").forEach(card => {
  card.onclick = () => {
    const name = card.dataset.name;
    studentContext.textContent = `Viewing: ${name}`;

    lockedItems.forEach(item => {
      item.classList.remove("locked");
    });

    alert(`Student ${name} selected`);
  };
});

//student confirmation pop up
const modal = document.getElementById("studentModal");
const modalStudentName = document.getElementById("modalStudentName");
const confirmBtn = document.getElementById("confirmStudent");
const cancelBtn = document.getElementById("cancelStudent");

let selectedStudent = null;
let pendingStudent = null;

document.querySelectorAll(".student-card").forEach(card => {
  card.onclick = () => {
    pendingStudent = card.dataset.name;
    modalStudentName.textContent = pendingStudent;
    modal.classList.remove("hidden");
  };
});

confirmBtn.onclick = () => {
  selectedStudent = pendingStudent;
  
  studentContext.textContent = `Viewing: ${selectedStudent}`;

  lockedItems.forEach(item => {
    item.classList.remove("locked");
  });

  loadAnalytics(selectedStudent);

  modal.classList.add("hidden");
};

cancelBtn.onclick = () => {
  pendingStudent = null;
  modal.classList.add("hidden");
};

//section navigation
const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
const sections = document.querySelectorAll("main section");

navItems.forEach(item => {
  item.addEventListener("click", () => {

    //prevent locked student-based section
    if (item.classList.contains("locked")) return;

    const targetId = item.dataset.target;

    //hide all sections
    sections.forEach(sec => sec.classList.add("hidden"));

    //show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove("hidden");
    }
  });
})

//syncing sidebar image
const uploadInput = document.getElementById("profileUpload");
const profileImage = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");

uploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const res = await fetch("/api/supervisor/upload-profile-image", {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: formData
    });

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }

    //reload profile after upload
    await loadProfile();

    alert("Profile image updated successfully");

  } catch (err) {
    console.error("Error uploading profile image:", err);
    alert("Failed to update profile image");
  }

});

//analytics chart per student
const studentAnalytics = {
  "Emmanuel Kitara Okello": {
    progress: [20, 35, 50, 65],
    repoCommits: [2, 5, 9, 14],
    submissions: ["On Time", "On Time", "Late", "On Time"]
  },
  "Stacy Martha Alowo Toto": {
    progress: [40, 60, 75, 82],
    repoCommits: [4, 8, 13, 21],
    submissions: ["On Time", "On Time", "On Time", "On Time"]
  }
};

//chart logic
let progressChart = null;
let reportChart = null;

function loadAnalytics(studentName) {
  const data = studentAnalytics[studentName];
  if (!data) return;

  const progressCanvas = document.getElementById("progressChart");
  const reportCanvas = document.getElementById("reportChart");
  
  if (!progressCanvas || !reportCanvas) {
    console.error("Analtyics canvas not found");
    return;
  }

  const progressCtx = progressCanvas.getContext("2d");
  const repoCtx = reportCanvas.getContext("2d");

  if (progressChart) progressChart.destroy();
  if(reportChart) reportChart.destroy();
 
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
      labels: ["week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [{
        label: "Repository Activity (Commits)",
        data: data.repoCommits
      }]
    }
  });
}

//logout
function openLogout() {
    document.getElementById("logoutModal").classList.add("active");
}

function closeLogout() {
    document.getElementById("logoutModal").classList.remove("active");
}

function confirmLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/index.html");
}

//closing module when clicking outside
document.getElementById("logoutModal").addEventListener("click", e => {
    if (e.target.id === "logoutModal") closeLogout();

});

//loading deadlines 
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("deadlineList");

    if (!container) {
        console.error("deadlineList container not found");
        return;
    }

    const deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];

    console.log("Deadlines loaded:", deadlines);

    if (deadlines.length === 0) {
        container.innerHTML = "<p>No deadlines available.</p>";
        return;
    }

    deadlines.forEach(dl => {
        if (!dl.audience.includes("supervisors")) return;

        const card = document.createElement("div");
        card.className = "deadline-card";

        card.innerHTML = `
            <h4>${dl.title}</h4>
            <p>${dl.description || ""}</p>
            <small>📅 ${dl.date}</small>
        `;

        container.appendChild(card);
    });

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
});

//files
function preview(id) {
    window.open(`/api/files/submissions/${id}`, "_blank");
}

function download(id) {
    const link = document.createElement("a");
    link.href = `/api/files/submissions/${id}`;
    link.download = "";
    link.click();
}

//grading
async function submitGrade(submissionId) {
    const score = document.getElementById("score").value;
    const comment = document.getElementById("comment").value;
    const status = document.getElementById("status").value;

    const res = await fetch(`/api/grades/${submissionId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ score, comment, status })
    });

    if (res.ok) {
        alert("Graded successfully");
    } else {
        alert("Failed to grade");
    }
}

//Auto total calculation
const gradeInputs = document.querySelectorAll(".grade-row input");
const totalDisplay = document.getElementById("gradeTotal");

function computeTotal() {
    let total = 0;

    gradeInputs.forEach(input => {
      const value = parseInt(input.value) || 0;
      total += value;
    });

    totalDisplay.textContent = total;
}

gradeInputs.forEach(input => {
    input.addEventListener("input", computeTotal);
});


//DB DRIVEN LOGIC
// import { protectedRoute } from "../auth/protectRoute.js";
// //CONSTANTS
// const API_URL = "http://localhost:8080/api";
// let selectedStudent = null;
// let progressChart = null;
// let reportChart = null;

// //INIT
// document.addEventListener("DOMContentLoaded", async () => {
//   await loadProfile();
//   await loadStudent();
//   await loadDeadlines();
//   initNavigation();
//   initGrading();
// });

// //PROFILE
// async function loadProfile() {
//   try {
//     const res = await fetch("/api/supervisor/me", {
//       headers: {
//         "Authorization": "Bearer " + localStorage.getItem("token")
//       }
//     });
//     if (!res.ok) throw new Error("Unauthorized");

//     const supervisor = await res.json();

//     document.querySelector(".supervisor-info h3").textContent = supervisor.fullName;
//     document.getElementById("department").textContent = supervisor.department;
//     document.getElementById("email").textContent = supervisor.email;

//     if (supervisor.profileImagePath) {
//       const imageUrl = `/api/supervisor/profile-image/${supervisor.profileImagePath}`;
//       document.getElementById("profileImage").src = imageUrl;
//       document.getElementById("profilePreview").src = imageUrl;
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }

// //STUDENTS
// async function loadStudent() {
//   try {
//     const res = await fetch("/api/supervisor/students", {
//       headers: {
//         "Authorization": "Bearer " + localStorage.getItem("token")
//       }
//     });
    
//     const students = await res.json();

//     students.forEach(s => {
//       const card = document.createElement("div");
//       card.className = "student-card";
//       card.innerHTML = `
//         <h3>${s.fullName}</h3>
//         <p>${s.regNo}</p>
//         <p>progress: ${s.progress}%</p>
//       `;
//       card.onclick = () => openStudentModal(s);
//       container.appendChild(card);
//     });
//   } 

//   function openStudentModal(student) {
//     selectedStudent = student;
//     document.getElementById("modalStudentName").textContent = student.fullName;
//     document.getElementById("studentModal").classList.remove("hidden");
//   }

//   document.getElementById("confirmStudent").onclick = () => {
//     document.getElementById("studentContext").textContent = 
//       `Viewing: ${selectedStudent.fullName}`;

//       document.querySelectorAll(".locked").forEach(el => 
//         el.classList.remove("locked")
//       );

//       await loadStudentData(selectedStudent.id);
//       document.getElementById("studentModal").classList.add("hidden");
//   };  

//   document.getElementById("cancelStudent").onclick = () => {
//     document.getElementById("studentModal").classList.add("hidden");
//   };

//   //LOAD STUDENT DATA
//   async function loadStudentData(Id) {
//     await loadAnalytics(Id);
//     await loadDocuments(Id);
//     await loadRepository(Id);
//     await loadGrades(Id);
//   }

//   //DOCUMENTATION
//   async function loadDocuments(Id) {
//     const res = await fetch(`/api/students/${Id}/documents`, {
//       headers: {
//         "Authorization  ": "Bearer " + token }
//     });

//     const docs = await res.json();
//     const section = document.getElementById("documentView");
//     section.innerHTML = "<h2>Documentation</h2>";

//     docs.forEach(doc => {
//       const card = document.createElement("div");
//       card.className = "doc-card";
//       card.innerHTML = `
//         <h3>${doc.type}</h3>
//         <button onclick="preview('${doc.id}')">View</button>
//         <button onclick="download('${doc.id}')">Download</button>
//         <div class="review-section">
//           <textarea id="comment-${doc.id}" placeholder="Supervisor's comments...">${doc.comment || ""}</textarea>
//           <button onclick="submitComment('${doc.id}')">Submit Comments</button>
//         </div>
//       `;
//       section.appendChild(card);
//     });
//   }

//   async function submitComment(docId) {
//     const comment = document.getElementById(`comment-${docId}`).value;

//     await fetch(`/api/supervisor/documents/${docId}/comment`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",  
//         "Authorization": "Bearer " + localStorage.getItem("token")
//       },
//       body: JSON.stringify({ comment })
//     });

//     alert("Comment submitted");
//   }

//   //REPOSITORY
//   async function loadRepository(Id) {
//     const res = await fetch(`/api/supervisor/students/${Id}/repository`, {
//       headers: {
//         "Authorization": "Bearer " + token }
//     });

//     const repo = await res.json();

//     const repoView = document.getElementById("repoView");
//     repoView.querySelector("a").href = repo.githubUrl;
//     repoView.querySelector("a").textContent = repo.githubUrl;

//     const imageGrid = repoView.querySelector(".image-grid");\
//     imageGrid.innerHTML = "";

//     repo.snapshots.forEach(img => {
//       const image = document.createElement("img");
//       image.src = img.url;
//       image.alt = "Snapshot";
//       imageGrid.appendChild(image);
//     });
//   }

//   //ANALYTICS
//   async function loadAnalytics(Id) {
//     const res = await fetch(`/api/supervisor/students/${Id}/analytics`, {
//       headers: {
//         "Authorization": "Bearer " + token }
//     });

//     const data = await res.json();

//     if (progressChart) progressChart.destroy();
//     if (reportChart) reportChart.destroy();

//     progressChart = new Chart(
//       document.getElementById("progressChart"),
//       {
//         type: "line",
//         data: {
//           labels:  data.labels,
//           datasets: [{
//             label: "Project Progress (%)",
//             data: data.progress 
//           }]
//         }
//       }
//     );

//       reportChart = new Chart(
//         document.getElementById("reportChart"),
//         {
//           type: "bar",
//           data: {
//             labels: data.weeks,
//             datasets: [{
//               label: "Repository Activity (Commits)",
//               data: data.commits
//             }]
//           }
//         }
//       );
//   }

//   //GRADING
//   function initGrading() {
//     document.getElementById("saveGrade").onclick = async () => 
//       saveGrades(false);

//     document.getElementById("submitGrade").onclick = async () =>
//       saveGrades(true);
//   }

//   async function loadGrades(Id) {
//     const res = await fetch(`/api/supervisor/students/${Id}/grades`, {
//       headers: { "Authorization": "Bearer " + token }
//     });

//     const grades = await res.json();

//     document.querySelectorAll(".grade-row input").forEach(input => {
//       const part = input.dataset.part;
//       input.value = grades[part] || 0;
//     });

//     computeTotal();
//   }

//   async function saveGrades(final) {
//     if (!selectedStudent) return;

//     const payload = {}
//       document.querySelectorAll(".grade-row input").forEach(input => {
//         payload[input.dataset.part] = parseInt(input.value) || 0;
//       }),

//       payload.comment = document.getElementById("gradeComment").value;
//       payload.final = final;

//       await fetch(`/api/supervisor/students/${selectedStudent.id}/grades`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           " Authorization": "Bearer " + token
//         },
//         body: JSON.stringify(payload)
//       }
//       );
//       alert(final ? "Grades submitted" : "Draft saved");
//   }

//   //DEADLINES
//   async function loadDeadlines() {
//     const container = document.getElementById("deadlineList");
//     container.innerHTML = "";

//     const res = await fetch("/api/supervisor/deadlines", {
//       headers: { Authorization: "Bearer " + token }
//     });

//     const deadlines = await res.json();

//     deadlines.forEach(dl => {
//       const card = document.createElement("div");
//       card.className = "deadline-card";
//       card.innerHTML = `
//         <h4>${dl.title}</h4>
//         <p>${dl.description || ""}</p>
//         <small>📅 ${dl.date}</small>
//       `;
//       container.appendChild(card);
//     });
//   }

//   //NAVIGATION
//   function initNavigation() {
//     const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
//     const sections = document.querySelectorAll("main section");

//     navItems.forEach(item => {
//       item.addEventListener("click", () => {
//         if (item.classList.contains("locked")) return;

//         const targetId = item.dataset.target;
//         sections.forEach(sec => sec.classList.add("hidden"));
//         document.getElementById(targetId).classList.remove("hidden");
//       });
//     });
//   }

//   //HELPER FUNCTIONS
//   function preview(id) {
//     window.open(`/api/files/submissions/${id}`, "_blank");
//   }

//   function download(id) {
//     const link = document.createElement("a");
//     link.href = `/api/files/submissions/${id}`;
//     link.download = "";
//     link.click();
//   }

//   function computeTotal() {
//     let total = 0;
//     document.querySelectorAll(".grade-row input").forEach(input => {
//       total += parseInt(input.value) || 0;
//     });
//     document.getElementById("gradeTotal").textContent = 
//     total + " / 100";
//   }
      