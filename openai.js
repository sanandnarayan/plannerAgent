// openai.js

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

async function callOpenAIChat(messages, functions) {
  // messages: [{role: 'system'|'user'|'assistant', content: '...'}]
  // functions: optional array of { name, description, parameters }

  const payload = {
    model: "gpt-4-0613",
    messages: messages,
    temperature: 0,
  };

  if (functions && functions.length > 0) {
    payload.functions = functions;
  }

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    throw new Error(`OpenAI API error: ${resp.status} ${await resp.text()}`);
  }

  const data = await resp.json();
  return data;
}

// A helper to invoke a function call if OpenAI decides to call a function.
async function handleFunctionCalls(response, toolFunctions) {
  // If function call present
  const choice = response.choices[0];
  if (choice.finish_reason === "function_call") {
    const fnCall = choice.message.function_call;
    const fnName = fnCall.name;
    const args = JSON.parse(fnCall.arguments || "{}");

    const tool = toolFunctions.find((t) => t.name === fnName);
    if (!tool) {
      throw new Error(`No tool found for function ${fnName}`);
    }

    const result = await tool.execute(args);
    // Return result as assistant's response
    return { role: "assistant", content: result };
  } else {
    // Normal response
    return choice.message;
  }
}

module.exports = { callOpenAIChat, handleFunctionCalls };
