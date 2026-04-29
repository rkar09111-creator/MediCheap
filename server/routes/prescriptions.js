const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription.model');
const { protect, restrictTo } = require('../middleware/auth');

// POST /upload [user]
router.post('/upload', protect, async (req, res) => {
  try {
    const { imageUrl, adminNotes } = req.body;
    const prescription = await Prescription.create({
      user: req.user.id,
      imageUrl,
      adminNotes,
      status: 'pending'
    });

    const io = req.app.get('io');
    io.to('admin').emit('prescription:new', { prescription });

    res.status(201).json({ success: true, data: { prescription } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /mine [user]
router.get('/mine', protect, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    res.json({ success: true, data: { prescriptions } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /my [user] — alias for /mine (frontend compatibility)
router.get('/my', protect, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    res.json({ success: true, data: { prescriptions } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /all [admin]
router.get('/all', protect, restrictTo('admin'), async (req, res) => {
  try {
    const prescriptions = await Prescription.find().populate('user').sort({ uploadedAt: -1 });
    res.json({ success: true, data: { prescriptions } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/status [admin]
router.patch('/:id/status', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });

    prescription.status = status;
    if (adminNotes) prescription.adminNotes = adminNotes;
    if (status === 'verified') {
      prescription.reviewedBy = req.user.id;
      prescription.reviewedAt = Date.now();
    }
    await prescription.save();

    const io = req.app.get('io');
    io.to(`user:${prescription.user}`).emit('prescription:status_changed', { id: prescription._id, status });

    res.json({ success: true, data: { prescription } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/verify [admin] - Legacy alias
router.patch('/:id/verify', protect, restrictTo('admin'), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, { 
      status: 'verified', 
      reviewedBy: req.user.id,
      reviewedAt: Date.now()
    }, { new: true });

    const io = req.app.get('io');
    io.to(`user:${prescription.user}`).emit('prescription:verified', { id: prescription._id });

    res.json({ success: true, data: { prescription } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
