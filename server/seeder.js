import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicine from './models/Medicine.js';
import User from './models/User.js';
import Setting from './models/Setting.js';
import Category from './models/Category.js';
import Order from './models/Order.js';

dotenv.config();

const medicineTemplates = [
  {
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    brand: 'Crocin Advanced',
    categoryName: 'General Health',
    medicineType: 'Tablet',
    medicineSystem: 'Allopathic',
    regulatoryCategory: 'OTC',
    consumerCategory: 'Wellness & Fitness',
    description: 'Fast-acting relief from fever and mild to moderate pain.',
    mrp: 50,
    sellingPrice: 45,
    stock: 500,
    requiresPrescription: false,
    manufacturer: 'GlaxoSmithKline (GSK)',
    images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600', isCover: true }]
  },
  {
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    brand: 'Augmentin Duo',
    categoryName: 'Antibiotics',
    medicineType: 'Tablet',
    medicineSystem: 'Allopathic',
    regulatoryCategory: 'POM',
    consumerCategory: 'Immunity & Defence',
    description: 'Broad-spectrum antibiotic used to treat bacterial infections.',
    mrp: 200,
    sellingPrice: 180,
    stock: 120,
    requiresPrescription: true,
    manufacturer: 'Pfizer Pharmaceuticals',
    images: [{ url: 'https://images.unsplash.com/photo-1576073719710-418242273944?auto=format&fit=crop&q=80&w=600', isCover: true }]
  },
  {
    name: 'Ashwagandha Churna',
    genericName: 'Withania Somnifera',
    brand: 'Himalaya Pure Herbs',
    categoryName: 'Ayurvedic',
    medicineType: 'Powder',
    medicineSystem: 'Ayurvedic',
    regulatoryCategory: 'OTC',
    consumerCategory: 'Vitamins & Supplements',
    description: 'Natural stress reliever and immunity booster.',
    mrp: 180,
    sellingPrice: 165,
    stock: 300,
    requiresPrescription: false,
    manufacturer: 'Himalaya Wellness',
    images: [{ url: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=600', isCover: true }]
  },
  {
    name: 'Arnica Montana 30C',
    genericName: 'Arnica',
    brand: 'SBL Homeopathy',
    categoryName: 'Homeopathic',
    medicineType: 'Other',
    medicineSystem: 'Homeopathic',
    regulatoryCategory: 'OTC',
    consumerCategory: 'Wellness & Fitness',
    description: 'Effective for muscle aches, stiffness, and bruising.',
    mrp: 120,
    sellingPrice: 110,
    stock: 200,
    requiresPrescription: false,
    manufacturer: 'SBL Ltd',
    images: [{ url: 'https://images.unsplash.com/photo-1550573105-342080f455b8?auto=format&fit=crop&q=80&w=600', isCover: true }]
  },
  {
    name: 'Yoga Mat Pro',
    genericName: 'TPE Yoga Mat',
    brand: 'FitLife',
    categoryName: 'Yoga Gear',
    medicineType: 'Other',
    medicineSystem: 'Yoga',
    regulatoryCategory: 'Medical Devices',
    consumerCategory: 'Wellness & Fitness',
    description: 'Extra thick 6mm TPE yoga mat with anti-skid surface.',
    mrp: 1200,
    sellingPrice: 999,
    stock: 50,
    requiresPrescription: false,
    manufacturer: 'FitLife India',
    images: [{ url: 'https://images.unsplash.com/photo-1592432676556-28456ac20460?auto=format&fit=crop&q=80&w=600', isCover: true }]
  },
  {
    name: 'Chyawanprash Special',
    genericName: 'Amla Mixed Herbs',
    brand: 'Dabur',
    categoryName: 'Ayurvedic',
    medicineType: 'Other',
    medicineSystem: 'Ayurvedic',
    regulatoryCategory: 'OTC',
    consumerCategory: 'Immunity & Defence',
    description: 'Authentic Ayurvedic formulation for overall immunity.',
    mrp: 350,
    sellingPrice: 315,
    stock: 150,
    requiresPrescription: false,
    manufacturer: 'Dabur India',
    images: [{ url: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=600', isCover: true }]
  },
  {
    name: 'Nasal Spray Relief',
    genericName: 'Oxymetazoline',
    brand: 'Otrivin',
    categoryName: 'Respiratory',
    medicineType: 'Drops',
    medicineSystem: 'Allopathic',
    regulatoryCategory: 'GSL',
    consumerCategory: 'Respiratory Care',
    description: 'Fast relief from blocked nose due to cold or allergies.',
    mrp: 95,
    sellingPrice: 85,
    stock: 400,
    requiresPrescription: false,
    manufacturer: 'GSK Consumer Health',
    images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600', isCover: true }]
  }
];

export default async function seedData() {
  try {
    // 1. Seed Categories
    let categories = await Category.find();
    if (categories.length === 0) {
      const categoryNames = [...new Set(medicineTemplates.map(m => m.categoryName))];
      const categoryDocs = categoryNames.map((name, index) => ({
        name,
        categoryNumber: 100 + index,
        description: `Essential ${name} medications`,
        status: 'active'
      }));
      categories = await Category.insertMany(categoryDocs);
      console.log('✅ Categories Seeded');
    }

    // 2. Seed Users
    let admin = await User.findOne({ role: 'admin' });
    let rider = await User.findOne({ role: 'rider' });
    let customer = await User.findOne({ role: 'user' });

    if (!admin || !rider || !customer) {
      const users = [];
      if (!admin) users.push({ name: 'Institutional Admin', email: 'admin@medicheap.co.in', password: 'adminpassword123', role: 'admin', phone: '9876543210' });
      if (!rider) users.push({ name: 'Rider John', email: 'rider@medicheap.co.in', password: 'riderpassword123', role: 'rider', phone: '9876543211' });
      if (!customer) users.push({ name: 'Premium Patient', email: 'user@example.com', password: 'userpassword123', role: 'user', phone: '9876543212' });
      
      const createdUsers = await User.create(users);
      admin = admin || createdUsers.find(u => u.role === 'admin');
      rider = rider || createdUsers.find(u => u.role === 'rider');
      customer = customer || createdUsers.find(u => u.role === 'user');
      console.log('✅ Users Seeded');
    }

    // 3. Seed Medicines
    let medicineDocs = await Medicine.find();
    if (medicineDocs.length === 0) {
      const medicinesToInsert = medicineTemplates.map(template => {
        const category = categories.find(c => c.name === template.categoryName);
        return {
          ...template,
          category: category._id,
          sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`
        };
      });
      medicineDocs = await Medicine.insertMany(medicinesToInsert);
      console.log('✅ Medicine Data Imported');
    }

    // 4. Seed Orders (to populate dashboard charts)
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      const sampleOrders = [];
      const statuses = ['pending', 'confirmed', 'packed', 'delivered'];
      
      for (let i = 0; i < 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7));
        
        const med = medicineDocs[Math.floor(Math.random() * medicineDocs.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        
        sampleOrders.push({
          orderId: `MC-${10000 + i}`,
          user: customer._id,
          items: [{ medicine: med._id, quantity: qty, price: med.sellingPrice }],
          totalAmount: med.sellingPrice * qty,
          deliveryAddress: { street: 'Main Road', city: 'Mumbai', pincode: '400001' },
          status: statuses[Math.floor(Math.random() * statuses.length)],
          paymentMethod: 'cod',
          paymentStatus: i % 3 === 0 ? 'paid' : 'pending',
          createdAt: date
        });
      }
      await Order.insertMany(sampleOrders);
      console.log('✅ Sample Orders Seeded');
    }

    // 5. Seed Settings
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      await Setting.create({
        key: 'trustVideoUrl',
        value: 'https://assets.mixkit.co/videos/preview/mixkit-biomedical-engineer-working-in-a-lab-41315-large.mp4',
        label: 'Shop Trust Video',
        description: 'Looping video shown in the shop header to build customer trust.'
      });
      console.log('✅ Global Settings Seeded');
    }
  } catch (error) {
    console.error(`❌ Seeding Error: ${error}`);
  }
}
