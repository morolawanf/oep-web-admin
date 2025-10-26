import { z } from 'zod';

// Return status update schema
export const returnStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'items_received', 'inspecting', 'inspection_passed', 'inspection_failed', 'completed', 'cancelled']),
  adminNotes: z.string().min(1, 'Admin notes are required when updating status').max(500, 'Notes must be less than 500 characters'),
});

export type ReturnStatusUpdateInput = z.infer<typeof returnStatusUpdateSchema>;

// Refund process schema
export const refundProcessSchema = z.object({
  refundMethod: z.enum(['original_payment', 'store_credit', 'bank_transfer']),
  refundAmount: z.number().positive('Refund amount must be positive'),
  adminNotes: z.string().min(1, 'Admin notes are required for refund processing').max(500, 'Notes must be less than 500 characters'),
});

export type RefundProcessInput = z.infer<typeof refundProcessSchema>;

// Return filters schema for search/filtering
export const returnFiltersSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'items_received', 'inspecting', 'inspection_passed', 'inspection_failed', 'completed', 'cancelled']).optional(),
  returnType: z.enum(['refund', 'exchange']).optional(),
  reason: z.string().optional(),
  dateRange: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }).optional(),
  searchTerm: z.string().optional(),
});

export type ReturnFiltersInput = z.infer<typeof returnFiltersSchema>;
