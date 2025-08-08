const mongoose = require('mongoose')

const AcademicConnectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  authors: {
    type: [String],
    default: [],
  },
  sourceUrl: {
    type: String,
    trim: true,
    // Optional: Add URL validation if needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('AcademicConnection', AcademicConnectionSchema)
