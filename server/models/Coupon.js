import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, uppercase: true },
  description: String,
  discountType: { type: String, enum: ['Percentage', 'Amount'], required: true },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  usageLimitTotal: { type: Number },
  usageLimitPerCustomer: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  validFrom: Date,
  validUntil: Date,
  applyTo: {
    type: String,
    enum: ['All', 'FirstOrder', 'Category'],
    default: 'All'
  },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
