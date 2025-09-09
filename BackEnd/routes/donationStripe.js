// routes/stripe.js
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

/**
 * POST /api/stripe/create-donation-session
 * Request body: { amount: number }  // amount in USD
 */
router.post("/create-donation-session", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid donation amount" });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", // ✅ one-time payment
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "SORA Donation",
              description: "Your donation helps support neurodivergent users 🌸",
            },
            unit_amount: Math.round(amount * 100), 
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/app`,
      cancel_url: `${process.env.FRONTEND_URL}/donate`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe donation error:", err);
    res.status(500).json({ error: "Failed to create donation session" });
  }
});

module.exports = router;
