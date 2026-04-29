import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicine from './models/Medicine.js';
import connectDB from './config/db.js';

dotenv.config();

const clear = async () => {
  try {
    await connectDB();
    await Medicine.deleteMany({});
    console.log('✅ Medicines Cleared');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

clear();
