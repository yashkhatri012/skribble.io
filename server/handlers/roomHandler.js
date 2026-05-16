import { rooms, roomStrokes } from "../utils/roomStore.js";

export function registerRoomHandlers(io, socket) {
    
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    // Init room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        currentDrawerIndex: 0,
      };
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
}