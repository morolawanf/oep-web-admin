'use client';

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/libs/axios';
import api from '@/libs/endpoints';
import toast from 'react-hot-toast';
import { RefundProcessInput } from '@/validators/return-schema';

type MutationContext = {
  previousReturn?: any;
};

export const useProcessRefund = (
  returnId: string,
  options?: Omit<UseMutationOptions<any, Error, RefundProcessInput, MutationContext>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, RefundProcessInput, MutationContext>({
    mutationFn: async (data: RefundProcessInput) => {
      const response = await apiClient.post(api.returns.processRefund(returnId), data);
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['return', returnId] });
      queryClient.invalidateQueries({ queryKey: ['returns', 'statistics'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'statistics'] });
      toast.success('Refund processed successfully');
      // Allow component to override/extend success handler
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Default error toast
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      console.error('Process refund error:', error);
      // Allow component to override/extend error handler
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};
