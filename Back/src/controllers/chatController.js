// src/controllers/conversationController.js
import { getAIResponse } from "../services/chatService.js";

const sessions = {}; // In-memory session store (replace with database for persistence)

export function startConversation(req, res) {
    const sessionId = req.body.sessionId;
    if (!sessionId) {
        return res.status(400).json({ error: "Session ID required." });
    }

    sessions[sessionId] = { step: 0, conversation: [] };
    res.json({ message: "What aspects of organoid research interest you the most?" });
}

export async function respondToConversation(req, res) {
    const { sessionId, userResponse } = req.body;
    if (!sessionId || !userResponse) {
        return res.status(400).json({ error: "Session ID and user response required." });
    }

    const session = sessions[sessionId];
    if (!session) {
        return res.status(400).json({ error: "Invalid session. Start a new conversation." });
    }

    session.conversation.push({ user: userResponse });

    if (session.step >= 5) {
        delete sessions[sessionId];
        return res.json({ message: "Thank you for completing the conversation!" });
    }

    const nextQuestion = await getAIResponse(session.conversation);
    session.step++;
    res.json({ message: nextQuestion });
}