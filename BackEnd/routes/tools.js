const express = require("express")
const DailyCheckin = require("../models/DailyCheckin")
const auth = require("../middleware/auth")

const router = express.Router()

// Daily Check-in endpoints
router.post("/daily-checkin", auth, async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0)

    // Check if already checked in today
    const existingCheckin = await DailyCheckin.findOne({
      userId: req.userId,
      date: today,
    })

    if (existingCheckin) {
      return res.status(400).json({ message: "Already checked in today" })
    }

    const checkin = new DailyCheckin({
      userId: req.userId,
      date: today,
      ...req.body,
    })

    await checkin.save()
    res.status(201).json(checkin)
  } catch (error) {
    console.error("Daily checkin error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/daily-checkin/history", auth, async (req, res) => {
  try {
    const { days = 30 } = req.query
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(days))

    const checkins = await DailyCheckin.find({
      userId: req.userId,
      date: { $gte: startDate },
    }).sort({ date: -1 })

    res.json(checkins)
  } catch (error) {
    console.error("Get checkin history error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
