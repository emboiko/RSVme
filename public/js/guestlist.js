let divShowing = false;

document.querySelector(".guests").addEventListener("click", (e) => {
    divShowing = !divShowing;
    const div = document.querySelector(".guestlist")

    if (divShowing) {
        div.style.display = "inline-block";
    } else {
        div.style.display = "none";
    }

});
