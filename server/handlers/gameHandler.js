import { rooms, roomStrokes } from "../utils/roomStore.js";
import { startTurn } from "../utils/turnmanager.js";

export function registerGameHandlers(io, socket) {
    socket.on("start-game", ({ roomId }) => {
    rooms[roomId].players.forEach((p) => (p.score = 0));

    rooms[roomId].currentDrawerIndex = 0;
    rooms[roomId].currentRound = 1;
    rooms[roomId].totalRounds = 3;
    rooms[roomId].turnsThisRound = 0;
    startTurn(io, roomId);
  });


  socket.on("word-chosen", ({ roomId, word }) => {
    rooms[roomId].currentWord = word;
    rooms[roomId].timeRemaining = 60;
    rooms[roomId].guessCount = 0;
    rooms[roomId].gameActive = true;

    console.log("word chosen:", word);
    const masked = word
      .split("")
      .map(() => "_")
      .join(" ");

    // Send real word only to drawer, masked to everyone else
    io.to(roomId).emit("masked-word", { masked });
    rooms[roomId].maskedWord = masked;
    io.to(rooms[roomId].currentDrawer.id).emit("actual-word", { word });

    const timer = setInterval(() => {
      rooms[roomId].timeRemaining--;
      io.to(roomId).emit("timer", {
        timeRemaining: rooms[roomId].timeRemaining,
      });

      if (rooms[roomId].timeRemaining <= 0) {
        clearInterval(timer);
        rooms[roomId].currentWord = null;
        rooms[roomId].maskedWord = null;

        io.to(roomId).emit("round-end", { word });

        //  Advance to the next drawer
        const room = rooms[roomId];
        room.turnsThisRound++;

        // Check if everyone has drawn this round
        if (room.turnsThisRound >= room.players.length) {
          room.turnsThisRound = 0;
          room.currentRound++;

          // Check if all rounds are done
          if (room.currentRound > room.totalRounds) {
            setTimeout(() => {
              room.gameActive = false;
              io.to(roomId).emit("game-over", { players: room.players });
            }, 3000);
            return; 
          }
        }
        room.currentDrawerIndex =
          (room.currentDrawerIndex + 1) % room.players.length;

        // Wait 3 seconds, then start the next turn
        setTimeout(() => {
          startTurn(io, roomId);
        }, 3000);
      }
    }, 1000);
  });


}