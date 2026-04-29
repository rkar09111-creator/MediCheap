require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Make io accessible throughout app
app.set('io', io);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // For development and ease of integration
}));
app.use(morgan('dev'));
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medicheap', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
    
    // Ensure Admin Exists
    const User = require('./models/User.model');
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Institutional Admin',
        email: 'admin@medicheap.co.in',
        password: 'adminpassword123',
        role: 'admin'
      });
      console.log('✅ Admin Seeded');
    }

    // Seed Medicines if empty
    const Medicine = require('./models/Medicine.model');
    const medicineCount = await Medicine.countDocuments();
    if (medicineCount === 0) {
      console.log('🔄 Seeding initial medicines...');
      const Category = require('./models/Category.model');
      
      const categories = [
        { name: 'General Health', icon: '💊' },
        { name: 'Antibiotics', icon: '🛡️' },
        { name: 'Ayurvedic', icon: '🌿' }
      ];

      for (const cat of categories) {
        let category = await Category.findOne({ name: cat.name });
        if (!category) {
          category = await Category.create({ name: cat.name, categoryNumber: Math.floor(Math.random() * 1000) });
        }

        const templates = [
          {
            name: `${cat.name} Sample Med A`,
            brand: 'MediCheap Premium',
            mrp: 100,
            sellingPrice: 85,
            stock: 50,
            category: category._id,
            images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600'],
            isFeatured: true
          },
          {
            name: `${cat.name} Sample Med B`,
            brand: 'MediCheap Premium',
            mrp: 200,
            sellingPrice: 170,
            stock: 30,
            category: category._id,
            images: ['https://images.unsplash.com/photo-1576073719710-418242273944?auto=format&fit=crop&q=80&w=600'],
            isFeatured: true
          }
        ];

        for (const t of templates) {
          await Medicine.create(t);
        }
      }
      console.log('✅ Medicines Seeded');
    }
  } catch (err) {
    console.log('⚠️ Persistent MongoDB failed, starting Memory Server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log('🚀 In-Memory MongoDB connected');

    const User = require('./models/User.model');
    const Medicine = require('./models/Medicine.model');
    const Category = require('./models/Category.model');
    const Banner = require('./models/Banner.model');
    const Coupon = require('./models/Coupon.model');
    const SiteSettings = require('./models/SiteSettings.model');

    // Admin user
    const admin = await User.create({
      name: 'MediCheap Admin',
      email: 'admin@medicheap.in',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin',
      isActive: true
    });
    // Test customer
    await User.create({
      name: 'Rahul Sharma',
      email: 'user@test.com',
      password: 'user123',
      phone: '9876543210',
      role: 'user',
      isActive: true
    });

    // Categories
    const cats = await Category.insertMany([
      { name: 'General Health',        icon: '💊', slug: 'general-health', displayOrder: 1, isActive: true, showOnHomepage: true },
      { name: 'Antibiotics',            icon: '🛡️', slug: 'antibiotics',    displayOrder: 2, isActive: true, showOnHomepage: true },
      { name: 'Vitamins & Supplements', icon: '🌟', slug: 'vitamins',       displayOrder: 3, isActive: true, showOnHomepage: true },
      { name: 'Ayurvedic',              icon: '🌿', slug: 'ayurvedic',      displayOrder: 4, isActive: true, showOnHomepage: true },
      { name: 'Skincare',               icon: '✨', slug: 'skincare',       displayOrder: 5, isActive: true, showOnHomepage: true },
      { name: 'Diabetes Care',          icon: '🩸', slug: 'diabetes-care',  displayOrder: 6, isActive: true, showOnHomepage: true },
      { name: 'Heart Health',           icon: '❤️', slug: 'heart-health',  displayOrder: 7, isActive: true, showOnHomepage: false },
      { name: 'Cold & Flu',             icon: '🤧', slug: 'cold-flu',       displayOrder: 8, isActive: true, showOnHomepage: true }
    ]);
    const [general, antibiotics, vitamins, ayurvedic, skincare, diabetes, heart, coldFlu] = cats;

    // Medicines — images must be plain strings per Medicine.model.js schema
    const IMG = {
      pill1:   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
      pill2:   'https://images.unsplash.com/photo-1576073719710-418242273944?auto=format&fit=crop&q=80&w=600',
      pill3:   'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=600',
      pill4:   'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=600',
      vitC:    'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=600',
      vitD:    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600',
      omega3:  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600',
      herb:    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      herb2:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
      cream:   'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=600'
    };
    const medsData = [
      { name: 'Dolo 650',           brand: 'Micro Labs', genericName: 'Paracetamol',              manufacturer: 'Micro Labs Ltd.',       mrp: 30,  sellingPrice: 28,  stock: 500, category: general._id,    description: 'Used for fever and mild to moderate pain relief. Contains Paracetamol 650mg.',        images: [IMG.pill1], isFeatured: true,  isAvailable: true, requiresPrescription: false, avgRating: 4.8, totalReviews: 1243 },
      { name: 'Crocin Pain Relief', brand: 'Haleon',     genericName: 'Paracetamol + Caffeine',   manufacturer: 'Haleon India',           mrp: 45,  sellingPrice: 40,  stock: 300, category: general._id,    description: 'Effective for headache, bodyache and fever.',                                         images: [IMG.pill2], isFeatured: true,  isAvailable: true, requiresPrescription: false, avgRating: 4.5, totalReviews: 876 },
      { name: 'Pantoprazole 40mg',  brand: 'Sun Pharma', genericName: 'Pantoprazole',             manufacturer: 'Sun Pharmaceutical',    mrp: 110, sellingPrice: 95,  stock: 200, category: general._id,    description: 'Used for gastric acid disorders, GERD and peptic ulcers.',                            images: [IMG.pill3], isFeatured: false, isAvailable: true, requiresPrescription: true,  avgRating: 4.6, totalReviews: 540 },
      { name: 'Amoxicillin 500mg',  brand: 'Abbott',     genericName: 'Amoxicillin',              manufacturer: 'Abbott Healthcare',     mrp: 120, sellingPrice: 108, stock: 150, category: antibiotics._id, description: 'Broad-spectrum antibiotic for bacterial infections. Prescription required.',          images: [IMG.pill4], isFeatured: true,  isAvailable: true, requiresPrescription: true,  avgRating: 4.6, totalReviews: 543 },
      { name: 'Azithromycin 500mg', brand: 'Cipla',      genericName: 'Azithromycin',             manufacturer: 'Cipla Ltd.',             mrp: 180, sellingPrice: 160, stock: 100, category: antibiotics._id, description: 'Used for respiratory tract and skin infections.',                                  images: [IMG.pill3], isFeatured: false, isAvailable: true, requiresPrescription: true,  avgRating: 4.7, totalReviews: 312 },
      { name: 'Vitamin C 1000mg',   brand: 'HealthViva', genericName: 'Ascorbic Acid',            manufacturer: 'HealthViva India',       mrp: 299, sellingPrice: 249, stock: 400, category: vitamins._id,   description: 'High-potency Vitamin C for immune support and antioxidant protection.',               images: [IMG.vitC],  isFeatured: true,  isAvailable: true, requiresPrescription: false, avgRating: 4.9, totalReviews: 2100 },
      { name: 'Vitamin D3 60000IU', brand: 'Sun Pharma', genericName: 'Cholecalciferol',          manufacturer: 'Sun Pharmaceutical',    mrp: 85,  sellingPrice: 72,  stock: 250, category: vitamins._id,   description: 'Weekly dose Vitamin D3 sachets for bone health and immunity.',                        images: [IMG.vitD],  isFeatured: true,  isAvailable: true, requiresPrescription: false, avgRating: 4.7, totalReviews: 1560 },
      { name: 'Omega 3 Fish Oil',   brand: 'Now Foods',  genericName: 'Omega-3 Fatty Acids',      manufacturer: 'Now Foods India',        mrp: 649, sellingPrice: 549, stock: 160, category: vitamins._id,   description: '1000mg Omega-3 fish oil with EPA and DHA for heart and brain health.',                images: [IMG.omega3],isFeatured: true,  isAvailable: true, requiresPrescription: false, avgRating: 4.8, totalReviews: 1890 },
      { name: 'Ashwagandha KSM-66', brand: 'Himalaya',   genericName: 'Withania Somnifera',       manufacturer: 'Himalaya Drug Company', mrp: 350, sellingPrice: 299, stock: 200, category: ayurvedic._id,  description: 'Premium KSM-66 Ashwagandha extract for stress relief and energy.',                    images: [IMG.herb],  isFeatured: true,  isAvailable: true, requiresPrescription: false, avgRating: 4.8, totalReviews: 3200 },
      { name: 'Triphala Churna',    brand: 'Dabur',      genericName: 'Triphala',                 manufacturer: 'Dabur India',            mrp: 199, sellingPrice: 170, stock: 300, category: ayurvedic._id,  description: 'Classical Ayurvedic formulation for digestive health and detox.',                     images: [IMG.herb2], isFeatured: false, isAvailable: true, requiresPrescription: false, avgRating: 4.5, totalReviews: 780 },
      { name: 'Cetaphil Cream',     brand: 'Cetaphil',   genericName: 'Emollient Cream',          manufacturer: 'Galderma India',         mrp: 490, sellingPrice: 420, stock: 120, category: skincare._id,   description: 'Gentle moisturizer for dry and sensitive skin. Dermatologist recommended.',           images: [IMG.cream], isFeatured: true,  isAvailable: true, requiresPrescription: false, avgRating: 4.9, totalReviews: 4500 },
      { name: 'Metformin 500mg',    brand: 'USV',        genericName: 'Metformin HCl',            manufacturer: 'USV Pvt. Ltd.',          mrp: 65,  sellingPrice: 55,  stock: 300, category: diabetes._id,   description: 'First-line oral antidiabetic medication for Type 2 Diabetes.',                        images: [IMG.pill1], isFeatured: false, isAvailable: true, requiresPrescription: true,  avgRating: 4.6, totalReviews: 670 },
      { name: 'Sinarest Tablet',    brand: 'Centaur',    genericName: 'Paracetamol+Phenylephrine',manufacturer: 'Centaur Pharma',         mrp: 58,  sellingPrice: 52,  stock: 450, category: coldFlu._id,   description: 'Relief from cold, sinusitis and nasal congestion.',                                   images: [IMG.pill2], isFeatured: true,  isAvailable: true, requiresPrescription: false, avgRating: 4.4, totalReviews: 980 },
      { name: 'Vicks Action 500',   brand: 'Vicks',      genericName: 'Paracetamol+Pseudoephedrine',manufacturer: 'P&G Health',          mrp: 42,  sellingPrice: 38,  stock: 600, category: coldFlu._id,   description: 'Fast relief from cold symptoms including fever, body ache and congestion.',            images: [IMG.pill3], isFeatured: false, isAvailable: true, requiresPrescription: false, avgRating: 4.3, totalReviews: 1100 }
    ];
    const meds = await Medicine.insertMany(medsData);

    // Update product counts
    for (const cat of cats) {
      const count = await Medicine.countDocuments({ category: cat._id });
      await Category.findByIdAndUpdate(cat._id, { productCount: count });
    }

    // Banners
    await Banner.insertMany([
      { title: 'Up to 40% off on Vitamins', desktopImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1400', mobileImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=600', altText: 'Vitamins sale', linkType: 'category', linkValue: vitamins._id.toString(), showOn: ['home', 'shop'], displayOrder: 1, isActive: true },
      { title: 'Free delivery above Rs.499', desktopImage: 'https://images.unsplash.com/photo-1601348604-7fe9c1fa1f66?auto=format&fit=crop&q=80&w=1400', mobileImage: 'https://images.unsplash.com/photo-1601348604-7fe9c1fa1f66?auto=format&fit=crop&q=80&w=600', altText: 'Free delivery', linkType: 'shop', showOn: ['home'], displayOrder: 2, isActive: true }
    ]);

    // Coupons
    await Coupon.insertMany([
      { code: 'FIRST10', description: '10% off on your first order', discountType: 'percentage', discountValue: 10, maxDiscountAmount: 100, minOrderAmount: 200, totalUsageLimit: 1000, perUserLimit: 1, applicableTo: 'first_order', isActive: true, createdBy: admin._id },
      { code: 'SAVE50',  description: 'Flat Rs.50 off on orders above Rs.500', discountType: 'flat', discountValue: 50, minOrderAmount: 500, totalUsageLimit: 500, perUserLimit: 2, applicableTo: 'all', isActive: true, createdBy: admin._id }
    ]);

    // Site settings
    await SiteSettings.create({
      store: { name: 'MediCheap', tagline: 'Genuine Medicines. Honest Prices.' },
      homepage: { announcementBar: { isActive: true, bgColor: '#16A34A' }, hero: { isActive: true }, categoriesSection: { isActive: true, maxToShow: 8 }, featuredMedicines: { isActive: true }, trustBar: { isActive: true }, prescriptionBanner: { isActive: true }, whyUs: { isActive: true }, reviewsSection: { isActive: true } },
      delivery: { fee: 49, freeAbove: 499, cutoffTime: '18:00', estimatedTime: '2-4 hours', codEnabled: true }
    });

    // Seed Companies if empty
    const Company = require('./models/Company.model');
    const CompanyCategory = require('./models/CompanyCategory.model');
    const CompanyProduct = require('./models/CompanyProduct.model');
    const companyCount = await Company.countDocuments();
    
    if (companyCount === 0) {
      console.log('🔄 Seeding initial companies & brands...');
      const igma = await Company.create({
        name: 'IGMA Ltd.',
        slug: 'igma-ltd',
        shortName: 'IGMA',
        tagline: 'Precision Pharma. Clinical Excellence.',
        description: 'IGMA Pharmaceuticals is a global leader in clinical research and high-fidelity pharmaceutical manufacturing. Our facilities adhere to the highest international standards of safety and efficacy.',
        logo: 'https://img.freepik.com/free-vector/abstract-logo-template_23-2148204646.jpg', // Placeholder logo
        primaryColor: '#16A34A',
        isFeatured: true,
        showOnWebsite: true
      });

      const cat = await CompanyCategory.create({
        company: igma._id,
        name: 'Clinical Antibiotics',
        slug: 'clinical-antibiotics',
        icon: '🛡️',
        displayOrder: 1
      });

      await CompanyProduct.create({
        company: igma._id,
        category: cat._id,
        name: 'IGMA Amoxiclav 625',
        slug: 'igma-amoxiclav-625',
        mrp: 185,
        sellingPrice: 149,
        stock: 250,
        unit: 'strip',
        packSize: '10 Tablets',
        requiresPrescription: true,
        isFeatured: true,
        description: 'High-potency Amoxicillin and Potassium Clavulanate Tablets IP.'
      });

      await Company.findByIdAndUpdate(igma._id, { totalCategories: 1, totalProducts: 1 });
      console.log('✅ Brands Seeded');
    }

    console.log('✅ Full dataset seeded to In-Memory DB');
    console.log('   Admin: admin@medicheap.in / admin123');
    console.log('   User:  user@test.com / user123');
    console.log('   Medicines:', meds.length, '| Categories:', cats.length);

  }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/rider', require('./routes/rider'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/search', require('./routes/search'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/companies', require('./routes/companies'));

// Socket setup
require('./socket')(io);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
