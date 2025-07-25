const express = require("express")
const router = express.Router()
const Goal = require("../models/Goal")
const Achievement = require("../models/Achievement")
const UserProgress = require("../models/UserProgress")
const auth = require("../middleware/auth")

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
const initializeUserData = async (userId) => {
  try {
    // Create user progress if it doesn't exist
    let userProgress = await UserProgress.findOne({ userId })
    if (!userProgress) {
      userProgress = new UserProgress({ userId })
      await userProgress.save()
    }

    // Create predefined achievements if they don't exist
    for (const achievementData of PREDEFINED_ACHIEVEMENTS) {
      const existingAchievement = await Achievement.findOne({
        userId,
        title: achievementData.title,
      })

      if (!existingAchievement) {
        const achievement = new Achievement({
          ...achievementData,
          userId,
        })
        await achievement.save()
      }
    }

    return userProgress
  } catch (error) {
    console.error("Error initializing user data:", error)
    throw error
  }
}

// Get all goals for a user
router.get("/usergoals", auth, async (req, res) => {
  try {
    await initializeUserData(req.user.id)

    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 })

    res.json({ goals })
  } catch (error) {
    console.error("Error fetching goals:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new goal
router.post("/creategoal", auth, async (req, res) => {
  try {
    const { title, description, difficulty, priority, category } = req.body

    // Calculate rewards based on difficulty
    const rewards = {
      EASY: { xp: 10, coins: 5 },
      MEDIUM: { xp: 25, coins: 15 },
      HARD: { xp: 50, coins: 30 },
    }

    const reward = rewards[difficulty] || rewards.EASY

    const goal = new Goal({
      userId: req.user.id,
      title,
      description,
      difficulty,
      priority,
      category,
      xpReward: reward.xp,
      coinReward: reward.coins,
    })

    await goal.save()
    res.status(201).json({ goal })
  } catch (error) {
    console.error("Error creating goal:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Complete a goal
router.put("/:goalId/complete", auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.goalId,
      userId: req.user.id,
    })

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
    let userProgress = await UserProgress.findOne({ userId: req.user.id })
    if (!userProgress) {
      userProgress = await initializeUserData(req.user.id)
    }

    const oldLevel = userProgress.level
    userProgress.totalXP += goal.xpReward
    userProgress.coins += goal.coinReward
    userProgress.goalsCompleted += 1

    // Calculate new level
    const newLevel = Math.floor(userProgress.totalXP / 100) + 1
    userProgress.level = newLevel

    // Update streak
    const today = new Date()
    const lastActivity = userProgress.lastActivityDate
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      userProgress.dayStreak += 1
    } else if (daysDiff > 1) {
      userProgress.dayStreak = 1
    }

    userProgress.lastActivityDate = today
    await userProgress.save()

    // Check for new achievements
    const newAchievements = await checkAchievements(req.user.id, userProgress)

    res.json({
      message: "Goal completed successfully",
      xpEarned: goal.xpReward,
      coinsEarned: goal.coinReward,
      levelUp: newLevel > oldLevel,
      newLevel: newLevel,
      progress: userProgress,
      newAchievements,
    })
  } catch (error) {
    console.error("Error completing goal:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Check and unlock achievements
const checkAchievements = async (userId, userProgress) => {
  try {
    const achievements = await Achievement.find({ userId, isUnlocked: false })
    const newAchievements = []

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
          const selfCareGoals = await Goal.countDocuments({
            userId,
            isCompleted: true,
            category: "self-care",
          })
          if (selfCareGoals >= achievement.requirement) {
            shouldUnlock = true
          }
          break
        case "productivity":
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
        newAchievements.push(achievement)
      }
    }

    return newAchievements
  } catch (error) {
    console.error("Error checking achievements:", error)
    return []
  }
}

// Get user achievements
router.get("/achievements", auth, async (req, res) => {
  try {
    await initializeUserData(req.user.id)

    const achievements = await Achievement.find({ userId: req.user.id }).sort({ isUnlocked: -1, createdAt: -1 })

    res.json({ achievements })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user progress
router.get("/progress", auth, async (req, res) => {
  try {
    let userProgress = await UserProgress.findOne({ userId: req.user.id })

    if (!userProgress) {
      userProgress = await initializeUserData(req.user.id)
    }

    // Calculate virtual fields
    const xpToNextLevel = userProgress.level * 100
    const previousLevelXP = (userProgress.level - 1) * 100
    const currentLevelXP = userProgress.totalXP - previousLevelXP

    const progressData = {
      ...userProgress.toObject(),
      xpToNextLevel,
      currentLevelXP,
    }

    res.json({ progress: progressData })
  } catch (error) {
    console.error("Error fetching user progress:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a goal
router.delete("/:goalId", auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.goalId,
      userId: req.user.id,
    })

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    res.json({ message: "Goal deleted successfully" })
  } catch (error) {
    console.error("Error deleting goal:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a goal
router.put("/:goalId", auth, async (req, res) => {
  try {
    const { title, description, difficulty, priority, category } = req.body

    const goal = await Goal.findOne({
      _id: req.params.goalId,
      userId: req.user.id,
    })

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    // Update rewards if difficulty changed
    if (difficulty && difficulty !== goal.difficulty) {
      const rewards = {
        EASY: { xp: 10, coins: 5 },
        MEDIUM: { xp: 25, coins: 15 },
        HARD: { xp: 50, coins: 30 },
      }
      const reward = rewards[difficulty] || rewards.EASY
      goal.xpReward = reward.xp
      goal.coinReward = reward.coins
    }

    // Update fields
    if (title) goal.title = title
    if (description) goal.description = description
    if (difficulty) goal.difficulty = difficulty
    if (priority) goal.priority = priority
    if (category) goal.category = category

    await goal.save()
    res.json({ goal })
  } catch (error) {
    console.error("Error updating goal:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
