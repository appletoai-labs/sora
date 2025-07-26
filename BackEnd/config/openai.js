const { OpenAI } = require("openai");

// Initialize OpenAI with your API key (use environment variable for security)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = { openai };
