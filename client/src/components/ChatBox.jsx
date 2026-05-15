import { useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket";

export default function ChatBox({ roomId, username , messages }) {
 
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("message", { roomId, username, text: input });
    setInput("");
  };

  return (
    <div className="w-80 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col h-125 shadow-xl overflow-hidden font-sans">
      
      {/* Header (Shadcn style) */}
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-sm font-medium text-zinc-100 tracking-tight">Room Chat</h3>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
        {messages.map((msg, i) => (
        <div key={i} className="text-sm leading-relaxed wrap-break-word">
          <span className="text-zinc-400 font-medium mr-1.5">{msg.username}:</span>
          <span className={msg.type === "correct" ? "text-green-400 font-bold" : "text-zinc-200"}>
            {msg.text}
          </span>
        </div>
      ))}
        <div ref={bottomRef} />

        
        
      </div>

      {/* Input section */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex gap-2 items-center">
        <input
          className="flex-1 h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a guess..."
        />
        <button
          onClick={sendMessage}
          className="h-9 inline-flex items-center justify-center rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-900 shadow transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}