const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const Medicine = require('../models/Medicine.model');
const Coupon = require('../models/Coupon.model');
const StockMovement = require('../models/StockMovement.model');
const { protect, restrictTo } = require('../middleware/auth');

// Helper to generate Order ID
const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'MED-';
  for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  result += '-';
  for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

// POST / [user]
router.post('/', protect, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, couponCode, notes, pricing } = req.body;

    // 1. Validate items and stock
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicine);
      if (!medicine || medicine.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Stock unavailable for ${medicine?.name || 'item'}` });
      }
    }

    // 2. Process Order
    const orderId = generateOrderId();
    const order = await Order.create({
      orderId,
      user: req.user.id,
      items,
      deliveryAddress,
      paymentMethod,
      pricing,
      status: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order placed' }]
    });

    // 3. Decrement stock
    for (const item of items) {
      const medicine = await Medicine.findByIdAndUpdate(item.medicine, { $inc: { stock: -item.quantity, totalSold: item.quantity } }, { new: true });
      await StockMovement.create({
        medicine: medicine._id,
        type: 'out',
        quantity: item.quantity,
        previousStock: medicine.stock + item.quantity,
        newStock: medicine.stock,
        reason: 'sale',
        referenceOrder: order._id,
        doneBy: req.user.id
      });
    }

    // 4. Emit socket
    const io = req.app.get('io');
    io.to('admin').emit('order:new', { order });

    res.status(201).json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET / [user]
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { orders } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /all [admin]
router.get('/all', protect, restrictTo('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('user').sort({ createdAt: -1 });
    res.json({ success: true, data: { orders } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/status [admin]
router.patch('/:id/status', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, note, updatedBy: req.user.id });
    await order.save();

    const io = req.app.get('io');
    io.to(`user:${order.user}`).emit('order:status_changed', { orderId: order._id, status });
    io.to(`order:${order._id}`).emit('order:status_changed', { status });

    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /:id [user]
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.medicine', 'name brand images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    // Ensure user can only see their own order (admin can see any)
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /:id/cancel [user]
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (['delivered', 'cancelled', 'out_for_delivery'].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel order in '${order.status}' status` });
    }

    // Restore stock
    for (const item of order.items) {
      if (item.medicine) {
        await Medicine.findByIdAndUpdate(item.medicine, { $inc: { stock: item.quantity, totalSold: -item.quantity } });
      }
    }

    order.status = 'cancelled';
    order.cancelReason = reason || 'Cancelled by customer';
    order.cancelledAt = Date.now();
    order.statusHistory.push({ status: 'cancelled', note: reason || 'Cancelled by customer', updatedBy: req.user.id });
    await order.save();

    const io = req.app.get('io');
    io.to('admin').emit('order:cancelled', { orderId: order._id, orderRef: order.orderId });

    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /rider/active [rider]
router.get('/rider/active', protect, restrictTo('rider'), async (req, res) => {
  try {
    const orders = await Order.find({ rider: req.user.id, status: 'out_for_delivery' })
      .populate('user', 'name phone')
      .populate('items.medicine', 'name brand images');
    res.json({ success: true, data: { orders } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/assign-rider [admin]
router.patch('/:id/assign-rider', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { riderId } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { 
      rider: riderId, 
      status: 'out_for_delivery',
      $push: { statusHistory: { status: 'out_for_delivery', note: 'Rider assigned', updatedBy: req.user.id } }
    }, { new: true });
    
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Notify rider via socket
    const io = req.app.get('io');
    io.to(`user:${riderId}`).emit('order:new_assignment', { orderId: order._id });
    io.to(`user:${order.user}`).emit('order:out_for_delivery', { orderId: order._id });

    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/delivered [rider/admin]
router.patch('/:id/delivered', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = 'delivered';
    order.deliveredAt = Date.now();
    order.statusHistory.push({ status: 'delivered', note: 'Order delivered successfully', updatedBy: req.user.id });
    await order.save();

    const io = req.app.get('io');
    io.to(`user:${order.user}`).emit('order:delivered', { orderId: order._id });

    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
