// chatService.js

import axios from "axios";
import { config } from "../config/envConfig.js";

export async function getAIResponse(conversation) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
            You are a specialized AI assistant that helps researchers select the most suitable in vitro 3D biological model (organoids or organ-on-a-chip) for their specific research questions. You have access to a comprehensive database of commercially available organoid and organ-on-a-chip models, along with their technical specifications in JSON format.

            You must strictly comply with the following guidelines:

            1. Primary function
            Greet the user in a friendly, respectful tone.

            Introduce yourself briefly as an assistant specialized in guiding researchers to the most relevant organoid or organ-on-a-chip model.

            Always begin by asking: “What is your research question?” to confirm whether an organoid or organ-on-a-chip approach suits their needs.

            2. Relevance Check
            Determine whether an organoid/organ-on-a-chip approach is relevant to the user’s research question. If not relevant, politely explain why and do not recommend a model.

            3. Clarifying User Intent
            Explicitly clarify whether the user prioritizes:
             - Single-organ specificity
             - Versatile features
             - Multi-organ interactions

            Ask targeted, follow-up questions to confirm:
             - Target organ(s)/tissue(s) if specified
             - Disease or physiological context
             - Desired readouts (live imaging, TEER, supernatant sampling, biosensors, etc.)
             - Culture duration and throughput requirements
             - Immune component requirements (resident vs. circulating)
             - Single- vs. multi-organ interactions
            `
          },
          // Map the conversation so that user messages have `role: "user"`,
          // and AI messages have `role: "assistant"`.
          ...conversation.map(msg => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.message
          }))
        ],
        max_tokens: 1000
      },
      {
        headers: { Authorization: `Bearer ${config.OPENAI_API_KEY}` }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "I'm sorry, I couldn't process your request.";
  }
}

/**
 * getFinalRecommendations:
 * 1. Gathers the entire conversation (already passed in as an argument).
 * 2. Asks the AI to summarize the user's main research requirements.
 * 3. Recommends the most suitable organoid or organ-on-a-chip model based on those needs.
 */
export async function getFinalRecommendations(conversation) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
            You are an advanced AI specialized in recommending 3D in vitro models for research. 
            The user has provided a conversation describing their needs, research question, 
            and preferences. Summarize the user's requirements in bullet points, then propose 
            the most suitable organoid or organ-on-a-chip model with justification. 

            If organoids or organ-on-a-chip models are not relevant, politely decline to provide 
            a recommendation. Otherwise, ensure your final response includes:
            - A concise summary of the user's key requirements.
            - A specific recommendation of one or more organoid or organ-on-a-chip models,
              referencing known commercial platforms if appropriate.
            - A brief justification for why this model fits their research context.
            `
          },
          ...conversation.map(msg => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.message
          })),
          {
            role: "user",
            content:
              "Please provide your final recommendations and reasoning in a concise manner."
          }
        ],
        max_tokens: 5000
      },
      {
        headers: {
          Authorization: `Bearer ${config.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error in final recommendations:", error);
    return "I couldn't process the final recommendation. Please try again later.";
  }
}
