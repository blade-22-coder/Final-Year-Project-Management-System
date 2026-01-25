//theme toggling
    const toggle = document.getElementById("themeToggle");
    let dark = true;
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        toggle.textContent = dark ? "🌞" : "🌙";
        dark = !dark;
    });

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
        batteryFill.style.width = currentPercent + "%";
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
    document.querySelectorAll(".sidebar-nav li [data-target]").click();
});