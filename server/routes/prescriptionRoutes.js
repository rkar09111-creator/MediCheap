import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  uploadPrescription, 
  getAllPrescriptions, 
  getMyPrescriptions, 
  reviewPrescription 
} from '../controllers/prescriptionController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/prescriptions/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  },
  limits: { fileSize: 10000000 } // 10MB institutional limit
});

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('prescription'), uploadPrescription);
router.get('/my', getMyPrescriptions);

// Admin only
router.get('/', restrictTo('admin'), getAllPrescriptions);
router.patch('/:id/review', restrictTo('admin'), reviewPrescription);

export default router;
