// executor.js

const { callOpenAIChat } = require("./openai");
const { tavilySearchResults } = require("./tools");

async function executeStep(step) {
  // We'll prompt the model with the step, and if it decides to use the tool, we do so.
  const systemMessage = {
    role: "system",
    content:
      "You are an execution agent that can use tools if needed. If you need to search, think 'I should use the search tool' and then do so.",
  };
  const userMessage = { role: "user", content: step };

  // First call LLM to see if we need a tool:
  const initialResp = await callOpenAIChat([systemMessage, userMessage]);

  let content = initialResp.choices[0].message.content || "";
  // Heuristics: if model says something like "I should search..."
  // In real scenario, you'd do function calling. Here we just do a naive approach:
  if (content.toLowerCase().includes("search")) {
    // Extract query from content heuristically
    // For simplicity, let's assume the model wrote: "I should search for 'X'"
    const match = content.match(/search for ['"](.*?)['"]/i);
    let query = match ? match[1] : step;
    const results = await tavilySearchResults(query);

    // Give results back to the model and ask for final answer:
    const toolMessage = {
      role: "system",
      content: `Search results:\n${results
        .map((r) => `${r.title}: ${r.content}`)
        .join("\n")}`,
    };

    const finalResp = await callOpenAIChat([
      systemMessage,
      userMessage,
      toolMessage,
    ]);
    content = finalResp.choices[0].message.content || "";
  }

  return content.trim();
}

module.exports = { executeStep };
