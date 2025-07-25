const mongoose = require("mongoose")

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
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
    trim: true,
  },
  xpReward: {
    type: Number,
    default: function () {
      switch (this.difficulty) {
        case "EASY":
          return 10
        case "MEDIUM":
          return 25
        case "HARD":
          return 50
        default:
          return 10
      }
    },
  },
  coinReward: {
    type: Number,
    default: function () {
      switch (this.difficulty) {
        case "EASY":
          return 5
        case "MEDIUM":
          return 15
        case "HARD":
          return 30
        default:
          return 5
      }
    },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
goalSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Set rewards based on difficulty before saving
goalSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("difficulty")) {
    switch (this.difficulty) {
      case "EASY":
        this.xpReward = 10
        this.coinReward = 5
        break
      case "MEDIUM":
        this.xpReward = 25
        this.coinReward = 15
        break
      case "HARD":
        this.xpReward = 50
        this.coinReward = 30
        break
    }
  }
  next()
})

module.exports = mongoose.model("Goal", goalSchema)
