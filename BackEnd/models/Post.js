const mongoose = require("mongoose")

const responseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  category: {
    type: String,
    required: true,
    enum: ["support", "celebrations", "advice", "resources"],
  },
  safeSpace: {
    type: String,
    default: null,
    trim: true,
    enum: [
      null,
      "adhd-support",
      "autistic-community",
      "sensory-support",
      "anxiety-overwhelm",
      "executive-function",
      "social-connection",
    ],
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  reactions: {
    heart: {
      type: Number,
      default: 0,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    solidarity: {
      type: Number,
      default: 0,
    },
  },
  userReactions: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reactionType: {
        type: String,
        enum: ["heart", "helpful", "solidarity"],
      },
    },
  ],
  responses: [responseSchema],
  isActive: {
    type: Boolean,
    default: true,
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
postSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Index for better query performance
postSchema.index({ category: 1, createdAt: -1 })
postSchema.index({ userId: 1, createdAt: -1 })
postSchema.index({ isActive: 1, createdAt: -1 })
postSchema.index({ safeSpace: 1, createdAt: -1 })

module.exports = mongoose.model("Post", postSchema)
