import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import CanvasBoard from "../components/CanvasBoard";
import { useLocation, useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import RoundEndOverlay from "../components/RoundEndOverlay";

function GamePage() {
const { roomId } = useParams();
const { state } = useLocation();

const username = state?.username || "Anonymous";
const [players, setPlayers] = useState([]);
const [currentDrawer, setCurrentDrawer] = useState(null);
const [word, setWord] = useState(null);         // only set for the drawer

const [wordOptions, setWordOptions] = useState([]);
const [maskedWord, setMaskedWord] = useState("");
const [actualWord, setActualWord] = useState("");
const [gameStarted, setGameStarted] = useState(false);
const [roundEndData, setRoundEndData] = useState(null); 

 const [messages, setMessages] = useState([]);

const isHost = players.find((p) => p.id === socket.id)?.isHost;
const isDrawing = currentDrawer?.id === socket.id;
const [timeRemaining, setTimeRemaining] = useState(60);

  useEffect(() => {
    socket.on("message", ({ username, text }) => {
      setMessages((prev) => [...prev, { username, text }]);
    });

    return () => {
      socket.off("message");
    };
  }, []);


  useEffect(() => {

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      
      // JOIN ROOM
    socket.emit("join-room", { roomId, username });
    

    
    
      
    });

       
   socket.on("room-update", ({ players }) => {
      setPlayers(players);
    });


    socket.on("game-started", ({ drawer }) => {
       console.log("game started, drawer:", drawer);
  setGameStarted(true);
  setCurrentDrawer(drawer);
});

socket.on("word-options", ({ options }) => {
  setWordOptions(options);
});

socket.on("masked-word", ({ masked }) => {
 
  setMaskedWord(masked);
});

socket.on("actual-word", ({ word }) => {
  setActualWord(word);
  
});

socket.on("correct-guess", ({ username }) => {
  setMessages((prev) => [...prev, { username, text: "✅ guessed the word!", type: "correct" }]);
});

socket.on("timer", ({ timeRemaining }) => {
  setTimeRemaining(timeRemaining);
});

socket.on("round-end", ({ word }) => {
  setMaskedWord("");
  setActualWord("");
  setGameStarted(false);
  setMessages(prev => [...prev, { username: "🎮 Game", text: `Round over! The word was: ${word}` }]);
  setRoundEndData({ word, players: [...players] }); // 👈 snapshot scores at this moment

  // Auto-dismiss after 3s (matches server's setTimeout before next turn)
  setTimeout(() => setRoundEndData(null), 7000);
});

    return () => {
      socket.off("connect");
       socket.off("reply");
       socket.off("room-update");
       socket.off("draw");
       socket.off("game-started");
      socket.off("word-options");
      socket.off("masked-word");
      socket.off("actual-word");
      socket.off("correct-guess");
      socket.disconnect();
    };

  }, [roomId]);


  const copyRoomId = async () => {
  try {
    await navigator.clipboard.writeText(roomId);

    alert("Room ID copied!");
  } catch (error) {
    console.log(error);

    alert("Failed to copy");
  }
};

  return (
    
    <div className="min-h-screen flex flex-col items-center p-4">
      
      <div className="flex gap-4 w-full max-w-6xl">
        
        {/* Player List — left side */}
        <div className="w-48 shrink-0 bg-zinc-950 rounded-2xl p-4 border-b-4 border-slate-950 h-fit">
          <h2 className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
            Players · {players.length}
          </h2>
          <ul className=" text-white space-y-2">
            {players.map((player, i) => (
              <li
                key={player.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Crown for host */}
                  <span className="text-sm shrink-0">
                    {player.isHost ? "👑" : `#${i + 1}`}
                  </span>
                  <span
                    className={`text-sm font-bold truncate ${
                      player.name === username
                        ? "text-yellow-400"  // highlight yourself
                        : "text-white"
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

          {/* Room ID badge */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-slate-500 text-xs mb-1">Room ID</p>

            <p className="text-yellow-400 font-mono font-bold text-sm tracking-widest">
              {roomId}
              
            </p>
            <button className="text-white  border-black"  onClick={copyRoomId}> Copy</button>
            
          </div>
        </div>
            <div>
              {isHost && !gameStarted && (
            <button
              onClick={() => socket.emit("start-game", { roomId })}
              className="bg-green-500 text-white font-bold px-6 py-2 rounded-xl"
            >
              Start Game
            </button>
          )}

          {wordOptions.length > 0 && (
          <div className="flex gap-4">
            {wordOptions.map((word) => (
              <button
                key={word}
                onClick={() => {
                  socket.emit("word-chosen", { roomId, word });
                  setWordOptions([]);
                }}
                className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-xl"
              >
                {word}
              </button>
            ))}
          </div>
        )}

        
            </div>
        
        {/* Canvas — center */}
        <div className="flex-1 flex flex-col items-center gap-2">
          
          {/* Word display above canvas */}
          {maskedWord && (
             <div className="flex items-center gap-6">
            <p className="text-black text-4xl font-bold tracking-widest">
              {isDrawing ? actualWord : maskedWord}
            </p>
            <p className="text-red-500 text-2xl font-bold">{timeRemaining}s</p>
          </div>
            
          )}
          {
            gameStarted && (
              <CanvasBoard roomId={roomId}  isDrawing={isDrawing} />
            )
          }
          
        </div>
        
            

            <div>
              <ChatBox roomId={roomId} username={username}  messages={messages}/>
            </div>
      </div>
      {roundEndData && (
  <RoundEndOverlay
    word={roundEndData.word}
    players={roundEndData.players}
  />
)}
    </div>
  );
}

export default GamePage;