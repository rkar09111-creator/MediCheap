import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  categoryNumber: {
    type: Number,
    required: true,
    unique: true
  },
  description: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  icon: String,
  itemCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
