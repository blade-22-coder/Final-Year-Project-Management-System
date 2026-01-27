//section navigation
const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
const sections = document.querySelectorAll(".section");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const targetId = item.dataset.target;

        sections.forEach(sec => sec.classList.remove("active"));
        navItems.forEach(li => li.classList.remove("active"));
    
        document.getElementById(targetId)?.classList.add("active");
        item.classList.add("active");
    });
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

function saveDeadline() {
    const title = document.getElementById("deadlineTitle").value;
    if (!title) return;

    adminCalendar.addEvent({
        title,
        start: selectedDate,
        allDay: true
    });

    closeDeadline();
    document.getElementById("deadlineTitle").value = "";
}


//saving deadlines from click
function saveDeadline() {
    const title = document.getElementById("deadlineTitle").value;
    const description = document.getElementById("deadlinedecription").value;

    if (!title || !selectedDate) return;

    const deadline = {
        id: "dl_" + Date.now(),
        title,
        description,
        date: selectedDate,
        audience: "students",
        createdBy: "blade",
        createdAt: new Date().toISOString()
    };

    //get existing deadlines
    const deadlines  = JSON.parse(localStorage.getItem("deadlines")) || [];

    deadlines.push(deadline);

    localStorage.setItem("deadlines", JSON.stringify(deadlines));

    //adding calendar visually
    adminCalendar.addEvent({
        title: deadline.title,
        start: deadline.date,
        allDay:true
    });
    closeDeadline();
    document.getElementById("deadlineTitle").value = "";
    document.getElementById("deadlineDescription").value = "";
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




