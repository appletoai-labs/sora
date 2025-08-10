const ChatSession = require("../models/ChatSession");
const { OpenAI } = require("openai");

// Initialize OpenAI directly with API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeRecentChats(userId) {
  const recentSessions = await ChatSession.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  if (!recentSessions.length) return "";

  let fullChatText = "";

  for (const session of recentSessions) {
    for (const msg of session.messages) {
      const prefix = msg.role === "user" ? "User:" : "Assistant:";
      fullChatText += `${prefix} ${msg.content}\n`;
    }
  }

  const limitedChatText = fullChatText.slice(0, 8000);

  const summaryPrompt = `Summarize the following conversation history in a detailed paragraph focusing on user concerns, themes, and assistant responses:\n\n${limitedChatText}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: summaryPrompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

module.exports = summarizeRecentChats;
