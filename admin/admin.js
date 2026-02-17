
// //section navigation
const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
const sections = document.querySelectorAll(".section");

navItems.forEach(item => {
    item.addEventListener("click", (e) => {

        // Ignore submenu parents
        if (item.classList.contains("no-direct-nav")) return;

        const targetId = item.dataset.target;

        sections.forEach(sec => sec.classList.remove("active"));
        navItems.forEach(li => li.classList.remove("active"));

        document.getElementById(targetId)?.classList.add("active");
        item.classList.add("active");
    });
});

//users menu dropdown + section display
document.addEventListener("DOMContentLoaded", () => {

    const usersMenu = document.getElementById("usersMenu");
    const menuTitle = usersMenu.querySelector(".menu-title");
    const submenu = usersMenu.querySelector(".submenu");

    menuTitle.addEventListener("click", (e) => {
        e.stopPropagation();

        // Show USERS section
        sections.forEach(sec => sec.classList.remove("active"));
        document.getElementById("users")?.classList.add("active");

        // Toggle submenu
        usersMenu.classList.toggle("open");

        if (usersMenu.classList.contains("open")) {
            submenu.style.maxHeight = submenu.scrollHeight + "px";
        } else {
            submenu.style.maxHeight = null;
        }
    });
});

//supervisor clicks
document.querySelectorAll("#usersMenu .submenu li").forEach(item => {
    item.addEventListener("click", (e) => {
        e.stopPropagation();

        const targetId = item.dataset.target;

        sections.forEach(sec => sec.classList.remove("active"));
        document.getElementById(targetId)?.classList.add("active");

        if (targetId === "supervisors") {
            renderSupervisors();
        }
    });
});



document.addEventListener("DOMContentLoaded", () => {

    const usersMenu = document.querySelector(
        '.menu-item.has-submenu[data-target="users"]'
    );

    const submenu = usersMenu.querySelector(".submenu");
    const menuTitle = usersMenu.querySelector(".menu-title");

    /* TOGGLE USERS SUBMENU */
    menuTitle.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent sidebar section switching

        usersMenu.classList.toggle("open");

        // Smooth height animation
        if (usersMenu.classList.contains("open")) {
            submenu.style.maxHeight = submenu.scrollHeight + "px";
        } else {
            submenu.style.maxHeight = null;
        }
    });

    /*  SUBMENU NAVIGATION (SUPERVISORS) */
    submenu.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();

            const targetId = item.dataset.target;

            // Switch sections
            document.querySelectorAll(".section")
                .forEach(sec => sec.classList.remove("active"));

            const targetSection = document.getElementById(targetId);
            targetSection?.classList.add("active");

            // Optional render hook
            if (targetId === "supervisors") {
                if (typeof renderSupervisors === "function") {
                    renderSupervisors();
                }
            }

            // Close submenu on mobile
            if (window.innerWidth < 650) {
                usersMenu.classList.remove("open");
                submenu.style.maxHeight = null;
            }
        });
    });

});

document.addEventListener("DOMContentLoaded", () => {

    //theme toggling
    const toggle = document.getElementById("themeToggle");
    let dark = true;
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        toggle.textContent = dark ? "🌞" : "🌙";
        dark = !dark
    });

    //bar chart
    new Chart(document.getElementById("projectChart"), {
    type: "bar",
    data: {
        labels: ["Proposals", "Approved", "Rejected", "Reports"],
        datasets: [{
            label: "Projects",
            data: [98, 70, 28, 54],
            backgroundColor: [
                "#00ffff",
                "#00ff88",
                "#ff4444",
                "#ffaa00"
            ]
        }]
    },
    options: {responsive: true, 
        maintainAspectRatio: false}
    });

    //doughnut chart
    const roleCtx = document.getElementById("roleChart");
    new Chart(roleCtx, {
        type: "doughnut",
        data: {
            labels: ["Students", "Supervisors", "Admin"],
            datasets:[{
                data: [120, 15, 3],
                backgroundColor: ["#00ffff", "#ffaa00", "#ff4444"]
            }]
        },
        options: {responsive: true, maintainAspectRatio: false}
    });

    //line Submission trend
    new Chart (document.getElementById("submissionChart"), {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets :[{
                label: "Submissions",
                data :[45, 25, 56, 85, 10],
                borderColor: "#00ffff",
                tension: 0.4
            }]
        },
        options: {responsive: true, maintainAspectRatio: false}
    });

    //monthly radar activity
    new Chart(document.getElementById("activityChart"), {
        type: "radar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [{
                label: "Active Users",
                
                data: [106, 87, 68, 119, 47],
                backgroundColor: "rgba(0, 255, 255, 0.2)",
                borderColor: "#00ffff",
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
});

