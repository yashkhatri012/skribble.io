export default function RoundEndOverlay({ word, players }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-100/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-xl border border-stone-100 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">
          The word was
        </p>
        <p className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight capitalize mb-5 md:mb-6">
          {word}
        </p>

        <div className="h-px bg-stone-100 mb-3 md:mb-4" />

        <div className="flex flex-col gap-1.5 md:gap-2 text-left mb-4 md:mb-5">
          {sorted.map((player, i) => (
            <div
              key={player.id}
              className={`flex items-center justify-between px-3 py-2 md:py-2.5 rounded-xl border ${
                i === 0 ? "bg-stone-50 border-stone-200" : "bg-white border-stone-100"
              }`}
            >
              <div className="flex items-center gap-2 md:gap-2.5">
                <span className="text-sm w-5 text-center">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </span>
                <span className={`text-[13px] md:text-[14px] text-stone-800 ${i === 0 ? "font-bold" : "font-medium"}`}>
                  {player.name}
                </span>
              </div>
              <span className={`text-[12px] md:text-[13px] font-mono font-semibold ${
                i === 0 ? "text-indigo-500" : "text-stone-400"
              }`}>
                {player.score}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-stone-300">Next round starting in 3s…</p>
      </div>
    </div>
  );
}