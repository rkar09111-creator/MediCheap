import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getPaymentSettings, 
  updateUpiSettings, 
  updateCodSettings, 
  uploadQrImage, 
  uploadPaymentScreenshot,
  verifyPayment,
  rejectPayment,
  getPendingPayments
} from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

// Multer Storage for Payments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'qrCode') {
      cb(null, 'uploads/payments/');
    } else {
      cb(null, 'uploads/payments/screenshots/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5000000 } // 5MB
});

const router = express.Router();

// Public/Auth routes
router.get('/settings', getPaymentSettings);

router.use(protect);

router.post('/screenshot/:orderId', upload.single('screenshot'), uploadPaymentScreenshot);

// Admin only routes
router.use(restrictTo('admin'));
router.post('/settings/qr', upload.single('qrCode'), uploadQrImage);
router.put('/settings/upi', updateUpiSettings);
router.put('/settings/cod', updateCodSettings);
router.get('/pending', getPendingPayments);
router.patch('/verify/:orderId', verifyPayment);
router.patch('/reject/:orderId', rejectPayment);

export default router;
