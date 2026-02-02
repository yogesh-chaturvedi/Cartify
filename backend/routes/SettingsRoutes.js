const express = require('express');
const VerifyUser = require('../middleware/verifyMiddleware');
const isAdmin = require('../middleware/isAdminMiddleware');
const { fetchSettingsController, businessFormController, orderFormSettings, rolesPermissionsFormSettings } = require('../controllers/SettingsControllers');
const router = express.Router();


router.get('/fetch', fetchSettingsController)

router.put('/business', VerifyUser, isAdmin, businessFormController)

router.put('/orders', VerifyUser, isAdmin, orderFormSettings)


module.exports = router