const mongoose = require("mongoose")

const thoughtSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

thoughtSchema.index({ userId: 1, date: 1 })

module.exports = mongoose.model("Thought", thoughtSchema)
