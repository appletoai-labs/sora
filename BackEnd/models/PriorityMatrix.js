const mongoose = require("mongoose")

const priorityMatrixSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Automatically adds unique index
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

module.exports = mongoose.model("PriorityMatrix", priorityMatrixSchema)
