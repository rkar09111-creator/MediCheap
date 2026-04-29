const mongoose = require('mongoose');

const companyProductSchema = new mongoose.Schema({
  company: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'CompanyCategory', required: true 
  },
  
  // Basic Info
  name: { type: String, required: true },
  slug: { type: String, required: true },
  sku: { type: String },
  shortDescription: { type: String },
  description: { type: String },
  specifications: [{
    key: String,
    value: String
  }],
  
  // Images
  images: [{ type: String }],  // cloudinary URLs, first = cover
  
  // Pricing
  mrp: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  gst: { type: Number, default: 5 },
  
  // Inventory
  stock: { type: Number, default: 0 },
  minStockAlert: { type: Number, default: 10 },
  unit: { type: String },        // "box", "strip", "bottle"
  packSize: { type: String },    // "10 tablets", "200ml"
  
  // Regulatory
  requiresPrescription: { type: Boolean, default: false },
  
  // Display
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  
  // SEO
  seoTitle: { type: String },
  seoDescription: { type: String },
  searchTags: [String],
  
  // Stats
  avgRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps and calculate discount before saving
companyProductSchema.pre('save', function() {
  this.updatedAt = Date.now();
  if (this.mrp && this.sellingPrice) {
    this.discount = Math.round(((this.mrp - this.sellingPrice) / this.mrp) * 100);
  }
});

// Index for search
companyProductSchema.index({ name: 'text', description: 'text', searchTags: 'text' });

module.exports = mongoose.model('CompanyProduct', companyProductSchema);
