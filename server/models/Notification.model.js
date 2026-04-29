const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'order_placed', 'order_confirmed', 'order_packed',
      'order_out_for_delivery', 'order_delivered',
      'order_cancelled', 'prescription_verified',
      'prescription_rejected', 'payment_verified',
      'payment_rejected', 'low_stock', 'new_message',
      'new_order_admin', 'new_prescription_admin',
      'new_review_admin', 'new_chat_admin'
    ]
  },
  title: { type: String },
  body: { type: String },
  data: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
