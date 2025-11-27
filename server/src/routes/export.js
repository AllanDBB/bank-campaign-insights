import express from 'express';
import extractUserId from '../middleware/extractUserId.js';
import ExportController from '../controllers/ExportController.js';

const router = express.Router();
const exportController = new ExportController();

router.get('/export/pdf', authMiddleware, (req, res, next) => {
  exportController.exportToPDF(req, res, next);
});

router.get('/export/excel', authMiddleware, (req, res, next) => {
  exportController.exportToExcel(req, res, next);
});

export default router;
