require("dotenv").config();

// tools.js
const tavily_api_key = process.env.TAVILY_API_KEY;

// Simulated search tool function. In real scenario, call your search API.
async function tavilySearchResults(query) {
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        api_key: tavily_api_key,
        query: query,
        search_depth: "basic",
        max_results: 5,
      }),
    });

    const data = await response.json();

    // Return results in the specified format
    return data.results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.content,
    }));
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

module.exports = { tavilySearchResults };
