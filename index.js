import express from "express";
import { connectDB } from "./data/database.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // Add this import
import listRouter from "./routes/ListRoute.js";
import userRouter from "./routes/addUserRoute.js";
import mailRouter from "./routes/sendMailRoute.js";
import unsubscribeRouter from "./routes/unsubscribeRoute.js";

dotenv.config();

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/api/list", listRouter);
app.use("/api/user", userRouter);
app.use("/api/mail", mailRouter);
app.use("/api/unsubscribe", unsubscribeRouter);
app.use("/api/check", (req, res) => res.send("Server is running"));

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

connectDB().catch((err) => console.log(err));
