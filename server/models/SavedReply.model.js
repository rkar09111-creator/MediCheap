const mongoose = require('mongoose');

const savedReplySchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortcut: { type: String },
  message: { type: String, required: true },
  category: { type: String, enum: ['order', 'prescription', 'delivery', 'general'] },
  usedCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedReply', savedReplySchema);
