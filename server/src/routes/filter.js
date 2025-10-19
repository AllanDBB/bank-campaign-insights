import express from 'express';
import extractUserId from '../middleware/extractUserId.js';
import FilterController from '../controllers/FilterController.js';

const router = express.Router();
const filterController = new FilterController();

router.get('/filters', extractUserId, (req, res, next) => {
  filterController.getFilters(req, res, next);
});

router.post('/filters', extractUserId, (req, res, next) => {
  filterController.createFilter(req, res, next);
});

router.put('/filters/:id', extractUserId, (req, res, next) => {
  filterController.updateFilter(req, res, next);
});

router.delete('/filters/:id', extractUserId, (req, res, next) => {
  filterController.deleteFilter(req, res, next);
});

export default router;
