import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  phone: { type: String, required: true },
  patientInstructions: String,
  status: { 
    type: String, 
    enum: ['pending','approved','rejected','fulfilled','ordered'], 
    default: 'pending' 
  },
  priority: { 
    type: String, 
    enum: ['standard', 'urgent', 'refill'], 
    default: 'standard' 
  },
  adminNotes: String,
  linkedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  createdAt: { type: Date, default: Date.now }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
