// app.js

const PlanExecuteState = require("./state");
const { runWorkflow } = require("./workflow");

async function runAgent(objective) {
  const state = new PlanExecuteState(objective);
  const finalAnswer = await runWorkflow(state);
  return finalAnswer;
}

module.exports = { runAgent };
