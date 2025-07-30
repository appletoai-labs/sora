const mongoose = require("mongoose")

const calendarTaskSchema = new mongoose.Schema(
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
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    date: {
      type: String, // YYYY-MM-DD format
      required: true,
    },
    time: {
      type: String, // HH:MM format
      default: null,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    color: {
      type: String,
      default: "bg-teal-500",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    reminders: [
      {
        type: {
          type: String,
          enum: ["email", "push", "sms"],
          default: "push",
        },
        minutesBefore: {
          type: Number,
          default: 15,
        },
        sent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    recurring: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: "weekly",
      },
      interval: {
        type: Number,
        default: 1,
      },
      endDate: {
        type: String,
        default: null,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        filename: String,
        url: String,
        size: Number,
        mimeType: String,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
calendarTaskSchema.index({ userId: 1, date: 1 })
calendarTaskSchema.index({ userId: 1, completed: 1 })
calendarTaskSchema.index({ userId: 1, priority: 1 })
calendarTaskSchema.index({ date: 1, time: 1 })

// Virtual for formatted date
calendarTaskSchema.virtual("formattedDate").get(function () {
  const date = new Date(this.date)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
})

// Virtual for formatted time
calendarTaskSchema.virtual("formattedTime").get(function () {
  if (!this.time) return null
  const [hours, minutes] = this.time.split(":")
  const date = new Date()
  date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
})

// Method to mark task as completed
calendarTaskSchema.methods.markCompleted = function () {
  this.completed = true
  this.completedAt = new Date()
  return this.save()
}

// Method to mark task as incomplete
calendarTaskSchema.methods.markIncomplete = function () {
  this.completed = false
  this.completedAt = null
  return this.save()
}

// Static method to get tasks for date range
calendarTaskSchema.statics.getTasksForDateRange = function (userId, startDate, endDate) {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1, time: 1 })
}

// Static method to get upcoming tasks
calendarTaskSchema.statics.getUpcomingTasks = function (userId, days = 7) {
  const today = new Date().toISOString().split("T")[0]
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)
  const futureDateString = futureDate.toISOString().split("T")[0]

  return this.find({
    userId,
    date: {
      $gte: today,
      $lte: futureDateString,
    },
    completed: false,
  }).sort({ date: 1, time: 1 })
}

// Static method to get overdue tasks
calendarTaskSchema.statics.getOverdueTasks = function (userId) {
  const today = new Date().toISOString().split("T")[0]

  return this.find({
    userId,
    date: { $lt: today },
    completed: false,
  }).sort({ date: -1, time: -1 })
}

module.exports = mongoose.model("CalendarTask", calendarTaskSchema)
