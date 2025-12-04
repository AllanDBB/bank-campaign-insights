/**
 * Access Control Facade Hook
 * Simple unified interface for checking permissions throughout the app
 */
export const useAccessControl = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || '{}');
  const permissions = JSON.parse(sessionStorage.getItem("permissions") || '{}');

  return {
    // Role info
    isManager: user.role === 'gerente',
    isExecutive: user.role === 'ejecutivo',
    userRole: user.role,
    userName: user.name || 'Usuario',

    // Simple permission check
    can: (permission) => permissions[permission] === true,
    cannot: (permission) => permissions[permission] !== true,

    // All permissions (for ProtectedRoute, etc)
    ...permissions,
  };
};
