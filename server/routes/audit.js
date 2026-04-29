const express = require('express');
const router = express.Router();
const Audit = require('../models/Audit');
const { protect, restrictTo } = require('../middleware/auth');

// GET /all [admin]
router.get('/all', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, action, entity } = req.query;
    const query = {};
    if (action && action !== 'All') query.action = action;
    if (entity) query.entity = entity;

    const logs = await Audit.find(query)
      .populate('admin', 'name role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Audit.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalLogs: count
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
