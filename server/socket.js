import { Server } from "socket.io";
import { registerRoomHandlers } from "./handlers/roomHandler.js";
import { registerCanvasHandlers } from "./handlers/canvasHandler.js";
import { registerChatHandlers } from "./handlers/chatHandler.js";
import { registerGameHandlers } from "./handlers/gameHandler.js";

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
      "http://localhost:5173",
      "https://skribble-io7.vercel.app"
    ],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    registerRoomHandlers(io, socket);
    registerCanvasHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerGameHandlers(io, socket);
  });

  return io;
}