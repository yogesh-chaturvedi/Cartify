const express = require('express')
const UserModel = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const formatName = (fullName) => {
    return fullName
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};


// signup controller function
const signupController = async (req, res) => {

    try {
        const { fullName, email, password } = req.body;

        // safety check even if you use Joi
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const isExist = await UserModel.findOne({ email: normalizedEmail });

        if (isExist) {
            return res.status(400).json({ message: "Account is already created", success: false })
        }
        else {

            // hashing the password 
            const hashedPassword = await bcrypt.hash(password, 10);

            const newAccount = new UserModel({
                name: formatName(fullName),
                email: normalizedEmail,
                password: hashedPassword
            })

            await newAccount.save();
            return res.status(201).json({ message: "Account has beeen successfully created", success: true })
        }

    }
    catch (error) {
        console.error('error', error)
        res.status(500).json({ message: 'Signup error', success: false })
    }
}


// login validation function
const loginController = async (req, res) => {

    try {
        const { email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();
        const isExist = await UserModel.findOne({ email: normalizedEmail });

        if (!isExist) {
            return res.status(400).json({ message: "User Not Found", success: false })
        }
        else {
            const isMatch = await bcrypt.compare(password, isExist.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect password", success: false })
            }
            else {
                // creating jwt token
                const token = jwt.sign({ userId: isExist._id, userEmail: isExist.email, userRole: isExist.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

                // setting token into cookie 
                res.cookie("Token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                return res.status(200).json({
                    message: "Login Successful", success: true, loggedInUser: { id: isExist._id, email: isExist.email, role: isExist.role }
                    ,
                });
            }
        }
    }
    catch (error) {
        console.error('error', error)
        res.status(500).json({ message: 'Signup error', success: false })
    }
}

// logout controller
const logoutController = (req, res) => {
    try {
        res.clearCookie("Token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({ message: 'logout successfully', success: true })
    }
    catch (error) {
        console.error('error', error)
        res.status(500).json({ message: 'logout error', success: false })
    }
}

module.exports = { signupController, loginController, logoutController }