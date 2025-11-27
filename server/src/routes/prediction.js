import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import PredictionController from '../controllers/PredictionController.js';

const router = express.Router();
const controller = new PredictionController();

router.post('/prediction/score', authMiddleware, (req, res, next) => controller.score(req, res, next));
router.get('/prediction/config', authMiddleware, (req, res, next) => controller.getConfig(req, res, next));
router.put('/prediction/config', authMiddleware, (req, res, next) => controller.updateConfig(req, res, next));

export default router;
