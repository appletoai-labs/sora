// routes/clarityToolsRoutes.js

const express = require("express");
const router = express.Router();

const {
  getTaskBreakdown,
  getOverwhelmSupport,
} = require("../services/clarityToolsService");

// POST /api/task-breakdown
router.post("/task-breakdown", async (req, res) => {
  const { taskDescription, userContext } = req.body;
  try {
    const result = await getTaskBreakdown(taskDescription, userContext);
    res.json(result);
  } catch (err) {
    console.error("Task Breakdown Error:", err);
    res.status(500).json({ error: "Failed to get task breakdown." });
  }
});

// POST /api/overwhelm-support
router.post("/overwhelm-support", async (req, res) => {
  const { situation, triggers } = req.body;
  try {
    const result = await getOverwhelmSupport(situation, triggers);
    res.json(result);
  } catch (err) {
    console.error("Overwhelm Support Error:", err);
    res.status(500).json({ error: "Failed to get overwhelm support." });
  }
});

module.exports = router;
