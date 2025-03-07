import { getAIResponse } from "../services/chatService.js";

export async function startConversation(req, res) {
  const sessionId = req.body.sessionId;
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID required." });
  }
  const db = req.app.locals.db;

  try {
    await db.run(
      `INSERT INTO sessions (sessionId, step) VALUES (?, ?)`,
      [sessionId, 0]
    );
    res.json({ message: "What aspects of organoid research interest you the most?" });
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

    if (session.step >= 5) {
      await db.run(`DELETE FROM sessions WHERE sessionId = ?`, [sessionId]);
      return res.json({ message: "Thank you for completing the conversation!" });
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
