const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'verified', 'rejected', 'fulfilled'],
    default: 'pending'
  },
  linkedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  adminNotes: { type: String },
  pharmacistNotes: { type: String },
  rejectionReason: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
