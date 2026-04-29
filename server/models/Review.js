import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  photos: [String],
  isVerifiedPurchase: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Published', 'Rejected', 'Flagged'], default: 'Pending' },
  adminResponse: {
    text: String,
    respondedAt: Date,
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
