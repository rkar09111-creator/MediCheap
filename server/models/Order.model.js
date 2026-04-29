const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    name: { type: String },
    image: { type: String },
    quantity: { type: Number, required: true },
    mrp: { type: Number },
    sellingPrice: { type: Number },
    requiresPrescription: { type: Boolean }
  }],
  prescription: {
    imageUrl: { type: String },
    status: {
      type: String,
      enum: ['not_required', 'pending', 'verified', 'rejected'],
      default: 'not_required'
    },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    pharmacistNotes: { type: String }
  },
  deliveryAddress: {
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    fullName: { type: String },
    phone: { type: String },
    flatNo: { type: String },
    buildingName: { type: String },
    streetArea: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    coordinates: { 
      lat: { type: Number }, 
      lng: { type: Number } 
    }
  },
  pricing: {
    subtotal: { type: Number },
    discount: { type: Number },
    couponDiscount: { type: Number },
    deliveryFee: { type: Number },
    gst: { type: Number },
    total: { type: Number }
  },
  coupon: {
    code: { type: String },
    discountAmount: { type: Number }
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'screenshot_uploaded', 'verified', 'failed', 'refunded', 'collected'],
    default: 'pending'
  },
  paymentScreenshot: { type: String },
  paymentScreenshotAt: { type: Date },
  paymentVerifiedAt: { type: Date },
  paymentVerifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upiTransactionId: { type: String },
  paymentNotes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'prescription_required', 'prescription_verified', 'packed', 'assigned_to_rider', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String }
  }],
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
  adminNotes: { type: String },
  customerNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
