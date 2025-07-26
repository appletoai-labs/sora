const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    res.json(user.toJSON())
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put(
  "/profile",
  auth,
  [
    body("firstName").optional().trim().isLength({ min: 1 }),
    body("lastName").optional().trim().isLength({ min: 1 }),
    body("preferences.highContrast").optional().isBoolean(),
    body("preferences.fontSize").optional().isIn(["small", "medium", "large"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const updates = req.body
      const user = await User.findByIdAndUpdate(req.userId, { $set: updates }, { new: true, runValidators: true })

      res.json(user.toJSON())
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get user stats
router.get("/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    // This would typically aggregate data from various collections
    const stats = {
      weeklyActivity: "Ready for check-in",
      toolsUsed: "Start exploring",
      totalSessions: 0,
      streakDays: 0,
      lastActive: user.lastActive,
    }

    res.json(stats)
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
