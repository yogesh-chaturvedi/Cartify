const express = require('express');
const upload = require('../multer');
const { addProductsControllers, fetchProductsControllers, editProductsControllers, deleteProductControllers, fetchSingleProductControllers } = require('../controllers/ProductsControllers');
const VerifyUser = require('../middleware/verifyMiddleware');
const isAdmin = require('../middleware/isAdminMiddleware');
const router = express.Router();


// fetch all products
router.get('/fetch', fetchProductsControllers)

// to uplode images 
router.post('/add-product', VerifyUser, isAdmin, (req, res, next) => {
    upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'images', maxCount: 4 }
    ])(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "Image upload failed"
            });
        }
        next();
    });
}, addProductsControllers)

// edit products
router.put('/updateProduct/:productId', VerifyUser, isAdmin, (req, res, next) => {
    upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'images', maxCount: 4 }
    ])(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "Image upload failed"
            });
        }
        next();
    });
}, editProductsControllers)

// delete products
router.delete('/deleteProduct/:productId', VerifyUser, isAdmin, deleteProductControllers)

// fetch single products
router.get('/fetchSingleProduct/:productId', fetchSingleProductControllers)


module.exports = router;