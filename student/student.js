//theme toggling
    const toggle = document.getElementById("themeToggle");
    let dark = true;
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        toggle.textContent = dark ? "🌞" : "🌙";
        dark = !dark;
    });


 //toggle to edit profile
 function toggleEditProfile() {
    document.querySelector(".profile-display").style.display = "none";
    document.querySelector(".profile-edit").style.display = "block";
    //prefill inputs
    document.getElementById("editName").value = document.getElementById("studentName").textContent;
    document.getElementById("editRegNo").value = document.getElementById("regNo").textContent;
    document.getElementById("editEmail").value = document.getElementById("email").textContent;
    document.getElementById("editProgram").value = document.getElementById("program").textContent;
 }

 function cancelEditProfile () {
    document.querySelector(".profile-display").style.display = "block";
    document.querySelector(".profile-edit").style.display ="none";
 }

 function  saveProfile() {
    document.getElementById("studentName").textContent = document.getElementById("editName").value;
    document.getElementById("regNo").textContent = document.getElementById("editRegNo").value;
    document.getElementById("email").textContent = document.getElementById("editEmail").value;
    document.getElementById("program").textContent = document.getElementById("editProgram").value;
 
 //profile pic update
 const file = document.getElementById("editProfilePic").files[0];
 if (file) {
    const reader = new FileReader ();
    reader.onlaod = e => document.getElementById("profileImage").src = e.target.result;
    reader.readAsDataURL(file);
    }
    cancelEditProfile(); //switch back to display mode
 }

//project progress battery chart
let progressData = {
    title: 20,
    proposal: 45,
    proposalApproved: 60,
    finalReport: 80,
    finalApproved: 100
};
    //choose which progress to display
let currentStage = 'proposalApproved'; //example stage

const batteryFill = document.getElementById("batteryFill");
const batteryPercent = document.getElementById("batteryPercent");
    //color based on progress
function getBatteryColor(percentage) {
    if (percentage < 40) return 'linear-gradient(90deg, red, orange)';
    if (percentage < 70) return 'linear-gradient(90deg, orange, yellow)';
    if (percentage <= 100) return 'linear-gradient(90deg, yellow, green)';
    return 'linear-gradient(90deg, blue, purple)';
}
    //animate battery fill like charge
function animateBattery(targetPercent) {
    batteryFill.classList.add("stripes"); //add stripes animation
    let currentPercent = 0;

    const interval = setInterval(() => {
        if (currentPercent >= targetPercent) {
            clearInterval(interval);
            batteryFill.classList.remove("stripes"); //remove stripes animation
            return;
        }
        currentPercent++;
        batteryFill.style.height = currentPercent + "%";
        batteryFill.style.background = getBatteryColor(currentPercent);
        batteryPercent.textContent = currentPercent + "%"; 
    }, 20); //speed of animation
}
    //run animation
animateBattery(progressData[currentStage]);


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
// document.addEventListener("DOMContentLoaded", () => {
//     const container = document.getElementById("deadlineList");
//     const deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];

//     if (deadlines.length === 0) {
//         container.innerHTML = "<p>No deadlines set yet.</p>";
//         return;
//     }

//     deadlines.forEach(dl => {
//         if (dl.audience !== "students" && dl.audience !== "all") return;

//         const card = document.createdElement("div");
//         card.className = "deadline-card";

//         card.innerHTML = `
//             <h3>${dl.title}<h3>
//             <p>${dl.description || ""}</p>
//             <div class="deadline-date">📆 ${dl.date}</div>`;
        
//         container.appendChild(card);
//     });
// });
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
        if (dl.audience !== "students" && dl.audience !== "all") return;

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
