import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// form zod validation schema
export const createUserSchema = z.object({
  email: validateEmail,
  userType: z.enum(['user', 'employee'], {
    required_error: 'User type is required',
  }),
  role: z.string().min(1, { message: messages.roleIsRequired }),
});

// generate form types from zod validation schema
export type CreateUserInput = z.infer<typeof createUserSchema>;
