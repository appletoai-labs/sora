const express = require("express");
const axios = require("axios");
const router = express.Router();
const ChatSession = require("../models/ChatSession"); // Adjust the path if needed
const auth = require("../middleware/auth");
const Insight = require("../models/insights");
const ResponseDB = require("../models/previousResponse"); // Adjust the path if needed
const summarizeRecentChats = require("../utils/summarizeSessions");
const User = require("../models/User"); // Adjust the path if needed
const generateSessionTitle = require("../utils/generateSessionTitle");
const { generatePatternsForSession } = require("../services/patternService");
const LastSession = require("../models/lastsession"); // Adjust the path if needed

// At the top of chatProxy.js
const { openai } = require('@ai-sdk/openai');
const { generateText } = require('ai');

// Ensure PYTHONSERVER_URL is set in .env
require("dotenv").config();
// Base URL for the Flask API
if (!process.env.PYTHONSERVER_URL) {
  throw new Error("PYTHONSERVER_URL is not defined in .env");
}

const FLASK_API_BASE = process.env.PYTHONSERVER_URL;

// Update last session for the logged-in user
router.post("/lastsession", auth, async (req, res) => {
  try {
    const { sessionId, isViewingPastSession } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    await LastSession.findOneAndUpdate(
      { userId: req.user.id },
      { sessionId, isViewingPastSession: !!isViewingPastSession },
      { upsert: true, new: true }
    );

    res.json({ message: "Last session updated successfully" });
  } catch (err) {
    console.error("Error updating last session:", err);
    res.status(500).json({ error: "Server error while updating last session" });
  }
});


router.post('/summary/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await ChatSession.findById(sessionId);

    if (!session || !session.messages || session.messages.length === 0) {
      return res.status(404).json({ error: 'Chat session not found or empty.' });
    }

    // Combine messages into one conversation string
    const conversationText = session.messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const prompt = `
    Summarize the following conversation between a user and an assistant in a helpful, concise, and human-readable format. Don't show it in user perspective, just summarize the conversation and say it like "you said" or "you mentioned" instead of "User said" or "User mentioned".Use you instead of User or User's name:

    ${conversationText}

    Summary:
    `;

    const result = await generateText({
      model: openai('gpt-4.1-mini'), // or gpt-3.5-turbo
      prompt,
      maxTokens: 300,
    });

    const summary = result.text;

    // Optionally store it in DB for future use
    session.summary = summary;
    session.insights = true;
    await session.save();

    return res.json({ summary });
  } catch (err) {
    console.error('Summary generation error:', err);
    return res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

router.get("/latest/responseid", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get latest response by created time (assuming _id order or timestamp is enough)
    const latestResponse = await ResponseDB.findOne({ userId })
      .sort({ _id: -1 }); // sort by creation time descending

    if (!latestResponse) {
      return res.status(404).json({ error: "No response found for user." });
    }

    return res.json({ previousResponseId: latestResponse.previousResponseId });
  } catch (error) {
    console.error("Error fetching latest response:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/chattrials", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      message,
      account_type,
      previous_response_id,
      session_id,
      session_type,
    } = req.body;

    let chatSession;
    if (session_id) {
      chatSession = await ChatSession.findById(session_id);
    } else {
      chatSession = await ChatSession.findOne({ userId, isActive: true }).sort({ createdAt: -1 });
    }

    // Check if chat session exists and message length > 5
    if (chatSession && chatSession.messages.length >= 5) {
      // Update user freeExperience flag to false
      await User.findByIdAndUpdate(userId, { isfreeTrial: false });

      return res.status(403).json({
        error: "Free trial message limit reached. Please upgrade to continue chatting.",
        status: 300, // Custom status code for free trial limit
      });
    }

    // If session does not exist or is under limit, proceed

    // ✨ Get summary of past context
    const contextSummary = await summarizeRecentChats(userId);

    // ✨ Include context summary in payload
    const flaskRes = await axios.post(`${FLASK_API_BASE}/api/chat`, {
      message,
      account_type,
      previous_response_id,
      session_id,
      session_type,
      context_summary: contextSummary, // New field
    });

    const botReply = flaskRes.data.message;
    const responseId = flaskRes.data.response_id;

    if (chatSession) {
      chatSession.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: botReply, ResponseId: responseId }
      );
    } else {
      const generatedTitle = await generateSessionTitle(botReply);
      console.log("Generated session title:", generatedTitle);
      chatSession = new ChatSession({
        userId,
        title: generatedTitle,
        sessionType: session_type || "general",
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: botReply, ResponseId: responseId },
        ],
      });
    }

    await chatSession.save();

    // Increment chat count for user (optional)
    await User.findByIdAndUpdate(userId, { $inc: { chatcount: 1 } });

    res.json({
      message: botReply,
      messageCount: chatSession.messages.length,
      chattitle: chatSession.title,
      response_id: responseId,
      session_id: chatSession._id,
    });
  } catch (error) {
    console.error("Proxy /chattrial error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to forward to SORA microservice or save chat" });
  }
});



