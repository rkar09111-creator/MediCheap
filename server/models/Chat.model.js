const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  status: {
    type: String,
    enum: ['active', 'waiting', 'resolved'],
    default: 'waiting'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderRole: { type: String },
    content: { type: String },
    type: { type: String, enum: ['text', 'image', 'system'] },
    readAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
