import express from 'express';
import { 
  updateLocation, 
  getRiderLocation, 
  getAvailableRiders, 
  toggleOnlineStatus 
} from '../controllers/riderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.patch('/location', restrictTo('rider'), updateLocation);
router.patch('/toggle-status', restrictTo('rider'), toggleOnlineStatus);
router.get('/location/:riderId', getRiderLocation);
router.get('/available', restrictTo('admin'), getAvailableRiders);

export default router;
