// routes/auth.js
const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")
const LastSession = require("../models/lastsession") // Adjust the path if needed

const router = express.Router()

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // 🔧 enable debug output
  logger: true,
});

// 1️⃣ Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Forgot password request for:", email);

    if (!email) {
      console.log("❌ No email provided");
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("🔍 User found in DB:", user ? user.email : "NONE");

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("✅ Generated OTP:", otp);

    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    console.log("💾 Saved OTP for user:", user.email);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    });
    console.log("📧 Email sent to:", user.email);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("🔥 Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 2️⃣ Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("📩 Verify OTP request for:", email, "OTP:", otp);

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("🔍 User found:", user ? user.email : "NONE");

    if (!user || !user.resetOtp) {
      console.log("❌ Invalid request, no user/OTP");
      return res.status(400).json({ message: "Invalid request" });
    }

    if (user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
      console.log("❌ OTP mismatch or expired");
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    console.log("✅ OTP verified successfully for:", user.email);
    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("🔥 Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 3️⃣ Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("📩 Reset password request:", { email, otp, newPassword });

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("🔍 User found:", user ? user.email : "NONE");

    if (!user || !user.resetOtp) {
      console.log("❌ Invalid reset request");
      return res.status(400).json({ message: "Invalid request" });
    }

    if (user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
      console.log("❌ OTP mismatch or expired");
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();
    console.log("✅ Password reset successful for:", user.email);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("🔥 Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔐 Register a new user
router.post(
  "/register",
  [
    body("email").isEmail(),
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

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
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

router.post("/logout", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, isViewingPastSession } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    await LastSession.findOneAndUpdate(
      { userId },
      { sessionId, isViewingPastSession },
      { upsert: true, new: true }
    );

    res.json({ message: "Logged out and last session saved" });
  } catch (err) {
    console.error("Logout error:", err.message || err);
    res.status(500).json({ error: "Failed to save last session on logout" });
  }
});


// 🔑 Login existing user
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
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

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
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
