export default function RoundEndOverlay({ word, players }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
        
        {/* Word reveal */}
        <p className="text-zinc-400 text-sm uppercase tracking-widest mb-1">The word was</p>
        <p className="text-yellow-400 text-4xl font-black mb-6 capitalize">{word}</p>

        {/* Scoreboard */}
        <div className="flex flex-col gap-2 text-left">
          {sorted.map((player, i) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 text-sm w-4">{i + 1}</span>
                <span className="text-white font-semibold">{player.name}</span>
                {i === 0 && <span className="text-xs">👑</span>}
              </div>
              <span className="text-yellow-400 font-mono font-bold">{player.score}</span>
            </div>
          ))}
        </div>

        {/* Countdown hint */}
        <p className="text-zinc-500 text-xs mt-5">Next round starting in 10s...</p>
      </div>
    </div>
  );
}