//calendar
const publicHolidays = [
    "2026-01-01", // New Year
    "2026-03-08", // Women's Day
    "2026-05-01", // Labour Day
    "2026-10-09", // Independence Day
];
let adminCalendar;
let selectedDate = null;
document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("adminCalendar");

    adminCalendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        height: "auto",
        selectable: true,
        fixedWeekCount: false,
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek"
        },

        dayCellClassNames(arg) {
            const dateStr = arg.date.toISOString().split("T")[0];

            if (arg.date.getDay() === 0 || arg.date.getDay() === 6) {
                return ["fc-weekend"];
            }

            if (publicHolidays.includes(dateStr)) {
                return ["fc-holiday"];
            }
        },

        dateClick(info) {
            selectedDate = info.dateStr;
            document.getElementById("deadlineDate").value = selectedDate;
            document.getElementById("deadlineModal").classList.add("active");
        }
    });
});
navItems.forEach(item => {
    item.addEventListener("click", () => {
        const targetId = item.dataset.target;

        sections.forEach(sec => sec.classList.remove("active"));
        navItems.forEach(li => li.classList.remove("active"));

        const targetSection = document.getElementById(targetId);
        targetSection?.classList.add("active");
        item.classList.add("active");

        if (targetId === "calendar") {
            setTimeout(() => {
                adminCalendar.render();
            }, 50);
        }
    });
});
function closeDeadline() {
    document.getElementById("deadlineModal").classList.remove("active");
}



