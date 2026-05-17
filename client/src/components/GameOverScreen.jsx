import { socket } from "../socket/socket";

export default function GameOverScreen({ players, roomId, isHost, onRestart, onClose }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-100/80 backdrop-blur-md p-4">
      <div className="relative bg-white rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-xl border border-stone-100 text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 text-sm font-bold transition-colors flex items-center justify-center"
        >
          ✕
        </button>

        <div className="text-3xl md:text-4xl mb-2">🏆</div>
        <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight mb-1">
          Game Over
        </h2>
        <p className="text-sm text-stone-400 mb-5 md:mb-6">
          <span className="text-indigo-500 font-bold">{winner.name}</span> wins!
        </p>

        <div className="h-px bg-stone-100 mb-3 md:mb-4" />

        <div className="flex flex-col gap-1.5 md:gap-2 text-left mb-5 md:mb-6">
          {sorted.map((player, i) => (
            <div
              key={player.id}
              className={`flex items-center justify-between px-3 py-2 md:py-2.5 rounded-xl border ${
                i === 0 ? "bg-stone-50 border-stone-200" : "bg-white border-stone-100"
              }`}
            >
              <div className="flex items-center gap-2 md:gap-2.5">
                <span className="text-sm w-5 text-center">
                  {medals[i] ?? `#${i + 1}`}
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

        {isHost ? (
          <button
            onClick={() => {
              socket.emit("start-game", { roomId });
              onRestart();
            }}
            className="w-full py-2.5 md:py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-colors text-sm tracking-tight"
          >
            Play Again
          </button>
        ) : (
          <p className="text-[13px] text-stone-300">Waiting for host to restart…</p>
        )}
      </div>
    </div>
  );
}