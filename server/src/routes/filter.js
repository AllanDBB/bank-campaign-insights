import express from 'express';
import FilterController from '../controllers/FilterController.js';

const router = express.Router();
const filterController = new FilterController();

router.get('/filters', (req, res, next) => {
  filterController.getFilters(req, res, next);
});

router.get('/filters/:id', (req, res, next) => {
  filterController.getFilterById(req, res, next);
});

router.post('/filters', (req, res, next) => {
  filterController.createFilter(req, res, next);
});

router.put('/filters/:id', (req, res, next) => {
  filterController.updateFilter(req, res, next);
});

router.delete('/filters/:id', (req, res, next) => {
  filterController.deleteFilter(req, res, next);
});

export default router;
