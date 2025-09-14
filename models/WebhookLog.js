const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema(
  {
    payload: { type: Object, required: true },
    headers: { type: Object },
    query: { type: Object }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WebhookLog', webhookLogSchema);