import { socket } from "../socket/socket";

export default function GameOverScreen({ players, roomId, isHost, onRestart, onClose }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
        <button
    onClick={onClose}
    className="absolute top-60 right-150 text-zinc-500 hover:text-white text-xl transition-colors"
  >
    ✕
  </button>
        <p className="text-4xl mb-2">🎉</p>
        <h2 className="text-white text-2xl font-black mb-1">Game Over!</h2>
        <p className="text-zinc-400 text-sm mb-6">
          <span className="text-yellow-400 font-bold">{winner.name}</span> wins!
        </p>

        {/* Final scoreboard */}
        <div className="flex flex-col gap-2 text-left mb-6">
          {sorted.map((player, i) => (
            <div
              key={player.id}
              className={`flex items-center justify-between rounded-xl px-4 py-2 ${
                i === 0 ? "bg-yellow-400/10 border border-yellow-400/30" : "bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span>{medals[i] ?? `#${i + 1}`}</span>
                <span className="text-white font-semibold">{player.name}</span>
              </div>
              <span className="text-yellow-400 font-mono font-bold">{player.score}</span>
            </div>
          ))}
        </div>

        {isHost && (
          <button
            onClick={() => {
              socket.emit("start-game", { roomId });
              onRestart();
            }}
            className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded-xl transition-colors"
          >
            Play Again
          </button>
        )}
        {!isHost && (
          <p className="text-zinc-500 text-sm">Waiting for host to restart...</p>
        )}
      </div>
    </div>
  );
}