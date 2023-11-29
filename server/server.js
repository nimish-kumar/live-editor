import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Document from "./dbDocument.js";

dotenv.config({ path: "../.env" });

console.log(
  "##--> PROJ_DB_CONNECTION_STRING",
  process.env.PROJ_DB_CONNECTION_STRING,
);
console.log("##--> PROJ_SERVER_PORT", process.env.PROJ_SERVER_PORT);
console.log(
  "##--> PROJ_DEPLOYED_FRONTEND_URL",
  process.env.PROJ_DEPLOYED_FRONTEND_URL,
);

mongoose
  .connect(process.env.PROJ_DB_CONNECTION_STRING)
  .then(() => console.log("mongodb connected!"))
  .catch(err => console.log("mongodb error", err));

const conn = new Server(Number(process.env.PROJ_SERVER_PORT || "8001"), {
  cors: {
    origin: process.env.PROJ_DEPLOYED_FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

conn.on("connection", socket => {
  socket.on("get-document", async id => {
    const document = await findOrCreateDocument(id);
    socket.join(id);
    socket.emit("load-document", document.data);
    socket.on("send-changes", delta => {
      socket.broadcast.to(id).emit("receive-changes", delta, id);
    });

    socket.on("save-document", async data => {
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
