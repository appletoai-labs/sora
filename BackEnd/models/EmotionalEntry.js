const mongoose = require("mongoose")

const emotionalEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emotion: {
      type: String,
      required: true,
    },
    intensity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    triggers: {
      type: String,
      default: "",
    },
    strategiesUsed: [
      {
        strategyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "EmotionalStrategy",
        },
        effectiveness: {
          type: Number,
          min: 1,
          max: 5,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        notes: {
          type: String,
          default: "",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiResponse: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("EmotionalEntry", emotionalEntrySchema)
