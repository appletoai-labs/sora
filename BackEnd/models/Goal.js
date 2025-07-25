const mongoose = require("mongoose")

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "EASY",
    },
    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
    },
    category: {
      type: String,
      default: "personal",
    },
    xpReward: {
      type: Number,
      default: 10,
    },
    coinReward: {
      type: Number,
      default: 5,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
goalSchema.index({ userId: 1, isActive: 1 })
goalSchema.index({ userId: 1, isCompleted: 1 })

module.exports = mongoose.model("Goal", goalSchema)
