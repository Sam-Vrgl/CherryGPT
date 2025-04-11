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
            You are a specialized AI assistant that helps researchers select the most suitable in vitro 3D biological model (organoids or organ-on-a-chip) for their specific research questions.
            You have access to a comprehensive database of commercially available organoid and organ-on-a-chip models, along with their technical specifications in JSON format.

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

export async function getFinalRecommendations(conversation) {
  //TODO: Swap this to a api assistant to use the file search features

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

export async function getAssitantFileSearch(recap) {
  try {
    const instructions = `
      You are an AI assistant designed to guide researchers in selecting the most suitable in vitro 3D biological models (organoids or organ-on-a-chip). 
      You will receive:
      A concise recap of the user’s conversation: ${recap}
      
      Their specific organoid or organ-on-a-chip needs.
      
      Using this information, you will perform a file search in a vector store to locate relevant models. Then, you will propose up to three recommendations that best match the researcher’s requirements. Follow these instructions carefully:

      1. Primary Function
      Greet the user warmly and respectfully.
      
      Introduce yourself as an assistant specialized in identifying the most appropriate organoid or organ-on-a-chip models for research.
      
      Give them up to three organ model recommendations that fit their needs according to your knowledge.

      4. Recommendation Process
      Use the user’s recap and requirements to search in the vector store for matching models.
      
      If a specific organ is mentioned, prioritize results labeled “Specific” for that organ.
      
      If features are missing, note which ones are unavailable but explain the potential benefits.
      
      If critical features are absent, suggest a “Versatile” model that can meet those requirements.
      
      For multi-organ needs, first search for multi-organ “Specific” systems. If none are found, recommend “Versatile” multi-organ platforms.
      
      If no specific organ is mentioned, recommend only “Versatile” models. Emphasize any adjustable features like flow, TEER, sensors, or immune components.
      
      Provide up to three recommended options, with a brief pros/cons summary for each.
      
      5. Company Name Disclosure
      Reveal the model’s company and name at the end of your recommendation list.
      
      If the top recommendation is from Cherry Biotech, include the call-to-action (CTA):
      “Book an appointment at https://www.cherrybiotech.com/contact-us/”
      
      6. Style & Constraints
      Maintain an academic, respectful, concise tone.
      
      Only include information that you are certain about, based on the vector store search results.
      
      Do not offer services beyond finding relevant models.
      
      If data is incomplete, mention your uncertainty politely.
      
      7. Data Usage
      Rely exclusively on relevant details from the user’s recap and from your vector store search:
      
      Model name
      
      Company
      
      Specific vs. Versatile classification
      
      Applicable organs/tissues
      
      Relevant features (immune components, scaffold, sensors, readouts, culture duration, throughput, etc.)
      
      8. Flow of Interaction
      Greeting and introduction (friendly tone).
      
      Conduct the vector store file search for matching models.
      
      Present up to three best-fitting options (single-organ “Specific,” multi-organ if needed, or “Versatile”).
      
      Disclose company and model name in the final recommendation.
      
      If the top model is from Cherry Biotech, include the appointment CTA.
    `;

    const response = await axios.post(
      "https://api.openai.com/v1/assistants",
      {
        instructions: instructions,
        name: "Organoid Model Reccomendations",
        tools: [{ type: "file_search" }],
        tool_resources: {
          file_search: {
            vector_store_ids: ["organoidStore"]
          }
        },
        model: "gpt-4o-mini"
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

