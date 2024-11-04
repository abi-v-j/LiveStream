const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("./public"));

const httpServer = http.createServer(app);

// Configure the Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "https://live-stream-server-pearl.vercel.app", // Update with your Vercel frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Broadcast a message to all clients except the sender
  socket.on("stream-data", (data) => {
    socket.broadcast.emit("stream-data", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
