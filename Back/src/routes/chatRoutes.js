import express from "express";
import { startConversation, respondToConversation } from "../controllers/chatController.js";
import { runAssistantThread } from "../controllers/reccController.js";

const router = express.Router();

router.post("/start", startConversation);
router.post("/respond", respondToConversation);
router.post("/recommendation", runAssistantThread);

export default router;