import { io } from "socket.io-client";

// export const socket = io("http://localhost:5000/");
// export const socket = io("https://live-stream-server-pearl.vercel.app/");

export const socket = io("https://live-stream-server-pearl.vercel.app", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 20000
  });

  
  