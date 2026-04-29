import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import seedData from '../seeder.js';

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;
        let isInMemory = false;

        console.log('🔍 Checking Database Connectivity...');

        // Try to connect to MONGO_URI if it exists
        if (mongoUri) {
            try {
                // Set a short timeout for local connection check
                await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
                console.log(`✅ Persistent MongoDB Connected: ${mongoose.connection.host}`);
            } catch (err) {
                console.log('⚠️ Persistent MongoDB Connection Failed. Falling back to In-Memory...');
                isInMemory = true;
            }
        } else {
            isInMemory = true;
        }

        if (isInMemory) {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('🚀 In-Memory MongoDB Connected (Data will reset on server restart)');
        }

        // Always run seeder to ensure Admin/Rider accounts exist
        await seedData();
        
    } catch (error) {
        console.error(`❌ Critical DB Error: ${error.message}`);
        // Don't exit, try to survive
    }
};

export default connectDB;
