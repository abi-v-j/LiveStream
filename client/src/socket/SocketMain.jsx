import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");
// export const socket = io("https://live-stream-server-pearl.vercel.app",{
//     transports:['websocket']
// });

  