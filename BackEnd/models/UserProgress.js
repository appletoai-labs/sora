const mongoose = require("mongoose")

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  totalXP: {
    type: Number,
    default: 0,
  },
  coins: {
    type: Number,
    default: 100, // Starting coins
  },
  goalsCompleted: {
    type: Number,
    default: 0,
  },
  dayStreak: {
    type: Number,
    default: 0,
  },
  lastStreakDate: {
    type: Date,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  achievements: [
    {
      achievementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
      unlockedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Calculate level based on XP
userProgressSchema.methods.calculateLevel = function () {
  // Level formula: Level = floor(sqrt(totalXP / 100)) + 1
  this.level = Math.floor(Math.sqrt(this.totalXP / 100)) + 1
  return this.level
}

// Get XP needed for next level
userProgressSchema.methods.getXPToNextLevel = function () {
  const currentLevelXP = Math.pow(this.level - 1, 2) * 100
  const nextLevelXP = Math.pow(this.level, 2) * 100
  return nextLevelXP - this.totalXP
}

// Get current level progress
userProgressSchema.methods.getCurrentLevelXP = function () {
  const currentLevelXP = Math.pow(this.level - 1, 2) * 100
  return this.totalXP - currentLevelXP
}

// Update streak
userProgressSchema.methods.updateStreak = function () {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastStreak = this.lastStreakDate ? new Date(this.lastStreakDate) : null

  if (!lastStreak) {
    // First streak
    this.dayStreak = 1
    this.lastStreakDate = today
  } else {
    const daysDiff = Math.floor((today - lastStreak) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      // Consecutive day
      this.dayStreak += 1
      this.lastStreakDate = today
    } else if (daysDiff === 0) {
      // Same day, no change
      return
    } else {
      // Streak broken
      this.dayStreak = 1
      this.lastStreakDate = today
    }
  }

  // Update longest streak
  if (this.dayStreak > this.longestStreak) {
    this.longestStreak = this.dayStreak
  }
}

userProgressSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  this.calculateLevel()
  next()
})

module.exports = mongoose.model("UserProgress", userProgressSchema)
