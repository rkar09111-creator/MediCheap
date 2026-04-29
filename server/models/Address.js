import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  label: { 
    type: String, 
    enum: ['Home', 'Work', 'Other', 'Hotel'],
    default: 'Home'
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  flatNo: { type: String, required: true },
  buildingName: { type: String },
  streetArea: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
