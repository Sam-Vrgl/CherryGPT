import express from "express";
import { startConversation, respondToConversation, endReccomendation } from "../controllers/chatController.js";
import { runAssistantThread } from "../controllers/reccController.js";

const router = express.Router();

router.post("/start", startConversation);
router.post("/respond", respondToConversation);
router.post("/end", endReccomendation);
router.post("/recommendation", runAssistantThread);

export default router;