import express from 'express';
import { 
  placeOrder, 
  getMyOrders, 
  getAllOrders, 
  getOrderDetails, 
  updateOrderStatus, 
  assignRider, 
  verifyPrescription, 
  getRiderOrders, 
  markAsDelivered,
  cancelOrder 
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user/my-orders', protect, getMyOrders);

// Public route for tracking
router.get('/:id', getOrderDetails);

router.use(protect);

router.post('/', placeOrder);
router.get('/rider/active', restrictTo('rider'), getRiderOrders);
router.patch('/:id/delivered', restrictTo('rider'), markAsDelivered);
router.patch('/:id/cancel', cancelOrder);

// Admin only
router.get('/', restrictTo('admin'), getAllOrders);
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);
router.patch('/:id/assign-rider', restrictTo('admin'), assignRider);
router.patch('/:id/verify-prescription', restrictTo('admin'), verifyPrescription);

export default router;
