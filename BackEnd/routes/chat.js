const express = require("express")
const ChatSession = require("../models/ChatSession")
const auth = require("../middleware/auth")

const router = express.Router()

// Get user's chat sessions
router.get("/sessions", auth, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.userId }).sort({ updatedAt: -1 }).limit(20)

    res.json(sessions)
  } catch (error) {
    console.error("Get chat sessions error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new chat session
router.post("/sessions", auth, async (req, res) => {
  try {
    const { title, sessionType } = req.body

    const session = new ChatSession({
      userId: req.userId,
      title: title || "New Conversation",
      sessionType: sessionType || "general",
    })

    await session.save()
    res.status(201).json(session)
  } catch (error) {
    console.error("Create chat session error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add message to session
router.post("/sessions/:sessionId/messages", auth, async (req, res) => {
  try {
    const { sessionId } = req.params
    const { role, content, metadata } = req.body

    const session = await ChatSession.findOne({
      _id: sessionId,
      userId: req.userId,
    })

    if (!session) {
      return res.status(404).json({ message: "Session not found" })
    }

    session.messages.push({
      role,
      content,
      metadata: metadata || {},
    })

    await session.save()
    res.json(session)
  } catch (error) {
    console.error("Add message error:", error)
    res.status(500).json({ message: "Server error" })
  }
})



module.exports = router
