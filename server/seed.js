/**
 * seed.js — Comprehensive data seed for MediCheap
 * Run with: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User.model');
const Category = require('./models/Category.model');
const Medicine = require('./models/Medicine.model');
const Banner = require('./models/Banner.model');
const Coupon = require('./models/Coupon.model');
const SiteSettings = require('./models/SiteSettings.model');

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/medicheap';
  console.log(`Connecting to: ${uri}`);
  await mongoose.connect(uri);
  console.log('Connected');

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Medicine.deleteMany({}),
    Banner.deleteMany({}),
    Coupon.deleteMany({})
  ]);
  console.log('Cleared existing data');

  // Admin
  const admin = await User.create({
    name: 'MediCheap Admin',
    email: 'admin@medicheap.in',
    phone: '9999999999',
    password: 'admin123',
    role: 'admin',
    isActive: true
  });
  console.log('Admin created: admin@medicheap.in / admin123');

  // Test Customer
  await User.create({
    name: 'Rahul Sharma',
    email: 'user@test.com',
    phone: '9876543210',
    password: 'user123',
    role: 'user',
    isActive: true
  });
  console.log('Test user created: user@test.com / user123');

  // Categories
  const categories = await Category.insertMany([
    { name: 'General Health', icon: '💊', slug: 'general-health', displayOrder: 1, isActive: true, showOnHomepage: true, productCount: 0 },
    { name: 'Antibiotics', icon: '🛡️', slug: 'antibiotics', displayOrder: 2, isActive: true, showOnHomepage: true, productCount: 0 },
    { name: 'Vitamins & Supplements', icon: '🌟', slug: 'vitamins', displayOrder: 3, isActive: true, showOnHomepage: true, productCount: 0 },
    { name: 'Ayurvedic', icon: '🌿', slug: 'ayurvedic', displayOrder: 4, isActive: true, showOnHomepage: true, productCount: 0 },
    { name: 'Skincare', icon: '✨', slug: 'skincare', displayOrder: 5, isActive: true, showOnHomepage: true, productCount: 0 },
    { name: 'Diabetes Care', icon: '🩸', slug: 'diabetes-care', displayOrder: 6, isActive: true, showOnHomepage: true, productCount: 0 },
    { name: 'Heart Health', icon: '❤️', slug: 'heart-health', displayOrder: 7, isActive: true, showOnHomepage: false, productCount: 0 },
    { name: 'Cold & Flu', icon: '🤧', slug: 'cold-flu', displayOrder: 8, isActive: true, showOnHomepage: true, productCount: 0 }
  ]);
  const [general, antibiotics, vitamins, ayurvedic, skincare, diabetes, heart, coldFlu] = categories;
  console.log(categories.length + ' categories created');

  // Medicines
  const medicines = await Medicine.insertMany([
    { name: 'Dolo 650', brand: 'Micro Labs', genericName: 'Paracetamol', manufacturer: 'Micro Labs Ltd.', mrp: 30, sellingPrice: 28, stock: 500, category: general._id, description: 'Dolo 650 is used for fever and mild to moderate pain relief. It contains Paracetamol 650mg.', images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600' }], isFeatured: true, isAvailable: true, requiresPrescription: false, sideEffects: ['Nausea', 'Rash'], rating: 4.8, reviewCount: 1243 },
    { name: 'Crocin Pain Relief', brand: 'Haleon', genericName: 'Paracetamol', manufacturer: 'Haleon India', mrp: 45, sellingPrice: 40, stock: 300, category: general._id, description: 'Effective for headache, bodyache and fever.', images: [{ url: 'https://images.unsplash.com/photo-1576073719710-418242273944?auto=format&fit=crop&q=80&w=600' }], isFeatured: true, isAvailable: true, requiresPrescription: false, rating: 4.5, reviewCount: 876 },
    { name: 'Pantoprazole 40mg', brand: 'Sun Pharma', genericName: 'Pantoprazole', manufacturer: 'Sun Pharmaceutical', mrp: 110, sellingPrice: 95, stock: 200, category: general._id, description: 'Used for gastric acid disorders, GERD and peptic ulcers.', images: [{ url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=600' }], isFeatured: false, isAvailable: true, requiresPrescription: true, rating: 4.6, reviewCount: 540 },
    { name: 'Amoxicillin 500mg', brand: 'Abbott', genericName: 'Amoxicillin', manufacturer: 'Abbott Healthcare', mrp: 120, sellingPrice: 108, stock: 150, category: antibiotics._id, description: 'Broad-spectrum antibiotic for bacterial infections. Prescription required.', images: [{ url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=600' }], isFeatured: true, isAvailable: true, requiresPrescription: true, sideEffects: ['Diarrhea', 'Rash', 'Nausea'], rating: 4.6, reviewCount: 543 },
    { name: 'Azithromycin 500mg', brand: 'Cipla', genericName: 'Azithromycin', manufacturer: 'Cipla Ltd.', mrp: 180, sellingPrice: 160, stock: 100, category: antibiotics._id, description: 'Used for respiratory tract and skin infections.', images: [{ url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=600' }], isFeatured: false, isAvailable: true, requiresPrescription: true, rating: 4.7, reviewCount: 312 },
    { name: 'Vitamin C 1000mg', brand: 'HealthViva', genericName: 'Ascorbic Acid', manufacturer: 'HealthViva India', mrp: 299, sellingPrice: 249, stock: 400, category: vitamins._id, description: 'High-potency Vitamin C for immune support and antioxidant protection.', images: [{ url: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=600' }], isFeatured: true, isAvailable: true, requiresPrescription: false, rating: 4.9, reviewCount: 2100 },
    { name: 'Vitamin D3 60000 IU', brand: 'Sun Pharma', genericName: 'Cholecalciferol', manufacturer: 'Sun Pharmaceutical', mrp: 85, sellingPrice: 72, stock: 250, category: vitamins._id, description: 'Weekly dose Vitamin D3 sachets for bone health and immunity.', images: [{ url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600' }], isFeatured: true, isAvailable: true, requiresPrescription: false, rating: 4.7, reviewCount: 1560 },
    { name: 'Omega 3 Fish Oil', brand: 'Now Foods', genericName: 'Omega-3 Fatty Acids', manufacturer: 'Now Foods India', mrp: 649, sellingPrice: 549, stock: 160, category: vitamins._id, description: '1000mg Omega-3 fish oil with EPA and DHA for heart and brain health.', images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600' }], isFeatured: true, isAvailable: true, requiresPrescription: false, rating: 4.8, reviewCount: 1890 },
    { name: 'Ashwagandha KSM-66', brand: 'Himalaya', genericName: 'Withania Somnifera', manufacturer: 'Himalaya Drug Company', mrp: 350, sellingPrice: 299, stock: 200, category: ayurvedic._id, description: 'Premium KSM-66 Ashwagandha extract for stress relief and energy.', images: [{ url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600' }], isFeatured: true, isAvailable: true, requiresPrescription: false, rating: 4.8, reviewCount: 3200 },
    { name: 'Triphala Churna', brand: 'Dabur', genericName: 'Triphala', manufacturer: 'Dabur India', mrp: 199, sellingPrice: 170, stock: 300, category: ayurvedic._id, description: 'Classical Ayurvedic formulation for digestive health and detox.', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600' }], isFeatured: false, isAvailable: true, requiresPrescription: false, rating: 4.5, reviewCount: 780 },
    { name: 'Cetaphil Moisturizing Cream', brand: 'Cetaphil', genericName: 'Emollient Cream', manufacturer: 'Galderma India', mrp: 490, sellingPrice: 420, stock: 120, category: skincare._id, description: 'Gentle moisturizer for dry and sensitive skin. Dermatologist recommended.', images: [{ url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=600' }], isFeatured: true, isAvailable: true, requiresPrescription: false, rating: 4.9, reviewCount: 4500 },
    { name: 'Metformin 500mg', brand: 'USV', genericName: 'Metformin HCl', manufacturer: 'USV Pvt. Ltd.', mrp: 65, sellingPrice: 55, stock: 300, category: diabetes._id, description: 'First-line oral antidiabetic medication for Type 2 Diabetes.', images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600' }], isFeatured: false, isAvailable: true, requiresPrescription: true, sideEffects: ['Nausea', 'Diarrhea'], rating: 4.6, reviewCount: 670 },
    { name: 'Sinarest Tablet', brand: 'Centaur Pharma', genericName: 'Paracetamol + Phenylephrine', manufacturer: 'Centaur Pharmaceuticals', mrp: 58, sellingPrice: 52, stock: 450, category: coldFlu._id, description: 'Relief from cold, sinusitis and nasal congestion.', images: [{ url: 'https://images.unsplash.com/photo-1576073719710-418242273944?auto=format&fit=crop&q=80&w=600' }], isFeatured: true, isAvailable: true, requiresPrescription: false, rating: 4.4, reviewCount: 980 },
    { name: 'Vicks Action 500', brand: 'Vicks', genericName: 'Paracetamol + Pseudoephedrine', manufacturer: 'Procter and Gamble', mrp: 42, sellingPrice: 38, stock: 600, category: coldFlu._id, description: 'Fast relief from cold symptoms including fever, body ache and congestion.', images: [{ url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=600' }], isFeatured: false, isAvailable: true, requiresPrescription: false, rating: 4.3, reviewCount: 1100 }
  ]);
  console.log(medicines.length + ' medicines created');

  // Update category product counts
  for (const cat of categories) {
    const count = await Medicine.countDocuments({ category: cat._id });
    await Category.findByIdAndUpdate(cat._id, { productCount: count });
  }

  // Banners
  await Banner.insertMany([
    { title: 'Up to 40% off on Vitamins', desktopImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1400', mobileImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=600', altText: 'Vitamins sale', linkType: 'category', linkValue: vitamins._id.toString(), showOn: ['home', 'shop'], displayOrder: 1, isActive: true },
    { title: 'Free delivery above 499', desktopImage: 'https://images.unsplash.com/photo-1601348604-7fe9c1fa1f66?auto=format&fit=crop&q=80&w=1400', mobileImage: 'https://images.unsplash.com/photo-1601348604-7fe9c1fa1f66?auto=format&fit=crop&q=80&w=600', altText: 'Free delivery', linkType: 'shop', showOn: ['home'], displayOrder: 2, isActive: true }
  ]);
  console.log('Banners created');

  // Coupons
  await Coupon.insertMany([
    { code: 'FIRST10', description: '10% off on your first order', discountType: 'percentage', discountValue: 10, maxDiscountAmount: 100, minOrderAmount: 200, totalUsageLimit: 1000, perUserLimit: 1, applicableTo: 'first_order', isActive: true, createdBy: admin._id },
    { code: 'SAVE50', description: 'Flat Rs.50 off on orders above Rs.500', discountType: 'flat', discountValue: 50, minOrderAmount: 500, totalUsageLimit: 500, perUserLimit: 2, applicableTo: 'all', isActive: true, createdBy: admin._id },
    { code: 'HEALTH20', description: '20% off on vitamins', discountType: 'percentage', discountValue: 20, maxDiscountAmount: 200, minOrderAmount: 300, applicableTo: 'category', applicableCategories: [vitamins._id], isActive: true, createdBy: admin._id }
  ]);
  console.log('Coupons created');

  // Site Settings
  await SiteSettings.findOneAndUpdate({}, {
    store: { name: 'MediCheap', tagline: 'Genuine Medicines. Honest Prices.' },
    homepage: {
      announcementBar: { isActive: true, bgColor: '#16A34A' },
      hero: { isActive: true },
      trustBar: { isActive: true },
      categoriesSection: { isActive: true, maxToShow: 8 },
      featuredMedicines: { isActive: true },
      prescriptionBanner: { isActive: true },
      whyUs: { isActive: true },
      reviewsSection: { isActive: true }
    },
    delivery: { fee: 49, freeAbove: 499, cutoffTime: '18:00', estimatedTime: '2-4 hours', codEnabled: true }
  }, { upsert: true, new: true });
  console.log('Site settings updated');

  console.log('\n=== SEED COMPLETE ===');
  console.log('Admin: admin@medicheap.in / admin123');
  console.log('User:  user@test.com / user123');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
