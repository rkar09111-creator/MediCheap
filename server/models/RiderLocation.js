import mongoose from 'mongoose';

const riderLocationSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  currentLocation: { 
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  isOnline: { type: Boolean, default: false },
  activeOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  lastUpdated: { type: Date, default: Date.now }
});

const RiderLocation = mongoose.model('RiderLocation', riderLocationSchema);
export default RiderLocation;
