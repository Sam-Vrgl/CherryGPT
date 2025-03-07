import axios from "axios";
import { config } from "../config/envConfig.js";

export async function getAIResponse(conversation) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are an AI assistant conducting a 5 to 6 question conversation with a scientist or biologist interested in using organoids for their research research. Your first question should ask for an overview of their interest, and follow-up questions should depend on their responses. Your goal by the end of the conversation is to be able to orient them towards specific organoid models and companies that best fit their needs."
                        //objectif: volume, niveau de complexite, quel type de cellules, micro env ou non, organes, cancer etc
                        //
                     },
                    ...conversation.map(msg => ({ role: "user", content: msg.message }))
                ],
                max_tokens: 150
            },
            {
                headers: { "Authorization": `Bearer ${config.OPENAI_API_KEY}` }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error getting AI response:", error);
        return "I'm sorry, I couldn't process your request.";
    }
}