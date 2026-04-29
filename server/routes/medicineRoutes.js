import express from 'express';
import { 
  getAllMedicines, 
  getMedicine, 
  addMedicine, 
  updateMedicine, 
  deleteMedicine, 
  updateStock, 
  toggleAvailability,
  addReview,
  getAIRecommendations,
  bulkImportMedicines
} from '../controllers/medicineController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllMedicines);
router.post('/recommend', getAIRecommendations);
router.post('/bulk-import', protect, restrictTo('admin'), bulkImportMedicines);
router.get('/:id', getMedicine);
router.post('/:id/reviews', protect, addReview);

// Admin only routes
router.post('/', protect, restrictTo('admin'), addMedicine);
router.put('/:id', protect, restrictTo('admin'), updateMedicine);
router.delete('/:id', protect, restrictTo('admin'), deleteMedicine);
router.patch('/:id/stock', protect, restrictTo('admin'), updateStock);
router.patch('/:id/toggle', protect, restrictTo('admin'), toggleAvailability);

export default router;
