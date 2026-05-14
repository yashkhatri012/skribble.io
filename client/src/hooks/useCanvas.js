import { useEffect, useRef } from "react";
import { drawLine } from "../utils/drawLine";
import { socket } from "../socket/socket";

export default function useCanvas(canvasRef, roomId) {
  
  const isDrawing = useRef(false);
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
      const ctx = canvasRef.current.getContext("2d");
      drawLine(ctx, stroke);
    });

    socket.on("clear-canvas", () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.current = [];
    });

    
    const redrawCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.current.forEach((strokeGroup) => {
        strokeGroup.forEach((stroke) => drawLine(ctx, stroke));
      });
    };

    socket.on("undo", ({ updatedStrokes }) => {
      strokes.current = updatedStrokes;
      redrawCanvas();
    });

    
socket.on("canvas-state", ({ strokes: incomingStrokes }) => {
  strokes.current = incomingStrokes.filter(g => g.length > 0);
  redrawCanvas();
});

  return () => {
    socket.off("draw");
    socket.off("clear-canvas");
    socket.off("undo");
    socket.off("canvas-state"); 
  };
  }, []);

  const startDrawing = (e) => {
    isDrawing.current = true; 
    currentStroke.current = [];
    prevPos.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false; // ✅ ref write — synchronous
    if (currentStroke.current.length > 0) {
      strokes.current.push([...currentStroke.current]); // ✅ copy the array
      currentStroke.current = [];
    }


    //Tell server stroke group is done
     socket.emit("stroke-end", { roomId });
  };

  const draw = (e) => {
    if (!isDrawing.current) return; // ✅ always reads latest value

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
    socket.emit("draw", { roomId, stroke });
    currentStroke.current.push(stroke);

    prevPos.current = { x: currentX, y: currentY };
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current.forEach((strokeGroup) => {
      strokeGroup.forEach((stroke) => drawLine(ctx, stroke));
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current = [];
    socket.emit("clear-canvas", roomId);
  };

  const undoLastStroke = () => {
    if (strokes.current.length === 0) return;
    strokes.current.pop();
    redrawCanvas();
    socket.emit("undo", {
      roomId,
      updatedStrokes: strokes.current,
    });
  };

  return { startDrawing, stopDrawing, draw, clearCanvas, undoLastStroke };
}