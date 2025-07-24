const express = require("express");
const axios = require("axios");
const router = express.Router();
// Ensure PYTHONSERVER_URL is set in .env
require("dotenv").config();
// Base URL for the Flask API
if (!process.env.PYTHONSERVER_URL) {
  throw new Error("PYTHONSERVER_URL is not defined in .env");
}

const FLASK_API_BASE = process.env.PYTHONSERVER_URL;

// Proxy to Flask: /api/chat
router.post("/chat", async (req, res) => {
  try {
    const flaskRes = await axios.post(`${FLASK_API_BASE}/api/chat`, req.body);
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
