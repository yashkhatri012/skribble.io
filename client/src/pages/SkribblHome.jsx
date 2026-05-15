import React, { useState } from 'react';
import { Pencil, Play, Users, Hash } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const SkribblHome = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Generates a random 6-character alphanumeric Room ID
  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 8).toLowerCase();
  };

  const handleCreateRoom = () => {
    if (!username) return alert("Please enter a username first!");
    const newRoomId = generateRandomId();
    console.log(`Creating room: ${newRoomId} for user: ${username}`);
    
    navigate(`/game/${newRoomId}` , { state: { username } });

    
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!username || !roomId) return alert("Enter username and Room ID!");
    navigate(`/game/${roomId}`, { state: { username } });
    console.log(`Joining room: ${roomId} as user: ${username}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-8 animate-bounce">
        <div className="bg-yellow-400 p-3 rounded-xl rotate-12">
          <Pencil className="text-slate-900 w-8 h-8" />
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter italic">
          SKRIBBLE<span className="text-yellow-400">.IO</span>
        </h1>
      </div>

      <div className="w-full max-w-md bg-slate-800 rounded-3xl shadow-2xl border-b-8 border-slate-950 p-8">
        <div className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2 ml-1">YOUR NAME</label>
            <input
              type="text"
              placeholder="Enter cool nickname..."
              className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="h-px bg-slate-700 my-2" />

          {/* Action Buttons */}
          <div className="grid gap-4">
            {/* Create Room Button */}
            <button
              onClick={handleCreateRoom}
              className="group relative flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white font-black py-4 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              <Play className="fill-current" />
              CREATE PRIVATE ROOM
            </button>

            <div className="relative flex py-3 items-center">
              <div className="grow border-t border-slate-700"></div>
              <span className="shrink mx-4 text-slate-500 font-bold text-xs uppercase">or join one</span>
              <div className="grow border-t border-slate-700"></div>
            </div>

            {/* Join Room Form */}
            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <div className="relative grow">
                <Hash className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Room ID"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-colors"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toLowerCase())}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 rounded-xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex justify-center gap-6 text-slate-500">
          <div className="flex items-center gap-1 text-xs">
            <Users className="w-4 h-4" /> <span>2-12 PLAYERS</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Pencil className="w-4 h-4" /> <span>REAL-TIME DRAW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkribblHome;