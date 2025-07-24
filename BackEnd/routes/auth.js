// routes/auth.js
const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// 🔐 Register a new user
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("role").isIn(["individual", "therapy_client", "therapist"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() })
      }

      const { email, password, firstName, lastName, role } = req.body

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
      }

      const user = new User({ email, password, firstName, lastName, role })
      await user.save()

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "7d",
      })

      res.status(201).json({
        message: "User created successfully",
        user: user.toJSON(),
        token,
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Server error during registration" })
    }
  }
)

// 🔑 Login existing user
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email, isActive: true })
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "7d",
      })

      res.status(200).json({
        message: "Login successful",
        user: user.toJSON(),
        token,
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Server error during login" })
    }
  }
)

// ✅ Token verification for frontend re-auth
router.get("/verify", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user.toJSON())
  } catch (error) {
    console.error("Token verification error:", error)
    res.status(500).json({ message: "Server error during verification" })
  }
})

module.exports = router
