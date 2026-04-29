const mongoose = require('mongoose');

const riderLocationSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  coordinates: { 
    lat: { type: Number }, 
    lng: { type: Number } 
  },
  isOnline: { type: Boolean, default: false },
  activeOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RiderLocation', riderLocationSchema);
