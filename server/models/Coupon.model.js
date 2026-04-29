const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, uppercase: true },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'flat'] },
  discountValue: { type: Number },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number },
  totalUsageLimit: { type: Number },
  perUserLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  usedBy: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usedAt: { type: Date }
  }],
  validFrom: { type: Date },
  validUntil: { type: Date },
  applicableTo: {
    type: String,
    enum: ['all', 'first_order', 'category', 'medicine'],
    default: 'all'
  },
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  applicableMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);
