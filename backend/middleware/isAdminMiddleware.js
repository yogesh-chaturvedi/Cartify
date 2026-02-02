const express = require('express')



const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please login"
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admin access only"
            });
        }

        next();
    }
    catch (error) {
        console.error('isAdmin middleware error:', error);
        res.status(500).json({
            success: false,
            message: "Authorization failed"
        });
    }
};

module.exports = isAdmin;