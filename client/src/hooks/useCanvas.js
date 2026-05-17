import { useEffect, useRef } from "react";
import { drawLine } from "../utils/drawLine";
import { socket } from "../socket/socket";

export default function useCanvas(canvasRef, roomId) {
  const isDrawing = useRef(false);
  const prevPos = useRef({ x: 0, y: 0 });
  const strokes = useRef([]);
  const currentStroke = useRef([]);

  
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

   
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      // Touch event
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }

    // Mouse event
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    socket.on("draw", ({ stroke }) => {
      drawLine(canvasRef.current.getContext("2d"), stroke);
    });

    socket.on("clear-canvas", () => {
      const canvas = canvasRef.current;
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      strokes.current = [];
    });

    const redrawCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.current.forEach((group) => group.forEach((s) => drawLine(ctx, s)));
    };

    socket.on("undo", ({ updatedStrokes }) => {
      strokes.current = updatedStrokes;
      redrawCanvas();
    });

    socket.on("canvas-state", ({ strokes: incoming }) => {
      strokes.current = incoming.filter((g) => g.length > 0);
      redrawCanvas();
    });

    return () => {
      socket.off("draw");
      socket.off("clear-canvas");
      socket.off("undo");
      socket.off("canvas-state");
    };
  }, []);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const handleTouchStart = (e) => { e.preventDefault(); };
  const handleTouchMove  = (e) => { e.preventDefault(); };

  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove",  handleTouchMove,  { passive: false });

  return () => {
    canvas.removeEventListener("touchstart", handleTouchStart);
    canvas.removeEventListener("touchmove",  handleTouchMove);
  };
}, []);


  
  const startDrawing = (e) => {
    e.preventDefault(); 
    isDrawing.current = true;
    currentStroke.current = [];
    prevPos.current = getPos(e);
  };

  
  const stopDrawing = (e) => {
    e?.preventDefault();
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentStroke.current.length > 0) {
      strokes.current.push([...currentStroke.current]);
      currentStroke.current = [];
    }
    socket.emit("stroke-end", { roomId });
  };

  
  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);

    const stroke = {
      x1: prevPos.current.x,
      y1: prevPos.current.y,
      x2: x,
      y2: y,
    };

    drawLine(ctx, stroke);
    socket.emit("draw", { roomId, stroke });
    currentStroke.current.push(stroke);
    prevPos.current = { x, y };
  };

  
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current.forEach((group) => group.forEach((s) => drawLine(ctx, s)));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    strokes.current = [];
    socket.emit("clear-canvas", roomId);
  };

  const undoLastStroke = () => {
    if (strokes.current.length === 0) return;
    strokes.current.pop();
    redrawCanvas();
    socket.emit("undo", { roomId, updatedStrokes: strokes.current });
  };

  return { startDrawing, stopDrawing, draw, clearCanvas, undoLastStroke };
}