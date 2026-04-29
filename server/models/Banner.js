import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: String,
  desktopImage: { type: String, required: true },
  mobileImage: String,
  altText: String,
  linkType: {
    type: String,
    enum: ['Shop', 'Category', 'Medicine', 'External', 'Prescription', 'None'],
    default: 'None'
  },
  linkValue: String,
  showOn: [{
    type: String,
    enum: ['Homepage', 'Shop', 'Categories']
  }],
  displayOrder: { type: Number, default: 0 },
  activeFrom: Date,
  activeUntil: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
