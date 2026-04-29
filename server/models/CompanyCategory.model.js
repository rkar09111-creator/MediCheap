const mongoose = require('mongoose');

const companyCategorySchema = new mongoose.Schema({
  company: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true 
  },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  icon: { type: String },        // emoji or URL
  image: { type: String },       // category image
  displayOrder: { type: Number, default: 0 },
  showOnWebsite: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Ensure unique category names within the same company
companyCategorySchema.index({ company: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('CompanyCategory', companyCategorySchema);
