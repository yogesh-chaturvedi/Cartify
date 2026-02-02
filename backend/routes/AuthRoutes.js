const express = require('express')
const { signupValidation, loginValidation } = require('../middleware/AuthMiddleware')
const { signupController, loginController, logoutController } = require('../controllers/AuthController')
const VerifyUser = require('../middleware/verifyMiddleware')
const { loginLimiter } = require('../middleware/RateLimiterMiddleware')
const router = express.Router()


// signup route 
router.post('/signup', signupValidation, signupController)

// login route 
router.post('/login', loginLimiter, loginValidation, loginController)

// to verify user's 
router.get('/verify', VerifyUser, (req, res) => {
    res.status(200).json({ message: "Verification completed", success: true, userData: req.user })
})

// logout route
router.delete('/logout', logoutController)


module.exports = router