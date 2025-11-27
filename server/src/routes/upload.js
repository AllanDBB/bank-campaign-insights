import express from 'express';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';
import UploadController from '../controllers/UploadController.js';

const router = express.Router();
const uploadController = new UploadController();

router.post('/upload', authMiddleware, upload.single('file'), (req, res, next) => {
  uploadController.uploadFile(req, res, next);
});


export default router;
