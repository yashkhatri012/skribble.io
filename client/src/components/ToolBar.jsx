export default function Toolbar({ clearCanvas, undoLastStroke }) {
  return (
    <div className="flex items-center gap-1 md:gap-1.5 bg-white border border-stone-200 rounded-xl px-2 md:px-2.5 py-1.5 md:py-2 shadow-sm self-start">
      <button
        onClick={undoLastStroke}
        className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[12px] md:text-[13px] font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
      >
        <span>↩</span>
        Undo
      </button>

      <div className="w-px h-4 md:h-5 bg-stone-200" />

      <button
        onClick={clearCanvas}
        className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[12px] md:text-[13px] font-semibold text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <span>✕</span>
        Clear
      </button>
    </div>
  );
}