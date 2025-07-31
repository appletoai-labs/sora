const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

const webhookRouter = express.Router();

// Stripe webhook endpoint (DO NOT use express.json())
webhookRouter.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;

    try {
      await User.findByIdAndUpdate(userId, {
        isPremium: true,
        chatCount: 0,
      });
      console.log(`User ${userId} upgraded to premium`);
    } catch (err) {
      console.error("User upgrade failed:", err);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = webhookRouter;
