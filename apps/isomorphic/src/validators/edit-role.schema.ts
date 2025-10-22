import { z } from 'zod';
import { messages } from '@/config/messages';

// form zod validation schema for editing roles
export const editRoleSchema = z.object({
  name: z
    .string()
    .min(1, { message: messages.roleNameIsRequired })
    .min(3, { message: messages.roleNameLengthMin }),
  description: z.string().optional(),
  permissions: z
    .array(
      z.object({
        resource: z.string(),
        actions: z.array(z.string()),
      })
    )
    .optional(),
});

// form zod validation schema for changing user type (employee/user)
export const changeUserTypeSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
  role: z.enum(['user', 'employee'], {
    errorMap: () => ({ message: 'Role must be either user or employee' }),
  }),
});

// generate form types from zod validation schema
export type EditRoleInput = z.infer<typeof editRoleSchema>;
export type ChangeUserTypeInput = z.infer<typeof changeUserTypeSchema>;

// Legacy schema for backward compatibility
export const rolePermissionSchema = editRoleSchema;
export type RolePermissionInput = EditRoleInput;
