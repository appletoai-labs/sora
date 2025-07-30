const express = require("express")
const Routine = require("../models/Routine")
const auth = require("../middleware/auth")
const { generateRoutine, generateRoutineFromBrainDump } = require("../services/executiveService")

const router = express.Router()

// Generate a new routine
router.post("/generate-routine", auth, async (req, res) => {
  try {
    const { routineType, preferences } = req.body

    if (!routineType) {
      return res.status(400).json({ message: "Routine type is required" })
    }

    const generatedRoutine = await generateRoutine(routineType, preferences)

    res.json(generatedRoutine)
  } catch (error) {
    console.error("Generate routine error:", error)
    res.status(500).json({ message: "Failed to generate routine" })
  }
})

// Generate routine from brain dump
router.post("/brain-dump-routine", auth, async (req, res) => {
  try {
    const { brainDumpText } = req.body

    if (!brainDumpText || !brainDumpText.trim()) {
      return res.status(400).json({ message: "Brain dump text is required" })
    }

    const generatedRoutine = await generateRoutineFromBrainDump(brainDumpText)

    res.json(generatedRoutine)
  } catch (error) {
    console.error("Generate routine from brain dump error:", error)
    res.status(500).json({ message: "Failed to generate routine from brain dump" })
  }
})

// Save a routine
router.post("/save-routine", auth, async (req, res) => {
  try {
    const { title, type, steps, sensory_breaks, tips_for_success } = req.body

    if (!title || !type || !steps || !Array.isArray(steps)) {
      return res.status(400).json({ message: "Title, type, and steps are required" })
    }

    const routine = new Routine({
      userId: req.userId,
      title,
      type,
      steps,
      sensory_breaks: sensory_breaks || [],
      tips_for_success: tips_for_success || [],
    })

    await routine.save()
    res.status(201).json(routine)
  } catch (error) {
    console.error("Save routine error:", error)
    res.status(500).json({ message: "Failed to save routine" })
  }
})

// Get user's saved routines
router.get("/routines", auth, async (req, res) => {
  try {
    const routines = await Routine.find({
      userId: req.userId,
      isActive: true,
    }).sort({ createdAt: -1 })

    res.json(routines)
  } catch (error) {
    console.error("Get routines error:", error)
    res.status(500).json({ message: "Failed to fetch routines" })
  }
})

// Get a specific routine
router.get("/routines/:id", auth, async (req, res) => {
  try {
    const routine = await Routine.findOne({
      _id: req.params.id,
      userId: req.userId,
      isActive: true,
    })

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" })
    }

    res.json(routine)
  } catch (error) {
    console.error("Get routine error:", error)
    res.status(500).json({ message: "Failed to fetch routine" })
  }
})

// Update a routine
router.put("/routines/:id", auth, async (req, res) => {
  try {
    const { title, type, steps, sensory_breaks, tips_for_success } = req.body

    const routine = await Routine.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
        isActive: true,
      },
      {
        title,
        type,
        steps,
        sensory_breaks,
        tips_for_success,
      },
      { new: true },
    )

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" })
    }

    res.json(routine)
  } catch (error) {
    console.error("Update routine error:", error)
    res.status(500).json({ message: "Failed to update routine" })
  }
})

// Delete a routine (soft delete)
router.delete("/routines/:id", auth, async (req, res) => {
  try {
    const routine = await Routine.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
        isActive: true,
      },
      { isActive: false },
      { new: true },
    )

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" })
    }

    res.json({ message: "Routine deleted successfully" })
  } catch (error) {
    console.error("Delete routine error:", error)
    res.status(500).json({ message: "Failed to delete routine" })
  }
})

module.exports = router
