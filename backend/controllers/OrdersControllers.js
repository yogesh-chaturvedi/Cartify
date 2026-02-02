const express = require('express')
const mongoose = require('mongoose')
const OrdersModel = require('../models/Orders')
const UserModel = require('../models/User')
const CartModel = require('../models/Cart')

// to fetch orders 
const fetchOrdersController = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 5,
            status = "All",
            search = "",
            sort = "date-new"
        } = req.query;

        const skip = (page - 1) * limit;

        let query = {};

        //    FILTER
        if (status !== "All") {
            query.orderStatus = status;
        }

        //    SEARCH
        if (search.trim() !== "") {
            const regex = new RegExp(search, "i");

            const users = await UserModel.find({
                $or: [{ name: regex }, { email: regex }]
            }).select("_id");

            const userIds = users.map(u => u._id);

            query.$or = [
                { "shippingAddress.fullName": regex },
                { "shippingAddress.phone": regex },
                { orderStatus: regex }
            ];

            if (mongoose.Types.ObjectId.isValid(search)) {
                query.$or.push({ _id: search });
            }

            if (userIds.length > 0) {
                query.$or.push({ user: { $in: userIds } });
            }
        }

        //    SORT
        let sortQuery = {};
        switch (sort) {
            case "amount-asc":
                sortQuery.totalAmount = 1;
                break;
            case "amount-desc":
                sortQuery.totalAmount = -1;
                break;
            case "date-old":
                sortQuery.createdAt = 1;
                break;
            default:
                sortQuery.createdAt = -1;
        }


        //    COUNT (same query!)
        const totalOrders = await OrdersModel.countDocuments(query);

        //    FETCH
        const orders = await OrdersModel.find(query)
            .populate("user", "name email")
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit));

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders
            }
        });

    } catch (error) {
        console.error("fetchOrdersController error", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

// to delete orders
const deleteOrdersController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrdersModel.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false, });
        }

        res.status(200).json({ message: "Orders removed successfully", success: true });
    }
    catch (error) {
        console.error('deleteOrdersController error', error);
        res.status(500).json({ message: 'Failed to removed order', success: false });
    }
}

// to fetch single orders
const fetchSingleOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrdersModel.findById(orderId).populate("user", "name email")
            .populate({
                path: "orderHistory.changedBy",
                select: "name email role",
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false, });
        }

        res.status(200).json({ message: "Orders fetched successfully", success: true, order });
    }
    catch (error) {
        console.error('fetchSingleOrderController error', error);
        res.status(500).json({ message: 'Failed to fetch user order', success: false });
    }
}

// to change order status 
const changeOrderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { newStatus } = req.body;
        const order = await OrdersModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false, });
        }

        // ✅ VALID STATUS FLOW
        const validTransitions = {
            Pending: ["Confirmed", "Cancelled"],
            Confirmed: ["Shipped", "Cancelled"],
            Shipped: ["Delivered"],
        };

        if (
            !validTransitions[order.orderStatus]?.includes(newStatus)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid status change from ${order.orderStatus} to ${newStatus}`,
            });
        }

        const oldStatus = order.orderStatus;

        // change status 
        order.orderStatus = newStatus;

        order.orderHistory.push({
            from: oldStatus,
            to: newStatus,
            changedBy: req.user._id, // 👈 correct
            changedAt: new Date(),
        })

        if (newStatus === "Delivered") {
            order.deliveredAt = new Date()
        }

        if (newStatus === "Cancelled") {
            order.cancelledAt = new Date()
        }

        await order.save();
        return res.status(200).json({ success: true, message: `Order status updated from ${oldStatus} to ${newStatus}`, order });

    }
    catch (error) {
        console.error('changeOrderStatusController error', error);
        res.status(500).json({ message: 'Failed to change order status', success: false });
    }
}

// fetch users orders 
const fetchUserOrderController = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await OrdersModel.find({ user: userId });

        if (!orders) {
            return res.status(404).json({ message: 'Orders Not Found', success: false });
        }

        res.status(200).json({ message: 'Order fetched successfully', success: true, orders });
    }
    catch (error) {
        console.error('fetchUserOrderController error', error);
        res.status(500).json({ message: 'Failed to fetch user order', success: false });
    }
}

// verify orders 
const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.query;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required",
            });
        }

        const order = await OrdersModel.findOne({
            "paymentResult.sessionId": sessionId,
        });

        // ⏳ Webhook not processed yet
        if (!order) {
            return res.status(202).json({
                success: false,
                paymentStatus: "PENDING",
                message: "Payment is still being confirmed",
            });
        }

        // ✅ Payment confirmed
        if (order.paymentStatus === "PAID") {
            return res.status(200).json({
                success: true,
                paymentStatus: "PAID",
                orderId: order._id,
            });
        }

        // ❌ Payment failed or cancelled
        return res.status(200).json({
            success: false,
            paymentStatus: order.paymentStatus,
        });

    } catch (error) {
        console.error("verifyPayment error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify payment",
        });
    }
};

module.exports = { fetchOrdersController, deleteOrdersController, fetchSingleOrderController, changeOrderStatusController, fetchUserOrderController, verifyPayment }