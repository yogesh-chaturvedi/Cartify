const express = require('express');
const VerifyUser = require('../middleware/verifyMiddleware');
const { ChatBotController } = require('../controllers/ChatBotControllers');
const router = express.Router();


router.post('/message/:productId', VerifyUser, ChatBotController)

module.exports = router;