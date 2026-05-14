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


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

 
  socket.on("join-room", (roomId) => {

  //Put this user inside a room
  socket.join(roomId);

  console.log(`${socket.id} joined ${roomId}`);

});

  socket.on("draw", ({ roomId, stroke }) => {

  socket.to(roomId).emit("draw", {
    stroke,
  });

});

socket.on("clear-canvas", (roomId) => {

  socket.to(roomId).emit("clear-canvas");

});

socket.on("undo", ({ roomId, updatedStrokes }) => {
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