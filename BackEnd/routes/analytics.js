const express = require("express");
const DailyCheckin = require("../models/DailyCheckin");
const ChatSession = require("../models/ChatSession");
const auth = require("../middleware/auth");
const Checkin = require("../models/Checkin");

const router = express.Router();

// Define mappings to convert string values to numbers
const valueMapping = {
  mood: {
    very_low: 1,
    low: 2,
    neutral: 3,
    good: 4,
    very_good: 5,
  },
  energy: {
    very_low: 1,
    low: 2,
    neutral: 3,
    good: 4,
    very_good: 5,
  },
};

// Get user analytics dashboard
router.get("/dashboard", auth, async (req, res) => {
  try {
    const { timeframe = "30" } = req.query;
    const days = Number.parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // ✅ Get check-in data (correct field: `user`)
    const checkins = await Checkin.find({
      user: req.userId,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    const totalChatSessions = await ChatSession.countDocuments({ userId: req.userId })


    // Calculate average mood and energy from check-ins
    const totalCheckins = checkins.length;
    let moodSum = 0;
    let energySum = 0;

    checkins.forEach((c) => {
      moodSum += valueMapping.mood[c.mood] || 0;
      energySum += valueMapping.energy[c.energy] || 0;
    });

    const averageMood = totalCheckins > 0 ? moodSum / totalCheckins : 0;
    const averageEnergy = totalCheckins > 0 ? energySum / totalCheckins : 0;

    // Calculate insights
    const insights = {
      totalCheckins,
      averageMood,
      averageEnergy,
      totalChatSessions,
      commonSymptoms: getCommonSymptoms(checkins),
      moodTrend: getMoodTrend(checkins),
      streakDays: calculateStreak(checkins),
    };

    res.json({
      insights,
      checkins,
      timeframe: days,
    });
  } catch (error) {
    console.error("Analytics dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper: Common symptoms
function getCommonSymptoms(checkins) {
  const symptomCounts = {};
  checkins.forEach((checkin) => {
    if (checkin.symptoms && Array.isArray(checkin.symptoms)) {
      checkin.symptoms.forEach((symptom) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    }
  });

  return Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([symptom, count]) => ({ symptom, count }));
}

// Helper: Mood trend
function getMoodTrend(checkins) {
  if (checkins.length < 2) return "stable";

  const convertMood = (mood) => valueMapping.mood[mood] || 0;
  const recent = checkins.slice(-7);
  const older = checkins.slice(-14, -7);

  if (recent.length === 0 || older.length === 0) return "stable";

  const recentAvg = recent.reduce((sum, c) => sum + convertMood(c.mood), 0) / recent.length;
  const olderAvg = older.reduce((sum, c) => sum + convertMood(c.mood), 0) / older.length;

  const diff = recentAvg - olderAvg;
  if (diff > 0.5) return "improving";
  if (diff < -0.5) return "declining";
  return "stable";
}

// Helper: Streak calculation (✅ fixed `c.createdAt`)
function calculateStreak(checkins) {
  if (checkins.length === 0) return 0;

  let streak = 0;
  const today = new Date().setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today - i * 24 * 60 * 60 * 1000);
    const hasCheckin = checkins.some(
      (c) => new Date(c.createdAt).setHours(0, 0, 0, 0) === checkDate
    );
    if (hasCheckin) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

module.exports = router;
