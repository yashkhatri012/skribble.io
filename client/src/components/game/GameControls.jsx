import { socket } from "../../socket/socket";

function GameControls({ isHost, gameStarted, wordOptions, roomId, onWordChosen }) {
  const showStartButton = isHost && !gameStarted && wordOptions.length === 0;
  const showWordPicker = wordOptions.length > 0;

  if (!showStartButton && !showWordPicker) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      {showStartButton && (
        <button
          onClick={() => socket.emit("start-game", { roomId })}
          className="bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-2 rounded-xl transition-colors"
        >
          Start Game
        </button>
      )}

      {showWordPicker && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-slate-400 text-sm font-semibold">Pick a word to draw:</p>
          <div className="flex gap-3">
            {wordOptions.map((word) => (
              <button
                key={word}
                onClick={() => onWordChosen(word)}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-2 rounded-xl transition-colors"
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

export default GameControls;