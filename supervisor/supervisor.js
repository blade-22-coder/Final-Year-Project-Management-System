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
