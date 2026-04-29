const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  image: { type: String },
  bannerImage: { type: String },
  backgroundColor: { type: String, default: '#F0FDF4' },
  medicineSystem: {
    type: String,
    enum: ['allopathic', 'ayurvedic', 'homeopathic', 'naturopathy', 'yoga'],
    default: 'allopathic'
  },
  regulatoryType: {
    type: String,
    enum: ['otc', 'pom', 'gsl', 'p', 'nutraceutical', 'device', 'generic']
  },
  displayOrder: { type: Number, default: 0 },
  showOnHomepage: { type: Boolean, default: true },
  showInNav: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
