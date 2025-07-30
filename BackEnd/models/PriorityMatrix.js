const mongoose = require("mongoose")

const priorityMatrixSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user has only one priority matrix
    },
    urgentImportant: {
      type: String,
      default: "",
    },
    notUrgentImportant: {
      type: String,
      default: "",
    },
    urgentNotImportant: {
      type: String,
      default: "",
    },
    notUrgentNotImportant: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
priorityMatrixSchema.index({ userId: 1 })

module.exports = mongoose.model("PriorityMatrix", priorityMatrixSchema)
