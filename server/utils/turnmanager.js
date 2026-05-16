import { wordList } from "../words.js";
import { rooms } from "./roomStore.js";



export function startTurn(io, roomId) {
  const room = rooms[roomId];
  const drawer = room.players[room.currentDrawerIndex];
  room.currentDrawer = drawer;
  room.currentWord = null;

  const shuffled = [...wordList].sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, 3);

  io.to(drawer.id).emit("word-options", { options });
  io.to(roomId).emit("game-started", { drawer });

  io.to(roomId).emit("round-info", {
    currentRound: room.currentRound,
    totalRounds: room.totalRounds,
  });
}