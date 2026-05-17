<div align="center">

```
 _____ _          _ _     _     _               _
/  ___| |        (_) |   | |   | |             (_)
\ `--.| | ___ __ _| |__ | |__ | | ___   ___ _ _  ___
 `--. \ |/ / '__| | '_ \| '_ \| |/ _ \ / _ \ | |/ _ \
/\__/ /   <| |  | | |_) | |_) | |  __/|  __/ | | (_) |
\____/|_|\_\_|  |_|_.__/|_.__/|_|\___| \___|_|_|\___/
```

**A real-time multiplayer drawing & guessing game built with React + Socket.io**


</div>

---

## What is this?

Skribble.io is aclone of [skribbl.io](https://skribbl.io), a real-time multiplayer game where one player draws a word and everyone else races to guess it. Built from scratch with a React frontend and a Node.js/Socket.io backend.

---

## Features

- 🎨 **Real-time canvas** — smooth drawing synced across all players instantly
- 🏠 **Private rooms** — create a room and share the ID with friends
- ✏️ **Word selection** — drawer picks from 3 random word options each turn
- ⏱️ **Turn timer** — 60 seconds per turn with live countdown
- 💬 **Live chat** — guess the word by typing in the chat
- ✅ **Correct guess detection** — server validates guesses and awards points
- ↩️ **Undo & clear** — toolbar controls for the active drawer
- 📜 **Late join support** — players who join mid-game are caught up with current state
- 📱 **Mobile friendly** — touch drawing works without scrolling the page
- 🔄 **Multi-round games** — 3 rounds, every player gets a turn to draw

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Realtime | Socket.io (client + server) |
| Backend | Node.js, Express |
| Canvas | HTML5 Canvas API (custom hooks) |
| Routing | React Router v6 |

---

## Project Structure

```
skribble.io/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── game/
│   │   │   │   ├── DrawingArea.jsx     # Canvas + toolbar wrapper
│   │   │   │   ├── GameControls.jsx    # Start button + word picker
│   │   │   │   ├── PlayerList.jsx      # Scoreboard sidebar
│   │   │   │   └── WordDisplay.jsx     # Masked word + timer
│   │   │   ├── CanvasBoard.jsx         # Canvas element + touch handling
│   │   │   ├── ChatBox.jsx             # Chat + guess input
│   │   │   ├── RoundEndOverlay.jsx     # Between-round overlay
│   │   │   └── GameOverScreen.jsx      # Final scores screen
│   │   ├── hooks/
│   │   │   └── useCanvas.js            # Drawing logic, socket sync, undo
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Landing page (create/join room)
│   │   │   └── GamePage.jsx            # Main game page
│   │   ├── socket/
│   │   │   └── socket.js               # Socket.io client instance
│   │   └── utils/
│   │       └── drawLine.js             # Canvas line drawing utility
│
└── server/                     # Node.js backend
    ├── handlers/
    │   ├── registerRoomHandlers.js     # join-room, disconnect
    │   └── registerGameHandlers.js     # start-game, word-chosen, guesses
    ├── utils/
    │   ├── roomStore.js                # In-memory rooms + strokes state
    │   └── turnManager.js             # Turn logic, word options
    ├── words.js                        # Word list
    └── index.js                        # Express + Socket.io server entry
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

**1. Clone the repo**

```bash
git clone https://github.com/yashkhatri012/skribble.io.git
cd skribble.io
```

**2. Install server dependencies**

```bash
cd server
npm install
```

**3. Install client dependencies**

```bash
cd ../client
npm install
```

### Running locally

**Start the server**

```bash
cd server
npm run dev
# Runs on http://localhost:3001
```

**Start the client**

```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

Then open `http://localhost:5173` in your browser, enter a nickname, and create a room. Share the Room ID with friends to play together.

---

## How to Play

```
1. Enter a nickname on the home screen
2. Create a private room or join one with a Room ID
3. The host clicks "Start Game" when everyone is in
4. The drawer picks one of 3 word options
5. Everyone else types guesses in the chat
6. Correct guess = points for the guesser and drawer
7. Turn ends when time runs out or everyone guesses correctly
8. Every player gets a turn to draw each round
9. Most points after 3 rounds wins!
```

---

## Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `{ roomId, username }` | Join or create a room |
| `start-game` | `{ roomId }` | Host starts the game |
| `word-chosen` | `{ roomId, word }` | Drawer picks a word |
| `draw` | `{ roomId, stroke }` | Send a draw stroke |
| `stroke-end` | `{ roomId }` | Pen lifted |
| `undo` | `{ roomId, updatedStrokes }` | Undo last stroke |
| `clear-canvas` | `roomId` | Clear the canvas |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `room-update` | `{ players }` | Player list changed |
| `game-started` | `{ drawer }` | New turn started |
| `word-options` | `{ options }` | 3 words for drawer to pick |
| `masked-word` | `{ masked }` | `_ _ _ _ _` for guessers |
| `actual-word` | `{ word }` | Real word for drawer only |
| `timer` | `{ timeRemaining }` | Countdown tick |
| `round-info` | `{ currentRound, totalRounds }` | Round counter |
| `correct-guess` | `{ username }` | Someone guessed correctly |
| `round-end` | `{ word }` | Turn ended, word revealed |
| `game-over` | `{ players }` | Final scores |
| `canvas-state` | `{ strokes }` | Full canvas for late joiners |

---

## Known Limitations

- **In-memory state only** — restarting the server clears all rooms and games
- **No persistent scores** — scores reset between game sessions
- **Single server** — not horizontally scalable without a Redis adapter for Socket.io
- **No public matchmaking** — private rooms only

