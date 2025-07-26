const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    mood: String,
    tags: [String],
    sentiment: String,
  },
})

const chatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Conversation",
    },
    messages: [messageSchema],
    sessionType: {
      type: String,
      enum: ["general", "crisis", "clarity", "checkin"],
      default: "general",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    summary: {
      type: String,
    },
    tags: [String],
    mood: {
      type: String,
      enum: ["very_low", "low", "neutral", "good", "very_good"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
chatSessionSchema.index({ userId: 1, createdAt: -1 })
chatSessionSchema.index({ userId: 1, isActive: 1 })

module.exports = mongoose.model("ChatSession", chatSessionSchema)
