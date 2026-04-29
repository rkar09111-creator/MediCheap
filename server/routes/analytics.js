/**
 * routes/analytics.js
 * Provides visit tracking + customer intelligence for the admin sidebar panel.
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Order = require('../models/Order.model');
const { protect, restrictTo } = require('../middleware/auth');

const Visit = require('../models/Visit.model');

// POST /visit — track page visits
router.post('/visit', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sessionId = req.body.sessionId || req.ip;
    const hour = new Date().getHours();

    let visit = await Visit.findOne({ date: today });
    if (!visit) {
      visit = new Visit({ date: today });
    }

    visit.count += 1;
    if (!visit.uniqueSessions.includes(sessionId)) {
      visit.uniqueSessions.push(sessionId);
    }
    
    // Ensure hourly array is initialized
    if (!visit.hourly || visit.hourly.length === 0) {
      visit.hourly = Array(24).fill(0);
    }
    visit.hourly[hour] += 1;
    visit.markModified('hourly');
    
    await visit.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /summary — admin: customer intelligence summary for sidebar
router.get('/summary', protect, restrictTo('admin'), async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayStr = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().split('T')[0];

    const [
      totalUsers,
      newToday,
      newThisWeek,
      newThisMonth,
      totalOrders,
      ordersToday,
      revenueToday,
      activeUsers,
      topBuyers,
      todayVisit,
      pastVisits
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: todayStart } }),
      User.countDocuments({ role: 'user', createdAt: { $gte: weekStart } }),
      User.countDocuments({ role: 'user', createdAt: { $gte: monthStart } }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      User.countDocuments({ role: 'user', lastLogin: { $gte: new Date(Date.now() - 30 * 60 * 1000) } }),
      Order.aggregate([
        { $group: { _id: '$user', totalSpent: { $sum: '$pricing.total' }, orderCount: { $sum: 1 } } },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: { path: '$user', preserveNullAndEmpty: true } },
        { $project: { name: { $ifNull: ['$user.name', 'Anonymous'] }, totalSpent: 1, orderCount: 1 } }
      ]),
      Visit.findOne({ date: todayStr }),
      Visit.find({ date: { $gte: sevenDaysAgo, $lt: todayStr } })
    ]);

    // Build 7-day visit chart
    const visitChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
      
      const record = (dStr === todayStr) ? todayVisit : pastVisits.find(v => v.date === dStr);
      visitChart.push({
        day: label,
        visits: record?.count || 0
      });
    }

    res.json({
      success: true,
      data: {
        visits: {
          today: todayVisit?.count || 0,
          uniqueToday: todayVisit?.uniqueSessions?.length || 0,
          hourly: todayVisit?.hourly || Array(24).fill(0),
          chart: visitChart
        },
        customers: {
          total: totalUsers,
          newToday,
          newThisWeek,
          newThisMonth,
          activeNow: activeUsers
        },
        orders: {
          total: totalOrders,
          today: ordersToday,
          revenueToday: revenueToday[0]?.total || 0
        },
        topBuyers
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /hourly — admin: hourly visit breakdown today
router.get('/hourly', protect, restrictTo('admin'), async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const visit = await Visit.findOne({ date: today });
    const hourlyArr = visit?.hourly || Array(24).fill(0);
    
    const hourly = hourlyArr.map((count, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      visits: count
    }));
    res.json({ success: true, hourly });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
