const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription.model');
const { protect, restrictTo } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const Notification = require('../models/Notification.model');

// POST /upload [user, protected]
router.post('/upload', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { 
      patientName, 
      patientAge, 
      patientPhone, 
      deliveryAddress, 
      patientNotes, 
      medicinesRequested, 
      urgency,
      prescriptionDate
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype
    }));

    const parsedAddress = typeof deliveryAddress === 'string' ? JSON.parse(deliveryAddress) : deliveryAddress;

    const prescription = await Prescription.create({
      user: req.user.id,
      images,
      patientName,
      patientAge,
      patientPhone,
      deliveryAddress: parsedAddress,
      patientNotes,
      medicinesRequested,
      urgency: urgency || 'normal',
      prescriptionDate,
      status: 'uploaded'
    });

    const io = req.app.get('io');
    
    // Notify Admins
    io.to('admin').emit('prescription:new', { 
      prescription, 
      referenceId: prescription.referenceId 
    });

    // Create Notification for Admin
    await Notification.create({
      recipient: null, // Global or specific admin
      title: 'New Prescription Uploaded',
      message: `A new prescription ${prescription.referenceId} has been uploaded by ${patientName}`,
      type: 'prescription',
      link: `/admin/prescriptions/${prescription._id}`
    });

    res.status(201).json({ 
      success: true, 
      data: { 
        prescription, 
        referenceId: prescription.referenceId 
      } 
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /mine [user, protected]
router.get('/mine', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('linkedOrder');

    const total = await Prescription.countDocuments(query);

    res.json({ 
      success: true, 
      data: { 
        prescriptions,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit)
        }
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /my [user] - Legacy alias
router.get('/my', protect, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { prescriptions } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /:id [user/admin]
router.get('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('user linkedOrder');
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Check ownership if not admin
    if (req.user.role !== 'admin' && prescription.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: { prescription } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/under-review [admin]
router.patch('/:id/under-review', protect, restrictTo('admin'), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, { 
      status: 'under_review' 
    }, { new: true });

    const io = req.app.get('io');
    io.to(`user:${prescription.user}`).emit('prescription:under_review', { 
      prescriptionId: prescription._id 
    });

    res.json({ success: true, data: { prescription } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/verify [admin]
router.patch('/:id/verify', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { pharmacistNotes } = req.body;
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, { 
      status: 'verified',
      pharmacistNotes,
      reviewedBy: req.user.id,
      reviewedAt: Date.now()
    }, { new: true });

    const io = req.app.get('io');
    io.to(`user:${prescription.user}`).emit('prescription:verified', { 
      prescriptionId: prescription._id,
      pharmacistNotes
    });

    // Create Notification for User
    await Notification.create({
      recipient: prescription.user,
      title: 'Prescription Verified ✅',
      message: `Your prescription ${prescription.referenceId} has been verified. You can now place your order.`,
      type: 'prescription',
      link: `/upload-prescription`
    });

    res.json({ success: true, data: { prescription } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/reject [admin]
router.patch('/:id/reject', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { rejectionReason, pharmacistNotes } = req.body;
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, { 
      status: 'rejected',
      rejectionReason,
      pharmacistNotes,
      reviewedBy: req.user.id,
      reviewedAt: Date.now()
    }, { new: true });

    const io = req.app.get('io');
    io.to(`user:${prescription.user}`).emit('prescription:rejected', { 
      prescriptionId: prescription._id,
      reason: rejectionReason
    });

    // Create Notification for User
    await Notification.create({
      recipient: prescription.user,
      title: 'Prescription Rejected ❌',
      message: `Your prescription ${prescription.referenceId} was rejected. Reason: ${rejectionReason}`,
      type: 'prescription',
      link: `/upload-prescription`
    });

    res.json({ success: true, data: { prescription } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id [user]
router.delete('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: 'Not found' });
    
    if (prescription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (prescription.status !== 'uploaded') {
      return res.status(400).json({ success: false, message: 'Cannot delete prescription after review has started' });
    }

    // Delete from Cloudinary
    for (const img of prescription.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    await prescription.deleteOne();
    res.json({ success: true, message: 'Prescription deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /:id/reupload [user]
router.post('/:id/reupload', protect, upload.array('images', 5), async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: 'Not found' });
    
    if (prescription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (prescription.status !== 'rejected') {
      return res.status(400).json({ success: false, message: 'Can only reupload for rejected prescriptions' });
    }

    // Delete old images from Cloudinary
    for (const img of prescription.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype
    }));

    prescription.images = images;
    prescription.status = 'uploaded';
    prescription.rejectionReason = undefined;
    await prescription.save();

    const io = req.app.get('io');
    io.to('admin').emit('prescription:new', { prescription, referenceId: prescription.referenceId });

    res.json({ success: true, data: { prescription } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
