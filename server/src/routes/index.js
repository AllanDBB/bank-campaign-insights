import express from 'express';
import healthRouter from './health.js';
import uploadRouter from './upload.js';
import userRouter from './user.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/documents', uploadRouter);
router.use('/', userRouter);

export default router;
