import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const cleanSeed = async () => {
    try {
        console.log('🔄 Starting Clean Seed...');
        await connectDB();
        
        // Remove existing to avoid duplicates or stale data
        await User.deleteMany({ email: { $in: ['admin@medicheap.co.in', 'rider@medicheap.co.in'] } });
        
        // Create fresh users
        await User.create([
            {
                name: 'Admin User',
                email: 'admin@medicheap.co.in',
                password: 'adminpassword123',
                role: 'admin',
                phone: '9876543210'
            },
            {
                name: 'Rider John',
                email: 'rider@medicheap.co.in',
                password: 'riderpassword123',
                role: 'rider',
                phone: '9876543211'
            }
        ]);
        
        console.log('✅ CLEAN SEED SUCCESSFUL: admin@medicheap.co.in and rider@medicheap.co.in are ready.');
        process.exit(0);
    } catch (e) {
        console.error('❌ SEED FAILED:', e);
        process.exit(1);
    }
};

cleanSeed();
