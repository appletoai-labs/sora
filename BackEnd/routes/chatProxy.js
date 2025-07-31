const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth")
const router = express.Router();
// Ensure PYTHONSERVER_URL is set in .env
require("dotenv").config();
// Base URL for the Flask API
if (!process.env.PYTHONSERVER_URL) {
  throw new Error("PYTHONSERVER_URL is not defined in .env");
}

const FLASK_API_BASE = process.env.PYTHONSERVER_URL;

// Proxy to Flask: /api/chat
router.post("/chat", auth, async (req, res) => {
  try {
    const user = req.user;

    if (!user.isPremium && user.chatCount >= 5) {
      return res.status(403).json({ message: "Free chat limit reached. Upgrade to continue." });
    }

    const flaskRes = await axios.post(`${FLASK_API_BASE}/api/chat`, req.body);

    // Increment chat count for non-premium users
    if (!user.isPremium) {
      user.chatCount += 1;
      await user.save();
    }

    res.json(flaskRes.data);
  } catch (error) {
    console.error("Proxy /chat error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to forward to SORA microservice" });
  }
});


// Proxy to Flask: /api/chat-history
router.get("/chat-history", async (req, res) => {
  try {
    const flaskRes = await axios.get(`${FLASK_API_BASE}/api/chat-history`, {
      params: req.query,
    });
    res.json(flaskRes.data);
  } catch (error) {
    console.error("Proxy /chat-history error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to forward to SORA microservice" });
  }
});

module.exports = router;
