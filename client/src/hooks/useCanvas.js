import { useEffect, useRef, useState } from "react";
import { drawLine } from "../utils/drawLine";
import { socket } from "../socket/socket";


export default function useCanvas(canvasRef , roomId) {
  const [isDrawing, setIsDrawing] = useState(false);

  const prevPos = useRef({ x: 0, y: 0 });

  const strokes = useRef([]);
  const currentStroke = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";


    socket.on("draw", ({ stroke }) => {

  const canvas = canvasRef.current;

  const ctx = canvas.getContext("2d");

  drawLine(ctx, stroke);


});

socket.on("clear-canvas", () => {

  const canvas = canvasRef.current;

  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  strokes.current = [];

});

socket.on("undo", ({ updatedStrokes }) => {
  strokes.current = [...updatedStrokes];

  redrawCanvas();
});

return () => {
  socket.off("draw");
  socket.off("clear-canvas");
  socket.off("undo");
};

  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);

     currentStroke.current = [];

    prevPos.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
     if (currentStroke.current.length > 0) {
    strokes.current.push(currentStroke.current);
  }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    const currentX = e.nativeEvent.offsetX;
    const currentY = e.nativeEvent.offsetY;

    const stroke = {
      x1: prevPos.current.x,
      y1: prevPos.current.y,
      x2: currentX,
      y2: currentY,
    };

    drawLine(ctx, stroke);
        socket.emit("draw", {
      roomId,
      stroke,
    });
    // save stroke
    currentStroke.current.push(stroke);
    

    prevPos.current = {
      x: currentX,
      y: currentY,
    };
  };

  // CLEAR FUNCTION
  const clearCanvas = () => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.current = [];

    socket.emit("clear-canvas", roomId);
  };

  // UNDO FUNCTION
  const undoLastStroke = () => {
  const updatedStrokes = [...strokes.current];

  updatedStrokes.pop();

  strokes.current = updatedStrokes;

  redrawCanvas();

  socket.emit("undo", {
    roomId,
    updatedStrokes,
  });
};

  const redrawCanvas = () => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.current.forEach((strokeGroup) => {
  strokeGroup.forEach((stroke) => {
    drawLine(ctx, stroke);
  });
});
  };

  return {
    startDrawing,
    stopDrawing,
    draw,
    clearCanvas,
    undoLastStroke,
  };
}