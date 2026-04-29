const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Order = require('../models/Order.model');
const { protect, restrictTo } = require('../middleware/auth');

// GET / — admin: list all customers with stats
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { search, page = 1, limit = 30, isBlocked } = req.query;
    const query = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (isBlocked !== undefined) query.isBlocked = isBlocked === 'true';

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Attach order count for each user
    const usersWithStats = await Promise.all(users.map(async (u) => {
      const orderCount = await Order.countDocuments({ user: u._id });
      const totalSpent = await Order.aggregate([
        { $match: { user: u._id, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]);
      return {
        ...u.toObject(),
        orderCount,
        totalSpent: totalSpent[0]?.total || 0
      };
    }));

    res.json({ success: true, data: { users: usersWithStats, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /:id — admin: single user detail
router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, user, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/block — admin: block/unblock user
router.patch('/:id/block', protect, restrictTo('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id — admin: delete user account
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /me/stats — [user]
router.get('/me/stats', protect, async (req, res) => {
  try {
    const [orderCount, totalSpent, recentActivity] = await Promise.all([
      Order.countDocuments({ user: req.user.id }),
      Order.aggregate([
        { $match: { user: req.user.id, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(3).select('orderId status createdAt pricing')
    ]);

    res.json({
      success: true,
      data: {
        orderCount,
        totalSpent: totalSpent[0]?.total || 0,
        recentActivity: recentActivity.map(a => ({
          title: `Order #${a.orderId} status: ${a.status.replace(/_/g, ' ')}`,
          time: a.createdAt,
          status: a.status
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
