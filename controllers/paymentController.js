// controllers/paymentController.js
const { body } = require('express-validator');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');

const createPaymentValidations = [
  body('student_info.name').isString().trim().notEmpty(),
  body('student_info.id').isString().trim().notEmpty(),
  body('student_info.email').isEmail(),
  body('order_amount').isFloat({ gt: 0 }),
  body('gateway_name').isString().trim().notEmpty()
];

const createPayment = async (req, res, next) => {
  try {
    const schoolId = req.body.school_id || process.env.SCHOOL_ID;
    const { student_info, gateway_name, order_amount } = req.body;

    // Use the logged-in user's ID as trustee_id
    const trustee_id = req.user._id.toString();

    const order = await Order.create({
      school_id: schoolId,
      trustee_id,
      student_info,
      gateway_name
    });

    await OrderStatus.create({
      collect_id: order._id,
      order_amount: Number(order_amount),
      status: 'PENDING'
    });

    const redirectUrl = `https://example-gateway.test/pay?orderId=${order._id}&school=${schoolId}`;

    return res.status(201).json({
      success: true,
      message: 'Payment created',
      order_id: order._id,
      redirect_url: redirectUrl
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPaymentValidations, createPayment };
