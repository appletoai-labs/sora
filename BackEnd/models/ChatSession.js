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
  ResponseId: {
    type: String,
    required: function () {
      return this.role === "assistant";
    },
  }

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
    insights: {
      type: Boolean,
      default: false,
    },
    patternsGeneratedAt: {
      type: [Number], 
      default: []
    }

  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
chatSessionSchema.index({ userId: 1, createdAt: -1 })
chatSessionSchema.index({ userId: 1, isActive: 1 })

module.exports = mongoose.model("ChatSession", chatSessionSchema)
