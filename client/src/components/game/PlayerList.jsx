

function PlayerList({ players, username, roomId }) {
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      alert("Room ID copied!");
    } catch {
      alert("Failed to copy");
    }
  };

  return (
    <div className="w-48 shrink-0 bg-zinc-950 rounded-2xl p-4 border-b-4 border-slate-950 h-fit">
      <h2 className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
        Players · {players.length}
      </h2>

      <ul className="text-white space-y-2">
        {players.map((player, i) => (
          <li key={player.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm shrink-0">
                {player.isHost ? "👑" : `#${i + 1}`}
              </span>
              <span
                className={`text-sm font-bold truncate ${
                  player.name === username ? "text-yellow-400" : "text-white"
                }`}
              >
                {player.name}
              </span>
            </div>
            <span className="text-slate-400 text-xs font-mono shrink-0">
              {player.score}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs mb-1">Room ID</p>
        <p className="text-yellow-400 font-mono font-bold text-sm tracking-widest">
          {roomId}
        </p>
        <button
          onClick={copyRoomId}
          className="mt-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default PlayerList;