const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { protect } = require('../middleware/auth');

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User already exists' });

    user = await User.create({ name, email, phone, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[Login] Attempt for: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`[Login] User not found: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log(`[Login] Password match for ${email}: ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /logout
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'Logged out' });
});

// GET /me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('defaultAddress');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /update-profile
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /profile-stats
router.get('/profile-stats', protect, async (req, res) => {
  try {
    const Order = require('../models/Order.model');
    const orderCount = await Order.countDocuments({ user: req.user.id });
    const recentOrders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(3);
    
    const recentActivity = recentOrders.map(o => ({
      title: `Order #${o.orderId}`,
      time: o.createdAt,
      status: o.status
    }));

    res.json({
      success: true,
      data: {
        orderCount,
        recentActivity,
        vitals: req.user.vitals || {}
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /update-password
router.patch('/update-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /top-up-wallet
router.post('/top-up-wallet', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);
    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    await user.save();
    res.json({ success: true, walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
