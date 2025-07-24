const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    anxiety: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    sensory: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    executive: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    energy: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkin", checkinSchema);
