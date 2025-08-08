const express = require("express")
const auth = require("../middleware/auth")
const ChatSession = require("../models/ChatSession")
const Insight = require("../models/insights")
const Pattern = require("../models/patterns")
const { generateCodexReport , generateBrainInsights } = require("../services/researchService")
const { getAcademicConnections, searchAcademicReferences, saveAcademicConnection } = require("../services/academicService")
const Checkin = require("../models/Checkin")

const router = express.Router()

// Get conversation count
router.get("/stats/conversations", auth, async (req, res) => {
  try {
    const count = await ChatSession.countDocuments({ userId: req.userId })
    res.json({ count })
  } catch (error) {
    console.error("Error fetching conversation count:", error)
    res.status(500).json({ message: "Failed to fetch conversation count" })
  }
})

// Get insight count
router.get("/stats/insights", auth, async (req, res) => {
  try {
    const count = await Insight.countDocuments({ userId: req.userId })
    res.json({ count })
  } catch (error) {
    console.error("Error fetching insight count:", error)
    res.status(500).json({ message: "Failed to fetch insight count" })
  }
})

// Get check-in count
router.get("/stats/checkins", auth, async (req, res) => {
  try {
    const count = await Checkin.countDocuments({ user: req.user._id });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching check-in count:", error);
    res.status(500).json({ message: "Failed to fetch check-in count" });
  }
});


// Get pattern count
router.get("/stats/patterns", auth, async (req, res) => {
  try {
    const count = await Pattern.countDocuments({ userId: req.userId })
    res.json({ count })
  } catch (error) {
    console.error("Error fetching pattern count:", error)
    res.status(500).json({ message: "Failed to fetch pattern count" })
  }
})

// Get all insights for a user
router.get("/insights", auth, async (req, res) => {
  try {
    const insights = await Insight.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(insights)
  } catch (error) {
    console.error("Error fetching insights:", error)
    res.status(500).json({ message: "Failed to fetch insights" })
  }
})

// Get all patterns for a user
router.get("/patterns", auth, async (req, res) => {
  try {
    const patterns = await Pattern.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(patterns)
  } catch (error) {
    console.error("Error fetching patterns:", error)
    res.status(500).json({ message: "Failed to fetch patterns" })
  }
})

// Generate Personal Codex Report
router.get("/generate-codex-report", auth, async (req, res) => {
  try {
    const userId = req.userId
    const pdfBuffer = await generateCodexReport(userId)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=SORA_Neurodivergent_Codex.pdf")
    res.send(pdfBuffer)
  } catch (error) {
    console.error("Error generating codex report:", error)
    res.status(500).json({ message: "Failed to generate report." })
  }
})

// Get Brain Insights Dashboard data
router.get("/brain-insights", auth, async (req, res) => {
  try {
    const userId = req.userId
    const insightsData = await generateBrainInsights(userId)
    res.json(insightsData)
  } catch (error) {
    console.error("Error generating brain insights:", error)
    res.status(500).json({ message: "Failed to generate brain insights." })
  }
})

// Academic Search Route
router.get("/academic-search", auth, async (req, res) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.status(400).json({ message: "Search query is required." })
    }
    const searchResults = await searchAcademicReferences(query)
    res.json(searchResults)
  } catch (error) {
    console.error("Error performing academic search:", error)
    res.status(500).json({ message: "Failed to perform academic search." })
  }
})

// Get Saved Academic Connections
router.get("/academic-connections", auth, async (req, res) => {
  try {
    const connections = await getAcademicConnections(req.userId)
    res.json(connections)
  } catch (error) {
    console.error("Error fetching academic connections:", error)
    res.status(500).json({ message: "Failed to fetch academic connections." })
  }
})

// Save Academic Connection
router.post("/academic-connections", auth, async (req, res) => {
  try {
    const { title, summary, authors, sourceUrl } = req.body
    if (!title || !summary) {
      return res.status(400).json({ message: "Title and summary are required to save an academic connection." })
    }
    const newConnection = await saveAcademicConnection(req.userId, { title, summary, authors, sourceUrl })
    res.status(201).json(newConnection)
  } catch (error) {
    console.error("Error saving academic connection:", error)
    res.status(500).json({ message: "Failed to save academic connection." })
  }
})

module.exports = router
