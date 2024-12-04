let express = require("express");
let app = express();

app.use("/", express.static("public"));

let http = require("http");
const { SocketAddress } = require("net");
let server = http.createServer(app);
let io = require("socket.io");
io = new io.Server(server);

// Serve static files
app.use(express.static("public")); // Ensure your HTML, CSS, and JS are in the "public" folder

let userLocations = {};

io.on("connection", (socket) => {
  console.log("We have a new client: " + socket.id);

  socket.on('update location', (data) => {
    console.log(`Location from ${socket.id}:`, data);

    //save user's location
    userLocations[socket.id] = data;

    // Broadcast this user's location to all other clients
    socket.broadcast.emit("locationUpdate", data);

    // Broadcast the slider value to all other connected clients
    // io.emit('updateSoundDuration', data);
    // io.emit('message-share', data);
});


  socket.on("disconnect", () => {
    delete userLocations[socket.id];
    console.log("A client has disconnected: " + socket.id);
  });
});

// Start the server
let PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
