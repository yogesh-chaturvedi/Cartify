const express = require('express')
const router = express.Router();
const VerifyUser = require('../middleware/verifyMiddleware')
const { addToCartController, fetchCartController, removeItemController, handleQuantityController } = require('../controllers/CartControllers');
const User = require('../models/User');


// add products 
router.post('/addItem/:productId', VerifyUser, addToCartController)

// fetch User's cart
router.get('/fetch', VerifyUser, fetchCartController)

// to remove product from cart
router.delete('/removeItem/:productId', VerifyUser, removeItemController)

// handle product quantity
router.put('/handleQuantity/:productId', VerifyUser, handleQuantityController);

module.exports = router;