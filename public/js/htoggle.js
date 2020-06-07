const mainHeader = document.querySelector("#main-header");
const homeLink = document.querySelector(".home");
const hamburger = document.querySelector(".menu");

let toggled = false;
document.querySelector(".htoggle").addEventListener("click", () => {
    toggled = !toggled;
    hamburger.style.transform = toggled ? "rotate(90deg)" : "";
    mainHeader.style.display = toggled ? "flex" : "none";
});

window.addEventListener("resize", (e) => {
    if ((window.innerWidth > 768) && mainHeader.style.display === "none") {
        mainHeader.style.display = "flex";
    }
});