// Define permissions for each role
const rolePermissions = {
  Admin: {
    canCreateShip: true,
    canEditShip: true,
    canDeleteShip: true,
    canCreateComponent: true,
    canEditComponent: true,
    canDeleteComponent: true,
    canCreateJob: true,
    canEditJob: true,
    canDeleteJob: true,
    canAssignJob: true,
    canViewReports: true
  },
  Inspector: {
    canCreateShip: false,
    canEditShip: false,
    canDeleteShip: false,
    canCreateComponent: true,
    canEditComponent: true,
    canDeleteComponent: false,
    canCreateJob: true,
    canEditJob: true,
    canDeleteJob: false,
    canAssignJob: true,
    canViewReports: true
  },
  Engineer: {
    canCreateShip: false,
    canEditShip: false,
    canDeleteShip: false,
    canCreateComponent: false,
    canEditComponent: false,
    canDeleteComponent: false,
    canCreateJob: false,
    canEditJob: true, // Can update job status
    canDeleteJob: false,
    canAssignJob: false,
    canViewReports: false
  }
};

// Check if a user has a specific permission
export const hasPermission = (user, permission) => {
  if (!user) return false;
  return rolePermissions[user.role][permission] || false;
};

// Get all permissions for a user
export const getUserPermissions = (user) => {
  if (!user) return {};
  return rolePermissions[user.role] || {};
};

// Format role name for display
export const formatRoleName = (role) => {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}; 