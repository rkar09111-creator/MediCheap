const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medicheap');
    const User = require('./models/User.model');
    const admin = await User.findOne({ email: 'admin@medicheap.co.in' });
    if (!admin) {
      console.log('Admin not found');
      process.exit(1);
    }
    console.log('Admin found:', admin.email);
    console.log('Role:', admin.role);
    
    const isMatch = await bcrypt.compare('adminpassword123', admin.password);
    console.log('Password Match:', isMatch);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
