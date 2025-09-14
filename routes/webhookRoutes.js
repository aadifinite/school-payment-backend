// routes/webhookRoutes.js
const express = require('express');
const validate = require('../middleware/validate');
const { webhookValidations, handleWebhook } = require('../controllers/webhookController');

const router = express.Router();

router.post('/webhooks/payment', webhookValidations, validate, handleWebhook);

module.exports = router;
