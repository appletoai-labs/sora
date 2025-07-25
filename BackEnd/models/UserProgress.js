const mongoose = require("mongoose")

const userProgressSchema = new mongoose.Schema(
  {
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
    dayStreak: {
      type: Number,
      default: 0,
    },
    goalsCompleted: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
    streakHistory: [
      {
        date: Date,
        goalsCompleted: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Calculate XP needed for next level
userProgressSchema.virtual("xpToNextLevel").get(function () {
  return this.level * 100 // Each level requires level * 100 XP
})

// Calculate current level XP
userProgressSchema.virtual("currentLevelXP").get(function () {
  const previousLevelXP = (this.level - 1) * 100
  return this.totalXP - previousLevelXP
})

userProgressSchema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("UserProgress", userProgressSchema)
