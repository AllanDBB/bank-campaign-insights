import RBACService from '../services/RBACService.js';

export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const hasPermission = await RBACService.hasPermission(req.user.role, permission);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Permission denied. Required: ${permission}`
        });
      }

      next();
    } catch (error) {
      console.error('Error in permissionMiddleware:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
};
