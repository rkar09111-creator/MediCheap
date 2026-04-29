import mongoose from 'mongoose';

const paymentSettingsSchema = new mongoose.Schema({
  upi: {
    enabled: { type: Boolean, default: true },
    qrImageUrl: { type: String },
    qrImagePublicId: { type: String },
    upiId: { type: String },
    payeeName: { type: String },
    instructions: { 
      type: String,
      default: 'Scan QR with any UPI app and enter exact amount. Share screenshot after payment.' 
    },
    updatedAt: { type: Date },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  cod: {
    enabled: { type: Boolean, default: true },
    maxAmount: { type: Number, default: 5000 },
    extraCharge: { type: Number, default: 0 },
    instructions: { 
      type: String,
      default: 'Keep exact change ready. Our rider will collect payment on delivery.' 
    },
    availablePincodes: [String],
    unavailablePincodes: [String]
  },
  updatedAt: { type: Date, default: Date.now }
});

const PaymentSettings = mongoose.model('PaymentSettings', paymentSettingsSchema);
export default PaymentSettings;
