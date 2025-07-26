const express = require("express");
const router = express.Router();
const Checkin = require("../models/Checkin");
const auth  = require("../middleware/auth");

router.post("/checkins", auth, async (req, res) => {
  try {
    const { mood, anxiety, sensory, executive, energy, notes } = req.body;
    const newCheckin = new Checkin({
      user: req.user._id,
      mood,
      anxiety,
      sensory,
      executive,
      energy,
      notes,
    });
    await newCheckin.save();
    res.status(201).json({ success: true, checkin: newCheckin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
