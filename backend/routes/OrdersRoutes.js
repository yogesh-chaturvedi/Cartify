const express = require('express')
const VerifyUser = require('../middleware/verifyMiddleware')
const isAdmin = require('../middleware/isAdminMiddleware')
const { fetchOrdersController, deleteOrdersController, fetchSingleOrderController, changeOrderStatusController, fetchUserOrderController, verifyPayment } = require('../controllers/OrdersControllers')
const router = express.Router()


// to fetch orders 
router.get('/fetch', VerifyUser, isAdmin, fetchOrdersController)

// to delete orders 
router.delete('/delete/:orderId', VerifyUser, isAdmin, deleteOrdersController)

// to fetch order on view order page
router.get('/fetchSingleOrder/:orderId', VerifyUser, isAdmin, fetchSingleOrderController)

// to change sttus and tarck order history 
router.put('/changeOrderStatus/:orderId', VerifyUser, isAdmin, changeOrderStatusController)

// to fetch user's orders 
router.get('/userOrder/:userId', VerifyUser, fetchUserOrderController)

router.get('/verify-payment', VerifyUser, verifyPayment)



module.exports = router