const express = require("express");
const router = express.Router();
const stripe = require("../utils/stripe");
const OrdersModel = require("../models/Orders");
const CartModel = require("../models/Cart");

router.post(
    "/stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log("Webhook signature failed");
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }


        // Immediately respond 200 to Stripe
        res.status(200).send("received");

        // ✅ STRIPE CHECKOUT EVENT
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            const orderId = session.metadata.orderId;

            const order = await OrdersModel.findById(orderId);


            if (order && !order.isPaid) {
                order.isPaid = true;
                order.paymentStatus = "PAID";
                order.paidAt = new Date();
                order.paymentResult = {
                    paymentId: session.payment_intent,
                    status: session.payment_status,
                    sessionId: session.id,
                };

                await order.save();

                // Clear cart
                await CartModel.findOneAndUpdate(
                    { user: order.user },
                    { items: [], totalPrice: 0 }
                );

            }

        }

    }
);

module.exports = router;