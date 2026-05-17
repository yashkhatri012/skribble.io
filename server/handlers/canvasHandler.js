import { roomStrokes } from "../utils/roomStore.js";

export function registerCanvasHandlers(io, socket){
    socket.on("draw", ({ roomId, stroke }) => {
    if (!roomStrokes[roomId]) roomStrokes[roomId] = [];
    const groups = roomStrokes[roomId];

    // Only push a new group if there isn't one already open
    if (groups.length === 0) groups.push([]);
    groups[groups.length - 1].push(stroke);

    socket.to(roomId).emit("draw", { stroke });
  });

  socket.on("stroke-end", ({ roomId }) => {
    // Signal that current stroke group is complete start a new group next draw
    if (roomStrokes[roomId]) {
      roomStrokes[roomId].push([]); // new empty group 
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

}