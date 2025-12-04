import express from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { requireManager } from '../middleware/roleMiddleware.js';

const router = express.Router();
const userController = new UserController();

// Login (public)
router.post('/login', (req, res, next) => {
  userController.login(req, res, next);
});

// User Management Routes (manager only)

// Get all users
router.get('/users', authMiddleware, requireManager, (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

// Create user
router.post('/users', authMiddleware, requireManager, (req, res, next) => {
  userController.createUser(req, res, next);
});

// Update user role
router.patch('/users/:userId/role', authMiddleware, requireManager, (req, res, next) => {
  userController.updateUserRole(req, res, next);
});

export default router;
