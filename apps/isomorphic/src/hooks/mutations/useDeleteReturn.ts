'use client';

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/libs/axios';
import api from '@/libs/endpoints';
import toast from 'react-hot-toast';

type MutationContext = {
  previousReturns?: any[];
};

export const useDeleteReturn = (
  options?: Omit<UseMutationOptions<any, Error, string, MutationContext>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string, MutationContext>({
    mutationFn: async (returnId: string) => {
      const response = await apiClient.delete(api.returns.delete(returnId));
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['returns', 'statistics'] });
      toast.success('Return deleted successfully');
      // Allow component to override/extend success handler
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Default error toast
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      console.error('Delete return error:', error);
      // Allow component to override/extend error handler
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};
