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

let pendingStudent = null;

document.querySelectorAll(".student-card").forEach(card => {
  card.onclick = () => {
    pendingStudent = card.dataset.name;
    modalStudentName.textContent = pendingStudent;
    modal.classList.remove("hidden");
  };
});

confirmBtn.onclick = () => {
  studentContext.textContent = `Viewing: ${pendingStudent}`;

  lockedItems.forEach(item => {
    item.classList.remove("locked");
  });

  modal.classList.add("hidden");
};

cancelBtn.onclick = () => {
  pendingStudent = null;
  modal.classList.add("hidden");
};

//section navigation
const navItems = document.querySelectorAll(".sidebar-nav li[data-target");
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
const upload = document.getElementById("profileUpload");
const profileImg = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");

upload?.addEventListener("change", e => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    profileImg.src = reader.result;
    profilePreview.src = reader.result;
  };
  reader.readAsDataURL(file);
});

//analytics chart per student
const studentAnalytics = {
  "Emmanuel Kitara Okello": {
    progress: [20, 35, 50, 65,],
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
let progressCtx = document.getElementById("progressChart").getContext("2d");
let repoCtx = document.getElementById("repoChart").getContext("2d");

let progresschart, repoChart;

function loadAnalytics(studentName) {
  const data = studentAnalytics[studentName];
  if (!data) return;

  if (progressChart) progressChart.destroy();
  if(repoChart) reportChart.destroy();
 
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
  repoChart = new Chart(repoCtx, {
    type: "bar",
    data: {
      labels: ["week 1", "Week 2", "Week 3", "Week 4"],
      data: [{
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
});
 