const express = require('express')
const SettingsModel = require('../models/Settings')

const fetchSettingsController = async (req, res) => {
    try {
        const settings = await SettingsModel.find({});

        if (!settings) {
            return res.status(400).json({ message: "Settings not found", success: false });
        }

        return res.status(200).json({ message: "Settings fetched successfully", success: true, allSettings: settings });
    }
    catch (error) {
        console.error('fetchSettingsController error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const businessFormController = async (req, res) => {
    const { brandName, supportEmail, phoneNumber, whatsappNumber, address, instagram, facebook, website } = req.body;
    try {

        if (!brandName || !supportEmail || !phoneNumber || !address) {
            return res.status(400).json({
                message: "Required fields are missing",
                success: false
            });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!emailRegex.test(supportEmail)) {
            return res.status(400).json({
                message: "Invalid support email format",
                success: false
            });
        }

        // find and update otherwise create one 
        await SettingsModel.findOneAndUpdate(
            { owner: req.user._id },
            {
                $set: {
                    business: {
                        brandName,
                        supportEmail,
                        phoneNumber,
                        whatsappNumber,
                        address,
                        socialLinks: { instagram, facebook, website },
                    },
                }
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: "Business settings saved successfully",
            success: true,
        });

    }
    catch (error) {
        console.error('businessFormController error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

const orderFormSettings = async (req, res) => {
    const { isOrderEnabled, minOrderAmount, isCODEnabled, autoConfirmOrders } = req.body;

    try {

        const isOrderEnabledBool = Boolean(isOrderEnabled);
        const isCODEnabledBool = Boolean(isCODEnabled);
        const autoConfirmOrdersBool = Boolean(autoConfirmOrders);

        const minOrderAmountNum = Number(minOrderAmount);
        if (isNaN(minOrderAmountNum) || minOrderAmountNum < 0) {
            return res.status(400).json({
                message: "Invalid minimum order amount",
                success: false
            });
        }

        const updatedSettings = await SettingsModel.findOneAndUpdate(
            { owner: req.user._id },
            {
                $set: {
                    order: {
                        isOrderEnabled: isOrderEnabledBool,
                        minOrderAmount: minOrderAmountNum,
                        isCODEnabled: isCODEnabledBool,
                        autoConfirmOrders: autoConfirmOrdersBool,
                    },
                }
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: "Orders settings saved successfully",
            success: true,
            data: updatedSettings.order
        });
    }
    catch (error) {
        console.error('orderFormController error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}


module.exports = { fetchSettingsController, businessFormController, orderFormSettings };