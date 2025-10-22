import { z } from 'zod';
import { messages } from '@/config/messages';

// form zod validation schema
export const createRoleSchema = z.object({
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

// generate form types from zod validation schema
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
