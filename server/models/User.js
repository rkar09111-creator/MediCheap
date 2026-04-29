import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  healthProfile: {
    age: Number,
    gender: String,
    bloodGroup: String,
    weight: Number,
    height: Number,
    allergies: [String],
    chronicConditions: [String],
    weightHistory: [{ value: Number, date: { type: Date, default: Date.now } }],
    medicalHistory: [{
      title: String,
      description: String,
      date: Date,
      documents: [String]
    }]
  },
  savedAddresses: [{
    label: String,
    street: String,
    city: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }],
  walletBalance: { type: Number, default: 0 },
  walletTransactions: [{
    amount: Number,
    type: { type: String, enum: ['credit', 'debit'] },
    description: String,
    date: { type: Date, default: Date.now }
  }],
  subscriptions: [{
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    frequency: Number, // in days
    startDate: { type: Date, default: Date.now },
    nextRefillDate: Date,
    isActive: { type: Boolean, default: true }
  }],
  role: { 
    type: String, 
    enum: ['user', 'admin', 'rider'], 
    default: 'user' 
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
export default User;
