const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
  },
  
  // Uploaded files
  images: [{
    url: String,          // cloudinary URL
    publicId: String,     // for deletion
    originalName: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Patient details (from form)
  patientName: { type: String, required: true },
  patientAge: { type: Number },
  patientPhone: { type: String, required: true },
  
  // Delivery
  deliveryAddress: {
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    fullName: String,
    phone: String,
    flatNo: String,
    streetArea: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: { lat: Number, lng: Number }
  },
  
  // Notes
  patientNotes: { type: String },
  medicinesRequested: { type: String },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'very_urgent'],
    default: 'normal'
  },
  
  // Status tracking
  status: {
    type: String,
    enum: [
      'uploaded',
      'under_review',
      'verified',
      'rejected',
      'fulfilled',
      'expired'
    ],
    default: 'uploaded'
  },
  
  // Admin/Pharmacist actions
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  pharmacistNotes: String,
  rejectionReason: String,
  
  // Linked order (after fulfillment)
  linkedOrder: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null 
  },
  
  // Reference ID shown to user
  referenceId: { 
    type: String, unique: true 
  },
  
  // Expiry (prescriptions expire)
  prescriptionDate: Date,
  prescriptionValidUntil: Date,
  
  // Doctor info (if provided)
  doctorName: String,
  doctorRegNumber: String,
  hospitalName: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate referenceId: "RX-2025-XXXXXX"
prescriptionSchema.pre('save', async function(next) {
  if (!this.referenceId) {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referenceId = `RX-${year}-${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Prescription', prescriptionSchema);

