import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import RBACService from '../services/RBACService.js';

const router = express.Router();

/**
 * GET /api/rbac/permissions
 * Returns the permissions for the current user's role
 * Requires authentication via JWT token
 */
router.get('/permissions', authMiddleware, (req, res) => {
  try {
    const userRole = req.user.role; // From JWT token (extractedby authMiddleware)

    if (!userRole) {
      return res.status(400).json({
        message: 'User role not found in token'
      });
    }

    const permissions = RBACService.getPermissions(userRole);

    res.json({
      role: userRole,
      permissions
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({
      message: 'Error fetching permissions'
    });
  }
});

export default router;