router.post("/chat", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      message,
      account_type,
      previous_response_id,
      session_id,
      session_type,
    } = req.body;

    // ✨ Get summary of past context
    const contextSummary = await summarizeRecentChats(userId);

    // ✨ Include context summary in payload
    const flaskRes = await axios.post(`${FLASK_API_BASE}/api/chat`, {
      message,
      account_type,
      previous_response_id,
      session_id,
      session_type,
      context_summary: contextSummary, // New field
    });

    const botReply = flaskRes.data.message;
    const responseId = flaskRes.data.response_id;

    // 🧠 Store the latest previousResponseId
    await ResponseDB.findOneAndUpdate(
      { userId },
      { previousResponseId: responseId },
      { upsert: true, new: true }
    );

    let chatSession;
    if (session_id) {
      chatSession = await ChatSession.findById(session_id);
    } else {
      chatSession = await ChatSession.findOne({ userId, isActive: true }).sort({ createdAt: -1 });
    }

    if (chatSession) {
      // Push new messages
      chatSession.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: botReply, ResponseId: responseId }
      );

      // ✨ Update title dynamically (only if you want to allow changes later)
      chatSession.title =
        message?.slice(0, 50) ||
        botReply?.slice(0, 50) ||
        chatSession.title ||
        "New Chat";
    } else {
      console.log("Creating new chat session with message:", message);
      chatSession = new ChatSession({
        userId,
        // ✨ Title when creating new session
        title: message?.slice(0, 50) || botReply?.slice(0, 50) || "New Chat",
        sessionType: session_type || "general",
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: botReply, ResponseId: responseId },
        ],
      });
    }

    await chatSession.save();
    const messageCount = chatSession.messages.length;

    if (
      messageCount % 40 === 0 &&                       // Multiple of 20
      !chatSession.patternsGeneratedAt.includes(messageCount) // Not generated at this count before
    ) {
      try {
        const patterns = await generatePatternsForSession(userId, chatSession._id);
        chatSession.patternsGeneratedAt.push(messageCount); // Mark this milestone
        await chatSession.save();
        console.log(`✅ Patterns generated at ${messageCount} messages:`, patterns);
      } catch (patternErr) {
        console.error("⚠️ Auto pattern generation failed:", patternErr.message || patternErr);
      }
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { chatcount: 1 } },
      { new: true }
    );

    res.json({
      message: botReply,
      messageCount,
      chattitle: chatSession.title,
      response_id: responseId,
      session_id: chatSession._id,
    });
  } catch (error) {
    console.error("Proxy /chat error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to forward to SORA microservice or save chat" });
  }
});

router.get("/lastsession", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const lastSession = await LastSession.findOne({ userId }).populate("sessionId");
    if (!lastSession) {
      return res.status(404).json({ error: "No last session found" });
    }

    res.json({ sessionId: lastSession.sessionId._id, isViewingPastSession: lastSession.isViewingPastSession });
  } catch (err) {
    console.error("Get last session error:", err.message || err);
    res.status(500).json({ error: "Failed to fetch last session" });
  }
});

router.post("/chat/session", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Optionally mark other sessions inactive
    await ChatSession.updateMany({ userId }, { isActive: false });

    const session = new ChatSession({
      userId,
      sessionType: req.body.sessionType || "general",
      isActive: true,
      messages: [],
    });

    await session.save();

    res.status(201).json({ session_id: session._id });
  } catch (error) {
    console.error("Session creation error:", error.message);
    res.status(500).json({ error: "Failed to create new chat session" });
  }
});

router.get('/session/:id', auth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await ChatSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ messages: session.messages });
  } catch (err) {
    console.error('Failed to fetch session messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Proxy to Flask: /api/chat-history
router.get("/chat-history", async (req, res) => {
  try {
    const flaskRes = await axios.get(`${FLASK_API_BASE}/api/chat-history`, {
      params: req.query,
    });
    res.json(flaskRes.data);
  } catch (error) {
    console.error("Proxy /chat-history error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to forward to SORA microservice" });
  }
});

router.post("/session/end/:session_id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.session_id;

    // Mark session inactive
    const session = await ChatSession.findOneAndUpdate(
      { _id: sessionId, userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Active chat session not found" });
    }

    // ✅ Only generate patterns if there are messages
    if (session.messages && session.messages.length > 0) {
      try {
        const patterns = await generatePatternsForSession(userId, sessionId);
        console.log("✅ Patterns generated for session:", patterns);
      } catch (patternErr) {
        console.error("Pattern generation failed:", patternErr.message || patternErr);
      }
    } else {
      console.log(`⚠️ No messages in session ${sessionId}, skipping pattern generation.`);
    }

    res.json({ message: "Chat session ended successfully", session });
  } catch (err) {
    console.error("End session error:", err.message || err);
    res.status(500).json({ error: "Failed to end chat session" });
  }
});



