// =========DB DRIVEN LOGIC========
import { protectRoute } from "../auth/route-guard.js";

document.addEventListener("DOMContentLoaded", initAdminDashboard);

async function initAdminDashboard() {

    protectRoute("ADMIN");

    const API_URL = "http://localhost:8080/api";
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.replace("../index.html");
        return;
    }

    const sections = document.querySelectorAll(".section");
    const navItems = document.querySelectorAll(".sidebar-nav li[data-target]");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModal");

    let adminCalendar;
    let selectedDate = null;

    let projectChart, roleChart, submissionChart;

    let students = [];

    // SIDEBAR NAVIGATION
    navItems.forEach(item => {
        item.addEventListener("click", () => {

            const targetId = item.dataset.target;

            sections.forEach(sec => sec.classList.remove("active"));
            navItems.forEach(li => li.classList.remove("active"));

            document.getElementById(targetId)?.classList.add("active");
            item.classList.add("active");

            if (targetId === "calendar" && adminCalendar) {
                setTimeout(() => adminCalendar.render(), 50);
            }

            if (targetId === "supervisors") {
                loadSupervisors();
            }

            if (targetId === "projects") {
                loadProjects();
            }
        });
    });

    //USER DROPDOWN MENU + SECTION DISPLAY
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

    //SUPERVISOR CLICKS
    document.querySelectorAll("#usersMenu .submenu li").forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();

            const targetId = item.dataset.target;

            sections.forEach(sec => sec.classList.remove("active"));
            document.getElementById(targetId)?.classList.add("active");

            if (targetId === "supervisors") {
                loadSupervisors();
            }
        });
    });

    // LOAD DASHBOARD STATS
    async function loadAdminStats() {
        try {
            const res = await fetch(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch stats");

            const data = await res.json();

            document.getElementById("kpistudents").textContent = data.totalStudents;
            document.getElementById("kpisupervisors").textContent = data.totalSupervisors;
            document.getElementById("kpiproposals").textContent = data.totalProposals;
            document.getElementById("kpireports").textContent = data.totalReports;

            initCharts(data);

        } catch (err) {
            console.error("Dashboard load failed:", err);
        }
    }

    // INIT CHARTS
    if(projectChart) projectChart.destroy();
    if(roleChart) roleChart.destroy();
    function initCharts(data) {
        projectChart = new Chart(document.getElementById("projectChart"), {
            type: "bar",
            data: {
                labels: ["Proposals", "Reports"],
                datasets: [
                {
                    label: "Total",
                    data: [
                        data.totalProposals,
                        data.totalReports
                    ],
                    backgroundColor: "#00ffff"
                },
                {
                    label: "Approved",
                    data: [
                        data.approvedProposals,
                        data.approvedReports
                    ],
                    backgroundColor: "#00ff88"
                },
                {
                    label: "Rejected",
                    data: [
                        data.rejectedProposals,
                        data.rejectedReports
                    ],
                    backgroundColor: "#ff4444"
                }
            ]
        }
        });

        roleChart = new Chart(document.getElementById("roleChart"), {
            type: "doughnut",
            data: {
                labels: ["Students", "Supervisors", "Admin"],
                datasets: [{
                    data: [
                        data.totalStudents,
                        data.totalSupervisors,
                        data.totalAdmins
                    ],
                    backgroundColor: ["#00ffff", "#ffaa00", "#ff4444"]
                }]
            }
        });

        }



    // LOAD STUDENTS
    async function loadStudents() {
        try {
            const res = await fetch(`${API_URL}/admin/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            students = await res.json();  //store globally

            const tbody = document.getElementById("studentTableBody");
            tbody.innerHTML = "";

            students.forEach((s, idx) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${idx + 1}</td>
                    <td>${s.user?.fullName}</td>
                    <td>${s.registrationNumber}</td>
                    <td>${s.user?.email}</td>
                    <td>${s.projectTitle || "-"}</td>
                    <td>
                        <button class="delete-btn">❌</button>
                    </td>
                `;
                //delete student
                row.querySelector(".delete-btn").addEventListener("click", async () => {
                    if (!confirm("Delete this student?")) return;

                    const res = await fetch(`${API_URL}/admin/students/${s.id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (!res.ok) {
                        alert("Failed to delete student");
                        return;
                    }
                    await loadStudents();
                });

                tbody.appendChild(row);
            });

        } catch (err) {
            console.error("Student load failed:", err);
        }
    }

    // LOAD SUPERVISORS
    async function loadSupervisors() {
        try {
            const res = await fetch(`${API_URL}/admin/supervisors`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const supervisors = await res.json();
        
            renderSupervisors(supervisors);

        } catch (err) {
            console.error("Supervisor load failed:", err);
        }
    }

    //rendering supervisors as grid cards
    function renderSupervisors(supervisors) {
        const grid = document.getElementById("supervisorsGrid");
        if (!grid) return;

        grid.innerHTML = "";

        supervisors.forEach(sup => {
            const assigned = students.filter(s => s.supervisor?.id === sup.id);

            const card = document.createElement("div");
            card.className = "supervisors-card";

            const imgUrl = sup.profileImagePath
                ? `${API_URL}/supervisor/profile-image/${sup.profileImagePath}?t=${Date.now()}`
                : "../images/1.JPG";

            card.innerHTML = `
                <img src="${imgUrl}">
                <h4>${sup.user.fullName}</h4>
                <small>${assigned.length} / ${sup.maxStudent || 0} students</small>

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


    //ASSIGN / UNASSIGN ====NO DUPLICATES

    // Assigned students
    async function assignStudent(studentId, supervisorId) {
        await fetch (`${API_URL}/admin/assign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                studentProfileId: studentId,
                supervisorProfileId: supervisorId
            })
        });
        await refreshData();
    }
    
    //Unassign students
    async function unassignStudent(studentId) {
        await fetch (`${API_URL}/admin/unassign/${studentId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`}
        });
        
        await refreshData();
    }

    async function refreshData() {
        await loadStudents();
        await loadSupervisors();

    }

    //assigned student with unassign/ unassigned student if capacity allows
    function toggleStudentDropdown(dropdown, sup) {
        dropdown.innerHTML = "";

        const assigned = students.filter(s => s.supervisor?.id === sup.id);
        const unassigned = students.filter(s => !s.supervisor);

        // Capacity rule
        assigned.forEach(student => {
            const item = document.createElement("div");
            item.className = "student-item assigned";

            item.innerHTML = `
                ${student.user?.fullName}
                <button class = "unassign">Remove</button>
            `;

            item.querySelector(".unassign").addEventListener("click", (e) => {
                e.stopPropagation();
                unassignStudent(student.id);
            });

            dropdown.appendChild(item);

        });

        if (assigned.length >= sup.maxStudent) {
            const full = document.createElement("p");
            full.textContent = "Supervisor capacity reached";
            full.style.opacity = "0.6";

            dropdown.appendChild(full);
            return;
        }

        // Divider
        if (unassigned.length > 0) dropdown.appendChild(document.createElement("hr"));

        // Unassigned students
        unassigned.forEach(student => {
            const item = document.createElement("div");
            item.className = "student-item";
            item.textContent = student.user?.fullName;

            item.addEventListener("click", () => {
                assignStudent(student.id, sup.id);
            });

            dropdown.appendChild(item);
        });
    }

    // INIT CALENDAR
    function initCalendar() {

        const calendarEl = document.getElementById("adminCalendar");

        adminCalendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            height: "auto",
            selectable: true,
            fixedWeekCount: false,
            headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek"},

            dayCellClassNames(arg) {
                const dateStr = arg.date.toISOString().split("T")[0];

                if (arg.date.getDay() === 0 || arg.date.getDay() === 6) {
                    return ["fc-weekend"];
                }
            },

            dateClick(info) {
                selectedDate = info.dateStr;
                document.getElementById("deadlineDate").value = selectedDate;
                document.getElementById("deadlineModal").classList.add("active");
            }
        });

        adminCalendar.render();
        loadDeadlines();
    

        document.getElementById("deadlineSave")
            ?.addEventListener("click", saveDeadline);

        document.getElementById("deadlineCancel")
            ?.addEventListener("click", closeDeadlineModal);
    }

    function closeDeadlineModal() {
        document.getElementById("deadlineModal").classList.remove("active");
    }

    //saving deadlines from click
    async function saveDeadline() {
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

        //get exisitng deadlines
        await fetch(`${API_URL}/admin/deadlines`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify({
                title,
                description,
                deadlineDate: selectedDate + "T00:00:00"
            })
        });

        //adding calendar visually
        adminCalendar.addEvent({
            title: title,
            start: selectedDate,
            allDay: true
        });

        closeDeadlineModal();
        document.getElementById("deadlineTitle").value = "";
    }

    // maintain deadlines
    async function loadDeadlines() {

        const res = await fetch(
            `${API_URL}/admin/deadlines`, {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        const deadlines = await res.json();

        deadlines.forEach(dl => {
            adminCalendar.addEvent({
                title: dl.title,
                start: dl.deadlineDate,
                allDay: true
            });

        });
    }

    //projects 
    async function loadProjects() {
        try {
            const res = await fetch(`${API_URL}/admin/projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const projects = await res.json();

            document.getElementById("kpiTotal").textContent = projects.length;

            document.getElementById("kpiProposals").textContent = 
            projects.filter(p => p.type === "PROPOSAL").length;

            document.getElementById("kpiReports").textContent = 
            projects.filter(p => p.type === "REPORT").length;

            document.getElementById("kpiApproved").textContent =
            projects.filter(p => p.status === "APPROVED").length;

            document.getElementById("kpiRejected").textContent =
            projects.filter(p => p.status === "REJECTED").length;

            const table = document.querySelector("#projects table");
            const tbody = document.createElement("tbody");
        
            projects.forEach((p, idx) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${idx + 1}</td>
                    <td>${p.fullName}</td>
                    <td>${p.registrationNumber}</td>
                    <td>${p.projectTitle || "-"}</td>
                    <td>${p.total ?? "-"}</td>
                `;
                tbody.appendChild(row);
            });

            table.innerHTML = `
                <tr>
                    <th>No.</th>
                    <th>Student</th>
                    <th>Reg No.</th>
                    <th>Project Title</th>
                    <th>Grade</th>
                </tr>
            `;
            table.appendChild(tbody);

        } catch (err) {
            console.error("Projects load failed:", err);
        }
       
    }

    //logout
    logoutBtn?.addEventListener("click",() => {
        logoutModal.classList.add("active");
    });

    logoutModal?.querySelector(".btn-no")?.addEventListener("click", () => {
        logoutModal.classList.remove("active");
    });

    logoutModal?.querySelector(".btn-yes")?.addEventListener("click", () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("../index.html");
    });

    //click outside to close
    logoutModal?.addEventListener("click", (e) => {
        if (e.target === logoutModal) {
            logoutModal.classList.remove("active");
        }
    });
    
    // INITIAL LOAD
    await loadAdminStats();
    await loadStudents();
    initCalendar();
    
};





