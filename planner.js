// planner.js

const { callOpenAIChat } = require("./openai");
const { availableFunctions } = require("./executor");

// Helper function to generate tools description for system message
function generateToolsDescription() {
  let toolsDesc =
    "When creating the plan, keep in mind that the execution agent has access to the following tools:\n\n";

  // Use the actual function definitions from executor.js
  Object.entries(availableFunctions).forEach(([key, tool], index) => {
    toolsDesc += `${index + 1}. ${tool.name}: ${tool.description}\n`;
    if (tool.parameters?.properties) {
      toolsDesc += `   Parameters:\n`;
      Object.entries(tool.parameters.properties).forEach(
        ([paramName, paramDetails]) => {
          toolsDesc += `   - ${paramName}: ${paramDetails.description}\n`;
        }
      );
    }
  });

  toolsDesc +=
    "\nMake sure your plan effectively utilizes these available tools when needed. Break down steps in a way that can leverage these capabilities.";
  return toolsDesc;
}

async function planStep(objective) {
  const systemMessage = {
    role: "system",
    content: `You are a planner. Given an objective, return a step by step plan as a JSON object { "steps": [ "step 1", "step 2" ] } with no extra commentary.

${generateToolsDescription()}`,
  };
  const userMessage = { role: "user", content: objective };

  const resp = await callOpenAIChat([systemMessage, userMessage]);
  const msg = resp.choices[0].message.content;

  // Attempt to parse JSON
  let plan;
  try {
    plan = JSON.parse(msg);
  } catch {
    // fallback if not well-formed
    plan = { steps: [] };
  }
  return plan.steps || [];
}

async function replanStep(state) {
  const systemMessage = {
    role: "system",
    content: `You are a planner. Given the original objective, the original plan, and the steps done, update the plan. 
If no more steps are needed, return {"response":"in the value write the final answer to the users initial question"}.
Otherwise return {"steps":["new step1","new step2"]}.

${generateToolsDescription()}`,
  };

  const userMessage = {
    role: "user",
    content: `Objective: ${state.input}\n\nOriginal Plan:\n${state.plan.join(
      "\n"
    )}\n\nExecuted Steps:\n${state.pastSteps
      .map((p) => p[0] + ": " + p[1])
      .join("\n")}`,
  };

  const resp = await callOpenAIChat([systemMessage, userMessage]);
  const msg = resp.choices[0].message.content;

  let output;
  try {
    output = JSON.parse(msg);
  } catch {
    output = { steps: [] };
  }

  if (output.response) {
    // final answer
    return { response: output.response };
  }
  if (output.steps) {
    return { plan: output.steps };
  }
  return { plan: [] };
}

module.exports = { planStep, replanStep };
