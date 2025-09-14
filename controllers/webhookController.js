// controllers/webhookController.js
const { body } = require('express-validator');
const OrderStatus = require('../models/OrderStatus');
const WebhookLog = require('../models/WebhookLog');

const webhookValidations = [
  body('order_id').isString().notEmpty(),
  body('status').isIn(['SUCCESS', 'FAILED', 'CANCELLED', 'PENDING']),
  body('transaction_amount').optional().isFloat({ gt: 0 }),
  body('payment_mode').optional().isString(),
  body('payment_details').optional().isString(),
  body('bank_reference').optional().isString(),
  body('payment_message').optional().isString(),
  body('error_message').optional().isString(),
  body('payment_time').optional().isISO8601()
];

const handleWebhook = async (req, res, next) => {
  try {
    await WebhookLog.create({
      payload: req.body,
      headers: req.headers,
      query: req.query
    });

    const {
      order_id,
      status,
      transaction_amount,
      payment_mode,
      payment_details,
      bank_reference,
      payment_message,
      error_message,
      payment_time
    } = req.body;

    const update = {
      status,
      ...(transaction_amount !== undefined && { transaction_amount: Number(transaction_amount) }),
      ...(payment_mode && { payment_mode }),
      ...(payment_details && { payment_details }),
      ...(bank_reference && { bank_reference }),
      ...(payment_message && { payment_message }),
      ...(error_message && { error_message }),
      ...(payment_time && { payment_time: new Date(payment_time) })
    };

    const result = await OrderStatus.findOneAndUpdate(
      { collect_id: order_id },
      { $set: update },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Order status not found' });
    }

    return res.json({ success: true, message: 'Webhook processed', data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { webhookValidations, handleWebhook };
