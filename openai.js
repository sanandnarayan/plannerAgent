// openai.js

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

async function callOpenAIChat(messages, options = {}) {
  // messages: [{role: 'system'|'user'|'assistant'|'function', content: '...'}]
  // options: { functions, function_call } for function calling

  const payload = {
    model: "gpt-4-0613",
    messages: messages,
    temperature: 0,
  };

  // Add function calling options if provided
  if (options.functions) {
    payload.functions = options.functions;
  }
  if (options.function_call) {
    payload.function_call = options.function_call;
  }

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`OpenAI API error: ${resp.status} ${errorText}`);
    }

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}

module.exports = { callOpenAIChat };
