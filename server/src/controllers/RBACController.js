import RBACService from '../services/RBACService.js';

class RBACController {
  /**
   * Get current user's permissions based on their role
   * GET /api/rbac/permissions
   */
  async getPermissions(req, res, next) {
    try {
      const userRole = req.user.role;
      const permissions = await RBACService.getPermissions(userRole);

      return res.status(200).json({
        success: true,
        role: userRole,
        permissions
      });
    } catch (error) {
      console.error('Error in getPermissions:', error);
      next(error);
    }
  }

  /**
   * Get permissions for a specific role (manager only)
   * GET /api/rbac/roles/:roleName/permissions
   */
  async getRolePermissions(req, res, next) {
    try {
      const { roleName } = req.params;

      if (!['ejecutivo', 'gerente'].includes(roleName)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role name'
        });
      }

      const permissions = await RBACService.getPermissions(roleName);

      return res.status(200).json({
        success: true,
        role: roleName,
        permissions
      });
    } catch (error) {
      console.error('Error in getRolePermissions:', error);
      next(error);
    }
  }

  /**
   * Update permissions for a specific role (manager only)
   * PUT /api/rbac/roles/:roleName/permissions
   */
  async updateRolePermissions(req, res, next) {
    try {
      const { roleName } = req.params;
      const { permissions } = req.body;

      if (!['ejecutivo', 'gerente'].includes(roleName)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role name'
        });
      }

      if (!permissions || typeof permissions !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Permissions must be an object'
        });
      }

      const updated = await RBACService.updateRolePermissions(roleName, permissions);

      return res.status(200).json({
        success: true,
        message: `Permissions updated for role: ${roleName}`,
        role: updated.name,
        permissions: Object.fromEntries(updated.permissions)
      });
    } catch (error) {
      console.error('Error in updateRolePermissions:', error);
      next(error);
    }
  }
}

export default new RBACController();
