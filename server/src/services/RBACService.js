import Role from '../models/Role.js';

/**
 * Role-Based Access Control Service
 * Manages permissions stored in MongoDB, with fallback to defaults
 */
class RBACService {
  // Default permissions - used as fallback if database doesn't have data
  static DEFAULT_PERMISSIONS = {
    ejecutivo: {
      viewDashboard: true,
      viewTable: true,
      viewFilters: true,
      createFilters: true,
      uploadData: true,
      exportPDF: true,
      exportExcel: true,
      viewPrediction: true,
      scorePrediction: true,
      viewCommercialAction: true,
      compareWithAverage: true,
      viewJustification: false,
      simulateScenarios: false,
      editConfig: false,
      manageUsers: false,
    },
    gerente: {
      viewDashboard: true,
      viewTable: true,
      viewFilters: true,
      createFilters: true,
      uploadData: true,
      exportPDF: true,
      exportExcel: true,
      viewPrediction: true,
      scorePrediction: true,
      viewCommercialAction: true,
      compareWithAverage: true,
      viewJustification: true,
      simulateScenarios: true,
      editConfig: true,
      manageUsers: true,
    }
  };

  /**
   * Get all permissions for a specific role from database
   * Falls back to defaults if not found
   * @param {string} roleName - User role (ejecutivo or gerente)
   * @returns {Promise<object>} Permission object with boolean values
   */
  static async getPermissions(roleName) {
    try {
      const role = await Role.findOne({ name: roleName });
      if (role && role.permissions && role.permissions.size > 0) {
        return Object.fromEntries(role.permissions);
      }
    } catch (error) {
      console.error('Error fetching permissions from database:', error);
    }
    return this.DEFAULT_PERMISSIONS[roleName] || this.DEFAULT_PERMISSIONS.ejecutivo;
  }

  /**
   * Check if a role has a specific permission
   * @param {string} roleName - User role
   * @param {string} permission - Permission name to check
   * @returns {Promise<boolean>} True if role has permission
   */
  static async hasPermission(roleName, permission) {
    const permissions = await this.getPermissions(roleName);
    return permissions[permission] === true;
  }

  /**
   * Update permissions for a role in database
   * @param {string} roleName - User role name
   * @param {object} permissions - Permission object with boolean values
   * @returns {Promise<object>} Updated role document
   */
  static async updateRolePermissions(roleName, permissions) {
    try {
      const updated = await Role.findOneAndUpdate(
        { name: roleName },
        {
          name: roleName,
          permissions: new Map(Object.entries(permissions))
        },
        { upsert: true, new: true }
      );
      return updated;
    } catch (error) {
      console.error('Error updating role permissions:', error);
      throw error;
    }
  }

  /**
   * Get all available roles
   * @returns {array} Array of role names
   */
  static getRoles() {
    return Object.keys(this.DEFAULT_PERMISSIONS);
  }

  /**
   * Get default permissions for a role
   * @param {string} roleName - User role name
   * @returns {object} Default permissions for the role
   */
  static getDefaultPermissions(roleName) {
    return this.DEFAULT_PERMISSIONS[roleName] || this.DEFAULT_PERMISSIONS.ejecutivo;
  }
}

export default RBACService;
