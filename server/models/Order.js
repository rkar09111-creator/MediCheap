import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  prescription: { 
    imageUrl: String,
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: String,
    notes: String
  },
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    fullName: String,
    phone: String,
    flatNo: String,
    buildingName: String,
    streetArea: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'packed', 'prescription_verified', 'assigned_to_rider', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  paymentMethod: { 
    type: String, 
    enum: ['upi', 'cod', 'MediWallet'], 
    required: true 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'screenshot_uploaded', 'verified', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentScreenshot: { type: String },
  paymentScreenshotUploadedAt: { type: Date },
  paymentVerifiedAt: { type: Date },
  paymentVerifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentNotes: { type: String },
  upiTransactionId: { type: String },
  notes: String, // Customer notes
  internalNotes: [{
    text: String,
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  cancellationReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

orderSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
