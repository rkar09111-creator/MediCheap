const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: { type: String },
  brand: { type: String, required: true },
  manufacturer: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  medicineSystem: {
    type: String,
    enum: ['allopathic', 'ayurvedic', 'homeopathic', 'naturopathy', 'yoga'],
    default: 'allopathic'
  },
  regulatoryType: {
    type: String,
    enum: ['otc', 'pom', 'gsl', 'p', 'nutraceutical', 'device', 'generic'],
    default: 'otc'
  },
  consumerCategory: {
    type: String,
    enum: ['wellness', 'skincare', 'vitamins', 'mother_baby', 'diabetes', 'cardiac', 'immunity', 'orthopaedic', 'eye', 'respiratory']
  },
  description: { type: String },
  shortDescription: { type: String },
  directionsForUse: { type: String },
  warnings: { type: String },
  composition: { type: String },
  packSize: { type: String },
  unitOfMeasurement: { type: String },
  mrp: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  costPrice: { type: Number },
  discount: { type: Number, default: 0 },
  gst: { type: Number, default: 5 },
  images: [{ type: String }],
  sku: { type: String },
  stock: { type: Number, required: true, default: 0 },
  minStockAlert: { type: Number, default: 10 },
  maxStock: { type: Number },
  expiryDate: { type: Date },
  batchNumber: { type: String },
  rackLocation: { type: String },
  requiresPrescription: { type: Boolean, default: false },
  prescriptionType: {
    type: String,
    enum: ['schedule_h', 'schedule_h1', 'schedule_x', 'general_rx']
  },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false },
  featuredTab: { type: Number, default: 1 },
  searchTags: [{ type: String }],
  slug: { type: String },
  seoTitle: { type: String },
  seoDescription: { type: String },
  relatedMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  avgRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
});

module.exports = mongoose.model('Medicine', medicineSchema);
