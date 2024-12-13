// workflow.js

const { planStep, replanStep } = require("./planner");
const { executeStep } = require("./executor");
const { Langfuse } = require("langfuse");

let langfuse;

function createContext() {
  langfuse = new Langfuse({
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    baseUrl: process.env.LANGFUSE_BASE_URL,
  });

  return {
    trace: langfuse.trace({
      name: "inba-search-assistant-" + new Date().toISOString(),
    }),
  };
}

async function runWorkflow(state) {
  const context = createContext();

  // Plan
  state.plan = await planStep(state.input, context);
  state.currentStep = 0;

  while (!state.response) {
    console.log("==============");
    console.log(state);

    // Check if we've completed all steps
    if (state.currentStep >= state.plan.length) {
      // If no steps left, check if we're done
      const replanOut = await replanStep(state, context);
      if (replanOut.response) {
        state.response = replanOut.response;
        break;
      }
      if (replanOut.plan) {
        state.plan = replanOut.plan;
      }
      continue;
    }

    // Execute current step
    const currentStep = state.plan[state.currentStep];
    const result = await executeStep(currentStep, context);
    state.pastSteps.push([currentStep, result]);
    state.currentStep++;

    // Replan after each step
    const replanOut = await replanStep(state, context);
    if (replanOut.response) {
      state.response = replanOut.response;
      break;
    }

    // Update the plan with the new steps
    if (replanOut.plan) {
      state.plan = [
        ...state.plan.slice(0, state.currentStep),
        ...replanOut.plan,
      ];
    }
  }

  await langfuse.shutdownAsync();
  return state.response;
}

module.exports = { runWorkflow };
