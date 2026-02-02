const UserModel = require('../models/User')
const jwt = require("jsonwebtoken");

const VerifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.Token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated", success: false })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const freshUserData = await UserModel.findById(decoded.userId).select("-password");

        if (!freshUserData) {
            return res.status(401).json({ message: "User not found", success: false })
        }

        req.user = freshUserData;
        next();
    }
    catch (error) {
        console.log("verifyUser error", error)
        res.status(401).json({ message: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token", success: false })
    }
}

module.exports = VerifyUser;
