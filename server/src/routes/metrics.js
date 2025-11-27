import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import MetricsController from '../controllers/MetricsController.js';

const router = express.Router();
const metricsController = new MetricsController();

router.get('/metrics/dashboard', authMiddleware, (req, res, next) => {
  metricsController.getDashboardMetrics(req, res, next);
});

export default router;
