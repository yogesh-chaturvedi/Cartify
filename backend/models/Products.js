const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productTitle: {
        type: String,
        required: true,
        trim: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productSizes: [
        {
            size: {
                type: String,
                required: true,
                enum: ["XS", "S", "M", "L", "XL", "XXL"]
            },
            stock: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    productDescription: {
        type: String,
        required: true,
        trim: true
    },
    // ⭐ MAIN IMAGE (Hero image)
    mainImage: {
        url: String,
        publicId: String
    },
    // ⭐ GALLERY IMAGES
    images: [
        {
            url: String,
            publicId: String
        }
    ],
    productMaterial: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,  // show or hide 
        default: true
    },
    featured: {
        type: Boolean,   // show on homepage
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });


const Product = mongoose.model('Product', productSchema);

module.exports = Product;