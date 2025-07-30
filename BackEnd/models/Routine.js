const mongoose = require("mongoose")

const routineStepSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
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
  flexibility_options: [
    {
      type: String,
    },
  ],
  sensory_breaks: [
    {
      type: String,
    },
  ],
  tips: [
    {
      type: String,
    },
  ],
})

const routineSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      enum: ["morning", "evening", "work", "selfcare", "cleaning", "exercise", "social", "custom"],
    },
    steps: [routineStepSchema],
    sensory_breaks: [
      {
        type: String,
      },
    ],
    tips_for_success: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
routineSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("Routine", routineSchema)
