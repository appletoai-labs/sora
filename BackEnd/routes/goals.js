const express = require("express")
const Goal = require("../models/Goal")
const Achievement = require("../models/Achievement")
const UserProgress = require("../models/UserProgress")
const DailyCheckin = require("../models/DailyCheckin")
const auth = require("../middleware/auth")

const router = express.Router()

// Predefined achievements
const PREDEFINED_ACHIEVEMENTS = [
  {
    title: "Getting Started",
    description: "Complete your first micro-goal",
    requirement: 1,
    icon: "🎯",
    category: "milestone",
  },
  {
    title: "Building Momentum",
    description: "Complete goals for 3 days in a row",
    requirement: 3,
    icon: "🔥",
    category: "streak",
  },
  {
    title: "Week Warrior",
    description: "Complete goals for 7 days in a row",
    requirement: 7,
    icon: "⚡",
    category: "streak",
  },
  {
    title: "Rising Star",
    description: "Reach level 5",
    requirement: 5,
    icon: "⭐",
    category: "level",
  },
  {
    title: "Goal Achiever",
    description: "Reach level 10",
    requirement: 10,
    icon: "🏆",
    category: "level",
  },
  {
    title: "Community Friend",
    description: "Make 5 community posts or comments",
    requirement: 5,
    icon: "👥",
    category: "social",
  },
  {
    title: "Self-Care Champion",
    description: "Complete 10 sensory break goals",
    requirement: 10,
    icon: "💚",
    category: "self-care",
  },
  {
    title: "Task Master",
    description: "Complete 20 task breakdown goals",
    requirement: 20,
    icon: "📋",
    category: "productivity",
  },
]

// Initialize user progress and achievements
const initializeUserProgress = async (userId) => {
  try {
    let userProgress = await UserProgress.findOne({ userId })

    if (!userProgress) {
      userProgress = new UserProgress({ userId })
      await userProgress.save()
    }

    // Initialize achievements if they don't exist
    const existingAchievements = await Achievement.find({ userId })

    if (existingAchievements.length === 0) {
      const achievements = PREDEFINED_ACHIEVEMENTS.map((achievement) => ({
        ...achievement,
        userId,
      }))

      await Achievement.insertMany(achievements)
    }

    return userProgress
  } catch (error) {
    console.error("Error initializing user progress:", error)
    throw error
  }
}

// Check and unlock achievements
const checkAchievements = async (userId, userProgress) => {
  try {
    const achievements = await Achievement.find({ userId, isUnlocked: false })
    const newlyUnlocked = []

    for (const achievement of achievements) {
      let shouldUnlock = false

      switch (achievement.category) {
        case "milestone":
          if (achievement.title === "Getting Started" && userProgress.goalsCompleted >= 1) {
            shouldUnlock = true
          }
          break
        case "streak":
          if (userProgress.dayStreak >= achievement.requirement) {
            shouldUnlock = true
          }
          break
        case "level":
          if (userProgress.level >= achievement.requirement) {
            shouldUnlock = true
          }
          break
        case "self-care":
          // Count self-care related goals completed
          const selfCareGoals = await Goal.countDocuments({
            userId,
            isCompleted: true,
            category: { $in: ["self-care", "wellness"] },
          })
          if (selfCareGoals >= achievement.requirement) {
            shouldUnlock = true
          }
          break
        case "productivity":
          // Count productivity related goals completed
          const productivityGoals = await Goal.countDocuments({
            userId,
            isCompleted: true,
            category: "productivity",
          })
          if (productivityGoals >= achievement.requirement) {
            shouldUnlock = true
          }
          break
      }

      if (shouldUnlock) {
        achievement.isUnlocked = true
        achievement.unlockedAt = new Date()
        await achievement.save()
        newlyUnlocked.push(achievement)
      }
    }

    return newlyUnlocked
  } catch (error) {
    console.error("Error checking achievements:", error)
    return []
  }
}

