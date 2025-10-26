'use client';

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/libs/axios';
import api from '@/libs/endpoints';
import toast from 'react-hot-toast';
import { ReturnStatusUpdateInput } from '@/validators/return-schema';

type MutationContext = {
  previousReturn?: any;
};

export const useUpdateReturnStatus = (
  returnId: string,
  options?: Omit<UseMutationOptions<any, Error, ReturnStatusUpdateInput, MutationContext>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, ReturnStatusUpdateInput, MutationContext>({
    mutationFn: async (data: ReturnStatusUpdateInput) => {
      const response = await apiClient.patch(api.returns.updateStatus(returnId), data);
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
      toast.success('Return status updated successfully');
      // Allow component to override/extend success handler
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Default error toast
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      console.error('Update return status error:', error);
      // Allow component to override/extend error handler
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};
