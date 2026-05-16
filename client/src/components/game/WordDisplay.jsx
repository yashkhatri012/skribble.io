



function WordDisplay({ maskedWord, actualWord, isDrawing, timeRemaining, roundInfo, gameStarted }) {
  if (!gameStarted) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      {maskedWord && (
        <div className="flex items-center gap-6">
          <p className="text-black text-4xl font-bold tracking-widest">
            {isDrawing ? actualWord : maskedWord}
          </p>
          <p
            className={`text-2xl font-bold ${
              timeRemaining <= 10 ? "text-red-500 animate-pulse" : "text-red-400"
            }`}
          >
            {timeRemaining}s
          </p>
        </div>
      )}

      {roundInfo && (
        <p className="text-zinc-400 text-sm font-semibold tracking-wide">
          Round {roundInfo.currentRound} of {roundInfo.totalRounds}
        </p>
      )}
    </div>
  );
}

export default WordDisplay;