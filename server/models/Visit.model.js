const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  },
  uniqueSessions: {
    type: [String], // Array of session IDs or IPs
    default: []
  },
  hourly: {
    type: [Number], // Array of 24 numbers
    default: Array(24).fill(0)
  }
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
