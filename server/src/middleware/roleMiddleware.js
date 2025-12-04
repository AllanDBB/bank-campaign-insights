/**
 * Middleware to enforce manager-only access
 * Used for endpoints that should only be accessible to gerente role
 */

export const requireManager = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'gerente') {
      return res.status(403).json({
        success: false,
        message: 'Manager access required. Only gerente role can perform this action.'
      });
    }

    next();
  } catch (error) {
    console.error('Error in requireManager middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export default { requireManager };
