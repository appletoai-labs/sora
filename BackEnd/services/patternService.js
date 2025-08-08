const ChatSession = require("../models/ChatSession");
const Pattern = require("../models/patterns");
const { openai } = require("@ai-sdk/openai");
const { generateText } = require("ai");

async function generatePatternsForSession(userId, sessionId) {
  // Get finished session
  const session = await ChatSession.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new Error("Chat session not found");
  }

  // Get all old patterns for user
  const oldPatternsDocs = await Pattern.find({ userId }).sort({ createdAt: 1 });
  const oldPatternsText = oldPatternsDocs.map(p => p.patternsText).join("\n\n");

  // Format chat history
  const messagesText = session.messages
    .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n");

  // Pattern generation prompt
  const prompt = `
You are SORA, a neurodivergent research companion.

Your task is to analyze the current chat session and detect recurring behavioral, emotional, and contextual patterns.  
Also use the past patterns to improve accuracy.

---

PAST PATTERNS:
${oldPatternsText || "No past patterns available."}

---

CURRENT SESSION CHAT:
${messagesText}

---

Identify and describe patterns in:
- Emotional responses and mood trends over time
- Environmental or situational triggers
- Communication style preferences
- Energy fluctuations and social comfort zones
- Coping strategies or accommodations mentioned

Write findings as if contributing to the user's "neurodivergent codex", using supportive research-focused language.
`.trim();

  // Generate patterns
  const result = await generateText({
    model: openai("gpt-4"),
    prompt,
    temperature: 0.7,
  });

  const patternsText = result.text;

  // Save new patterns
  const patternDoc = new Pattern({
    userId,
    sessionId,
    patternsText,
  });

  await patternDoc.save();

  return patternsText;
}

module.exports = { generatePatternsForSession };
