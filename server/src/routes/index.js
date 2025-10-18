import express from 'express';
import healthRouter from './health.js';
import uploadRouter from './upload.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/documents', uploadRouter);

export default router;
