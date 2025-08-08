const ChatSession = require("../models/ChatSession")
const Insight = require("../models/insights")
const Pattern = require("../models/patterns")
const { generateText } = require("ai")
const { openai } = require("@ai-sdk/openai")

const PDFDocument = require("pdfkit")
const Checkin = require("../models/Checkin")

async function generateCodexReport(userId) {
  // Fetch user data
  const chatSessions = await ChatSession.find({ userId }).sort({ createdAt: -1 }).limit(50) // Limit to recent 50 sessions
  const insights = await Insight.find({ userId }).sort({ createdAt: -1 }).limit(20) // Limit to recent 20 insights
  const patterns = await Pattern.find({ userId }).sort({ createdAt: -1 }).limit(10) // Limit to recent 10 patterns
  const dailyCheckins = await Checkin.find({ userId }).sort({ createdAt: -1 }).limit(30) // Limit to recent 30 checkins

  // Prepare data for OpenAI
  const chatSummaries = chatSessions.map((session) => ({
    title: session.title,
    summary: session.summary,
    messages: session.messages.map(msg => `${msg.role}: ${msg.content}`).join("\n"),
    type: session.sessionType,
    createdAt: session.createdAt,
  }))

  const insightSummaries = insights.map((insight) => ({
    summary: insight.summary,
    mainConcern: insight.mainConcern,
    moodInsight: insight.moodInsight,
    tags: insight.tags,
    createdAt: insight.createdAt,
  }))

  const patternTexts = patterns.map((pattern) => ({
    text: pattern.patternsText,
    createdAt: pattern.createdAt,
  }))

  const checkinData = dailyCheckins.map((checkin) => ({
    mood: checkin.mood,
    energyLevel: checkin.energyLevel,
    focusLevel: checkin.focusLevel,
    sensoryInput: checkin.sensoryInput,
    notes: checkin.notes,
    createdAt: checkin.createdAt,
  }))

  const prompt = `Generate a "Personal Neurodivergent Codex" report based on the following user data.
  The report should be comprehensive, empathetic, and actionable, focusing on understanding and working with the user's neurodivergent profile.
  Structure the report with clear sections as described below. Use a friendly, supportive tone.

  User's Chat Sessions (recent 50):
  ${JSON.stringify(chatSummaries, null, 2)}

  User's Insights (recent 20):
  ${JSON.stringify(insightSummaries, null, 2)}

  User's Patterns (recent 10):
  ${JSON.stringify(patternTexts, null, 2)}

  User's Daily Check-ins (recent 30):
  ${JSON.stringify(checkinData, null, 2)}

  Report Structure:
  1.  **Title:** "Your Personal Neurodivergent Codex"
  2.  **Subtitle:** "Generated from [X] conversations over [X] months" (Calculate X based on chatSessions data)
  3.  **Introduction:** An empathetic welcome, explaining the purpose of the report.
  4.  **Key Themes & Concerns:** Summarize recurring topics, challenges, and emotional states from chat sessions and insights.
  5.  **Behavioral Patterns & Triggers:** Analyze patterns from check-ins and patterns data, identifying common triggers, energy fluctuations, and focus trends.
  6.  **Communication Style Insights:** Based on chat interactions, provide observations on communication preferences or challenges.
  7.  **Sensory Profile Observations:** From check-ins, highlight any recurring sensory sensitivities or preferences.
  8.  **Personalized Strategies & Recommendations:**
      *   Suggest actionable strategies tailored to the identified themes, patterns, and sensory profile.
      *   Include tips for managing overwhelm, improving focus, and enhancing well-being.
      *   Reference specific insights or patterns where relevant.
  9.  **Strengths & Unique Abilities:** Highlight positive aspects of their neurodivergent profile.
  10. **Next Steps & Resources:** Encourage continued engagement with SORA and suggest relevant tools or external resources.
  11. **Disclaimer:** A brief note that this report is for informational purposes and not a substitute for professional advice.

  Format the output as plain text, using clear headings and bullet points. Do not include any markdown formatting that would interfere with PDF generation.
  `

  const { text: reportContent } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
    temperature: 0.7,
  })

  // Calculate months for subtitle
  let months = 0
  if (chatSessions.length > 0) {
    const firstSessionDate = new Date(chatSessions[chatSessions.length - 1].createdAt)
    const lastSessionDate = new Date(chatSessions[0].createdAt)
    months = Math.ceil((lastSessionDate.getTime() - firstSessionDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  }

  // PDF Generation using pdfkit
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    info: {
      Title: "SORA Personal Neurodivergent Codex",
      Author: "SORA AI",
    },
  })

  const buffers = []
  doc.on("data", buffers.push.bind(buffers))
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers)
    // Resolve the promise with the buffer
  })

  // Define colors based on the theme
  const soraTeal = "#00CED1" // Example: A bright teal
  const soraOrange = "#FF8C00" // Example: A vibrant orange
  const soraDark = "#1A1D21" // Example: Dark background
  const soraCard = "#262A2E" // Example: Card background

  // Helper function to add styled text
  const addStyledText = (text, options = {}) => {
    doc.fillColor(options.color || "#E1E5E9").font(options.font || "Helvetica").fontSize(options.fontSize || 10).text(text, options.x, options.y, options.textOptions)
  }

  // Header
  doc.fillColor(soraTeal).fontSize(28).font("Helvetica-Bold").text("Your Personal Neurodivergent Codex", { align: "center" })
  doc.moveDown(0.5)
  doc.fillColor("#8B949E").fontSize(14).font("Helvetica").text(`Generated from ${chatSessions.length} conversations over ${months} months`, { align: "center" })
  doc.moveDown(2)

  // Add a line separator
  doc.strokeColor(soraTeal).lineWidth(1).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke()
  doc.moveDown(1)

  // Date Generated
  doc.fillColor("#8B949E").fontSize(10).text(`Date Generated: ${new Date().toLocaleDateString()}`, { align: "right" })
  doc.moveDown(1)

  // Parse and add report content
  const sections = reportContent.split(/\n(?=\d+\.\s\*\*)/).filter(Boolean) // Split by numbered bold headings

  sections.forEach((section) => {
    const lines = section.split("\n").filter(Boolean)
    if (lines.length === 0) return

    let heading = lines[0].replace(/^\d+\.\s\*\*(.*?)\*\*$/, "$1").trim()
    let content = lines.slice(1).join("\n").trim()

    // Special handling for the "Introduction" section to ensure it's always present and styled
    if (heading.includes("Introduction")) {
      doc.moveDown(1)
      doc.fillColor(soraTeal).fontSize(18).font("Helvetica-Bold").text(heading)
      doc.moveDown(0.5)
      doc.fillColor("#C9D1D9").fontSize(11).font("Helvetica").text(content)
      doc.moveDown(1)
    } else {
      doc.moveDown(1)
      doc.fillColor(soraTeal).fontSize(18).font("Helvetica-Bold").text(heading)
      doc.moveDown(0.5)
      doc.fillColor("#C9D1D9").fontSize(11).font("Helvetica").text(content)
      doc.moveDown(1)
    }
  })

  // Footer
  doc.moveDown(2)
  doc.fillColor("#8B949E").fontSize(9).text("This report is for informational purposes only and is not a substitute for professional medical or psychological advice. Always consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health or well-being.", { align: "center" })

  doc.end()

  return new Promise((resolve) => {
    const buffers = []
    doc.on("data", buffers.push.bind(buffers))
    doc.on("end", () => {
      resolve(Buffer.concat(buffers))
    })
  })
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
    model: openai("gpt-4o"),
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
