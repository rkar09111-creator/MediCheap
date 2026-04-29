import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import User from '../models/User.js';

export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod, prescription } = req.body;
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Handle Wallet Payment
    if (paymentMethod === 'MediWallet') {
      const user = await User.findById(req.user.id);
      if (user.walletBalance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      user.walletBalance -= totalAmount;
      user.walletTransactions.push({
        amount: totalAmount,
        type: 'debit',
        description: `Payment for order ${orderId}`
      });
      await user.save();
    }

    const order = await Order.create({
      orderId,
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'MediWallet' ? 'paid' : 'pending',
      prescription,
      status: 'pending'
    });

    // Update stock
    for (const item of items) {
      await Medicine.findByIdAndUpdate(item.medicine, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({ status: 'success', data: { order } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.medicine').sort('-createdAt');
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.medicine').populate('rider').sort('-createdAt');
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('items.medicine')
      .populate('rider');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { 
      rider: riderId,
      status: 'assigned_to_rider'
    }, { new: true });
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyPrescription = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      'prescription.isVerified': true,
      'prescription.verifiedBy': req.user.id,
      status: 'prescription_verified'
    }, { new: true });
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRiderOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      rider: req.user.id,
      status: { $in: ['assigned_to_rider', 'out_for_delivery'] }
    }).populate('user').populate('items.medicine');
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: 'delivered',
      paymentStatus: 'paid'
    }, { new: true });
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    // Restore stock
    for (const item of order.items) {
      await Medicine.findByIdAndUpdate(item.medicine, {
        $inc: { stock: item.quantity }
      });
    }

    // Refund Wallet if paid
    if (order.paymentStatus === 'paid' && order.paymentMethod === 'MediWallet') {
      const user = await User.findById(req.user.id);
      user.walletBalance += order.totalAmount;
      user.walletTransactions.push({
        amount: order.totalAmount,
        type: 'credit',
        description: `Refund for cancelled order ${order.orderId}`
      });
      await user.save();
    }

    order.status = 'cancelled';
    if (req.body.reason) {
      order.cancellationReason = req.body.reason;
    }
    await order.save();

    res.status(200).json({ status: 'success', message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
