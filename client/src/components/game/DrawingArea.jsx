import CanvasBoard from "../CanvasBoard";
import GameControls from "./GameControls";
import WordDisplay from "./WordDisplay";

function DrawingArea({
  roomId,
  isDrawing,
  isHost,
  gameStarted,
  wordOptions,
  maskedWord,
  actualWord,
  timeRemaining,
  roundInfo,
  onWordChosen,
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3">
      {/* Controls: start button or word picker — shown above canvas */}
      <GameControls
        isHost={isHost}
        gameStarted={gameStarted}
        wordOptions={wordOptions}
        roomId={roomId}
        onWordChosen={onWordChosen}
      />

      {/* Word + timer + round info */}
      <WordDisplay
        maskedWord={maskedWord}
        actualWord={actualWord}
        isDrawing={isDrawing}
        timeRemaining={timeRemaining}
        roundInfo={roundInfo}
        gameStarted={gameStarted}
      />

      {/* Canvas */}
      {gameStarted && <CanvasBoard roomId={roomId} isDrawing={isDrawing} />}

      {/* Waiting state */}
      {!gameStarted && wordOptions.length === 0 && !isHost && (
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
          Waiting for the host to start the game…
        </div>
      )}
    </div>
  );
}

export default DrawingArea;