//saving deadlines from click
function saveDeadline() {
    if (!selectedDate) {
        alert("Click a date first");
        return;
    }

    const title = document.getElementById("deadlineTitle").value.trim();
    const description = document.getElementById("deadlineDescription")?.value || "";

    if (!title) {
        alert("Deadline title required");
        return;
    }

    const deadline = {
        id: "dl_" + Date.now(),
        title,
        description,
        date: selectedDate,
        audience: ["students", "supervisors"],
        createdBy: "blade",
        createdAt: new Date().toISOString()
    };

    //get exisitng deadlines
    const deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
    deadlines.push(deadline);
    localStorage.setItem("deadlines", JSON.stringify(deadlines));

    //adding calendar visually
    adminCalendar.addEvent({
        title: deadline.title,
        start: deadline.date,
        allDay: true
    });

    closeDeadline();
    document.getElementById("deadlineTitle").value = "";
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


            //data models
//supervisors
const supervisors = [
    {id: "sup1", name: "Dr. Irene", image: "../images/1.JPG", capacity: 5},
    {id: "sup2", name: "Dr. Angole", image: "../images/2.JPG", capacity: 2},
    {id: "sup3", name: "Dr. Mutungi", image: "../images/3.JPG", capacity:4},
    {id: "sup4", name: "Musana", image: "../images/4.JPG", capacity: 7}
];
//students
let students = JSON.parse(localStorage.getItem("students")) || [
    { id: "st1", name: "Emmanuel Kitara", assignedTo: null },
    { id: "st2", name: "Stacy Martha", assignedTo: null },
    { id: "st3", name: "Allan Azahiire", assignedTo: null },
    { id: "st4", name: "Maxwell Okello", assignedTo: null }
];


//rendering supervisors as grid cards
function renderSupervisors() {
    const grid = document.getElementById("supervisorsGrid");
    grid.innerHTML = "";

    supervisors.forEach(sup => {
        const assigned = students.filter(s => s.assignedTo === sup.id);

        const card = document.createElement("div");
        card.className = "supervisors-card";

        card.innerHTML = `
            <img src="${sup.image}">
            <h4>${sup.name}</h4>
            <small>${assigned.length} / ${sup.capacity} students</small>

            <button class="assign-btn">
                Manage Students <span>▾</span>
            </button>

            <div class="student-dropdown" style="display:none"></div>
        `;

        const btn = card.querySelector(".assign-btn");
        const dropdown = card.querySelector(".student-dropdown");
        const arrow = btn.querySelector("span");

        btn.addEventListener("click", () => {
            const open = dropdown.style.display === "block";
            dropdown.style.display = open ? "none" : "block";
            btn.classList.toggle("open", !open);
            toggleStudentDropdown(dropdown, sup);
        });

        grid.appendChild(card);
    });
}


//assign/unassigned ...no duplicates
function assignStudent(studentId, supervisorId) {
    students = students.map(s =>
        s.id === studentId
            ? { ...s, assignedTo: supervisorId }
            : s
    );

    persistAndRefresh();
}

function unassignStudent(studentId) {
    students = students.map(s =>
        s.id === studentId
            ? { ...s, assignedTo: null }
            : s
    );

    persistAndRefresh();
}

function persistAndRefresh() {
    localStorage.setItem("students", JSON.stringify(students));
    renderSupervisors();
}



//assigned student with unassign/ unassigned student if capacity allows
function toggleStudentDropdown(dropdown, supervisor) {
    dropdown.innerHTML = "";

    const assigned = students.filter(s => s.assignedTo === supervisor.id);
    const unassigned = students.filter(s => s.assignedTo === null);

    // Assigned students
    assigned.forEach(student => {
        const item = document.createElement("div");
        item.className = "student-item";

        item.innerHTML = `
            <span>${student.name}</span>
            <span class="unassign">Unassign</span>
        `;

        item.querySelector(".unassign").addEventListener("click", () => {
            unassignStudent(student.id);
        });

        dropdown.appendChild(item);
    });

    // Capacity rule
    if (assigned.length >= supervisor.capacity) {
        const full = document.createElement("p");
        full.textContent = "Supervisor capacity reached";
        full.style.opacity = "0.6";
        dropdown.appendChild(full);
        return;
    }

    // Divider
    if (unassigned.length > 0) {
        const divider = document.createElement("hr");
        dropdown.appendChild(divider);
    }

    // Unassigned students
    unassigned.forEach(student => {
        const item = document.createElement("div");
        item.className = "student-item";
        item.textContent = student.name;

        item.addEventListener("click", () => {
            assignStudent(student.id, supervisor.id);
        });

        dropdown.appendChild(item);
    });
}

//admin dasbhoard
// const token = localStorage.getItem("token");
// if (!token)  location.href = "../index.html";

fetch( `${API_URL}/admin/stats`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => {
    document.getElementById("totalUsers").textContent = data.totalUsers;
    document.getElementById("Supervisors").textContent = data.totalSupervisors;
    document.getElementById("students").textContent = data.totalStudents;
    document.getElementById("projects").textContent = data.project;
    document.getElementById("submissions").textContent = data.submissions;
    document.getElementById("pending").textContent = data.pendingSubmissions;
})
.catch(err => {
    console.error("Error fetching admin stats:", err);
});


//=========DB DRIVEN LOGIC========
//import { protectRoute } from "../auth/route-guard.js";
//document.addEventListener("DOMContentLoaded", () => {
//    protectRoute("ADMIN");

// //CONSTANTS
// const API_URL = "http://localhost:8080/api";
// const token = localStorage.getItem("token");
// if (!token) location.href = "../index.html";

// //DOM REFERENCES
// const sections = document.querySelectorAll(".section");
// const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
// let adminCalendar;
// let selectedDate = null;

// //sidebar navigation
// navItems.forEach(item => {
//     item.addEventListener("click", () => {
//         const targetId = item.dataset.target;

//         sections.forEach(sec => sec.classList.remove("active"));
//         navItems.forEach(li => li.classList.remove("active"));

//         const targetSection = document.getElementById(targetId);
//         targetSection?.classList.add("active");
//         item.classList.add("active");

//         if (targetId === "calendar") setTimeout(() => adminCalendar.render(), 50);
//         if (targetId === "supervisors") renderSupervisors();
//     })
// });

// //THEME TOGGLING
// document.getElementById("themeToggle").addEventListener("click", () => {
//     document.body.classList.toggle("light");
//     const toggle = document.getElementById("themeToggle");
//     toggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
// });

// //KPIs and CHARTS
// let progressChart, roleChart, submissionChart, activityChart;

// async function loadAdminStats() {
//     try {
//         const res = await fetch(`${API_URL}/admin/stats`, {
//             headers: { "Authorization": `Bearer ${token}` }
//         });
//         const data = await res.json();

//         document.getElementById("kpistudents").textContent = data.totalStudents;
//         document.getElementById("kpisupervisors").textContent = data.totalSupervisors;
//         document.getElementById("kpiproposals").textContent = data.totalProposals;
//         document.getElementById("kpireports").textContent = data.totalReports;

//         //CHARTS
//         projectChart.data.datasets[0].data = [
//             data.totalProposals, 
//             data.approvedProposals, 
//             data.rejectedProposals, 
//             data.totalReports
//         ];
//         projectChart.update();

//         roleChart.data.datasets[0].data = [
//             data.totalStudents, 
//             data.totalSupervisors, 
//             data.totalAdmins
//         ];
//         roleChart.update();

//         submissionChart.data.datasets[0].data = data.monthlySubmissions;
//         submissionChart.update();

//         activityChart.data.datasets[0].data = data.monthlyActiveUsers;
//         activityChart.update();
//     } catch (err) {
//         console.error("Error loading admin stats:", err);
//     }

//     function initCharts() {
//         projectChart = new Chart(document.getElementById("projectChart"), {
//             type: "bar",
//             data: { labels: ["Proposals", "Approved", "Rejected", "Reports"], datasets: [{ label: "Projects", data: [], backgroundColor: ["#00ffff", "#00ff88", "#ff4444", "#ffaa00"] }] },
//             options: { responsive: true, maintainAspectRatio: false }
//         });

//         roleChart = new Chart(document.getElementById("roleChart"), {
//             type: "doughnut",
//             data: { labels: ["Students", "Supervisors", "Admin"], datasets: [{ data: [], backgroundColor: ["#00ffff", "#ffaa00", "#ff4444"] }] },
//             options: { responsive: true, maintainAspectRatio: false }
//         });

//         submissionChart = new Chart(document.getElementById("submissionChart"), {
//             type: "line",
//             data: { labels: ["Jan", "Feb", "Mar", "Apr", "May"], datasets: [{ label: "Submissions", data: [], borderColor: "#00ffff", tension: 0.4 }] },
//             options: { responsive: true, maintainAspectRatio: false }
//         });

//         activityChart = new Chart(document.getElementById("activityChart"), {   
//             type: "line",
//             data: { labels: ["Jan", "Feb", "Mar", "Apr", "May"], datasets: [{ label: "Active Users", data: [], borderColor: "#ffaa00", tension: 0.4 }] },
//             options: { responsive: true, maintainAspectRatio: false }
//         });

//     }

//     //STUDENTS TABLE
//     async function loadStudents() {
//         const tbody = document.querySelector("#users table tbody");
//         tbody.innerHTML = "";

//         try {
//             const res = await fetch(`${API_URL}/admin/students`, {
//                 headers: { "Authorization": `Bearer ${token}` }
//             });
//             const students = await res.json();

//             students.forEach((s, idx) => {
//                 const row = document.createElement("tr");
//                 row.innerHTML = `
//                     <td>${idx + 1}</td>
//                     <td>${s.fullName}</td>
//                     <td>${s.regNo}</td>
//                     <td>${s.email}</td>
//                     <td>${s.projectTitle}</td>
//                     <td>${s.status}</td>
//                 `;
//                 tbody.appendChild(row);
//             });
//         } catch (err) {
//             console.error("Failed to load students:", err);
//         }
//     }

//     //SUPERVISORS GRID
//     async function loadSupervisors() {
//         const grid = document.getElementById("supervisorsGrid");
//         grid.innerHTML = "";

//         try { 
//             const res = await fetch(`${API_URL}/admin/supervisors`, {
//                 headers: { "Authorization": `Bearer ${token}` }
//             });
//             const supervisors = await res.json();

//             supervisors.forEach(sup => {
//                 const card = document.createElement("div");
//                 card.className = "supervisors-card";

//                 card.innerHTML = `
//                     <img src="${sup.image}" />
//                     <h4>${sup.fullName}</h4>
//                     <small>${sup.assignedStudents.length} / ${sup.capacity} students</small>
//                     <button class="assign-btn">Manage Students <span>▾</span></button>
//                     <div class="student-dropdown" style="display:none"></div>
//                 `;

//                 const btn = card.querySelector(".assign-btn");
//                 const dropdown = card.querySelector(".student-dropdown");

//                 btn.addEventListener("click", () => {
//                     const open = dropdown.style.display === "block";
//                     dropdown.style.display = open ? "none" : "block";
//                     btn.classList.toggle("open", !open);
//                     toggleStudentDropdown(dropdown, sup);
//                 });

//                 grid.appendChild(card);
//             });
//         } catch (err) {
//             console.error("Failed to load supervisors:", err);
//         }
//     }

//     //ASSIGN/UNASSIGN LOGIC
//     async function assignStudent(studentId, supervisorId) {
//         await fetch(`${API_URL}/admin/assign`, {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json", 
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({ studentId, supervisorId })
//         });
//         loadSupervisors();
//     }

//     async function unassignStudent(studentId) {
//         await fetch(`${API_URL}/admin/unassign`, {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json", 
//                 "Authorization": `Bearer
//                 ${token}`
//             },
//             body: JSON.stringify({ studentId })
//         });
//         loadSupervisors();
//     }

//     function toggleStudentDropdown(dropdown, supervisor) {
//         dropdown.innerHTML = "";

//         fetch(`${API_URL}/admin/students`, {
//             headers: { "Authorization": `Bearer ${token}` }
//         })        .then(res => res.json())
//         .then(students => {
//             const assigned = students.filter(s => s.assignedTo === supervisor.id);
//             const unassigned = students.filter(s => s.assignedTo);

//             assigned.forEach(s => {
//                 const div = document.createElement("div");
//                 div.className = "student-item";
//                 div.innerHTML = `<span>${s.fullName}</span> <span class="unassign">Unassign</span>`;
//                 div.querySelector(".unassign").addEventListener("click", () => unassignStudent(s.id));
//                 dropdown.appendChild(div);
//             });

//             if (assigned.length >= supervisor.capacity) {
//                 const p = document.createElement("p");
//                 p.textContent = "Supervisor capacity reached";
//                 p.style.opacity = "0.6";
//                 dropdown.appendChild(p);
//                 return;
//             }

//             if (unassigned.length > 0) dropdown.appendChild(document.createElement("hr"));

//             unassigned.forEach(s => {
//                 const div = document.createElement("div");
//                 div.className = "student-item";
//                 div.textContent = s.fullName;
//                 div.addEventListener("click", () => assignStudent(s.id, supervisor.id));
//                 dropdown.appendChild(div);
//             });
//         });

//     }

//     //CALENDAR / DEADLINES
//     const publicHolidays = ["2026-01-01", "2026-03-08", "2026-05-01", "2026-10-09"];

//     function initCalendar() {
//         const calendarEl = document.getElementById("adminCalendar");
//         adminCalendar = new FullCalendar.Calendar(calendarEl, {
//             initialView: "dayGridMonth",
//             height: "auto",
//             selectable: true,
//             fixedWeekCount: false,
//             headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" },
//             dayCellClassNames(arg) {
//                 const dateStr = arg.date.toISOString().split("T")[0];
//                 if (arg.date.getDay() === 0 || arg.date.getDay() === 6) return ["fc-weekend"];
//                 if (publicHolidays.includes(dateStr)) return ["fc-holiday"];
//             },
//             dateClick(info) {
//                 selectedDate = info.dateStr;
//                 document.getElementById("deadlineDate").value = selectedDate;
//                 document.getElementById("deadlineModal").classList.add("active");
//             }
//         });
//     }

//     async function loadDeadlines() {
//         try {
//             const res = await fetch(`${API_URL}/admin/deadlines`, {
//                 headers: { "Authorization": `Bearer ${token}` }
//             });
//             const deadlines = await res.json();

//             deadlines.forEach(dl => {
//                 adminCalendar.addEvent({ title: dl.title, start: dl.date, allDay: true });
//             });
//         } catch (err) { 
//             console.error("Error loading deadlines:", err);
//         }
//     }

//     async function saveDeadline() {
//         if (!selectedDate) return alert("Click a date first");
//         const title = document.getElementById("deadlineTitle").value.trim();
//         if (!title) return alert("Deadline title required");
        
//         await fetch(`${API_URL}/admin/deadlines`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
//             body: JSON.stringify({ title, date: selectedDate, audience: ["students", "supervisors"] })
//         });
//         loadDeadlines();
//         closeDeadline();
//         document.getElementById("deadlineTitle").value = "";
//     }

//     //LOGOUT
//     function openLogout() { document.getElementById("logoutModal").classList.add("active"); }
//     function closeLogout() { document.getElementById("logoutModal").classList.remove("active"); }
//     function confirmLogout() { localStorage.clear(); sessionStorage.clear(); window.location.replace("/index.html"); }

//     //closing module when clicking outside
//     document.getElementById("logoutModal").addEventListener("click", e => {
//         if (e.target.id === "logoutModal") closeLogout();
//     });

//     //INITIAL LOAD
//     document.addEventListener("DOMContentLoaded", () => {
//         initCharts();
//         loadAdminStats();
//         loadStudents();
//         loadSupervisors();
//         initCalendar();
//         loadDeadlines();
//     });

// }



