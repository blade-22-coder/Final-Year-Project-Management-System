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




