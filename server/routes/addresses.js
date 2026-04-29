const express = require('express');
const router = express.Router();
const Address = require('../models/Address.model');
const { protect } = require('../middleware/auth');
const axios = require('axios');

// GET / [user]
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id, isActive: true })
      .sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST / [user]
router.post('/', protect, async (req, res) => {
  try {
    const { isDefault } = req.body;
    
    if (isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    const addressCount = await Address.countDocuments({ userId: req.user.id, isActive: true });
    const address = await Address.create({
      ...req.body,
      userId: req.user.id,
      isDefault: addressCount === 0 ? true : isDefault
    });

    res.status(201).json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/set-default [user]
router.patch('/:id/set-default', protect, async (req, res) => {
  try {
    await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isDefault: true },
      { new: true }
    );
    res.json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /geocode [public proxy to Nominatim]
router.post('/geocode', async (req, res) => {
  try {
    const { address } = req.body;
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', limit: 1, countrycodes: 'in' },
      headers: { 'User-Agent': 'MediCheap/1.0 (medicheap.in)' }
    });
    
    if (response.data.length === 0) return res.status(404).json({ success: false, message: 'Location not found' });
    
    const { lat, lon, display_name } = response.data[0];
    res.json({ success: true, lat: Number(lat), lng: Number(lon), displayName: display_name });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /reverse-geocode
router.post('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { lat, lon: lng, format: 'json' },
      headers: { 'User-Agent': 'MediCheap/1.0 (medicheap.in)' }
    });
    
    res.json({ success: true, address: response.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
