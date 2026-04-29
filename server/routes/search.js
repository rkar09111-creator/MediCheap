const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine.model');
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const { protect, restrictTo } = require('../middleware/auth');

// GET /global — admin global search
router.get('/global', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, results: [] });

    const regex = new RegExp(q, 'i');

    const [medicines, orders, users] = await Promise.all([
      // Search Medicines
      Medicine.find({
        $or: [
          { name: regex },
          { brand: regex },
          { genericName: regex },
          { sku: regex }
        ]
      }).limit(5).select('name brand images sellingPrice stock'),

      // Search Orders
      Order.find({
        $or: [
          { orderId: regex },
          { 'deliveryAddress.fullName': regex },
          { 'deliveryAddress.phone': regex }
        ]
      }).limit(5).populate('user', 'name').select('orderId pricing status createdAt'),

      // Search Users
      User.find({
        role: 'user',
        $or: [
          { name: regex },
          { email: regex },
          { phone: regex }
        ]
      }).limit(5).select('name email phone')
    ]);

    // Format results
    const results = [
      ...medicines.map(m => ({
        id: m._id,
        type: 'medicine',
        title: m.name,
        subtitle: m.brand,
        image: m.images?.[0],
        meta: `₹${m.sellingPrice} • Stock: ${m.stock}`,
        link: `/admin/medicines/${m._id}/edit`
      })),
      ...orders.map(o => ({
        id: o._id,
        type: 'order',
        title: o.orderId,
        subtitle: o.user?.name || 'Guest User',
        meta: `₹${o.pricing.total} • ${o.status.replace(/_/g, ' ')}`,
        link: `/admin/orders?id=${o._id}`
      })),
      ...users.map(u => ({
        id: u._id,
        type: 'user',
        title: u.name,
        subtitle: u.email,
        meta: u.phone,
        link: `/admin/customers?id=${u._id}`
      }))
    ];

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
