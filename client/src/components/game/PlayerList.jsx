import { useState } from "react";

export default function PlayerList({ players, username, roomId }) {
  const [copied, setCopied] = useState(false);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Failed to copy");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-3 md:p-4 flex flex-col
                    w-36 md:w-44 lg:w-44 shrink-0">
      <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2 md:mb-3">
        Players · {players.length}
      </p>

      <ul className="flex flex-col gap-0.5">
        {players.map((player, i) => {
          const isSelf = player.name === username;
          const isLeader = i === 0 && players.length > 1;
          return (
            <li
              key={player.id}
              className="flex items-center justify-between px-1.5 md:px-2 py-1 md:py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] md:text-[11px] text-stone-300 font-mono w-4 text-center shrink-0">
                  {player.isHost ? "👑" : i + 1}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className={`text-[12px] md:text-[13px] truncate font-medium ${
                    isSelf ? "text-indigo-500 font-semibold" : "text-stone-800"
                  }`}>
                    {player.name}
                  </span>
                  {isSelf && (
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wide">
                      you
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-[11px] md:text-[12px] font-mono font-semibold shrink-0 ml-1 ${
                isLeader ? "text-indigo-500" : "text-stone-400"
              }`}>
                {player.score}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 md:mt-5 pt-3 md:pt-4 border-t border-stone-100">
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-1">
          Room ID
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12px] font-mono font-semibold text-indigo-500 truncate">
            {roomId}
          </span>
          <button
            onClick={copyRoomId}
            className="text-[11px] font-semibold text-stone-400 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-md shrink-0 transition-colors"
          >
            {copied ? "✓" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}