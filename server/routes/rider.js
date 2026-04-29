const express = require('express');
const router = express.Router();
const RiderLocation = require('../models/RiderLocation.model');
const { protect, restrictTo } = require('../middleware/auth');

// GET /available — admin: list online riders
router.get('/available', protect, restrictTo('admin'), async (req, res) => {
  try {
    const riders = await RiderLocation.find({ isOnline: true }).populate('rider', 'name phone email');
    res.json({ success: true, data: { riders } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /location — rider: update coordinates
router.patch('/location', protect, restrictTo('rider'), async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const riderLocation = await RiderLocation.findOneAndUpdate(
      { rider: req.user.id },
      { 
        coordinates: { lat, lng },
        isOnline: true,
        lastUpdated: Date.now()
      },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: { riderLocation } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /toggle-status — rider: online/offline
router.patch('/toggle-status', protect, restrictTo('rider'), async (req, res) => {
  try {
    const { isOnline } = req.body;
    const riderLocation = await RiderLocation.findOneAndUpdate(
      { rider: req.user.id },
      { isOnline },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: { riderLocation } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
