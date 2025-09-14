// controllers/transactionController.js
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const mongoose = require('mongoose');

const getTransactions = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const skip = (page - 1) * limit;

    // Show transactions for the logged in user's trustee_id
    const trusteeId = req.user ? req.user._id.toString() : null;

    const match = trusteeId ? { trustee_id: trusteeId } : {};

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status'
        }
      },
      { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    const [items, totalCount] = await Promise.all([
      Order.aggregate(pipeline),
      Order.countDocuments(match)
    ]);

    return res.json({
      success: true,
      page,
      limit,
      total: totalCount,
      items
    });
  } catch (err) {
    next(err);
  }
};

const getTransactionsBySchool = async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    const items = await Order.aggregate([
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status'
        }
      },
      { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } }
    ]);

    return res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

const getTransactionStatus = async (req, res, next) => {
  try {
    const { custom_order_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(custom_order_id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }
    const status = await OrderStatus.findOne({ collect_id: custom_order_id }).lean();
    if (!status) {
      return res.status(404).json({ success: false, message: 'Order status not found' });
    }
    return res.json({ success: true, status });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTransactions, getTransactionsBySchool, getTransactionStatus };
