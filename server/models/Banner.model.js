const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String },
  desktopImage: { type: String },
  mobileImage: { type: String },
  altText: { type: String },
  linkType: {
    type: String,
    enum: ['shop', 'category', 'medicine', 'external', 'prescription', 'none']
  },
  linkValue: { type: String },
  showOn: [{ type: String, enum: ['home', 'shop', 'category'] }],
  displayOrder: { type: Number, default: 0 },
  activeFrom: { type: Date },
  activeUntil: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', bannerSchema);
