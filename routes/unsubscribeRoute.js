import express from "express";
import User from "../models/UserModel.js";

const router = express.Router();

router.get("/unsubscribe/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    await User.findByIdAndDelete(userId);
    res.send({ message: "You have been unsubscribed" });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
