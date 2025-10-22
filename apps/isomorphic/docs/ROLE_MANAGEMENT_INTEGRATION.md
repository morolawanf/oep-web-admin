# Frontend Role Management Integration Guide

This document describes the updated frontend role management system that integrates with the backend Role model and user role endpoints.

## Overview

The role management system has been redesigned to:

- Remove color-based role identification (no more avatars/colors)
- Use backend Role model with permissions
- Support changing user types between `employee` and `user`
- Integrate with staff management endpoints

## Components

### 1. CreateRole Component

**Location**: `apps/isomorphic/src/app/shared/roles-permissions/create-role.tsx`

Creates new roles with:

- **Name**: Role identifier (e.g., "Content Manager")
- **Description**: Role purpose and responsibilities
- **Permissions**: Resource-action permissions grid

#### Usage

```tsx
import CreateRole from '@/app/shared/roles-permissions/create-role';
import { useModal } from '@/app/shared/modal-views/use-modal';

function YourComponent() {
  const { openModal } = useModal();

  const handleCreateRole = () => {
    openModal({
      view: <CreateRole />,
      customSize: '600px',
    });
  };

  return <Button onClick={handleCreateRole}>Create Role</Button>;
}
```

#### API Integration

The component should call:

```typescript
POST /admin/roles
Body: {
  name: "Content Manager",
  description: "Manages blog posts and media",
  permissions: [
    { resource: "products", actions: ["read", "update"] },
    { resource: "gallery", actions: ["create", "read", "update", "delete"] }
  ]
}
```

---

### 2. EditRole Component

**Location**: `apps/isomorphic/src/app/shared/roles-permissions/edit-role.tsx`

Edits existing roles:

- Update name and description
- Modify permissions

#### Props

```typescript
interface EditRoleProps {
  role?: {
    _id: string;
    name: string;
    description?: string;
    permissions?: Array<{
      resource: string;
      actions: string[];
    }>;
  };
}
```

#### Usage

```tsx
import EditRole from '@/app/shared/roles-permissions/edit-role';

function YourComponent({ role }) {
  const { openModal } = useModal();

  const handleEditRole = () => {
    openModal({
      view: <EditRole role={role} />,
      customSize: '600px',
    });
  };

  return <Button onClick={handleEditRole}>Edit Role</Button>;
}
```

#### API Integration

```typescript
PUT /admin/roles/:roleId
Body: {
  name: "Updated Role Name",
  description: "Updated description",
  permissions: [
    { resource: "orders", actions: ["read", "update"] }
  ]
}
```

---

### 3. ChangeUserType Component

**Location**: `apps/isomorphic/src/app/shared/roles-permissions/change-user-type.tsx`

Changes a user's type between `employee` and `user`:

- Shows user info (name, email, current role)
- Radio buttons for role selection
- Descriptions for each role type

#### Props

```typescript
interface ChangeUserTypeProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'employee';
  };
}
```

#### Usage

```tsx
import ChangeUserType from '@/app/shared/roles-permissions/change-user-type';

function UserActionsMenu({ user }) {
  const { openModal } = useModal();

  const handleChangeUserType = () => {
    openModal({
      view: <ChangeUserType user={user} />,
      customSize: '500px',
    });
  };

  return <MenuItem onClick={handleChangeUserType}>Change Role</MenuItem>;
}
```

#### API Integration

```typescript
PUT /admin/users/:userId/role
Body: {
  role: "employee" // or "user"
}
```

---

## Validation Schemas

### CreateRoleInput

```typescript
{
  name: string;           // min 3 chars
  description?: string;   // optional
  permissions?: Array<{
    resource: string;
    actions: string[];
  }>;
}
```

### EditRoleInput

```typescript
{
  name: string;           // min 3 chars
  description?: string;   // optional
  permissions?: Array<{
    resource: string;
    actions: string[];
  }>;
}
```

### ChangeUserTypeInput

```typescript
{
  userId: string; // required
  role: 'user' | 'employee'; // enum
}
```

---

## Data Structure

### Role Interface

```typescript
interface Role {
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
```

### Permission Resources

Available resources:

- products, categories, subcategories, attributes
- inventory, orders, users, roles
- sales, coupons, reviews
- campaigns, banners, gallery
- analytics, invoices, logistics, transactions

### Permission Actions

Available actions:

- `create` - Create new records
- `read` - View/list records
- `update` - Edit existing records
- `delete` - Remove records

---

## Integration with Staff Management

### Fetching Staff (Employees & Owners)

Use the staff endpoint to list employees and owners:

```typescript
GET /admin/users/staff?page=1&limit=20&search=john&sort=-1

Response: {
  message: "Staff members fetched successfully",
  data: {
    users: [
      {
        _id: "...",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "employee",
        joinedAt: "2024-01-15T10:30:00.000Z",
        orderCount: 5,
        totalSpent: 1250.50,
        suspended: false,
        image: "https://...",
        emailVerified: "2024-01-15T12:00:00.000Z"
      }
    ],
    total: 42,
    totalPages: 3,
    currentPage: 1
  }
}
```

