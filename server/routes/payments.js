const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const { protect, restrictTo } = require('../middleware/auth');

// Simple in-memory payment settings store (no ES module dependency)
let paymentSettings = {
  upi: {
    enabled: true,
    upiId: 'medicheap@upi',
    payeeName: 'MediCheap',
    qrImageUrl: '',
    instructions: 'Scan QR with any UPI app and enter exact amount. Share screenshot after payment.'
  },
  cod: {
    enabled: true,
    maxAmount: 5000,
    extraCharge: 0,
    instructions: 'Keep exact change ready. Our rider will collect payment on delivery.'
  }
};

// GET /settings — public: fetch payment config
router.get('/settings', (req, res) => {
  res.json({ success: true, data: { settings: paymentSettings } });
});

// PUT /settings/upi — admin: update UPI settings
router.put('/settings/upi', protect, restrictTo('admin'), (req, res) => {
  paymentSettings.upi = { ...paymentSettings.upi, ...req.body };
  res.json({ success: true, data: { settings: paymentSettings } });
});

// PUT /settings/cod — admin: update COD settings
router.put('/settings/cod', protect, restrictTo('admin'), (req, res) => {
  paymentSettings.cod = { ...paymentSettings.cod, ...req.body };
  res.json({ success: true, data: { settings: paymentSettings } });
});

// POST /settings/qr — admin: update QR image
router.post('/settings/qr', protect, restrictTo('admin'), (req, res) => {
  const { qrImageUrl } = req.body;
  paymentSettings.upi.qrImageUrl = qrImageUrl;
  res.json({ success: true, data: { settings: paymentSettings } });
});

// POST /screenshot/:orderId — user uploads UPI payment screenshot
router.post('/screenshot/:orderId', protect, async (req, res) => {
  try {
    const { screenshotUrl, upiTransactionId } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not your order' });

    order.paymentScreenshot = screenshotUrl;
    order.paymentScreenshotAt = Date.now();
    order.upiTransactionId = upiTransactionId;
    order.paymentStatus = 'screenshot_uploaded';
    await order.save();

    // Notify admin
    const io = req.app.get('io');
    io.to('admin').emit('payment:screenshot_uploaded', { orderId: order._id, orderRef: order.orderId });

    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /pending — admin: list orders pending payment verification
router.get('/pending', protect, restrictTo('admin'), async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'screenshot_uploaded' })
      .populate('user', 'name email phone')
      .sort({ paymentScreenshotAt: -1 });
    res.json({ success: true, data: { orders } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /verify/:orderId — admin: verify payment
router.patch('/verify/:orderId', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { notes } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.paymentStatus = 'verified';
    order.paymentVerifiedAt = Date.now();
    order.paymentVerifiedBy = req.user.id;
    order.paymentNotes = notes || 'Verified by Admin';

    if (order.status === 'pending') {
      order.status = 'confirmed';
      order.statusHistory.push({ status: 'confirmed', note: notes || 'Payment verified by admin', updatedBy: req.user.id });
    }
    await order.save();

    const io = req.app.get('io');
    io.to(`user:${order.user}`).emit('payment:verified', { orderId: order._id });
    io.to(`order:${order._id}`).emit('order:status_changed', { status: order.status });

    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /reject/:orderId — admin: reject payment
router.patch('/reject/:orderId', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { notes } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.paymentStatus = 'failed';
    order.paymentNotes = notes || 'Payment rejected by admin';
    await order.save();

    const io = req.app.get('io');
    io.to(`user:${order.user}`).emit('payment:rejected', { orderId: order._id, reason: notes });

    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
