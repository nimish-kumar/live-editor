import { Schema, model } from "mongoose";

const Document = new Schema({
  _id: String,
  data: Object,
});

export default model("Document", Document);
