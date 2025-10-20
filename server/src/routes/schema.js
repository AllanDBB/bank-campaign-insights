import express from 'express';
import extractUserId from '../middleware/extractUserId.js';
import SchemaController from '../controllers/SchemaController.js';

const router = express.Router();
const schemaController = new SchemaController();

router.get('/schema/documents', extractUserId, (req, res, next) => {
  schemaController.getDocumentSchema(req, res, next);
});

export default router;
