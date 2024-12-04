document.addEventListener("DOMContentLoaded", function () {
    function displaySunInfo() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Calculate sun times using SunCalc
                const times = SunCalc.getTimes(new Date(), latitude, longitude);
                const sunrise = times.sunrise.toLocaleTimeString();
                const sunset = times.sunset.toLocaleTimeString();

                // Update sunrise and sunset in the DOM
                document.getElementById("sunrise").value = sunrise;
                document.getElementById("sunset").value = sunset;

                // Calculate sun position using SunCalc
                const sunPosition = SunCalc.getPosition(new Date(), latitude, longitude);
                const azimuth = sunPosition.azimuth * (180 / Math.PI); // Convert to degrees
                const altitude = sunPosition.altitude * (180 / Math.PI); // Convert to degrees

                // Calculate shadow angle and length
                const shadowAngle = (azimuth + 180) % 360; // Normalize to 0-360
                const shadowLength = 1 / Math.tan(sunPosition.altitude); // Shadow length formula

                // Update shadow info in the DOM
                document.getElementById("shadowAngle").value = shadowAngle.toFixed(2);
                document.getElementById("shadowLength").value = shadowLength.toFixed(2);

                // Update shadow effect
                updateShadowEffect(shadowAngle, shadowLength);

                // Update the position of a link dynamically
                updateLinkPosition(shadowAngle, shadowLength);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    // function updateShadowEffect(shadowAngle, shadowLength) {
    //     const cursor = document.querySelector(".custom-cursor");
    //     if (!cursor) {
    //         console.error("Error: '.custom-cursor' element not found");
    //         return;
    //     }

    //     // Calculate shadow x and y components
    //     const shadowX = shadowLength * Math.cos(shadowAngle * (Math.PI / 180));
    //     const shadowY = shadowLength * Math.sin(shadowAngle * (Math.PI / 180));

    //     // Update cursor shadow style
    //     cursor.style.boxShadow = `${shadowX * 10}px ${shadowY * 10}px ${shadowLength * 10}px rgba(255, 0, 0, 0.5)`;
    //     cursor.style.transform = `rotate(${shadowAngle}deg)`;
    // }

    function updateLinkPosition(shadowAngle, shadowLength) {
        // const link = document.getElementById("dynamicLink");
        // if (!link) {
        //     console.error("Error: '#dynamicLink' element not found");
        //     return;
        // }

        // Calculate x and y position based on shadow angle and length
        const xPosition = shadowLength * Math.cos(shadowAngle * (Math.PI / 180));
        const yPosition = shadowLength * Math.sin(shadowAngle * (Math.PI / 180));

    //     // Update link position
    //     link.style.left = `${xPosition + 50}px`; // Adjust for centering
    //     link.style.top = `${yPosition + 50}px`;
    }

    // Move the custom cursor with the mouse
    document.addEventListener("mousemove", function (event) {
        const cursor = document.querySelector(".custom-cursor");
        if (cursor) {
            cursor.style.top = `${event.pageY}px`;
            cursor.style.left = `${event.pageX}px`;
        }
    });

    // Update sun info every second
    setInterval(displaySunInfo, 1000);
});
