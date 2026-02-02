const express = require('express')
const VerifyUser = require('../middleware/verifyMiddleware')
const { fetchUsersControllers, deleteUsersControllers, editProfileControllers } = require('../controllers/UsersControllers')
const isAdmin = require('../middleware/isAdminMiddleware');
const uploadProfile = require('../middleware/profileUploads');
const router = express.Router()

// get all users 
router.get('/fetch', VerifyUser, isAdmin, fetchUsersControllers)


// remove users 
router.delete('/deleteUser/:userId', VerifyUser, isAdmin, deleteUsersControllers)


// edit users profile
router.put('/edit-profile', VerifyUser, uploadProfile.single("profileImage"), editProfileControllers)

module.exports = router
