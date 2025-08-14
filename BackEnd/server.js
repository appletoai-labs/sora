const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const researchroutes = require("./routes/research")
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const chatRoutes = require("./routes/chat");
const toolsRoutes = require("./routes/tools");
const analyticsRoutes = require("./routes/analytics");
const chatProxyRoutes = require("./routes/chatProxy");
const dailyCheckinRoutes = require("./routes/checkin");
const goalsRoutes = require("./routes/goals");
const clarityRoutes = require("./routes/clarityRoutes");
const EmotionalStrategy = require("./routes/emotional-support");
const Community = require("./routes/Community");
const Routine = require("./routes/executive");
const CalendarTask = require("./routes/calendar");
const stripeRoutes = require("./routes/stripe");
const stripeWebhookRoutes = require("./routes/stripeWebhook");


const app = express();

app.use("/api/stripe-webhook", stripeWebhookRoutes);

// Body parsing middleware (after webhook!)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());

const corsOptions = {
  origin: ["http://localhost:8080", "https://sora-henna-six.vercel.app", "https://www.sora-ally.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// All other routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chatproxy", chatProxyRoutes);
app.use("/api/dailycheckin", dailyCheckinRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/clarity", clarityRoutes);
app.use("/api/emotional-support", EmotionalStrategy);
app.use("/api/community", Community);
app.use("/api/executive", Routine);
app.use("/api/calendar", CalendarTask);
app.use("/api/research", researchroutes)
app.use("/api/stripe", stripeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
