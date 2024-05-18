import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import ErrorRecord from "../models/ErrorModel.js";
import User from "../models/UserModel.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/lists/:listId/users", upload.single("file"), async (req, res) => {
  const users = [];
  const errors = [];
  const listId = req.params.listId;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      if (!data.name || !data.email || !data.city) {
        errors.push({
          row: users.length + 1,
          error: "Missing required fields",
        });
      } else {
        users.push({
          name: data.name,
          email: data.email,
          city: data.city,
          list: listId,
        });
      }
    })
    .on("end", async () => {
      try {
        await User.insertMany(users);
      } catch (error) {
        errors.push({ row: users.length, error: error.message });
      }

      fs.unlinkSync(req.file.path);

      if (errors.length > 0) {
        await ErrorRecord.insertMany(
          errors.map((err) => ({ ...err, list: listId }))
        );
        res.status(400).send({ errors });
      } else {
        res.status(201).send(users);
      }
    });
});

export default router;
