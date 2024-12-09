// state.js
module.exports = class PlanExecuteState {
  constructor(input) {
    this.input = input || "";
    this.plan = [];
    this.pastSteps = [];
    this.response = null;
  }
};
