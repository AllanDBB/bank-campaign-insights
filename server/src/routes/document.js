import express from 'express';
import extractUserId from '../middleware/extractUserId.js';
import DocumentController from '../controllers/DocumentController.js';

const router = express.Router();
const documentController = new DocumentController();

router.get('/documents', extractUserId, (req, res, next) => {
  documentController.getDocuments(req, res, next);
});

export default router;
