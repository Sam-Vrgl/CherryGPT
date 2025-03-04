import express from "express";
import { startConversation, respondToConversation } from "../controllers/chatController.js";

const router = express.Router();

router.post("/start", startConversation);
router.post("/respond", respondToConversation);

export default router;