import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Document from "./dbDocument.js";

dotenv.config({ path: "../.env" });

mongoose
  .connect(process.env.PROJ_DB_CONNECTION_STRING)
  .then(() => console.log("mongodb connected!"))
  .catch(err => console.log("mongodb error", err));

let CORS_ACCESSIBLE_SITE = process.env.PROJ_DEPLOYED_FRONTEND_URL;

if (process.env.MODE === "development" || process.env.MODE === "dev") {
  CORS_ACCESSIBLE_SITE = "*";
}

const conn = new Server(Number(process.env.PROJ_SERVER_PORT), {
  cors: {
    origin: CORS_ACCESSIBLE_SITE,
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
