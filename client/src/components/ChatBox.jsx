import { useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket";

export default function ChatBox({ roomId, username, messages, mobile = false }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("message", { roomId, username, text: input });
    setInput("");
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-stone-100 flex flex-col overflow-hidden
      ${mobile ? "flex-1 h-48" : "w-64 shrink-0 h-100"}`}>
      {/* Header */}
      <div className="px-3 md:px-4 py-2 md:py-3 border-b border-stone-100 flex items-center justify-between shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
          Chat
        </span>
        <span className="w-2 h-2 rounded-full bg-green-400 ring-2 ring-green-100" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 md:p-3 flex flex-col gap-1 md:gap-1.5">
        {messages.length === 0 && (
          <p className="text-[11px] text-stone-300 text-center mt-3">
            No messages yet!
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col gap-0.5 bg-stone-50 px-2 md:px-3 py-1.5 md:py-2 rounded-xl">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wide text-stone-400">
              {msg.username}
            </span>
            <span className={`text-[12px] md:text-[13px] leading-snug wrap-break-word ${
              msg.type === "correct" ? "text-green-600 font-semibold" : "text-stone-700"
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-2 md:p-3 border-t border-stone-100 flex gap-1.5 md:gap-2 items-center shrink-0">
        <input
          className="flex-1 h-8 md:h-9 rounded-xl border border-stone-200 bg-stone-50 px-2 md:px-3 text-[12px] md:text-[13px] text-stone-900 placeholder:text-stone-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a guess…"
        />
        <button
          onClick={sendMessage}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm md:text-base flex items-center justify-center shrink-0 transition-colors shadow-sm shadow-indigo-200"
        >
          ↑
        </button>
      </div>
    </div>
  );
}