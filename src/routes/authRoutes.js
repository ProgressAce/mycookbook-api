// Serves all the authenticated endpoints for users
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controller/authController');

router.use(express.json());

// user registration
router.post('/auth/register',
            authMiddleware.validateRegistrationInput, authController.user_registration);

module.exports = router;