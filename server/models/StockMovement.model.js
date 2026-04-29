const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  type: { type: String, enum: ['in', 'out', 'adjust'] },
  quantity: { type: Number },
  previousStock: { type: Number },
  newStock: { type: Number },
  reason: {
    type: String,
    enum: ['restock', 'sale', 'damage', 'expiry', 'return', 'correction', 'import', 'other']
  },
  referenceOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  notes: { type: String },
  doneBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockMovement', stockMovementSchema);
