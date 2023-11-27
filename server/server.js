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
  socket.on("get-document", (id) => {
    const data = "";
    socket.join(id);
    socket.emit("load-document", data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(id).emit("receive-changes", delta, id);
    });
  });

  // console.log("connected!");
});