// Get all goals for user
router.get("/usergoals", auth, async (req, res) => {
  try {
    await initializeUserProgress(req.userId)

    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 })

    // Goal Completion Score
    let completedCount = 0
    let totalCount = goals.length
    goals.forEach(goal => {
      if (goal.status === "completed" || goal.isCompleted) {
        completedCount += 1
      }
    })
    const goalScore = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    // Daily Check-ins - Last 7 Entries
    const checkins = await DailyCheckin.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(7)

    // Score mapping
    const scaleMap = {
      very_low: 1,
      low: 2,
      neutral: 3,
      good: 4,
      very_good: 5,
      very_high: 5,
      high: 4,
      moderate: 3,
      mild: 2,
      none: 5,
      severe: 1,
      poor: 2,
      fair: 3,
      good: 4,
      excellent: 5,
      very_poor: 1,
    }

    // Aggregate scores from check-ins
    let checkinScoreSum = 0
    let checkinEntries = 0

    checkins.forEach(entry => {
      const fields = ["mood", "energy", "anxiety", "focus", "sleepQuality", "sensoryOverload"]
      fields.forEach(field => {
        const value = entry[field]
        if (value && scaleMap[value] !== undefined) {
          checkinScoreSum += scaleMap[value]
          checkinEntries += 1
        }
      })
    })

    const checkinScore = checkinEntries > 0 ? (checkinScoreSum / checkinEntries) * 20 : 0 // Scaled to 100

    // Final wellness score: weighted average (adjust weights as needed)
    const wellnessScore = Math.round((goalScore * 0.4 + checkinScore * 0.6))

    res.json({
      success: true,
      goals,
      wellnessScore,
    })
  } catch (error) {
    console.error("Error fetching goals and wellness score:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new goal
router.post("/addgoal", auth, async (req, res) => {
  try {
    const { title, description, difficulty, priority, category } = req.body

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" })
    }

    const goal = new Goal({
      userId: req.userId,
      title: title.trim(),
      description: description.trim(),
      difficulty: difficulty || "EASY",
      priority: priority || "MEDIUM",
      category: category || "personal",
    })

    await goal.save()

    res.status(201).json({
      success: true,
      goal,
      message: "Goal created successfully",
    })
  } catch (error) {
    console.error("Error creating goal:", error)
    res.status(500).json({ message: "Server error" })
  }
})


// Create new goal
router.post("/creategoal", auth, async (req, res) => {
  try {
    const { title, description, difficulty, priority, category } = req.body

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" })
    }

    const goal = new Goal({
      userId: req.userId,
      title: title.trim(),
      description: description.trim(),
      difficulty: difficulty || "EASY",
      priority: priority || "MEDIUM",
      category: category || "personal",
    })

    await goal.save()

    res.status(201).json({
      success: true,
      goal,
      message: "Goal created successfully",
    })
  } catch (error) {
    console.error("Error creating goal:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Complete a goal
router.put("/:goalId/complete", auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.goalId, userId: req.userId })

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    if (goal.isCompleted) {
      return res.status(400).json({ message: "Goal already completed" })
    }

    // Mark goal as completed
    goal.isCompleted = true
    goal.completedAt = new Date()
    await goal.save()

    // Update user progress
    let userProgress = await UserProgress.findOne({ userId: req.userId })
    if (!userProgress) {
      userProgress = await initializeUserProgress(req.userId)
    }

    userProgress.totalXP += goal.xpReward
    userProgress.coins += goal.coinReward
    userProgress.goalsCompleted += 1
    userProgress.updateStreak()

    await userProgress.save()

    // Check for new achievements
    const newAchievements = await checkAchievements(req.userId, userProgress)

    res.json({
      success: true,
      message: "Goal completed successfully",
      xpEarned: goal.xpReward,
      coinsEarned: goal.coinReward,
      progress: {
        level: userProgress.level,
        totalXP: userProgress.totalXP,
        coins: userProgress.coins,
        dayStreak: userProgress.dayStreak,
        goalsCompleted: userProgress.goalsCompleted,
        xpToNextLevel: userProgress.getXPToNextLevel(),
        currentLevelXP: userProgress.getCurrentLevelXP(),
      },
      newAchievements,
    })
  } catch (error) {
    console.error("Error completing goal:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user achievements
router.get("/achievements", auth, async (req, res) => {
  try {
    await initializeUserProgress(req.userId)

    const achievements = await Achievement.find({ userId: req.userId }).sort({ createdAt: 1 })

    res.json({
      success: true,
      achievements,
    })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user progress
router.get("/progress", auth, async (req, res) => {
  try {
    let userProgress = await UserProgress.findOne({ userId: req.userId })

    if (!userProgress) {
      userProgress = await initializeUserProgress(req.userId)
    }

    res.json({
      success: true,
      progress: {
        level: userProgress.level,
        totalXP: userProgress.totalXP,
        coins: userProgress.coins,
        dayStreak: userProgress.dayStreak,
        goalsCompleted: userProgress.goalsCompleted,
        longestStreak: userProgress.longestStreak,
        xpToNextLevel: userProgress.getXPToNextLevel(),
        currentLevelXP: userProgress.getCurrentLevelXP(),
      },
    })
  } catch (error) {
    console.error("Error fetching user progress:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a goal
router.delete("/:goalId", auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.goalId, userId: req.userId })

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    res.json({
      success: true,
      message: "Goal deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting goal:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a goal
router.put("/:goalId", auth, async (req, res) => {
  try {
    const { title, description, difficulty, priority, category, isActive } = req.body

    const goal = await Goal.findOne({ _id: req.params.goalId, userId: req.userId })

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    if (goal.isCompleted) {
      return res.status(400).json({ message: "Cannot update completed goal" })
    }

    // Update fields
    if (title) goal.title = title.trim()
    if (description) goal.description = description.trim()
    if (difficulty) goal.difficulty = difficulty
    if (priority) goal.priority = priority
    if (category) goal.category = category
    if (typeof isActive === "boolean") goal.isActive = isActive

    await goal.save()

    res.json({
      success: true,
      goal,
      message: "Goal updated successfully",
    })
  } catch (error) {
    console.error("Error updating goal:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
