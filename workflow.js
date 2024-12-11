// workflow.js

const { planStep, replanStep } = require("./planner");
const { executeStep } = require("./executor");

async function runWorkflow(state) {
  // Plan
  state.plan = await planStep(state.input);
  state.currentStep = 0;

  while (!state.response) {
    console.log("==============");
    console.log(state);

    // Check if we've completed all steps
    if (state.currentStep >= state.plan.length) {
      // If no steps left, check if we're done
      const replanOut = await replanStep(state);
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
    const result = await executeStep(currentStep);
    state.pastSteps.push([currentStep, result]);
    state.currentStep++;

    // Replan after each step
    const replanOut = await replanStep(state);
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

  return state.response;
}

module.exports = { runWorkflow };
