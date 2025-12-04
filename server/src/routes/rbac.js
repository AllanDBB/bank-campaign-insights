import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { requireManager } from '../middleware/roleMiddleware.js';
import RBACController from '../controllers/RBACController.js';

const router = express.Router();

/**
 * GET /api/rbac/permissions
 * Returns the permissions for the current user's role
 * Requires authentication via JWT token
 */
router.get('/permissions', authMiddleware, (req, res, next) => {
  RBACController.getPermissions(req, res, next);
});

/**
 * GET /api/rbac/roles/:roleName/permissions
 * Get permissions for a specific role (manager only)
 */
router.get('/roles/:roleName/permissions', authMiddleware, requireManager, (req, res, next) => {
  RBACController.getRolePermissions(req, res, next);
});

/**
 * PUT /api/rbac/roles/:roleName/permissions
 * Update permissions for a specific role (manager only)
 */
router.put('/roles/:roleName/permissions', authMiddleware, requireManager, (req, res, next) => {
  RBACController.updateRolePermissions(req, res, next);
});

export default router;
