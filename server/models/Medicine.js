import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: String,
  brand: { type: String, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  },
  categoryName: String,
  description: String, // Short description
  fullDescription: String, // Rich text
  directions: String, // Rich text
  warnings: String, // Rich text
  sideEffects: String, // Rich text
  
  mrp: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  gstPercentage: { type: Number, default: 0, enum: [0, 5, 12, 18] },
  
  medicineType: {
    type: String,
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Powder', 'Other'],
    required: true
  },
  packSize: String,
  
  stock: { type: Number, required: true, default: 0 },
  minStockAlert: { type: Number, default: 10 },
  sku: { type: String, unique: true, sparse: true },
  expiryDate: Date,
  
  requiresPrescription: { type: Boolean, default: false },
  
  medicineSystem: {
    type: String,
    enum: ['Allopathic', 'Ayurvedic', 'Homeopathic', 'Naturopathy', 'Yoga'],
    default: 'Allopathic'
  },
  
  regulatoryCategory: {
    type: String,
    enum: ['OTC', 'POM', 'GSL', 'P', 'Nutraceuticals', 'Medical Devices', 'Generics'],
    default: 'OTC'
  },
  
  consumerCategory: {
    type: String,
    enum: [
      'Wellness & Fitness', 'Skincare', 'Vitamins & Supplements', 
      'Mother & Baby', 'Diabetes Care', 'Cardiac Care', 'Personal Care',
      'Immunity & Defence', 'Orthopaedic Care', 'Eye & Vision Care', 'Respiratory Care'
    ],
    default: 'Wellness & Fitness'
  },
  
  images: [{
    url: String,
    isCover: { type: Boolean, default: false }
  }],
  
  manufacturer: String,
  
  isLive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false },
  showInSearch: { type: Boolean, default: true },
  
  relatedMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

medicineSchema.pre('save', function() {
  if (this.mrp && this.sellingPrice) {
    this.discountPercentage = Math.round(((this.mrp - this.sellingPrice) / this.mrp) * 100);
  }
});

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
