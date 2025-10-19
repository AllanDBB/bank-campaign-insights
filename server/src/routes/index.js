import express from 'express';
import healthRouter from './health.js';
import uploadRouter from './upload.js';
import userRouter from './user.js';
import filterRouter from './filter.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/documents', uploadRouter);
router.use('/', userRouter);
router.use('/', filterRouter);

export default router;
