const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// 🎯 Authenticated route to create a Stripe Checkout session
router.post("/create-checkout-session", auth, async (req, res) => {
    try {
        const { interval } = req.body; // "monthly" or "yearly"

        let priceId;
        if (interval === "month") {
            priceId = process.env.STRIPE_PRICE_MONTHLY_ID;
        } else if (interval === "year") {
            priceId = process.env.STRIPE_PRICE_YEARLY_ID;
        } else {
            return res.status(400).json({ message: "Invalid plan selected" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/app?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            customer_email: req.user.email,
            metadata: {
                userId: req.user._id.toString(),
                plan: interval,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout error:", error);
        res.status(500).json({ message: "Failed to create checkout session" });
    }
});

module.exports = router;
