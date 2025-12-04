/**
 * Access Control Facade Hook
 * Implements the Facade pattern to provide a clean, unified interface
 * for checking user permissions throughout the application
 */
export const useAccessControl = () => {
  /**
   * Retrieve user data from sessionStorage
   * @returns {object|null} User object with id, name, email, role
   */
  const getUserFromSession = () => {
    const userStr = sessionStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  /**
   * Retrieve permissions from sessionStorage
   * Permissions come from the backend /api/rbac/permissions endpoint
   * @returns {object} Permissions object with boolean values
   */
  const getPermissionsFromSession = () => {
    const permStr = sessionStorage.getItem("permissions");
    return permStr ? JSON.parse(permStr) : {};
  };

  const user = getUserFromSession();
  const permissions = getPermissionsFromSession();

  /**
   * Facade: unified interface for access control
   * Returns all permissions from backend plus convenience role checks
   */
  return {
    // Role checks - quick way to verify user role
    isManager: user?.role === 'gerente',
    isExecutive: user?.role === 'ejecutivo',
    userRole: user?.role,
    userName: user?.name || 'Usuario',

    // All permissions from backend (spread operator includes all permission keys)
    // Examples:
    // - viewDashboard: true/false
    // - viewPrediction: true/false
    // - editConfig: true/false (manager-only)
    // - simulateScenarios: true/false (manager-only)
    // - viewJustification: true/false (manager-only)
    ...permissions,
  };
};
