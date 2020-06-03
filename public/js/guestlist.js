let divShowing = false;

const guestList = document.querySelector(".btn-guestlist");

if (guestList) {
    guestList.addEventListener("click", (e) => {
        divShowing = !divShowing;
        const div = document.querySelector(".guestlist");
    
        if (divShowing) {
            div.style.display = "inline-block";
        } else {
            div.style.display = "none";
        }
    });
}
