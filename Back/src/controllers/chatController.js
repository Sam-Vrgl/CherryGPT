import { getAIResponse } from "../services/chatService.js";
import { getFinalRecommendations } from "../services/chatService.js";

export async function startConversation(req, res) {
  const { sessionId, firstName, lastName, email } = req.body;
  
  if (!sessionId || !firstName || !lastName || !email) {
    return res.status(400).json({ error: "Session ID, firstName, lastName, and email are required." });
  }
  
  const db = req.app.locals.db;

  try {
    await db.run(
      `INSERT INTO sessions (sessionId, firstName, lastName, email, step) VALUES (?, ?, ?, ?, ?)`,
      [sessionId, firstName, lastName, email, 0]
    );
    res.json({ message: "Hello and Welcome to the Organoid reccomendation tool, what kind of organ would you like to know more about today?" });
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ error: "Failed to start session." });
  }
}


export async function respondToConversation(req, res) {
  const { sessionId, userResponse } = req.body;
  if (!sessionId || !userResponse) {
    return res.status(400).json({ error: "Session ID and user response required." });
  }
  const db = req.app.locals.db;

  try {
    const session = await db.get(`SELECT * FROM sessions WHERE sessionId = ?`, [sessionId]);
    if (!session) {
      return res.status(400).json({ error: "Invalid session. Start a new conversation." });
    }

    await db.run(
      `INSERT INTO conversation (sessionId, role, message) VALUES (?, ?, ?)`,
      [sessionId, 'user', userResponse]
    );

    if (session.step >= 4) {
      const conversation = await db.all(
        `SELECT role, message FROM conversation WHERE sessionId = ? ORDER BY createdAt ASC`,
        [sessionId]
      );

      const finalReply = await getFinalRecommendations(conversation);

      await db.run(
        `INSERT INTO conversation (sessionId, role, message) VALUES (?, ?, ?)`,
        [sessionId, 'ai', finalReply]
      );

      return res.json({ message: finalReply });
    } else {

      const conversation = await db.all(
        `SELECT role, message FROM conversation WHERE sessionId = ? ORDER BY createdAt ASC`,
        [sessionId]
      );

      const nextQuestion = await getAIResponse(conversation);

      await db.run(
        `INSERT INTO conversation (sessionId, role, message) VALUES (?, ?, ?)`,
        [sessionId, 'ai', nextQuestion]
      );

      await db.run(
        `UPDATE sessions SET step = step + 1 WHERE sessionId = ?`,
        [sessionId]
      );

      res.json({ message: nextQuestion });
    }
  } catch (error) {
    console.error("Error handling conversation:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
