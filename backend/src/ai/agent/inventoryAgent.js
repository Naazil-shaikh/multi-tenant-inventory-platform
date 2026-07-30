// // This file should contain everything related to the LLM itself.no req, res.
import { createAgent, tool } from "langchain";
import * as z from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { INVENTORY_SYSTEM_PROMPT } from "../prompts/inventory.prompt.js";

const apiKey = process.env.GEMINI_API_KEY;

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});

console.log(model.model);

// const agent = createAgent({
//   model: "google-genai:gemini-2.5-flash-lite",
//   tools: [getWeather,  ],
// });

// console.log(
//   await agent.invoke({
//     messages: [
//       { role: "user", content: "What's the weather in San Francisco?" },
//     ],
//   })
// );
export async function invokeInventoryAgent({ message, tools }) {
  const agent = createAgent({
    model,
    tools,
    systemPrompt: INVENTORY_SYSTEM_PROMPT,
  });

  const response = await agent.invoke({
    messages: [
      {
        role: "user",

        content: message,
      },
    ],
  });
  const finalMessage = response.messages.at(-1);

  return finalMessage.content;
}
