import express from 'express';
import healthRouter from './health.js';
import uploadRouter from './upload.js';
import userRouter from './user.js';
import filterRouter from './filter.js';
import documentRouter from './document.js';
import schemaRouter from './schema.js';
import metricsRouter from './metrics.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/documents', uploadRouter);
router.use('/', userRouter);
router.use('/', filterRouter);
router.use('/', documentRouter);
router.use('/', schemaRouter);
router.use('/', metricsRouter);

export default router;
