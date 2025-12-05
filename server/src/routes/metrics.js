import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import MetricsController from '../controllers/MetricsController.js';

const router = express.Router();
const metricsController = new MetricsController();

router.get('/metrics/dashboard', authMiddleware, requirePermission('viewDashboard'), (req, res, next) => {
  metricsController.getDashboardMetrics(req, res, next);
});

export default router;
