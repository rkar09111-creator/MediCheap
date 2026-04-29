const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['user','admin','rider'], 
    default: 'user' 
  },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  defaultAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  fcmToken: { type: String },
  walletBalance: { type: Number, default: 0 },
  vitals: {
    bloodGroup: { type: String, default: 'O+' },
    weight: { type: String, default: '70kg' },
    height: { type: String, default: '175cm' },
    o2Saturation: { type: String, default: '98%' },
    pulse: { type: String, default: '72 BPM' },
    sleep: { type: String, default: '8h' },
    bmi: { type: String, default: '22.5' },
    trustIndex: { type: String, default: '99%' }
  },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
