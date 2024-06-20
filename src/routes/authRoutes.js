// Serves all the authenticated endpoints for users
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controller/authController');

// user registration
router.post('/auth/register',
            authMiddleware.validateRegistration,
            authController.userRegistration);

router.post('/auth/login',
            authMiddleware.validateLogin, authController.userLogin);

router.post('/auth/login',
            authController.userLogin, authMiddleware.validateLogin);

module.exports = router;
