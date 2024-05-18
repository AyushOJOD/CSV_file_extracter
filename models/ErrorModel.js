import mongoose from "mongoose";

const ErrorSchema = new mongoose.Schema({
  row: { type: Number, required: true },
  error: { type: String, required: true },
  list: { type: mongoose.Schema.Types.ObjectId, ref: "List" },
});

const ErrorRecord = mongoose.model("ErrorRecord", ErrorSchema);

export default ErrorRecord;
