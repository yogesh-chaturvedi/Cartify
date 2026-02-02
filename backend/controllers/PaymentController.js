const OrdersModel = require('../models/Orders')
const ProductModel = require('../models/Products')
const CartModel = require('../models/Cart')
const stripe = require('../utils/stripe')


const paymentController = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // 1. Get user cart from DB
        const cart = await CartModel.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // creating order items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            title: item.product.productTitle,
            image: item.product.mainImage.url,
            price: item.priceAtThatTime,
            quantity: item.quantity,
            subtotal: item.priceAtThatTime * item.quantity
        }))

        const itemsPrice = orderItems.reduce((acc, item) => acc + item.subtotal, 0)
        const taxPrice = 0;
        const shippingPrice = 100;
        const totalAmount = itemsPrice + shippingPrice + taxPrice;

        const order = await OrdersModel.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "COD_PENDING" : "PENDING"
        });

        // cod 
        if (paymentMethod === "COD") {

            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
            return res.status(201).json({
                success: true,
                message: "Order created successfully",
                orderId: order._id,
            });

        }

        // stripe
        if (paymentMethod === "STRIPE") {

            const line_items = cart.items.map(item => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.product.productTitle,
                        images: [item.product.mainImage.url],
                    },
                    unit_amount: item.priceAtThatTime * 100, // paise
                },
                quantity: item.quantity,
            }));


            // to add Shipping prices
            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Shipping Charges",
                    },
                    unit_amount: shippingPrice * 100, // ₹100
                },
                quantity: 1,
            });

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                line_items,
                success_url: `${process.env.ORIGIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.ORIGIN}/cancel`,
                metadata: {
                    orderId: order._id.toString(),
                    userId: req.user._id.toString(),
                },
            });

            return res.status(200).json({ url: session.url });
        }

        return res.status(400).json({ message: "Invalid payment method" });

    }
    catch (error) {
        console.error('paymentController error', error)
        res.status(500).json({ message: "paymentController error", success: false })
    }
}

module.exports = { paymentController }