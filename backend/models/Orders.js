const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        // 🔹 USER
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // 🔹 ORDER ITEMS
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                subtotal: {
                    type: Number,
                    required: true,
                },
            },
        ],

        // 🔹 SHIPPING ADDRESS
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address1: { type: String, required: true },
            address2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            country: { type: String, default: "New Zealand" },
        },

        // 🔹 PRICING
        itemsPrice: {
            type: Number,
            required: true,
        },
        taxPrice: {
            type: Number,
            default: 0,
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        // 🔹 PAYMENT
        paymentMethod: {
            type: String,
            enum: ["COD", "STRIPE"],
            required: true,
        },
        paymentResult: {
            paymentId: String,
            status: String,
            sessionId: String,
            email: String,
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "COD_PENDING"],
            default: "PENDING"
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
        },

        // 🔹 ORDER STATUS
        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Shipped",
                "Delivered",
                "Cancelled",
                "Returned",
            ],
            default: "Pending",
        },
        orderHistory: [
            {
                from: "String",
                to: "String",
                changedAt: {
                    type: Date,
                    default: Date.now()
                },
                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            },
        ],

        deliveredAt: Date,
        cancelledAt: Date,
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;