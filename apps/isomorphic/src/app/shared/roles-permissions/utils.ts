// Permission resources and actions for role management

export const PERMISSION_RESOURCES = [
  'products',
  'categories',
  'subcategories',
  'attributes',
  'inventory',
  'orders',
  'users',
  'roles',
  'sales',
  'coupons',
  'reviews',
  'campaigns',
  'banners',
  'gallery',
  'analytics',
  'invoices',
  'logistics',
  'transactions',
  'settings',
] as const;

export const PERMISSION_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
] as const;

export const resources = PERMISSION_RESOURCES.map((resource) => ({
  label: resource.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  value: resource,
}));

export const actions = PERMISSION_ACTIONS.map((action) => ({
  label: action.charAt(0).toUpperCase() + action.slice(1),
  value: action,
}));

// User role types (for changing user type between employee/user)
export const USER_ROLE_TYPES = ['user', 'employee'] as const;

export const userRoleTypes = USER_ROLE_TYPES.map((role) => ({
  label: role.charAt(0).toUpperCase() + role.slice(1),
  value: role,
}));
