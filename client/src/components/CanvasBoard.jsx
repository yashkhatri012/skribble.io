import { useRef } from "react";
import useCanvas from "../hooks/useCanvas";
import Toolbar from "./ToolBar";

export default function CanvasBoard({roomId , isDrawing}) {
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
    {isDrawing && (
      <Toolbar clearCanvas={clearCanvas} undoLastStroke={undoLastStroke} />
    )}
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      style={{ touchAction: "none" }} 
      className={`border border-black ${!isDrawing ? "cursor-default" : "cursor-crosshair"}`}
      onMouseDown={isDrawing ? startDrawing : undefined}
      onMouseUp={isDrawing ? stopDrawing : undefined}
      onMouseLeave={isDrawing ? stopDrawing : undefined}
      onMouseMove={isDrawing ? draw : undefined}
      onTouchStart={isDrawing ? startDrawing : undefined}
        onTouchEnd={isDrawing ? stopDrawing : undefined}
        onTouchCancel={isDrawing ? stopDrawing : undefined}
        onTouchMove={isDrawing ? draw : undefined}
    />
  </>
);
}