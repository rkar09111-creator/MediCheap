import express from 'express';
import { askPharmacist } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask-pharmacist', askPharmacist);

export default router;
