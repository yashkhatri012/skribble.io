import express from 'express'

import http from "http";
import { Server } from "socket.io";
import { wordList } from './words.js';



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
const rooms = {};


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

 
  socket.on("join-room", ({roomId, username }) => {
    socket.join(roomId);
     // Init room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [] };
    }
    const isHost = rooms[roomId].players.length === 0;
    const player = { id: socket.id, name: username, score: 0, isHost };
    rooms[roomId].players.push(player);
    console.log(`${socket.id} joined ${roomId}`);


    // ✅ FIXED: only send if there are actual strokes (not just empty groups)
    const existing = roomStrokes[roomId]?.filter((g) => g.length > 0);
    if (existing && existing.length > 0) {
      console.log("Sending canvas-state, groups:", existing.length);
      socket.emit("canvas-state", { strokes: existing });
    }


    // ✅ Broadcast updated player list to everyone in room
    io.to(roomId).emit("room-update", { players: rooms[roomId].players });
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

socket.on("start-game", ({ roomId }) => {
  // Pick 3 random words
  const shuffled = wordList.sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, 3);

  // First player is the drawer for now
  const drawer = rooms[roomId].players[0];
  rooms[roomId].currentDrawer = drawer;
  rooms[roomId].currentWord = null;

  // Send options only to the drawer
  io.to(drawer.id).emit("word-options", { options });
  
  // Tell everyone who is drawing
  io.to(roomId).emit("game-started", { drawer });
});

socket.on("word-chosen", ({ roomId, word }) => {
  rooms[roomId].currentWord = word;
  rooms[roomId].timeRemaining = 60;
  rooms[roomId].guessCount = 0;
   console.log("word chosen:", word)
  const masked = word.split("").map(() => "_").join(" ");

  // Send real word only to drawer, masked to everyone else
  io.to(roomId).emit("masked-word", { masked });
  io.to(rooms[roomId].currentDrawer.id).emit("actual-word", { word });

   const timer = setInterval(() => {
    rooms[roomId].timeRemaining--;
    io.to(roomId).emit("timer", { timeRemaining: rooms[roomId].timeRemaining });

    if (rooms[roomId].timeRemaining <= 0) {
      clearInterval(timer);
      rooms[roomId].currentWord = null;
      io.to(roomId).emit("round-end", { word });
    }
  }, 1000);
});

// MESSAGE
  socket.on("message", ({ roomId, username, text }) => {
  const room = rooms[roomId];
  const currentWord = room?.currentWord;

  // Check if it's a correct guess
  if (currentWord && text.toLowerCase() === currentWord.toLowerCase()) {
  const player = room.players.find((p) => p.id === socket.id);
  if (player) {
    const points = Math.max(0, room.timeRemaining * 10 - room.guessCount * 50);
    player.score += points;
    room.guessCount++;
  }

  io.to(roomId).emit("correct-guess", { username });
  io.to(roomId).emit("room-update", { players: room.players });
} else {
    // Just a normal message
    io.to(roomId).emit("message", { username, text });
  }
});



   socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // ✅ Remove player from whichever room they were in
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const index = room.players.findIndex((p) => p.id === socket.id);

      if (index !== -1) {
        const leaving = room.players[index];
        room.players.splice(index, 1);

        // If host left, assign host to next player
        if (leaving.isHost && room.players.length > 0) {
          room.players[0].isHost = true;
        }

        // Broadcast updated list
        io.to(roomId).emit("room-update", { players: room.players });

        // Clean up empty rooms
        if (room.players.length === 0) {
          delete rooms[roomId];
          delete roomStrokes[roomId];
        }
        break;
      }
    }
  });

  
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});