import { getRecommendations } from '../services/reccService.js';

export const runAssistantThread = async (req, res, next) => {
    try {
        const recap = req.body.recap;
        if (!recap) {
            return res.status(400).json({ error: "Missing 'recap' in request body" });
        }
        const assistantReply = await getRecommendations(recap);
        res.json({ reply: assistantReply });
    } catch (error) {
        next(error);
    }
};
