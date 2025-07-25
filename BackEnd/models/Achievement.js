const mongoose = require("mongoose")

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirement: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      default: "🏆",
    },
    isUnlocked: {
      type: Boolean,
      default: false,
    },
    unlockedAt: {
      type: Date,
    },
    category: {
      type: String,
      default: "general",
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
achievementSchema.index({ userId: 1, isUnlocked: 1 })

module.exports = mongoose.model("Achievement", achievementSchema)
