import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  properties: { type: Map, of: String },
  createdAt: { type: Date, default: Date.now },
});

export const List = new mongoose.model("List", ListSchema);
