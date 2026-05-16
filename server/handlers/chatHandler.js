import { rooms } from "../utils/roomStore.js";

export function registerChatHandlers(io, socket) {
    socket.on("message", ({ roomId, username, text }) => {
    const room = rooms[roomId];
    const currentWord = room?.currentWord;
    //prevent drawer from guessing
    if (room?.currentDrawer?.id === socket.id) {
      io.to(roomId).emit("message", { username, text });
      return;
    }

    // Check if it's a correct guess
    if (currentWord && text.toLowerCase() === currentWord.toLowerCase()) {
      const player = room.players.find((p) => p.id === socket.id);
      if (player) {
        const points = Math.max(
          0,
          room.timeRemaining * 10 - room.guessCount * 50,
        );
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
}