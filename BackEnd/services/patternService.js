const ChatSession = require("../models/ChatSession");
const Pattern = require("../models/patterns");
const { openai } = require("@ai-sdk/openai");
const { generateText } = require("ai");

const formatResponse = (text) => {
  if (!text) return '';

  // Escape HTML to avoid XSS attacks
  text = text.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  // Remove text inside [...] or 【...】
  text = text.replace(/\[.*?\]|\u3010.*?\u3011/g, '');

  // Handle code blocks (```lang\n...\n```)
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'plaintext'}">${code}</code></pre>`;
  });

  // Inline code (`code`)
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headings (#, ##, ###...)
  text = text.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
  text = text.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
  text = text.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
  text = text.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.*)$/gm, '<h1>$1</h1>');

  // Bold (**text**)
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic (*text* or _text_)
  text = text.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

  // Underline (__text__)
  text = text.replace(/__(.*?)__/g, '<u>$1</u>');

  // Links [text](url)
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Blockquotes (> text)
  text = text.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');

  // Numbered lists
  text = text.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');

  // Bullet lists (- item or * item)
  text = text.replace(/^(-|\*)\s+(.*)$/gm, '<li>$2</li>');
  text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  // Replace double newlines with paragraph breaks
  text = text.replace(/\n\s*\n/g, '</p><p>');

  // Replace single newlines with <br>
  text = text.replace(/\n/g, '<br>');

  // Wrap in paragraph if not already HTML
  if (!/^<.+>$/.test(text.trim())) {
    text = `<p>${text}</p>`;
  }

  return text;
};


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
  // Pattern generation prompt
  const prompt = `
You are SORA — a neurodivergent research companion helping build the user's personal "Neurodivergent Codex".
Your mission is to identify meaningful, evidence-informed patterns in the user’s behaviors, emotions, and context
based on their latest chat session — but only if there are truly clear and notable patterns. 
Avoid generic or filler observations.

You have access to:
- Past patterns (their existing codex entries)
- The current conversation session

---
PAST PATTERNS:
${oldPatternsText || "No past patterns available."}

---
CURRENT SESSION CHAT:
${messagesText}

---

📜 **Instructions for Pattern Detection**:
1. Review the current chat session closely.
2. Compare with past patterns — only add new insights if they are not already fully captured in previous entries.
3. Only record patterns if there is clear recurring evidence in this conversation (behavior, mood, triggers, style, etc.).
4. Skip output entirely if there are no meaningful new patterns.
5. When describing patterns:
   - Use supportive, research-focused language.
   - Write as if contributing to their personal codex.
   - Connect current observations to past patterns when relevant.
6. Organize patterns in a clear bullet-point or numbered list under thematic categories:
   - Emotional and Mood Trends
   - Triggers & Environmental Factors
   - Communication Style Preferences
   - Energy Patterns & Social Comfort Zones
   - Coping Strategies & Accommodations
7. End with a short **"Research Note"** explaining why these patterns might be important for understanding their brain.

---
🎯 **Output Format Example**:
If new patterns exist:
"""
## New Patterns Detected

### Emotional and Mood Trends
- You consistently express relief after solo activities following intense social interactions.

### Triggers & Environmental Factors
- Crowded spaces appear to lower your energy quickly.

### Communication Style Preferences
- You tend to appreciate direct, concise responses when feeling tired.

**Research Note:** These patterns suggest that post-social recovery time is essential for maintaining well-being. Aligns with past findings on sensory and social fatigue.
"""

If no meaningful new patterns exist:
"""
No new patterns were detected in this session.
"""
`.trim();


  // Generate patterns
  const result = await generateText({
    model: openai("gpt-4.1-mini"),
    prompt,
    temperature: 0.7,
  });

  let patternsText = result.text;

  // Don't save if no new patterns were detected
  if (/^no new patterns were detected/i.test(patternsText)) {
    return "No new patterns detected in this session.";
  }

  patternsText = formatResponse(patternsText);

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
