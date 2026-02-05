const CartModel = require('../models/Cart')
const ProductModel = require('../models/Products')

const shippingFee = 100;

// to add products in user's cart
const addToCartController = async (req, res) => {
    try {

        const { selectedSize, quantity } = req.body;
        const productId = req.params.productId;

        if (!selectedSize) {
            return res.status(400).json({ message: 'Please select size', success: false });
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(400).json({ message: 'Product not found', success: false });
        }

        const cart = await CartModel.findOne({ user: req.user._id })

        if (!cart) {
            const addNewCart = new CartModel({
                user: req.user._id,
                items: [
                    {
                        product: productId,
                        size: selectedSize,
                        quantity,
                        priceAtThatTime: product.productPrice,
                    }
                ],
                totalPrice: product.productPrice + shippingFee
            })

            await addNewCart.save();
            return res.status(200).json({ message: 'Product added successfully', success: true, userCart: addNewCart });
        }
        else {
            // Cart exists — check product
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId && item.size === selectedSize.toString()
            );

            if (itemIndex > -1) {
                // Product already in cart
                cart.items[itemIndex].quantity += quantity;
            } else {
                // New product
                cart.items.push({
                    product: productId,
                    size: selectedSize,
                    quantity,
                    priceAtThatTime: product.productPrice,
                });
            }

            // 🔄 Recalculate total price
            cart.totalPrice = cart.items.reduce(
                (total, item) => total + item.quantity * item.priceAtThatTime,
                0
            );

            await cart.save();

            return res.status(200).json({
                message: "Product added to your cart",
                success: true,
                userCart: cart
            });
        }
    }
    catch (error) {
        console.error('addToCartController error', error);
        res.status(500).json({ message: 'Add to cart request fails', success: false });
    }
}

// to fetch user's cart
const fetchCartController = async (req, res) => {
    try {
        const cart = await CartModel.findOne({ user: req.user._id }).populate("items.product");

        if (!cart) {
            return res.status(400).json({ message: "Cart not found", success: false });
        }

        return res.status(200).json({ message: "Cart fetched successfully", success: true, userCart: cart });
    }
    catch (error) {
        console.error('fetchCartController error', error);
        res.status(500).json({ message: 'Failed to fetch cart', success: false });
    }
}

// to remove items from user's cart
const removeItemController = async (req, res) => {
    try {

        const productId = req.params.productId;
        const { itemSize } = req.body

        const cart = await CartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(400).json({ message: "Cart not found", success: false });
        }

        cart.items = cart.items.filter((p) => !(p.product.toString() === productId && p.size === itemSize));

        // 🔄 Recalculate total price
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.quantity * item.priceAtThatTime,
            0
        );

        await cart.save();

        return res.status(200).json({ message: "Item removed successfully", success: true, userCart: cart });

    }
    catch (error) {
        console.error('removeItemController error', error);
        res.status(500).json({ message: 'Failed to fetch cart', success: false });
    }
}

const handleQuantityController = async (req, res) => {
    try {

        const productId = req.params.productId;
        const { itemSize, action } = req.body;

        const cart = await CartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(400).json({ message: "Cart not found", success: false });
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId && item.size === itemSize)

        if (itemIndex === -1) {
            return res.status(400).json({ message: "Product not found in cart", success: false });
        }

        // if action is increase then increase the quantity 
        if (action === "increase") {
            cart.items[itemIndex].quantity = cart.items[itemIndex].quantity + 1;
        }

        // if action is decrease then decrease the quantity 
        if (action === "decrease") {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            }
            else {
                return res.status(400).json({ message: "Minimum quantity should be 1", success: false });
            }
        }

        // Recalculate totalPrice
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.quantity * item.priceAtThatTime,
            0
        );

        await cart.save();

        const userCart = await CartModel.findOne({ user: req.user._id })
            .populate("items.product");

        return res.status(200).json({ message: `Quantity ${action} successfully`, success: true, userCart });

    }
    catch (error) {
        console.error('handleQuantityController error', error);
        res.status(500).json({ message: `Failed to ${action} cart`, success: false });
    }
}


module.exports = { addToCartController, fetchCartController, removeItemController, handleQuantityController }