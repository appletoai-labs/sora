const mongoose = require("mongoose")

const emotionalStrategySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["breathing", "movement", "sensory", "cognitive", "social", "mindfulness"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    effectiveness: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    steps: [
      {
        type: String,
        required: true,
      },
    ],
    timeNeeded: {
      type: String,
      required: true,
    },
    bestUsedWhen: {
      type: String,
      required: true,
    },
    emotions: [
      {
        type: String,
        required: true,
      },
    ],
    intensityRange: {
      min: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      max: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
    },
    neurodivergentAdaptations: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    generatedByAI: {
      type: Boolean,
      default: false,
    },
    aiPromptUsed: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("EmotionalStrategy", emotionalStrategySchema)
