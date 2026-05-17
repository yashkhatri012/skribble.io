import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useLocation, useParams } from "react-router-dom";

import ChatBox from "../components/ChatBox";
import RoundEndOverlay from "../components/RoundEndOverlay";
import GameOverScreen from "../components/GameOverScreen";
import PlayerList from "../components/game/PlayerList";
import DrawingArea from "../components/game/DrawingArea";

export default function GamePage() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const username = state?.username || "Anonymous";

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

  const isHost = players.find((p) => p.id === socket.id)?.isHost;
  const isDrawing = currentDrawer?.id === socket.id;

  useEffect(() => {
    socket.on("message", ({ username, text }) =>
      setMessages((prev) => [...prev, { username, text }])
    );
    return () => socket.off("message");
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => socket.emit("join-room", { roomId, username }));
    socket.on("room-update", ({ players }) => setPlayers(players));
    socket.on("game-started", ({ drawer }) => {
      setGameStarted(true);
      setGameOver(null);
      setCurrentDrawer(drawer);
    });
    socket.on("word-options", ({ options }) => setWordOptions(options));
    socket.on("masked-word", ({ masked }) => setMaskedWord(masked));
    socket.on("actual-word", ({ word }) => setActualWord(word));
    socket.on("correct-guess", ({ username }) =>
      setMessages((prev) => [...prev, { username, text: "✅ guessed the word!", type: "correct" }])
    );
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
      ["connect","room-update","draw","game-started","word-options",
       "masked-word","actual-word","correct-guess","round-info","round-end","game-over"]
        .forEach((e) => socket.off(e));
      socket.disconnect();
    };
  }, [roomId]);

  const handleWordChosen = (word) => {
    socket.emit("word-chosen", { roomId, word });
    setWordOptions([]);
  };

  return (
    <div className="min-h-screen bg-stone-100 p-3 md:p-5 font-sans">
      {/* Header */}
      <header className="max-w-[1220px] mx-auto mb-4 flex items-center justify-between">
        <span className="text-xl font-extrabold tracking-tight text-stone-900">
          draw<span className="text-indigo-500">it</span>
        </span>
        {roundInfo && gameStarted && (
          <span className="text-xs font-semibold text-stone-500 bg-stone-200 px-3 py-1 rounded-full tracking-wide font-mono">
            Round {roundInfo.currentRound} / {roundInfo.totalRounds}
          </span>
        )}
      </header>

      {/* Mobile: stack vertically. Desktop: 3 columns */}
      <div className="max-w-[1220px] mx-auto flex flex-col lg:flex-row gap-3 items-start">

        {/* Top row on mobile: players + chat side by side */}
        <div className="flex gap-3 w-full lg:hidden">
          <PlayerList players={players} username={username} roomId={roomId} />
          <ChatBox roomId={roomId} username={username} messages={messages} mobile />
        </div>

        {/* Center: canvas (full width on mobile) */}
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

        {/* Desktop sidebar: players + chat */}
        <div className="hidden lg:flex flex-col gap-3">
          <PlayerList players={players} username={username} roomId={roomId} />
          <ChatBox roomId={roomId} username={username} messages={messages} />
        </div>
      </div>

      {roundEndData && (
        <RoundEndOverlay word={roundEndData.word} players={roundEndData.players} />
      )}
      {gameOver && (
        <GameOverScreen
          players={gameOver.players}
          roomId={roomId}
          isHost={isHost}
          onRestart={() => { setGameOver(null); setRoundInfo(null); }}
          onClose={() => setGameOver(null)}
        />
      )}
    </div>
  );
}