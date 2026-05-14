// Future ideas 
// Undo
// Clear
// Color picker
// Brush size

export default function Toolbar({
  clearCanvas,
  undoLastStroke,
}) {
  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={undoLastStroke}
        className="px-4 py-2 border"
      >
        Undo
      </button>

      <button
        onClick={clearCanvas}
        className="px-4 py-2 border"
      >
        Clear
      </button>
    </div>
  );
}