
//     function requestDevicePermissions() {
//     if (typeof DeviceOrientationEvent.requestPermission === 'function' &&
//         typeof DeviceMotionEvent.requestPermission === 'function') {

//         const requestDevicePermissions = () => {
//             DeviceOrientationEvent.requestPermission().then(permissionState => {
//                 if (permissionState === 'granted') {
//                     window.addEventListener('deviceorientation', function (event) {
//                         _processGyroscopeData(event.alpha, event.beta, event.gamma, event.absolute);
//                     });
//                 } else {
//                     console.log("Device orientation permission denied.");

//                     const button = document.createElement('button');
//                     button.innerText = "Enable Orientation";
//                     button.style.position = 'absolute';
//                     button.style.top = '100%';
//                     button.style.left = '100%';
//                     button.style.transform = 'translate(50%, 50%)';
//                     document.body.appendChild(button);

//                     button.addEventListener('click', () => {
//                         requestDevicePermissions();
//                         requestMotionPermission();
//                         document.body.removeChild(button); // Remove button after requesting permissions
//                     });
//                 }
//             }).catch(err => {
//                 console.error("Error requesting deviceorientation permission:", err);
//             });
//         };

//         const requestOrientationAbsolutePermission = () => {
//             DeviceOrientationEvent.requestPermission(true).then(permissionState => {
//                 if (permissionState === 'granted') {
//                     window.addEventListener('deviceorientationabsolute', function (event) {
//                         _processGyroscopeData(event.alpha, event.beta, event.gamma, event.absolute);
//                     });
//                 } else {
//                     console.log("Device orientation absolute permission denied.");
//                 }
//             }).catch(err => {
//                 console.error("Error requesting deviceorientationabsolute permission:", err);
//             });
//         };

//         const requestMotionPermission = () => {
//             DeviceMotionEvent.requestPermission().then(response => {
//                 if (response === 'granted') {
//                     window.addEventListener('devicemotion', function (event) {
//                         _processAccelerometerData(event.acceleration.x, event.acceleration.y, event.acceleration.z);
//                         if (event.accelerationIncludingGravity) {
//                             _processAccelerometerDataGravity(
//                                 event.accelerationIncludingGravity.x,
//                                 event.accelerationIncludingGravity.y,
//                                 event.accelerationIncludingGravity.z
//                             );
//                         }
//                         if (event.rotationRate) {
//                             _processRotationRateData(
//                                 event.rotationRate.alpha,
//                                 event.rotationRate.beta,
//                                 event.rotationRate.gamma
//                             );
//                         }

//                         window.addEventListener('deviceorientation', function (event) {
//                             _processGyroscopeData(event.alpha, event.beta, event.gamma, event.absolute);
//                         });
//                     });
//                     console.log("DeviceMotionEvent permission granted.");
//                 } else {
//                     console.error("DeviceMotionEvent permission denied.");
//                 }
//             }).catch(err => {
//                 console.error("Error requesting DeviceMotionEvent permission:", err);
//             });
//         };

//         requestDevicePermissions();

//         const button = document.createElement('button');
//         button.innerText = "Enable Orientation";
//         button.style.position = 'absolute';
//         button.style.top = '100%';
//         button.style.left = '100%';
//         button.style.transform = 'translate(50%, 50%)';
//         document.body.appendChild(button);

//         button.addEventListener('click', () => {
//             requestDevicePermissions();
//             requestMotionPermission();
//             document.body.removeChild(button); // Remove button after requesting permissions
//         });
//     } else {
//         // Automatically start listeners on non-iOS 13+ devices
//         window.addEventListener('deviceorientation', function (event) {
//             _processGyroscopeData(event.alpha, event.beta, event.gamma);
//             console.log("DeviceOrientationEvent listener added automatically.");
//         });
//         window.addEventListener('devicemotion', function (event) {
//             _processAccelerometerData(event.acceleration.x, event.acceleration.y, event.acceleration.z);
//             console.log("DeviceMotionEvent listener added automatically.");
//         });
//     }
// }
