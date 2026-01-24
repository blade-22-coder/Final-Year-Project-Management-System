//section navigation
const navItems = document.querySelectorAll(".sidebar-nav li");
const sections = document.querySelectorAll("section");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const targetId = item.getAttribute("data-target");
        sections.forEach(sec => sec.classList.remove("active"));
    
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.classList.add("active");

        navItems.forEach(li => li.classList.remove("active"));
        item.classList.add("active");
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
    options: {responsive: true, maintainAspectRatio: false}
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
                data :[10, 25, 40, 55, 75],
                borderColor: "#00ffff",
                tension: 0.4
            }]
        },
        options: {responsive: true, maintainAspectRatio: false}
    });
});




