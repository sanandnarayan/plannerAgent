// run.js

const { runAgent } = require("./app");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt user for objective
rl.question("Please enter your objective: ", (objective) => {
  // Run the agent with user's objective
  runAgent(objective)
    .then((answer) => {
      console.log("Final Answer:", answer);
      rl.close(); // Close the readline interface
    })
    .catch((err) => {
      console.error("Error:", err);
      rl.close(); // Close the readline interface
    });
});
