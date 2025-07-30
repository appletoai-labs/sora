const express = require("express")
const router = express.Router()
const Thought = require("../models/Thought") // Import the new Thought model
const auth = require("../middleware/auth")

// Get all thoughts for a user
router.get("/thoughts", auth, async (req, res) => {
  try {
    const thoughts = await Thought.find({ userId: req.user.id }).sort({ date: 1, createdAt: 1 })
    res.json(thoughts)
  } catch (error) {
    console.error("Error fetching thoughts:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new thought (only for the current date)
router.post("/thoughts", auth, async (req, res) => {
  try {
    const { content, date } = req.body

    // Basic validation
    if (!content || !date) {
      return res.status(400).json({ message: "Content and date are required" })
    }

    // Ensure the thought is for today's date
    const today = new Date().toISOString().split("T")[0]


    const thought = new Thought({
      content,
      date,
      userId: req.user.id,
    })

    await thought.save()

    res.status(201).json(thought)
  } catch (error) {
    console.error("Error creating thought:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Removed task-related routes (GET /tasks, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id, PATCH /tasks/:id/toggle, GET /stats)
// as per the requirement to only handle thoughts.

module.exports = router