### Example Staff List Component

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'rizzui';
import ChangeUserType from '@/app/shared/roles-permissions/change-user-type';
import { useModal } from '@/app/shared/modal-views/use-modal';

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { openModal } = useModal();

  useEffect(() => {
    fetchStaff();
  }, [page]);

  const fetchStaff = async () => {
    const res = await fetch(`/api/admin/users/staff?page=${page}&limit=20`);
    const { data } = await res.json();
    setStaff(data.users);
    setTotal(data.total);
  };

  const handleChangeRole = (user: any) => {
    openModal({
      view: <ChangeUserType user={user} />,
      customSize: '500px',
    });
  };

  return (
    <div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Email</Table.Head>
            <Table.Head>Role</Table.Head>
            <Table.Head>Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {staff.map((user: any) => (
            <Table.Row key={user._id}>
              <Table.Cell>
                {user.firstName} {user.lastName}
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                <Badge color={user.role === 'employee' ? 'info' : 'secondary'}>
                  {user.role}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleChangeRole(user)}
                >
                  Change Role
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {/* Add pagination controls */}
    </div>
  );
}
```

---

## API Endpoints Reference

### Role Management

```typescript
// Get all roles
GET /admin/roles

// Get single role
GET /admin/roles/:roleId

// Create role
POST /admin/roles
Body: { name, description?, permissions? }

// Update role
PUT /admin/roles/:roleId
Body: { name, description?, permissions? }

// Delete role
DELETE /admin/roles/:roleId

// Get role permissions
GET /admin/roles/:roleId/permissions

// Assign role to user
POST /admin/roles/users/assign
Body: { userId, roleId }

// Remove role from user
PATCH /admin/roles/users/unassign
Body: { userId, roleId }

// Get user's roles
GET /admin/roles/users/:userId/roles

// Get user's permissions
GET /admin/roles/users/:userId/permissions
```

### User Management

```typescript
// Get staff (employees & owners)
GET /admin/users/staff?page=1&limit=20&search=john&sort=-1

// Change user role (employee/user)
PUT /admin/users/:userId/role
Body: { role: 'employee' | 'user' }

// Get all users
GET /admin/users/all?page=1&limit=50&role=employee&search=john
```

---

## State Management Example

### Using React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch roles
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await fetch('/api/admin/roles');
      return res.json();
    },
  });
}

// Create role mutation
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoleInput) => {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

// Change user type mutation
export function useChangeUserType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: ChangeUserTypeInput) => {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

---

## Testing

### Unit Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateRole from '@/app/shared/roles-permissions/create-role';

describe('CreateRole', () => {
  it('should render form fields', () => {
    render(<CreateRole />);

    expect(screen.getByLabelText(/role name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/permissions/i)).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<CreateRole onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/role name/i), {
      target: { value: 'Content Manager' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create role/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Content Manager',
        })
      );
    });
  });
});
```

---

## Migration Notes

### Removed Features

- ❌ Role colors (RgbaColorPicker)
- ❌ Role avatars
- ❌ `roleColor` field in schema
- ❌ Hard-coded role list (Administrator, Manager, Sales, etc.)

### New Features

- ✅ Dynamic roles from backend
- ✅ Permission-based access control
- ✅ Role descriptions
- ✅ User type switching (employee/user)
- ✅ Staff filtering endpoint
- ✅ Resource-action permission grid

### Breaking Changes

- `CreateRoleInput.roleName` → `CreateRoleInput.name`
- `CreateRoleInput.roleColor` → removed
- Role list now fetched from API instead of constants
- User role changes go through `/admin/users/:id/role` endpoint

---

## Best Practices

1. **Always validate permissions**: Check user has required permissions before showing UI elements
2. **Cache role data**: Use React Query or similar to cache roles list
3. **Optimistic updates**: Update UI immediately, rollback on error
4. **Error handling**: Show clear error messages for API failures
5. **Loading states**: Show loading indicators during API calls
6. **Accessibility**: Ensure forms are keyboard-navigable and screen-reader friendly

---

## Troubleshooting

### Common Issues

**Issue**: Permissions not saving

- Check that resource names match backend enum values
- Verify actions are valid (`create`, `read`, `update`, `delete`)

**Issue**: User role change fails

- Ensure user ID is valid MongoDB ObjectId
- Check role is either `user` or `employee`
- Verify admin has `users:update` permission

**Issue**: Staff list empty

- Confirm there are users with role `employee` or `owner`
- Check pagination parameters
- Verify API endpoint is correct (`/admin/users/staff`)

---

## Future Enhancements

- [ ] Bulk user role changes
- [ ] Role templates/presets
- [ ] Permission inheritance
- [ ] Role-based UI customization
- [ ] Audit log for role changes
- [ ] Advanced permission rules (time-based, IP-based)
