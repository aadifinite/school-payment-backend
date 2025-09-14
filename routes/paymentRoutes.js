const express = require('express');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { createPaymentValidations, createPayment } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-payment', protect, ...createPaymentValidations, validate, createPayment);

module.exports = router;