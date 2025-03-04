import axios from "axios";
import { config } from "../config/envConfig.js";

export async function getAIResponse(conversation) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are an AI assistant conducting a 6-question conversation with a scientist interested in starting organoid research. Your first question should ask for an overview of their interest, and follow-up questions should depend on their responses."
                     },
                    ...conversation.map(msg => ({ role: "user", content: msg.user }))
                ],
                max_tokens: 150
            },
            {
                headers: { "Authorization": `Bearer ${config.OPENAI_API_KEY}` }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return "I'm sorry, I couldn't process your request.";
    }
}