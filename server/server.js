const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5003;

app.use(cors());
app.use(express.static("./public"));

const httpServer = http.createServer(app);

// Configure the Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "https://live-stream-client.vercel.app", // Update with your Vercel frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Receive video data from the client and broadcast to all clients
  socket.on("stream-data", (chunk) => {
    // Broadcast the chunk to all clients except the sender
    socket.broadcast.emit("stream-data", chunk);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
