import express from 'express';
import { 
  getAllUsers, 
  deleteUser, 
  changeRole, 
  updateMe, 
  updateHealthProfile, 
  addAddress,
  topUpWallet
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.patch('/update-me', updateMe);
router.patch('/health-profile', updateHealthProfile);
router.post('/address', addAddress);
router.post('/wallet/topup', topUpWallet);

// Admin only routes
router.use(restrictTo('admin'));
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.patch('/:id/role', changeRole);

export default router;
