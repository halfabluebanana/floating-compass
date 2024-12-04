// Initialize socket
let socket = io();

window.addEventListener("load", () => {
    let heading = 0; // Current device heading

    // Permissions button handler
    document.getElementById("enable-permissions").addEventListener("click", async () => {
        const permissionGranted = await requestDeviceOrientation();
        if (!permissionGranted) {
            alert("Permission not granted. Compass features will not work.");
        }
    });

    // Request device orientation permissions
    async function requestDeviceOrientation() {
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
            try {
                const permissionState = await DeviceOrientationEvent.requestPermission();
                if (permissionState === "granted") {
                    addOrientationListener();
                    return true;
                } else {
                    console.warn("Device orientation permission denied.");
                    return false;
                }
            } catch (error) {
                console.error("Error requesting device orientation permission:", error);
                return false;
            }
        } else {
            // For browsers that don't require explicit permission
            addOrientationListener();
            return true;
        }
    }

    // Add orientation event listener
    function addOrientationListener() {
        window.addEventListener("deviceorientation", handleOrientation, { once: false });
        window.addEventListener("deviceorientationabsolute", handleOrientation, { once: false });
    }

    // Handle orientation events
    function handleOrientation(event) {
        const alpha = event.absolute ? event.alpha : (event.alpha || 0);
        heading = alpha;
    }

    // Geolocation API: Get user's current location
    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    (error) => reject(error),
                    { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
                );
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }

    // Handle geolocation errors
    function handleGeolocationError(error) {
        console.warn(`Geolocation error(${error.code}): ${error.message}`);
        const errorMessages = {
            1: "User denied the request for Geolocation. Enable location access to use the compass.",
            2: "Position information is unavailable. Ensure GPS is enabled.",
            3: "Request to get user location has timed out.",
        };
        alert(errorMessages[error.code] || "An unknown error occurred.");
    }

    // Update compass needle to point to the target
    function updateCompass(currentHeading, targetBearing) {
        const relativeAngle = (targetBearing - currentHeading + 360) % 360;
        const compassNeedle = document.querySelector(".compass-needle");
        if (compassNeedle) {
            compassNeedle.style.transform = `rotate(${relativeAngle}deg)`;
            console.log(
                "Current Heading:", currentHeading,
                "Target Bearing:", targetBearing,
                "Relative Angle:", relativeAngle
            );
        } else {
            console.warn("Compass needle element not found.");
        }
    }

    // Calculate the bearing (direction) between two coordinates
    function calculateBearing(lat1, lng1, lat2, lng2) {
        const toRad = (deg) => (deg * Math.PI) / 180;
        const toDeg = (rad) => (rad * 180) / Math.PI;

        const dLng = toRad(lng2 - lng1);
        const y = Math.sin(dLng) * Math.cos(toRad(lat2));
        const x =
            Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

        return (toDeg(Math.atan2(y, x)) + 360) % 360; // Normalize to 0-360
    }

    // Share real-time location updates
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Display user coordinates
            const coordinates = document.getElementById("coordinates");
            coordinates.textContent = `Your Coordinates: ${latitude.toFixed(
                4
            )}, ${longitude.toFixed(4)}`;

            // Send location to the server
            socket.emit("updateLocation", { latitude, longitude });
        },
        handleGeolocationError,
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );

    // Handle location updates from the server
    socket.on("locationUpdate", (data) => {
        console.log("Received location update from another user:", data);

        // Get the current user's location
        getCurrentLocation()
            .then((userLocation) => {
                const targetBearing = calculateBearing(
                    userLocation.lat,
                    userLocation.lng,
                    data.latitude,
                    data.longitude
                );
                updateCompass(heading, targetBearing);
            })
            .catch((error) => {
                console.error("Error getting user location:", error);
            });
    });

    // Display user map
    async function displayUserMap() {
        try {
            const userLocation = await getCurrentLocation();
            const latlon = `${userLocation.lat},${userLocation.lng}`;
            const mapImage = `http://maps.googleapis.com/maps/api/staticmap?center=${latlon}&zoom=20&size=640x640&maptype=satellite&sensor=false&key=AIzaSyCuFG-NOikYAj9JOBS3oD_nhuSxlu_T8v4`;
            document.getElementById("mapholder").innerHTML = `<img src="${mapImage}" alt="Map">`;
        } catch (error) {
            console.error("Error displaying map:", error);
        }
    }

    // Initialize map display
    displayUserMap();
});
