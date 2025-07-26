const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
// const rateLimit = require("express-rate-limit")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const chatRoutes = require("./routes/chat")
const toolsRoutes = require("./routes/tools")
const analyticsRoutes = require("./routes/analytics")
const chatProxyRoutes = require("./routes/chatProxy")
const dailyCheckinRoutes = require("./routes/checkin")
const goalsRoutes = require("./routes/goals")
const clarityRoutes = require("./routes/clarityRoutes")
const EmotionalStrategy = require("./routes/emotional-support")
const Community = require("./routes/Community")

const app = express()
app.use(express.json());

// Security middleware
app.use(helmet())
const corsOptions = {
  origin: ["http://localhost:8080", "https://sora-henna-six.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// })
// app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/tools", toolsRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/chatproxy", chatProxyRoutes)
app.use("/api/dailycheckin", dailyCheckinRoutes)
app.use("/api/goals", goalsRoutes)
app.use("/api/clarity", clarityRoutes)
app.use("/api/emotional-support", EmotionalStrategy)
app.use("/api/community", Community)


// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
