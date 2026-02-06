import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { sumsubKyc } from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;
sumsubKyc();
// HTTP server + Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // React frontend URL
  },
});

// ⚡ WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Client se message receive
  socket.on("chat", (msg) => {
    console.log("Message from client:", msg);

    // Broadcast to all clients including sender
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () =>
  console.log(`Socket.io server running on port ${PORT}`),
);

export { io };
