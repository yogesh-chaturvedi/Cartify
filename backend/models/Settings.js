const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
    business: {
        brandName: { type: String },
        supportEmail: { type: String },
        phoneNumber: { type: String },
        whatsappNumber: { type: String },
        address: { type: String },
        socialLinks: {
            instagram: String,
            facebook: String,
            website: String,
        },
    },

    order: {
        isOrderEnabled: { type: Boolean, default: true },
        minOrderAmount: { type: Number, default: 0 },
        isCODEnabled: { type: Boolean, default: true },
        autoConfirmOrders: { type: Boolean, default: false },
    },

    roles: {
        admin: {
            permissions: {
                manageProducts: { type: Boolean, default: false },
                manageOrders: { type: Boolean, default: false },
                manageUsers: { type: Boolean, default: false },
                accessSettings: { type: Boolean, default: false },
            },
        },
        staff: {
            permissions: {
                manageOrders: { type: Boolean, default: false },
                viewProducts: { type: Boolean, default: false },
            },
        },
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;