// const mongoose = require("mongoose")

// const dailyCheckinSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//     mood: {
//       type: String,
//       enum: ["very_low", "low", "neutral", "good", "very_good"],
//       required: true,
//     },
//     energy: {
//       type: String,
//       enum: ["very_low", "low", "neutral", "good", "very_good"],
//       required: true,
//     },
//     anxiety: {
//       type: String,
//       enum: ["very_low", "low", "neutral", "high", "very_high"],
//       required: true,
//     },
//     focus: {
//       type: String,
//       enum: ["very_low", "low", "neutral", "good", "very_good"],
//       required: true,
//     },
//     sensoryOverload: {
//       type: String,
//       enum: ["none", "mild", "moderate", "high", "severe"],
//       default: "none",
//     },
//     challenges: [
//       {
//         type: String,
//         enum: [
//           "executive_function",
//           "social_interaction",
//           "sensory_processing",
//           "emotional_regulation",
//           "communication",
//           "routine_disruption",
//           "overwhelm",
//           "other",
//         ],
//       },
//     ],
//     accomplishments: [String],
//     gratitude: [String],
//     notes: {
//       type: String,
//       maxlength: 1000,
//     },
//     toolsUsed: [
//       {
//         tool: String,
//         helpful: Boolean,
//         notes: String,
//       },
//     ],
//     sleepHours: {
//       type: Number,
//       min: 0,
//       max: 24,
//     },
//     sleepQuality: {
//       type: String,
//       enum: ["very_poor", "poor", "fair", "good", "excellent"],
//     },
//   },
//   {
//     timestamps: true,
//   },
// )

// // Ensure one checkin per user per day
// dailyCheckinSchema.index({ userId: 1, date: 1 }, { unique: true })

// module.exports = mongoose.model("DailyCheckin", dailyCheckinSchema)
