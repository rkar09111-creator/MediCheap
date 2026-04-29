import express from 'express';
import { getSettings, updateSetting } from '../controllers/settingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.post('/', protect, admin, updateSetting);

export default router;
