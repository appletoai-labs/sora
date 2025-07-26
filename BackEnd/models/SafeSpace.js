const mongoose = require("mongoose")

const safeSpaceSchema = new mongoose.Schema({
  spaceId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  tag: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
  },
  borderColor: {
    type: String,
    required: true,
  },
  focusAreas: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  memberCount: {
    type: Number,
    default: 0,
  },
  postCount: {
    type: Number,
    default: 0,
  },
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
safeSpaceSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Index for better query performance
safeSpaceSchema.index({ spaceId: 1 })
safeSpaceSchema.index({ isActive: 1 })

module.exports = mongoose.model("SafeSpace", safeSpaceSchema)
