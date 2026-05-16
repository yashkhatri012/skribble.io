import express from "express";
import http from "http";
import { initSocket } from "./socket.js";


const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Server running"));

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));