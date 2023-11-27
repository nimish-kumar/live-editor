import { config } from "dotenv";
import { Server } from "socket.io";

config();

const conn = new Server(8001, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

conn.on("connection", (socket) => {
  console.log("connected!");
});
