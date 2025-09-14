// routes/authRoutes.js
const express = require('express');
const validate = require('../middleware/validate');
const { registerValidations, loginValidations, register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerValidations, validate, register);
router.post('/login', loginValidations, validate, login);
router.get('/me', protect, getMe);

module.exports = router;
