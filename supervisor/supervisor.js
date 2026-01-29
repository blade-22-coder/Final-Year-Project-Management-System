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
const navItems = document.querySelectorAll(".sidebar-nav li[data-targ");
const sections = document.querySelectorAll("main section");

navItems.forEach(item => {
  item.addEventListener("click", () => {
    if (item.classList.contains("locked")) return;

    const target = item.dataset.target;

    sections.forEach(sec => sec.classList.add(hidden));

    const activeSection = document.getElementById(`${target}View`);
    if (activeSection) {
      activeSection.classList.remove("hidden");
    }
  });
});

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
 