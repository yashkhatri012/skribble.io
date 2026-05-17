export default function WordDisplay({ maskedWord, actualWord, isDrawing, timeRemaining, gameStarted }) {
  if (!gameStarted || !maskedWord) return null;

  const isUrgent = timeRemaining <= 10;

  return (
    <div className="flex items-center gap-3 md:gap-4 bg-white px-4 md:px-6 py-2 md:py-3 rounded-2xl shadow-sm border border-stone-100 w-full justify-center">
      <p className="text-lg md:text-2xl font-extrabold tracking-[0.2em] text-stone-900 font-mono">
        {isDrawing ? actualWord : maskedWord}
      </p>

      <div className="w-px h-5 md:h-6 bg-stone-100 shrink-0" />

      <div className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 rounded-full font-mono font-bold text-xs md:text-sm transition-colors shrink-0 ${
        isUrgent
          ? "bg-red-50 text-red-500 border border-red-200 animate-pulse"
          : "bg-stone-100 text-stone-500"
      }`}>
        <span>{isUrgent ? "⏰" : "⏱"}</span>
        <span>{timeRemaining}s</span>
      </div>
    </div>
  );
}