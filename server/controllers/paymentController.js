import PaymentSettings from '../models/PaymentSettings.js';
import Order from '../models/Order.js';

// Get payment settings
export const getPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = await PaymentSettings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update UPI settings
export const updateUpiSettings = async (req, res) => {
  try {
    const settings = await PaymentSettings.findOneAndUpdate(
      {},
      { 
        $set: { 
          'upi.enabled': req.body.enabled,
          'upi.upiId': req.body.upiId,
          'upi.payeeName': req.body.payeeName,
          'upi.instructions': req.body.instructions,
          'upi.updatedAt': Date.now(),
          'upi.updatedBy': req.user._id
        } 
      },
      { new: true, upsert: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update COD settings
export const updateCodSettings = async (req, res) => {
  try {
    const settings = await PaymentSettings.findOneAndUpdate(
      {},
      { 
        $set: { 
          'cod.enabled': req.body.enabled,
          'cod.maxAmount': req.body.maxAmount,
          'cod.extraCharge': req.body.extraCharge,
          'cod.instructions': req.body.instructions,
          'cod.availablePincodes': req.body.availablePincodes,
          'cod.unavailablePincodes': req.body.unavailablePincodes
        } 
      },
      { new: true, upsert: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upload QR Image
export const uploadQrImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });
    
    const settings = await PaymentSettings.findOneAndUpdate(
      {},
      { 
        $set: { 
          'upi.qrImageUrl': `/uploads/payments/${req.file.filename}`,
          'upi.updatedAt': Date.now(),
          'upi.updatedBy': req.user._id
        } 
      },
      { new: true, upsert: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Payment Screenshot (User)
export const uploadPaymentScreenshot = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a screenshot' });
    
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, user: req.user._id },
      { 
        paymentStatus: 'screenshot_uploaded',
        paymentScreenshot: `/uploads/payments/screenshots/${req.file.filename}`,
        paymentScreenshotUploadedAt: Date.now()
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Payment (Admin)
export const verifyPayment = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { 
        paymentStatus: 'verified',
        paymentVerifiedAt: Date.now(),
        paymentVerifiedBy: req.user._id,
        status: 'confirmed',
        paymentNotes: req.body.notes
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Payment (Admin)
export const rejectPayment = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { 
        paymentStatus: 'failed',
        paymentNotes: req.body.notes
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending payments
export const getPendingPayments = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'screenshot_uploaded' }).populate('user', 'name phone email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
