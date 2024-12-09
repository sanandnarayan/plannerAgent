// run.js

const { runAgent } = require("./app");

// Example objective:
const objective = "what is the hometown of the 2024 Australian open winner?";

runAgent(objective)
  .then((answer) => {
    console.log("Final Answer:", answer);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
