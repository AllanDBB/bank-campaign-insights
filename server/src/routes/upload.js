import express from 'express';
import upload from '../middleware/upload.js';
import UploadController from '../controllers/UploadController.js';

const router = express.Router();
const uploadController = new UploadController();

router.post('/upload', upload.single('file'), (req, res, next) => {
  uploadController.uploadDocument(req, res, next);
});

router.delete('/', (req, res, next) => {
  uploadController.deleteAllDocuments(req, res, next);
});

export default router;
