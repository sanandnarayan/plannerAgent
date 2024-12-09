// Import the tavilySearchResults function
const { tavilySearchResults } = require("./tools.js");

// Demo function to run the search
async function runSearchDemo() {
  console.log("Starting search demo...\n");

  try {
    // Example search query
    const query = "When was codebrahma founded?";
    console.log(`Searching for: "${query}"\n`);

    // Call the search function
    const results = await tavilySearchResults(query);

    // Display results
    console.log(`Found ${results.length} results:\n`);
    results.forEach((result, index) => {
      console.log(`Result ${index + 1}:`);
      console.log(`Title: ${result.title}`);
      console.log(`URL: ${result.url}`);
      console.log(`Content: ${result.content.substring(0, 150)}...`); // Show first 150 chars
      console.log("-------------------\n");
    });
  } catch (error) {
    console.error("Error in demo:", error);
  }
}

// Run the demo
runSearchDemo();
