const express = require('express');
const VerifyUser = require('../middleware/verifyMiddleware');
const { paymentController } = require('../controllers/PaymentController');
const router = express.Router();


router.put('/checkout', VerifyUser, paymentController)


module.exports = router