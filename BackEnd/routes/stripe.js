const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// 🎯 Authenticated route to create a Stripe Checkout session
router.post("/create-checkout-session", auth, async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            subscription_data: {
                cancel_at_period_end: true,
            },
            success_url: `${process.env.CLIENT_URL}/app`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            customer_email: req.user.email,
            metadata: {
                userId: req.user._id.toString(),
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout error:", error);
        res.status(500).json({ message: "Failed to create checkout session" });
    }
});

module.exports = router;
