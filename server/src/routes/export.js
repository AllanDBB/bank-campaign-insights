import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import ExportController from '../controllers/ExportController.js';

const router = express.Router();
const exportController = new ExportController();

router.get('/export/pdf', authMiddleware, requirePermission('viewTable'), (req, res, next) => {
  exportController.exportToPDF(req, res, next);
});

router.get('/export/excel', authMiddleware, requirePermission('viewTable'), (req, res, next) => {
  exportController.exportToExcel(req, res, next);
});

export default router;
