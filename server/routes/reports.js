const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const Medicine = require('../models/Medicine.model');
const User = require('../models/User.model');
const Prescription = require('../models/Prescription.model');

router.get('/stats', async (req, res) => {
  try {
    const [
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalUsers,
      totalMedicines,
      lowStockItems,
      pendingPrescriptions,
      recentOrders,
      ordersByStatus
    ] = await Promise.all([
      Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'user' }),
      Medicine.countDocuments({ deletedAt: null }),
      Medicine.countDocuments({ deletedAt: null, stock: { $lte: 10 } }),
      Prescription.countDocuments({ status: 'pending' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user'),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    // Format revenue chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const revenueChart = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'cancelled' } } },
      { $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      { $project: { date: "$_id", revenue: 1, orders: 1, _id: 0 } }
    ]);

    const userGrowthChart = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, role: 'user' } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          users: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      { $project: { date: "$_id", users: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        pendingOrders,
        totalUsers,
        totalMedicines,
        lowStockItems,
        pendingPrescriptions,
        recentOrders,
        revenueChart,
        userGrowthChart,
        ordersByStatus: ordersByStatus.map(s => ({ name: s._id.toUpperCase(), value: s.count })),
        activeOrders: totalOrders - (await Order.countDocuments({ status: { $in: ['delivered', 'cancelled'] } }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/counts', async (req, res) => {
  try {
    const [
      pendingOrders,
      pendingPrescriptions,
      rejectedPayments,
      lowStock
    ] = await Promise.all([
      Order.countDocuments({ status: 'pending' }),
      Prescription.countDocuments({ status: 'pending' }),
      Order.countDocuments({ paymentStatus: 'rejected' }),
      Medicine.countDocuments({ deletedAt: null, stock: { $lte: 10 } })
    ]);

    res.json({
      success: true,
      data: {
        pendingOrders,
        pendingPrescriptions,
        rejectedPayments,
        lowStock
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', (req, res) => { res.json({ success: true, message: 'Route connected' }); });

module.exports = router;
