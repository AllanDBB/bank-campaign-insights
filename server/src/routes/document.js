import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import DocumentController from '../controllers/DocumentController.js';

const router = express.Router();
const documentController = new DocumentController();

router.get('/documents', authMiddleware, (req, res, next) => {
  documentController.getDocuments(req, res, next);
});

router.get('/schema/documents', authMiddleware, (req, res, next) => {
  documentController.getDocumentSchema(req, res, next);
});

export default router;
