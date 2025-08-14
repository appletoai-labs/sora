const ChatSession = require("../models/ChatSession")
const Insight = require("../models/insights")
const Pattern = require("../models/patterns")
const { generateText } = require("ai")
const { openai } = require("@ai-sdk/openai")

const PDFDocument = require("pdfkit")
const Checkin = require("../models/Checkin")

async function generateCodexReport(userId) {
  // Fetch user data
  const chatSessions = await ChatSession.find({ userId }).sort({ createdAt: -1 }).limit(50);
  const insights = await Insight.find({ userId }).sort({ createdAt: -1 }).limit(20);
  const patterns = await Pattern.find({ userId }).sort({ createdAt: -1 }).limit(10);
  const dailyCheckins = await Checkin.find({ userId }).sort({ createdAt: -1 }).limit(30);

  // Prepare data
  const chatSummaries = chatSessions.map(session => ({
    title: session.title,
    summary: session.summary,
    messages: session.messages.map(msg => `${msg.role}: ${msg.content}`).join("\n"),
    type: session.sessionType,
    createdAt: session.createdAt,
  }));

  const insightSummaries = insights.map(insight => ({
    summary: insight.summary,
    mainConcern: insight.mainConcern,
    moodInsight: insight.moodInsight,
    tags: insight.tags,
    createdAt: insight.createdAt,
  }));

  const patternTexts = patterns.map(pattern => ({
    text: pattern.patternsText,
    createdAt: pattern.createdAt,
  }));

  const checkinData = dailyCheckins.map(checkin => ({
    mood: checkin.mood,
    energyLevel: checkin.energyLevel,
    focusLevel: checkin.focusLevel,
    sensoryInput: checkin.sensoryInput,
    notes: checkin.notes,
    createdAt: checkin.createdAt,
  }));

  // Calculate months for subtitle
  let months = 0;
  if (chatSessions.length > 0) {
    const firstSessionDate = new Date(chatSessions[chatSessions.length - 1].createdAt);
    const lastSessionDate = new Date(chatSessions[0].createdAt);
    months = Math.ceil((lastSessionDate - firstSessionDate) / (1000 * 60 * 60 * 24 * 30.44));
  }

  // Updated prompt — force numeric section format
  const prompt = `
Generate a "Personal Neurodivergent Codex" report based on the following data.
Output must have sections numbered 1–11, with each section starting with "<number>. <Section Name>:".
Do NOT use any markdown formatting — plain text only.

User's Chat Sessions (recent 50):
${JSON.stringify(chatSummaries, null, 2)}

User's Insights (recent 20):
${JSON.stringify(insightSummaries, null, 2)}

User's Patterns (recent 10):
${JSON.stringify(patternTexts, null, 2)}

User's Daily Check-ins (recent 30):
${JSON.stringify(checkinData, null, 2)}

Report Structure:
1. Title:
2. Subtitle:
3. Introduction:
4. Key Themes & Concerns:
5. Behavioral Patterns & Triggers:
6. Communication Style Insights:
7. Sensory Profile Observations:
8. Personalized Strategies & Recommendations:
9. Strengths & Unique Abilities:
10. Next Steps & Resources:
11. Disclaimer:
`;

  const { text: reportContent } = await generateText({
    model: openai("gpt-4.1-mini"),
    prompt,
    temperature: 0.7,
  });

  // PDF Generation
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const soraTeal = "#00CED1";

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  // Header
  doc.fillColor(soraTeal).fontSize(24).font("Helvetica-Bold")
    .text("Your Personal Neurodivergent Codex", { align: "center" });
  doc.moveDown(0.5);
  doc.fillColor("#8B949E").fontSize(12).font("Helvetica")
    .text(`Generated from ${chatSessions.length} conversations over ${months} months`, { align: "center" });
  doc.moveDown(1);

  // Date
  doc.fillColor("#8B949E").fontSize(10).text(`Date Generated: ${new Date().toLocaleDateString()}`, { align: "right" });
  doc.moveDown(1);

  // Parse AI output into sections
  const sections = reportContent
    .split(/\n(?=\d+\.\s)/) // split at "1. ", "2. " etc.
    .map(s => s.trim())
    .filter(Boolean);

  sections.forEach((section, idx) => {
    const lines = section.split("\n").filter(Boolean);
    const headingLine = lines[0];
    const heading = headingLine.replace(/^\d+\.\s*/, "").trim();
    const body = lines.slice(1).join("\n").trim();

    // Heading style
    doc.moveDown(0.8);
    doc.fillColor(soraTeal).fontSize(16).font("Helvetica-Bold").text(heading);

    // Body style — BLACK text now
    if (body) {
      doc.moveDown(0.3);
      doc.fillColor("#000000").fontSize(11).font("Helvetica")
        .text(body, { align: "left", lineGap: 3 });
    }

    // Separator between sections
    if (idx < sections.length - 1) {
      doc.moveDown(0.5);
      doc.strokeColor("#333").lineWidth(0.5)
        .moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
    }
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
}



async function generateBrainInsights(userId) {
  const chatSessions = await ChatSession.find({ userId }).sort({ createdAt: -1 }).limit(10)
  const insights = await Insight.find({ userId }).sort({ createdAt: -1 }).limit(5)
  const patterns = await Pattern.find({ userId }).sort({ createdAt: -1 }).limit(3)
  const dailyCheckins = await Checkin.find({ userId }).sort({ createdAt: -1 }).limit(7)

  const chatData = chatSessions.map(session => ({
    title: session.title,
    summary: session.summary,
    messages: session.messages.map(msg => `${msg.role}: ${msg.content}`).join("\n"),
    createdAt: session.createdAt,
  }))

  const insightData = insights.map(insight => ({
    summary: insight.summary,
    mainConcern: insight.mainConcern,
    moodInsight: insight.moodInsight,
    tags: insight.tags,
    createdAt: insight.createdAt,
  }))

  const patternData = patterns.map(pattern => ({
    text: pattern.patternsText,
    createdAt: pattern.createdAt,
  }))

  const checkinData = dailyCheckins.map(checkin => ({
    mood: checkin.mood,
    energyLevel: checkin.energyLevel,
    focusLevel: checkin.focusLevel,
    sensoryInput: checkin.sensoryInput,
    notes: checkin.notes,
    createdAt: checkin.createdAt,
  }))

  const prompt = `Based on the following user data, generate a concise "Brain Insights Dashboard" summary.
  Provide insights for "Optimal Times", "Sensory Profile", and "Communication Patterns".
  Format the output as a JSON object with three arrays: "optimalTimes", "sensoryProfile", and "communicationPatterns".
  Each array should contain bullet points as strings. If data is insufficient, state "No clear patterns yet." or similar.

  User's Recent Chat Sessions:
  ${JSON.stringify(chatData, null, 2)}

  User's Recent Insights:
  ${JSON.stringify(insightData, null, 2)}

  User's Recent Patterns:
  ${JSON.stringify(patternData, null, 2)}

  User's Recent Daily Check-ins:
  ${JSON.stringify(checkinData, null, 2)}

  Example Output Structure:
  {
    "optimalTimes": [
      "Creative work: Tuesday/Thursday 2-4pm",
      "Social interactions: Monday mornings",
      "Recharge periods: Friday afternoons"
    ],
    "sensoryProfile": [
      "Seeking: Deep pressure, white noise",
      "Avoiding: Fluorescent lights, sudden sounds",
      "Neutral: Various textures, background music"
    ],
    "communicationPatterns": [
      "Direct, pattern-based conversations",
      "Prefers academic explanations",
      "Responds well to visual information"
    ]
  }
  `

  try {
  const { text } = await generateText({
    model: openai("gpt-4.1-mini"),
    prompt: prompt,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  // Remove ```json ... ``` fences if present
  const cleanedText = text
    .replace(/```json\s*/, '')  // remove ```json at start
    .replace(/\s*```$/, '');    // remove trailing ```

  return JSON.parse(cleanedText);
} catch (error) {
  console.error("Error generating brain insights with OpenAI:", error);
  // Return default empty data if AI generation fails
  return {
    optimalTimes: ["No clear patterns yet."],
    sensoryProfile: ["No clear patterns yet."],
    communicationPatterns: ["No clear patterns yet."],
  };
}

}

function cleanOpenAIJsonResponse(text) {
  // Remove ```json ... ``` fences
  let cleaned = text.trim();

  // Remove code fences and language hints
  cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');

  // Sometimes OpenAI wraps with ``` (no json), remove those too
  cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

  return cleaned;
}

module.exports = {
  generateCodexReport,
  generateBrainInsights,
}
