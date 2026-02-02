const express = require('express');
const VerifyUser = require('../middleware/verifyMiddleware');
const router = express.Router();
const nodemailer = require("nodemailer")


router.post('/send', VerifyUser, async (req, res) => {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        // Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER, // your email
                pass: process.env.SMTP_PASS, // your app password
            },
        });

        // Email options
        const mailOptions = {
            from: email,
            to: process.env.RECEIVER_EMAIL, // company email
            subject: `New Contact Form Message from ${fullName}`,
            text: `Name: ${fullName}\nEmail: ${email}\nMessage: ${message}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong. Try again later." });
    }
})

module.exports = router