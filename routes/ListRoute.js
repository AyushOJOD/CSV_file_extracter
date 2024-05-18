import express from "express";
import { createList } from "../controllers/ListController.js";

const router = express.Router();

router.post("/lists", createList);

export default router;
