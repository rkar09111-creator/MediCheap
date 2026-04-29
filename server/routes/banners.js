const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner.model');
const { protect, restrictTo } = require('../middleware/auth');

// GET / — public: active banners for storefront
router.get('/', async (req, res) => {
  try {
    const { showOn } = req.query;
    const now = new Date();
    const query = {
      isActive: true,
      $or: [{ activeFrom: null }, { activeFrom: { $lte: now } }],
      $and: [{ $or: [{ activeUntil: null }, { activeUntil: { $gte: now } }] }]
    };
    if (showOn) query.showOn = showOn;

    const banners = await Banner.find(query).sort({ displayOrder: 1 });
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST / — admin: create banner
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    const io = req.app.get('io');
    io.emit('banners:updated');
    res.status(201).json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:id — admin: update banner
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    const io = req.app.get('io');
    io.emit('banners:updated');
    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/toggle — admin: toggle banner active state
router.patch('/:id/toggle', protect, restrictTo('admin'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    banner.isActive = !banner.isActive;
    await banner.save();
    const io = req.app.get('io');
    io.emit('banners:updated');
    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id — admin: delete banner
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    const io = req.app.get('io');
    io.emit('banners:updated');
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
