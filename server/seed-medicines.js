import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicine from './models/Medicine.js';
import Category from './models/Category.js';
import connectDB from './config/db.js';

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

const seed = async () => {
  try {
    await connectDB();
    console.log('🔄 Cleaning Medicines...');
    await Medicine.deleteMany({});
    
    console.log('🔄 Seeding Medicines...');
    for (const template of medicineTemplates) {
      let category = await Category.findOne({ name: template.categoryName });
      if (!category) {
        category = await Category.create({
          name: template.categoryName,
          categoryNumber: Math.floor(Math.random() * 1000),
          status: 'active'
        });
      }
      
      await Medicine.create({
        ...template,
        category: category._id,
        sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`
      });
    }
    
    console.log('✅ Medicine Seeding Successful');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
};

seed();
