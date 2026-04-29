const express = require('express');
const router = express.Router();
const Review = require('../models/Review.model');
const Medicine = require('../models/Medicine.model');
const Order = require('../models/Order.model');
const { protect, restrictTo } = require('../middleware/auth');

// POST / — user submits a review [protected]
router.post('/', protect, async (req, res) => {
  try {
    const { medicineId, orderId, rating, title, body } = req.body;

    // Prevent duplicate reviews for same order+medicine
    const existing = await Review.findOne({ medicine: medicineId, user: req.user.id, order: orderId });
    if (existing) return res.status(400).json({ success: false, message: 'Review already submitted for this order' });

    const isVerifiedPurchase = orderId ? !!(await Order.findOne({ _id: orderId, user: req.user.id })) : false;

    const review = await Review.create({
      medicine: medicineId,
      user: req.user.id,
      order: orderId,
      rating,
      title,
      body,
      isVerifiedPurchase,
      status: 'pending'
    });

    // Update medicine average rating
    const allReviews = await Review.find({ medicine: medicineId, status: 'approved' });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);
    await Medicine.findByIdAndUpdate(medicineId, { rating: avg.toFixed(1), reviewCount: allReviews.length });

    // Notify admin
    const io = req.app.get('io');
    io.to('admin').emit('review:new', { review });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /medicine/:medicineId — public review listing for a product
router.get('/medicine/:medicineId', async (req, res) => {
  try {
    const reviews = await Review.find({ medicine: req.params.medicineId, status: 'approved' })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /all — admin: all reviews with filters
router.get('/all', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 30 } = req.query;
    const query = {};
    if (status) query.status = status;
    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('user', 'name email avatar')
      .populate('medicine', 'name brand images')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, reviews, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/status — admin: approve/reject review
router.patch('/:id/status', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse, adminResponseAt: status === 'approved' ? Date.now() : undefined },
      { new: true }
    ).populate('user', 'name');
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id — admin: delete review
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
