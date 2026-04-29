const express = require('express');
const router = express.Router();
const Category = require('../models/Category.model');
const { protect, restrictTo } = require('../middleware/auth');

// GET / [public]
router.get('/', async (req, res) => {
  try {
    const { system, showOnHomepage, isActive } = req.query;
    let query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';

    if (system) query.medicineSystem = system;
    if (showOnHomepage) query.showOnHomepage = showOnHomepage === 'true';

    const categories = await Category.find(query).sort({ displayOrder: 1 });
    res.json({ success: true, data: { categories } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /:id [public]
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN ROUTES
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const category = await Category.create(req.body);
    const io = req.app.get('io');
    io.emit('categories:updated');
    res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/reorder', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { categoryIds } = req.body;
    for (let i = 0; i < categoryIds.length; i++) {
      await Category.findByIdAndUpdate(categoryIds[i], { displayOrder: i });
    }
    const io = req.app.get('io');
    io.emit('categories:updated');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/toggle — admin: toggle category status
router.patch('/:id/toggle', protect, restrictTo('admin'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    
    category.status = category.status === 'active' ? 'inactive' : 'active';
    category.isActive = category.status === 'active';
    await category.save();
    
    const io = req.app.get('io');
    io.emit('categories:updated');
    res.json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:id — admin: update category
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const io = req.app.get('io');
    io.emit('categories:updated');
    res.json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id — admin: delete category
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    const io = req.app.get('io');
    io.emit('categories:updated');
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
