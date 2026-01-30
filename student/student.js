//theme toggling
    const toggle = document.getElementById("themeToggle");
    let dark = true;
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        toggle.textContent = dark ? "🌞" : "🌙";
        dark = !dark;
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




// //project progress battery chart
// let progressData = {
//     title: 20,
//     proposal: 45,
//     proposalApproved: 60,
//     finalReport: 80,
//     finalApproved: 100
// };
//     //choose which progress to display
// let currentStage = 'proposalApproved'; //example stage

// const batteryFill = document.getElementById("batteryFill");
// const batteryPercent = document.getElementById("batteryPercent");
//     //color based on progress
// function getBatteryColor(percentage) {
//     if (percentage < 40) return 'linear-gradient(90deg, red, orange)';
//     if (percentage < 70) return 'linear-gradient(90deg, orange, yellow)';
//     if (percentage <= 100) return 'linear-gradient(90deg, yellow, green)';
//     return 'linear-gradient(90deg, blue, purple)';
// }
//     //animate battery fill like charge
// function animateBattery(targetPercent) {
//     batteryFill.classList.add("stripes"); //add stripes animation
//     let currentPercent = 0;

//     const interval = setInterval(() => {
//         if (currentPercent >= targetPercent) {
//             clearInterval(interval);
//             batteryFill.classList.remove("stripes"); //remove stripes animation
//             return;
//         }
//         currentPercent++;
//         batteryFill.style.height = currentPercent + "%";
//         batteryFill.style.background = getBatteryColor(currentPercent);
//         batteryPercent.textContent = currentPercent + "%"; 
//     }, 20); //speed of animation
// }
//     //run animation
// animateBattery(progressData[currentStage]);


//section toggling 
document.addEventListener("DOMContentLoaded", () => {
    
    const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
    const sections = document.querySelectorAll(".dashboard section");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetId = item.dataset.target;
            const targetSection = document.getElementById(targetId);

            if (!targetSection)  return;

            sections.forEach(sec => sec.classList.remove("active"));
            navItems.forEach(i => i.classList.remove("active"));

            targetSection.classList.add("active");
            item.classList.add("active");
        });
    });
    //default page
    document.querySelector(".sidebar-nav li [data-target]").click();
});


//toggling a dropdown menu of sections
document.querySelectorAll(".menu-title").forEach(title => {
    title.addEventListener("click", () => {
        const parent = title.parentElement;

        document.querySelectorAll(".has-submenu").forEach(item => {
            if (item !== parent) {
                item.classList.remove("open");
            }
        });
        parent.classList.toggle("open");
    });
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
        if (!dl.audience.includes("students")) return;

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

//comment section from supervisor
const submissions = {
    title: { state: "approved", comment: "Title is acceptable" },
    proposal: { state: "pending", comment: "Under review" },
    report: { state: "waiting", comment: "" },
    github: { state: "approved", comment: "Repo Structure is good" },
    snapshots: {state: "rejected", comment: "UI screenshots unclear" }
};

//comment section
const reviewComments = {
    title: {
        supervisor: {
            message: "Title is clear and researchable.",
            date: "2026-01-25"
        },
        student: {
            message: "Thank you, I’ll proceed with proposal.",
            date: "2026-01-25"
        }
    },

    proposal: {
        supervisor: {
            message: "Methodology section needs expansion.",
            date: "2026-01-26"
        },
        student: null
    },

    report: {
        supervisor: null,
        student: null
    },

    github: {
        supervisor: {
            message: "Commit history looks good.",
            date: "2026-01-27"
        },
        student: {
            message: "Thanks! I'll keep pushing updates.",
            date: "2026-01-27"
        }
    },

    snapshots: {
        supervisor: {
            message: "Dashboard UI needs better alignment.",
            date: "2026-01-27"
        },
        student: null
    }
};
//render comment threads
function renderComments() {
    const container = document.getElementById("commentThreads");
    container.innerHTML = "";

    Object.entries(reviewComments).forEach(([key, thread]) => {
        const wrapper = document.createElement("div");
        wrapper.className = "comment-thread";

        wrapper.innerHTML = `
            <h4>${key.toUpperCase()}</h4>

            ${thread.supervisor ? `
                <div class="comment supervisor">
                    <strong>Supervisor</strong>
                    <p>${thread.supervisor.message}</p>
                    <div class="comment-date">${thread.supervisor.date}</div>
                </div>
            ` : `<p>No supervisor feedback yet.</p>`}

            ${thread.student ? `
                <div class="comment student">
                    <strong>You</strong>
                    <p>${thread.student.message}</p>
                    <div class="comment-date">${thread.student.date}</div>
                </div>
            ` : `
                <div class="reply-box">
                    <textarea id="reply-${key}" placeholder="Reply to supervisor..."></textarea>
                    <button onclick="submitReply('${key}')">Send Reply</button>
                </div>
            `}
        `;

        container.appendChild(wrapper);
    });
}

renderComments();
//reply logic
function submitReply(section) {
    const textarea = document.getElementById(`reply-${section}`);
    const message = textarea.value.trim();

    if (!message) return alert("Reply cannot be empty");

    reviewComments[section].student = {
        message,
        date: new Date().toLocaleDateString()
    };

    // Save locally (replace with API later)
    localStorage.setItem("reviewComments", JSON.stringify(reviewComments));

    renderComments();
}
//status render
const statusIcons = {
    waiting: "💤 Waiting",
    pending: "⏳ Pending",
    approved: "✅ Approved",
    rejected: "❌ Rejected"
};

function renderStatus() {
    const grid = document.getElementById("statusGrid");
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

renderStatus();


