import express from 'express';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllBanners); // Public access for user website

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createBanner);
router.patch('/:id', updateBanner);
router.delete('/:id', deleteBanner);

export default router;
