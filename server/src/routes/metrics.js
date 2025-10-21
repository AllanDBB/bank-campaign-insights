import express from 'express';
import extractUserId from '../middleware/extractUserId.js';
import MetricsController from '../controllers/MetricsController.js';

const router = express.Router();
const metricsController = new MetricsController();

router.get('/metrics/dashboard', extractUserId, (req, res, next) => {
  metricsController.getDashboardMetrics(req, res, next);
});

export default router;
