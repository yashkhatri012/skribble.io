import express from 'express'

import http from "http";
import { Server } from "socket.io";



const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const roomStrokes = {};
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

 
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);

    // ✅ FIXED: only send if there are actual strokes (not just empty groups)
    const existing = roomStrokes[roomId]?.filter((g) => g.length > 0);
    if (existing && existing.length > 0) {
      console.log("Sending canvas-state, groups:", existing.length);
      socket.emit("canvas-state", { strokes: existing });
    }
});

socket.on("draw", ({ roomId, stroke }) => {
  if (!roomStrokes[roomId]) roomStrokes[roomId] = [];
  const groups = roomStrokes[roomId];

  // ✅ Only push a new group if there isn't one already open
  if (groups.length === 0) groups.push([]);
  groups[groups.length - 1].push(stroke);

  socket.to(roomId).emit("draw", { stroke });
});

socket.on("stroke-end", ({ roomId }) => {
    // Signal that current stroke group is complete — start a new group next draw
    if (roomStrokes[roomId]) {
      roomStrokes[roomId].push([]); // new empty group ready
    }
  });

socket.on("clear-canvas", (roomId) => {
  roomStrokes[roomId] = []; 
  socket.to(roomId).emit("clear-canvas");

});

socket.on("undo", ({ roomId, updatedStrokes }) => {
   roomStrokes[roomId] = updatedStrokes;
  socket.to(roomId).emit("undo", {
    updatedStrokes,
  });
});


// MESSAGE
  socket.on("message", ({ roomId, text }) => {

    console.log(text);

    socket.to(roomId).emit("reply", text);

  });



  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});