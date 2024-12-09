// workflow.js

const { planStep, replanStep } = require("./planner");
const { executeStep } = require("./executor");

async function runWorkflow(state) {
  // Plan
  state.plan = await planStep(state.input);

  while (!state.response) {
    if (state.plan.length === 0) {
      // If no steps, replan
      const replanOut = await replanStep(state);
      if (replanOut.response) {
        state.response = replanOut.response;
        break;
      }
      if (replanOut.plan) {
        state.plan = replanOut.plan;
      }
    }

    if (state.plan.length > 0) {
      const currentStep = state.plan[0];
      const result = await executeStep(currentStep);
      state.pastSteps.push([currentStep, result]);
      state.plan.shift(); // remove done step
    }

    if (state.plan.length === 0 && !state.response) {
      const replanOut = await replanStep(state);
      if (replanOut.response) {
        state.response = replanOut.response;
      } else if (replanOut.plan) {
        state.plan = replanOut.plan;
      }
    }
  }

  return state.response;
}

module.exports = { runWorkflow };
