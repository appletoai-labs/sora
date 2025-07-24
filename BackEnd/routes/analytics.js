const express = require("express")
const DailyCheckin = require("../models/DailyCheckin")
const ChatSession = require("../models/ChatSession")
const auth = require("../middleware/auth")

const router = express.Router()

// Get user analytics dashboard
router.get("/dashboard", auth, async (req, res) => {
  try {
    const { timeframe = "30" } = req.query
    const days = Number.parseInt(timeframe)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get check-in data
    const checkins = await DailyCheckin.find({
      userId: req.userId,
      date: { $gte: startDate },
    }).sort({ date: 1 })

    // Get chat session data
    const chatSessions = await ChatSession.find({
      userId: req.userId,
      createdAt: { $gte: startDate },
    })

    // Calculate insights
    const insights = {
      totalCheckins: checkins.length,
      averageMood: checkins.length > 0 ? checkins.reduce((sum, c) => sum + c.mood, 0) / checkins.length : 0,
      averageEnergy: checkins.length > 0 ? checkins.reduce((sum, c) => sum + c.energy, 0) / checkins.length : 0,
      totalChatSessions: chatSessions.length,
      commonSymptoms: getCommonSymptoms(checkins),
      moodTrend: getMoodTrend(checkins),
      streakDays: calculateStreak(checkins),
    }

    res.json({
      insights,
      checkins,
      timeframe: days,
    })
  } catch (error) {
    console.error("Analytics dashboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper functions
function getCommonSymptoms(checkins) {
  const symptomCounts = {}
  checkins.forEach((checkin) => {
    checkin.symptoms.forEach((symptom) => {
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
    })
  })

  return Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([symptom, count]) => ({ symptom, count }))
}

function getMoodTrend(checkins) {
  if (checkins.length < 2) return "stable"

  const recent = checkins.slice(-7)
  const older = checkins.slice(-14, -7)

  if (recent.length === 0 || older.length === 0) return "stable"

  const recentAvg = recent.reduce((sum, c) => sum + c.mood, 0) / recent.length
  const olderAvg = older.reduce((sum, c) => sum + c.mood, 0) / older.length

  const diff = recentAvg - olderAvg

  if (diff > 0.5) return "improving"
  if (diff < -0.5) return "declining"
  return "stable"
}

function calculateStreak(checkins) {
  if (checkins.length === 0) return 0

  let streak = 0
  const today = new Date().setHours(0, 0, 0, 0)

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today - i * 24 * 60 * 60 * 1000)
    const hasCheckin = checkins.some((c) => new Date(c.date).getTime() === checkDate.getTime())

    if (hasCheckin) {
      streak++
    } else {
      break
    }
  }

  return streak
}

module.exports = router
