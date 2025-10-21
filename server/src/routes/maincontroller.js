import express from 'express';
import healthRouter from './health.js';
import uploadRouter from './upload.js';
import userRouter from './user.js';
import filterRouter from './filter.js';
import documentRouter from './document.js';
import metricsRouter from './metrics.js';
import exportRouter from './export.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/documents', uploadRouter);
router.use('/', userRouter);
router.use('/', filterRouter);
router.use('/', documentRouter);
router.use('/', metricsRouter);
router.use('/', exportRouter);

export default router;
