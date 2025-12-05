import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import FilterController from '../controllers/FilterController.js';

const router = express.Router();
const filterController = new FilterController();

router.get('/filters', authMiddleware, requirePermission('manageFilters'), (req, res, next) => {
  filterController.getFilters(req, res, next);
});

router.post('/filters', authMiddleware, requirePermission('manageFilters'), (req, res, next) => {
  filterController.createFilter(req, res, next);
});

router.put('/filters/:id', authMiddleware, requirePermission('manageFilters'), (req, res, next) => {
  filterController.updateFilter(req, res, next);
});

router.delete('/filters/:id', authMiddleware, requirePermission('manageFilters'), (req, res, next) => {
  filterController.deleteFilter(req, res, next);
});

export default router;
