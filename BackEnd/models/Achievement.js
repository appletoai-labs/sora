const mongoose = require("mongoose")

const achievementSchema = new mongoose.Schema({
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
  requirement: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    default: "🏆",
  },
  category: {
    type: String,
    enum: ["milestone", "streak", "level", "self-care", "productivity", "social"],
    default: "milestone",
  },
  isUnlocked: {
    type: Boolean,
    default: false,
  },
  unlockedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Achievement", achievementSchema)
