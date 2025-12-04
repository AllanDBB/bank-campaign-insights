/**
 * Role-Based Access Control Service
 * Centralizes all permission definitions for different roles
 */
class RBACService {
  static PERMISSIONS = {
    ejecutivo: {
      // Previous stage features - All visible to ejecutivo
      viewDashboard: true,
      viewTable: true,
      viewFilters: true,
      createFilters: true,
      uploadData: true,
      exportPDF: true,
      exportExcel: true,

      // New stage - Ejecutivo can access basic prediction
      viewPrediction: true,
      scorePrediction: true,        // RF-2, RF-3, RF-4
      viewCommercialAction: true,   // RF-6
      compareWithAverage: true,     // RF-2.2

      // Manager-only features (ejecutivo CANNOT access)
      viewJustification: false,     // RF-5: Manager only
      simulateScenarios: false,     // RF-7: Manager only
      editConfig: false,            // Config editing: Manager only
      manageUsers: false,           // User management: Manager only
    },

    gerente: {
      // All ejecutivo permissions - Manager has everything
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

      // Manager-only features - All accessible to gerente
      viewJustification: true,      // RF-5: Influential factors analysis
      simulateScenarios: true,      // RF-7: What-if simulation
      editConfig: true,             // Modify prediction thresholds
      manageUsers: true,            // User CRUD operations
    }
  };

  /**
   * Get all permissions for a specific role
   * @param {string} role - User role (ejecutivo or gerente)
   * @returns {object} Permission object with boolean values
   */
  static getPermissions(role) {
    return this.PERMISSIONS[role] || this.PERMISSIONS.ejecutivo;
  }

  /**
   * Check if a role has a specific permission
   * @param {string} role - User role
   * @param {string} permission - Permission name to check
   * @returns {boolean} True if role has permission
   */
  static hasPermission(role, permission) {
    const permissions = this.getPermissions(role);
    return permissions[permission] === true;
  }

  /**
   * Get all available roles
   * @returns {array} Array of role names
   */
  static getRoles() {
    return Object.keys(this.PERMISSIONS);
  }
}

export default RBACService;
