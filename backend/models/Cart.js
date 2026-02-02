const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            size: {
                type: String,
                required: true,
                enum: ["XS", "S", "M", "L", "XL", "XXL"]
            },
            quantity: {
                type: Number,
                default: 1
            },
            priceAtThatTime: {
                type: Number
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    }

}, { timestamps: true });


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;