const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings.model');
const { protect, restrictTo } = require('../middleware/auth');

// GET / [public]
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /homepage [public]
router.get('/homepage', async (req, res) => {
  try {
    const settings = await SiteSettings.findOne().select('homepage');
    res.json({ success: true, homepage: settings?.homepage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN ROUTES
router.put('/homepage', protect, restrictTo('admin'), async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, { homepage: req.body }, { new: true, upsert: true });
    const io = req.app.get('io');
    io.emit('settings:updated', { section: 'homepage', data: settings.homepage });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/store', protect, restrictTo('admin'), async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, { store: req.body }, { new: true, upsert: true });
    const io = req.app.get('io');
    io.emit('settings:updated', { section: 'store', data: settings.store });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/delivery', protect, restrictTo('admin'), async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, { delivery: req.body }, { new: true, upsert: true });
    const io = req.app.get('io');
    io.emit('settings:updated', { section: 'delivery', data: settings.delivery });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, message: 'Key required' });
    
    const settings = await SiteSettings.findOneAndUpdate({}, { [key]: value }, { new: true, upsert: true });
    
    const io = req.app.get('io');
    io.emit('settings:updated', { section: key, data: value });
    
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
