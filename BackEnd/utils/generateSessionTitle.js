const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSessionTitle(soraReply) {
  try {
    console.log("=== Generating Session Title ===");
    console.log("Sora Reply:", soraReply);

    const dialogue = `\nAssistant: ${soraReply}`;

    const prompt = `You are a helpful assistant that creates short, meaningful titles for chat sessions based on the conversation. The title should be 3 to 4 words max and clearly reflect the main topic or emotional tone of the interaction.

Here is the conversation:
${dialogue}

Respond only with the title, no quotation marks or punctuation.`;

    console.log("Generated Prompt:\n", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 10,
    });

    const title = response.choices[0].message.content.trim();

    console.log("Generated Title:", title);

    return title;
  } catch (err) {
    console.error("Title generation error:", err.message);
    return err.message ;
  }
}

module.exports = generateSessionTitle;
