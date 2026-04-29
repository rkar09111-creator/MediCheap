const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine.model');
const Category = require('../models/Category.model');
const StockMovement = require('../models/StockMovement.model');
const { protect, restrictTo } = require('../middleware/auth');
const { logActivity } = require('../middleware/audit');

// GET / [public]
router.get('/', async (req, res) => {
  try {
    const { 
      system, category, type, consumer, 
      price_min, price_max, rating, brand, 
      in_stock, discount, sort, page = 1, limit = 24, q,
      featured, recommended, ids
    } = req.query;

    let query = { deletedAt: null };

    if (ids) {
      query._id = { $in: ids.split(',') };
    }
    if (system) query.medicineSystem = system;
    if (category) query.category = category;
    if (type) query.regulatoryType = type;
    if (consumer) query.consumerCategory = consumer;
    if (brand) query.brand = brand;
    if (featured) query.isFeatured = featured === 'true';
    if (recommended) query.isRecommended = recommended === 'true';
    
    if (price_min || price_max) {
      query.sellingPrice = {};
      if (price_min) query.sellingPrice.$gte = Number(price_min);
      if (price_max) query.sellingPrice.$lte = Number(price_max);
    }

    if (rating) query.avgRating = { $gte: Number(rating) };
    if (in_stock === 'true') query.stock = { $gt: 0 };
    if (discount) query.discount = { $gte: Number(discount) };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { genericName: { $regex: q, $options: 'i' } },
        { searchTags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    let sortQuery = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortQuery[field] = order === 'desc' ? -1 : 1;
    } else {
      sortQuery.createdAt = -1;
    }

    const total = await Medicine.countDocuments(query);
    const medicines = await Medicine.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('category');

    res.json({
      success: true,
      data: {
        medicines,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /search [public]
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    const medicines = await Medicine.find({
      deletedAt: null,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { genericName: { $regex: q, $options: 'i' } },
        { searchTags: { $in: [new RegExp(q, 'i')] } }
      ]
    }).limit(Number(limit)).select('name brand image mrp sellingPrice');

    res.json({ success: true, data: { results: medicines } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /:id [public]
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id)
      .populate('category')
      .populate('relatedMedicines');
    
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });

    medicine.viewCount += 1;
    await medicine.save();

    res.json({ success: true, data: { medicine } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN ROUTES
router.post('/', protect, restrictTo('admin'), logActivity('CREATE_MEDICINE', 'Medicine'), async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    await Category.findByIdAndUpdate(medicine.category, { $inc: { productCount: 1 } });
    
    const io = req.app.get('io');
    io.emit('medicine:added', medicine);

    res.status(201).json({ success: true, data: { medicine } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:id [admin]
router.put('/:id', protect, restrictTo('admin'), logActivity('UPDATE_MEDICINE', 'Medicine'), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    
    const io = req.app.get('io');
    io.emit('medicine:updated', medicine);

    res.json({ success: true, data: { medicine } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id [admin]
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, { deletedAt: Date.now() });
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    
    await Category.findByIdAndUpdate(medicine.category, { $inc: { productCount: -1 } });

    const io = req.app.get('io');
    io.emit('medicine:deleted', req.params.id);

    res.json({ success: true, message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/toggle-availability [admin]
router.patch('/:id/toggle-availability', protect, restrictTo('admin'), async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    medicine.isAvailable = !medicine.isAvailable;
    await medicine.save();

    const io = req.app.get('io');
    io.emit('medicine:updated', medicine);

    res.json({ success: true, data: { medicine } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/update-stock [admin]
router.patch('/:id/update-stock', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { type, quantity, reason, notes } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    
    const previousStock = medicine.stock;
    if (type === 'in') medicine.stock += Number(quantity);
    if (type === 'out') medicine.stock -= Number(quantity);
    if (type === 'adjust') medicine.stock = Number(quantity);

    await medicine.save();

    await StockMovement.create({
      medicine: medicine._id,
      type,
      quantity,
      previousStock,
      newStock: medicine.stock,
      reason,
      notes,
      doneBy: req.user.id
    });

    const io = req.app.get('io');
    io.emit('medicine:updated', medicine);
    if (medicine.stock <= medicine.minStockAlert) {
      io.emit('stock:low', { medicine, stock: medicine.stock });
    }

    res.json({ success: true, data: { medicine } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /bulk-import [admin]
router.post('/bulk-import', protect, restrictTo('admin'), logActivity('BULK_IMPORT_STOCK', 'Medicine'), async (req, res) => {
  try {
    const updates = req.body; // Array of { serialNumber, stock }
    let updatedCount = 0;

    for (const update of updates) {
      if (!update.serialNumber) continue;
      const medicine = await Medicine.findOneAndUpdate(
        { serialNumber: update.serialNumber },
        { stock: update.stock },
        { new: true }
      );
      if (medicine) updatedCount++;
    }

    const io = req.app.get('io');
    io.emit('inventory:bulk_updated', { updated: updatedCount });

    res.json({ success: true, data: { updated: updatedCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

