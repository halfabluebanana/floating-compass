//used the DOMContentLoaded Event listener because console kept showing me an error that browser is trying to assess #cursors before the DOM is fully loaded. 
document.addEventListener("DOMContentLoaded", function () {
    const cursorContainer = document.getElementById("cursors");

    //event listeners to start and stop cursor movement on hover
    cursorContainer.addEventListener("mouseenter", function () {
        document.addEventListener("mousemove", displayCursorShadow);
    });

    cursorContainer.addEventListener("mouseenter", function () {
        document.addEventListener("mouseleave", displayCursorShadow);
        document.querySelectorAll(".custom-cursor").forEach(cursor => cursor.remove());

    });

    // this displays custom cursor shadows
    function displayCursorShadow(event) {

        document.querySelectorAll(".custom-cursor").forEach(cursor => cursor.remove());

        //create the cursor element
        const cursor = document.createElement("div");
        cursor.classList.add("custom-cursor");

        //position cursor where mouse is
        cursor.style.top = event.pageY + "px";
        cursor.style.left = event.pageX + "px";

        //get the centre of the screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        //calculate angle in radians between mouse and center
        const deltaX = event.pageX - centerX;
        const deltaY = event.pageY - centerY;
        const angleInRadians = Math.atan2(deltaY, deltaX);

        //convert angle to degrees
        const degrees = (angleInRadians * 180 / Math.PI);

        //Apply rotation
        cursor.style.transform = 'rotate(${degrees}deg)';

        //add cursor to the body 
        document.body.appendChild(cursor);

    }
});

