import { socket } from "../../socket/socket";

export default function GameControls({ isHost, gameStarted, wordOptions, roomId, onWordChosen }) {
  const showStartButton = isHost && !gameStarted && wordOptions.length === 0;
  const showWordPicker = wordOptions.length > 0;

  if (!showStartButton && !showWordPicker) return null;

  return (
    <div className="flex flex-col items-center gap-2 md:gap-3 py-1 md:py-2 w-full">
      {showStartButton && (
        <button
          onClick={() => socket.emit("start-game", { roomId })}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 md:px-8 py-2 md:py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all text-sm tracking-tight"
        >
          Start Game
        </button>
      )}

      {showWordPicker && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
            Choose a word
          </p>
          {/* Wrap on small screens */}
          <div className="flex flex-wrap justify-center gap-2">
            {wordOptions.map((word) => (
              <button
                key={word}
                onClick={() => onWordChosen(word)}
                className="bg-white hover:bg-indigo-500 hover:text-white text-stone-800 border border-stone-200 hover:border-indigo-500 font-semibold px-4 md:px-6 py-1.5 md:py-2 rounded-xl shadow-sm transition-all text-sm"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}