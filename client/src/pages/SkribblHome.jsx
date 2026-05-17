import React, { useState } from 'react';
import { Pencil, Play, Users, Hash, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const SkribblHome = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const generateRandomId = () => Math.random().toString(36).substring(2, 8).toLowerCase();

  const handleCreateRoom = () => {
    if (!username.trim()) return alert("Please enter a username first!");
    const newRoomId = generateRandomId();
    navigate(`/game/${newRoomId}`, { state: { username } });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!username.trim() || !roomId.trim()) return alert("Enter username and Room ID!");
    navigate(`/game/${roomId}`, { state: { username } });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

      

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-violet-600 rounded-full opacity-10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/30 rotate-3">
            <Pencil className="text-white w-8 h-8 -rotate-3" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tighter text-white leading-none">
              skribble<span className="text-indigo-400">.io</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium mt-1 tracking-wide">draw • guess • win</p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-black/40">

          {/* Username */}
          <div className="mb-5">
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">
              Your Name
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Enter nickname…"
                maxLength={20}
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Create Room */}
          <button
            onClick={handleCreateRoom}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 active:scale-[0.98] text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-150 text-sm tracking-wide"
          >
            <Play className="w-4 h-4 fill-white" strokeWidth={0} />
            Create Private Room
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs font-semibold uppercase tracking-widest">or join</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Join Room */}
          <form onSubmit={handleJoinRoom} className="flex gap-2">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Room ID"
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toLowerCase())}
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold px-5 rounded-xl shadow-md shadow-violet-600/20 transition-all duration-150 text-sm"
            >
              Join
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer  */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5" />
            2–12 players
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
            <Pencil className="w-3.5 h-3.5" />
            Real-time draw
          </span>
        </div>

      </div>
    </div>
  );
};

export default SkribblHome;