const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortName: { type: String },
  logo: { type: String },        // cloudinary URL
  coverImage: { type: String },  // banner image URL
  description: { type: String },
  shortDescription: { type: String },
  website: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  country: { type: String, default: 'India' },
  established: { type: String },
  licenseNumber: { type: String },
  gstNumber: { type: String },
  
  // Display settings
  showOnWebsite: { type: Boolean, default: true },
  showInMedicineDetail: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  
  // Stats (computed or regularly updated)
  totalCategories: { type: Number, default: 0 },
  totalProducts: { type: Number, default: 0 },
  
  // Brand identity
  primaryColor: { type: String, default: '#16A34A' },
  tagline: { type: String },
  
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps on save
companySchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Company', companySchema);
