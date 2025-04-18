import axios from "axios";
import { config } from "../config/envConfig.js";
import OpenAI from "openai";
import { create } from "domain";


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key. Set the OPENAI_API_KEY environment variable.");
}
if (!ASSISTANT_ID) {
    throw new Error("Missing Assistant ID. Set the OPENAI_ASSISTANT_ID environment variable.");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function getRecommendations(recap) {

    //create a new thread
    const thread = await openai.beta.threads.create();

    //create a new message in the thread with the user prompt
    await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: recap.toString(),
    });

    let run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: ASSISTANT_ID,
    });

    const start = Date.now();
    const timeout = 300000; // 5 minutes
    while (run.status !== "completed" && run.status !== "failed" && Date.now() - start < timeout) {
        // wait 1 second before polling again
        await new Promise((resolve) => setTimeout(resolve, 1000));
        run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    if (run.status === "failed") {
        throw new Error("Assistant run failed");
    }
    if (run.status !== "completed") {
        throw new Error("Assistant run did not complete in time");
    }

    // 5. Retrieve messages and find the assistant's reply
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find((m) => m.role === "assistant");
    if (!assistantMessage || !assistantMessage.content?.[0]?.text?.value) {
        throw new Error("No assistant message found");
    }
    return assistantMessage.content[0].text.value;
}


export async function fullConversationTest(sessionID) {
    const thread = await openai.beta.threads.create();
    

}

