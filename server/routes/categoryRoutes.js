import express from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  toggleCategoryStatus
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route('/:id')
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

router.patch('/:id/toggle', protect, admin, toggleCategoryStatus);

export default router;
