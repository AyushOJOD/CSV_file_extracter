import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import ErrorRecord from "../models/ErrorModel.js";
import User from "../models/UserModel.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/lists/:listId/users", upload.single("file"), async (req, res) => {
  const results = [];
  const errors = [];
  const listId = req.params.listId;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      for (let i = 0; i < results.length; i++) {
        try {
          if (!results[i].name || !results[i].email || !results[i].city) {
            throw new Error("Missing required fields");
          }

          const user = new User({
            name: results[i].name,
            email: results[i].email,
            city: results[i].city,
            list: listId,
          });

          c;
          await user.save();
        } catch (error) {
          errors.push({ row: i + 1, error: error.message });
        }
      }

      fs.unlinkSync(req.file.path);

      if (errors.length > 0) {
        await ErrorRecord.insertMany(
          errors.map((err) => ({ ...err, list: listId }))
        );
        res.status(400).send({ errors });
      } else {
        res.status(201).send(results);
      }
    });
});

export default router;
