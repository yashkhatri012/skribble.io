import express from "express";
import http from "http";
import { initSocket } from "./socket.js";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://skribble-io7.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.get("/", (req, res) => res.send("Server running"));

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));