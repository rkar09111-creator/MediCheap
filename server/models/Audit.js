const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String, // e.g., 'CREATE_MEDICINE', 'UPDATE_ORDER_STATUS'
    required: true
  },
  target: {
    type: String, // e.g., 'Paracetamol 500mg'
    required: true
  },
  entity: {
    type: String, // e.g., 'Medicine', 'Order', 'User'
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ip: String,
  device: String
}, { timestamps: true });

module.exports = mongoose.model('Audit', auditSchema);
