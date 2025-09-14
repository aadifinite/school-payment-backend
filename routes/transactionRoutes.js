// routes/transactionRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getTransactions, getTransactionsBySchool, getTransactionStatus } = require('../controllers/transactionController');

const router = express.Router();

router.get('/transactions', protect, getTransactions);
router.get('/transactions/school/:schoolId', protect, getTransactionsBySchool);
router.get('/transaction-status/:custom_order_id', protect, getTransactionStatus);

module.exports = router;
