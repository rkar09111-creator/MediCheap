const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

async function test() {
  console.log('Testing connection to:', process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('SUCCESS: Connected to persistent MongoDB');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error('FAILURE:', err.message);
    process.exit(1);
  }
}

test();
