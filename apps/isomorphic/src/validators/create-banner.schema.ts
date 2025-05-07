import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

// form zod validation schema
export const bannerFormSchema = z.object({
  name: z.string().min(1, { message: 'Banner name is required' }),
  imageUrl: z.string().min(1, { message: 'Banner image is required' }),
  pageLink: z
    .string()
    .min(1, { message: 'Page link is required' })
    .regex(/^\/.*/, { message: 'Page link must start with /' }),
  active: z.boolean(),
  category: z.enum(['A', 'B', 'C', 'D', 'E'], {
    message: 'Please select a valid category',
  }),
  _id: z.string().optional(),
  createdAt: z.date().optional(),
});

// generate form types from zod validation schema
export type BannerFormInput = z.infer<typeof bannerFormSchema>;
