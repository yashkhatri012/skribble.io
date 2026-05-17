import CanvasBoard from "../CanvasBoard";
import GameControls from "./GameControls";
import WordDisplay from "./WordDisplay";

export default function DrawingArea({
  roomId,
  isDrawing,
  isHost,
  gameStarted,
  wordOptions,
  maskedWord,
  actualWord,
  timeRemaining,
  onWordChosen,
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 md:gap-3 w-full min-w-0">
      <GameControls
        isHost={isHost}
        gameStarted={gameStarted}
        wordOptions={wordOptions}
        roomId={roomId}
        onWordChosen={onWordChosen}
      />

      <WordDisplay
        maskedWord={maskedWord}
        actualWord={actualWord}
        isDrawing={isDrawing}
        timeRemaining={timeRemaining}
        gameStarted={gameStarted}
      />

      {gameStarted    ? (
        <div className="w-full rounded-2xl overflow-hidden shadow-md border border-stone-200 bg-white leading-none">
          <CanvasBoard roomId={roomId} isDrawing={isDrawing} />
        </div>
      ) : (
        wordOptions.length === 0 && !isHost && (
          <div className="flex items-center gap-2 mt-8 md:mt-16 text-stone-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-stone-300 animate-pulse inline-block" />
            Waiting for the host to start…
          </div>
        )
      )}
    </div>
  );
}