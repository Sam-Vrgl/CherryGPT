import express from "express";
import { startConversation, respondToConversation, endReccomendation } from "../controllers/chatController.js";

const router = express.Router();

router.post("/start", startConversation);
router.post("/respond", respondToConversation);
router.post("/end", endReccomendation);

export default router;