import { config } from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Document from "./dbDocument.js";
config();

mongoose
  .connect("mongodb://127.0.0.1:27017/editordb")
  .then(() => console.log("mongodb connected!"))
  .catch((err) => console.log("mongodb error", err));

const conn = new Server(8001, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

conn.on("connection", (socket) => {
  socket.on("get-document", async (id) => {
    const document = await findOrCreateDocument(id);
    socket.join(id);
    socket.emit("load-document", document.data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(id).emit("receive-changes", delta, id);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(id, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: "" });
}
