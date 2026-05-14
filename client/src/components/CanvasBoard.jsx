import { useRef } from "react";
import useCanvas from "../hooks/useCanvas";
import Toolbar from "./ToolBar";

export default function CanvasBoard({roomId}) {
  const canvasRef = useRef(null);

  const {
    draw,
    startDrawing,
    stopDrawing,
    clearCanvas,
    undoLastStroke,
  } = useCanvas(canvasRef, roomId);

  return (
    <>
    <Toolbar
    clearCanvas={clearCanvas}
    undoLastStroke={undoLastStroke}
    />
    <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border border-black"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onMouseMove={draw}
        />
    </>
   
    
  );
}