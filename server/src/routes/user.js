import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();
const userController = new UserController();

//register
router.post('/register', (req, res, next) => {
  userController.register(req, res, next);
});

//login
router.post('/login', (req, res, next) => {
  userController.login(req, res, next);
});

export default router;
