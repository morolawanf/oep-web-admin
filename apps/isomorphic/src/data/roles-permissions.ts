// Simplified roles data without avatars and colors
// Roles are now managed through the backend Role model

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: Array<{
    resource: string;
    actions: string[];
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const roleActions = [
  {
    id: 1,
    name: 'Edit Role',
  },
  {
    id: 2,
    name: 'View Permissions',
  },
  {
    id: 3,
    name: 'Delete Role',
  },
];

// User type options for the change user type form
export const userTypeOptions = [
  {
    label: 'User',
    value: 'user',
    description: 'Standard customer account with basic permissions',
  },
  {
    label: 'Employee',
    value: 'employee',
    description: 'Staff member with access to admin features',
  },
];