router.post("/insight/:session_id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.session_id;

    const session = await ChatSession.findOne({ _id: sessionId, userId });

    if (!session) {
      return res.status(404).json({ error: "Chat session not found" });
    }

    // Format the chat history
    const messagesText = session.messages.map(msg => {
      return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`;
    }).join("\n");

    const prompt = `
You are **SORA**, a dedicated neurodivergent research companion.  
Your mission is to analyze the following chat history and produce highly personalized, research-oriented insights for the user’s **Neurodivergent Codex**.

---

## **Context & Role**
You are not just summarizing — you are *researching* the user’s unique mind.  
Every insight you provide becomes part of their lifelong self-knowledge archive, helping them understand their optimal conditions, sensory/emotional profile, communication style, and growth patterns.  
Maintain a supportive, validating, and celebratory tone. Write in a way that helps the user feel seen, understood, and proud of their progress.

---

## **Chat History**
${messagesText}

---

## **Instructions for Insight Generation**
Analyze the conversation as a monthly research report entry for the user’s codex.  
Your insights should:

1. **Highlight key moments of self-discovery** or important emotional reactions.
2. **Identify conditions that led to successes** or reduced challenges.
3. **Spot recurring patterns** and connect them to previous experiences or known neurodivergent research.
4. **Suggest environmental or social accommodations** tailored to the user’s patterns.
5. **Link findings to academic research** (ADHD, autism, sensory processing, executive function, etc.) where relevant.
6. Maintain **a positive, strengths-based framing** — no pathologizing, shaming, or clinical diagnosis.
7. **Be clear, structured, and easy to read**.

---

## **Required Output Format**
Respond with clearly labeled sections in this exact order:

### **Optimal Conditions**
Describe the settings, routines, or contexts in which the user seems to thrive.

### **Sensory & Emotional Profile**
Summarize sensory sensitivities, triggers, and emotional strengths or regulation strategies.

### **Communication Preferences**
Outline what communication styles help the user feel understood and which hinder clarity.

### **Growth & Breakthroughs**
Highlight any progress, mindset shifts, or successful coping strategies.

### **Areas for Further Research**
Suggest questions or themes for the user to explore next in their codex.

---

## **Tone & Style Guidelines**
- **Encouraging & Celebratory:** “This is a powerful insight for your research profile…”
- **Research-Oriented:** “Studies suggest that similar sensory profiles respond well to…”
- **Pattern-Connecting:** “This echoes something you mentioned in a previous conversation about…”
- **Strengths-Based:** Emphasize what works, not what’s “wrong.”
- **Actionable:** Provide concrete suggestions that the user can try or track.

---

Now, write the **full insight report** following the structure above.
`.trim();


    // Call OpenAI using ai-sdk
    const result = await generateText({
      model: openai("gpt-4.1-mini"),
      prompt,
      temperature: 0.7,
    });


    const insightText = result.text;


    const insightDoc = new Insight({
      sessionId,
      userId,
      summary: insightText,
      mainConcern: "",
      moodInsight: "",
      tags: []
    });

    await insightDoc.save();

    res.json({ insight: insightDoc, insightText });
  } catch (error) {
    console.error("Insight generation error:", error.message || error);
    res.status(500).json({ error: "Failed to generate insight" });
  }
});

router.get("/sessions/recent", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await ChatSession.find({ userId })
      .sort({ createdAt: -1 }) // recent first
      .select("_id title createdAt sessionType") // only needed fields

    res.json({ sessions });
  } catch (error) {
    console.error("Failed to fetch user chat sessions:", error.message);
    res.status(500).json({ error: "Failed to retrieve chat sessions" });
  }
});

router.get('/session/:id/last-response-id', auth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;

    const session = await ChatSession.findOne({ _id: sessionId, userId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Find the last assistant message (search in reverse)
    const messages = [...session.messages].reverse();
    const lastAssistantMessage = messages.find((msg) => msg.role === 'assistant' && msg.ResponseId);

    if (!lastAssistantMessage) {
      return res.status(404).json({ error: 'No assistant messages with ResponseId found' });
    }

    res.json({ responseId: lastAssistantMessage.ResponseId });
  } catch (error) {
    console.error("Error fetching last assistant ResponseId:", error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
