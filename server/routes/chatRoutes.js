import express from 'express';
import { getAllChats, getChat, sendMessage } from '../controllers/chatController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', restrictTo('admin'), getAllChats);
router.get('/:id', getChat);
router.post('/:id/messages', sendMessage);

export default router;
