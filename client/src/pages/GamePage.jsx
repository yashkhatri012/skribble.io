import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useLocation, useParams } from "react-router-dom";

import ChatBox from "../components/ChatBox";
import RoundEndOverlay from "../components/RoundEndOverlay";
import GameOverScreen from "../components/GameOverScreen";
import PlayerList from "../components/game/PlayerList";
import DrawingArea from "../components/game/DrawingArea";

function GamePage() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const username = state?.username || "Anonymous";

  // ── State ────────────────────────────────────────────────────────────────
  const [players, setPlayers] = useState([]);
  const [currentDrawer, setCurrentDrawer] = useState(null);
  const [wordOptions, setWordOptions] = useState([]);
  const [maskedWord, setMaskedWord] = useState("");
  const [actualWord, setActualWord] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [roundInfo, setRoundInfo] = useState(null);
  const [roundEndData, setRoundEndData] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [messages, setMessages] = useState([]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const isHost = players.find((p) => p.id === socket.id)?.isHost;
  const isDrawing = currentDrawer?.id === socket.id;

  // ── Socket: chat messages ─────────────────────────────────────────────────
  useEffect(() => {
    socket.on("message", ({ username, text }) => {
      setMessages((prev) => [...prev, { username, text }]);
    });
    return () => socket.off("message");
  }, []);

  // ── Socket: game events ───────────────────────────────────────────────────
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join-room", { roomId, username });
    });

    socket.on("room-update", ({ players }) => setPlayers(players));

    socket.on("game-started", ({ drawer }) => {
      setGameStarted(true);
      setGameOver(null);
      setCurrentDrawer(drawer);
    });

    socket.on("word-options", ({ options }) => setWordOptions(options));

    socket.on("masked-word", ({ masked }) => setMaskedWord(masked));

    socket.on("actual-word", ({ word }) => setActualWord(word));

    socket.on("correct-guess", ({ username }) => {
      setMessages((prev) => [
        ...prev,
        { username, text: "✅ guessed the word!", type: "correct" },
      ]);
    });

    socket.on("timer", ({ timeRemaining }) => setTimeRemaining(timeRemaining));

    socket.on("round-info", ({ currentRound, totalRounds }) =>
      setRoundInfo({ currentRound, totalRounds })
    );

    socket.on("round-end", ({ word }) => {
      setMaskedWord("");
      setActualWord("");
      setGameStarted(false);
      setMessages((prev) => [
        ...prev,
        { username: "🎮 Game", text: `Round over! The word was: ${word}` },
      ]);
      setRoundEndData({ word, players: [...players] });
      setTimeout(() => setRoundEndData(null), 3000);
    });

    socket.on("game-over", ({ players }) => setGameOver({ players }));

    return () => {
      socket.off("connect");
      socket.off("room-update");
      socket.off("draw");
      socket.off("game-started");
      socket.off("word-options");
      socket.off("masked-word");
      socket.off("actual-word");
      socket.off("correct-guess");
      socket.off("round-info");
      socket.off("round-end");
      socket.off("game-over");
      socket.disconnect();
    };
  }, [roomId]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleWordChosen = (word) => {
    socket.emit("word-chosen", { roomId, word });
    setWordOptions([]);
  };

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {/* Three-column game layout */}
      <div className="flex gap-4 w-full max-w-6xl">

        {/* LEFT — player list */}
        <PlayerList players={players} username={username} roomId={roomId} />

        {/* CENTER — canvas + controls */}
        <DrawingArea
          roomId={roomId}
          isDrawing={isDrawing}
          isHost={isHost}
          gameStarted={gameStarted}
          wordOptions={wordOptions}
          maskedWord={maskedWord}
          actualWord={actualWord}
          timeRemaining={timeRemaining}
          roundInfo={roundInfo}
          onWordChosen={handleWordChosen}
        />

        {/* RIGHT — chat */}
        <ChatBox roomId={roomId} username={username} messages={messages} />
      </div>

      {/* Overlays */}
      {roundEndData && (
        <RoundEndOverlay word={roundEndData.word} players={roundEndData.players} />
      )}

      {gameOver && (
        <GameOverScreen
          players={gameOver.players}
          roomId={roomId}
          isHost={isHost}
          onRestart={() => {
            setGameOver(null);
            setRoundInfo(null);
          }}
          onClose={() => setGameOver(null)}
        />
      )}
    </div>
  );
}

export default GamePage;