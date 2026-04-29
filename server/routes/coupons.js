const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon.model');
const { protect, restrictTo } = require('../middleware/auth');

// POST /validate [user]
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or inactive coupon' });

    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) return res.status(400).json({ success: false, message: 'Coupon not yet valid' });
    if (coupon.validUntil && now > coupon.validUntil) return res.status(400).json({ success: false, message: 'Coupon expired' });

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ success: false, message: `Minimum order amount ₹${coupon.minOrderAmount} required` });
    }

    if (coupon.totalUsageLimit && coupon.usedCount >= coupon.totalUsageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon limit reached' });
    }

    const userUsage = coupon.usedBy.filter(u => u.user.toString() === req.user.id).length;
    if (userUsage >= coupon.perUserLimit) {
      return res.status(400).json({ success: false, message: 'You have already used this coupon' });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({ success: true, discountAmount, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN ROUTES
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /all — admin: list all coupons
router.get('/all', protect, restrictTo('admin'), async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id — admin: update coupon
router.patch('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id — admin
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
