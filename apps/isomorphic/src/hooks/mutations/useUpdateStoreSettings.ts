'use client';

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/libs/axios';
import api from '@/libs/endpoints';
import toast from 'react-hot-toast';
import axios from 'axios';
import { StoreSettings } from '../queries/useStoreSettings';

export interface UpdateStoreSettingsInput {
  storeName?: string;
  companyName?: string;
  logoUrl?: string;
  websiteUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  taxId?: string;
  taxRate?: number;
  currency?: string;
}

type MutationContext = {
  previousSettings?: StoreSettings;
};

export function useUpdateStoreSettings(
  options?: Omit<
    UseMutationOptions<StoreSettings, Error, UpdateStoreSettingsInput, MutationContext>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation<StoreSettings, Error, UpdateStoreSettingsInput, MutationContext>({
    mutationFn: async (data: UpdateStoreSettingsInput) => {
      const response = await apiClient.put<StoreSettings>(api.settings.update, data);
      if (!response.data) {
        throw new Error('No data returned from server');
      }
      return response.data;
    },
    onMutate: async (newSettings) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['storeSettings'] });

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData<StoreSettings>(['storeSettings']);

      // Optimistically update to the new value
      if (previousSettings) {
        queryClient.setQueryData<StoreSettings>(['storeSettings'], {
          ...previousSettings,
          ...newSettings,
          address: {
            ...previousSettings.address,
            ...(newSettings.address || {}),
          },
        });
      }

      // Return context with previous settings for rollback
      return { previousSettings };
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Store settings updated successfully');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousSettings) {
        queryClient.setQueryData(['storeSettings'], context.previousSettings);
      }
      
      const errorMessage = handleApiError(error);
      
      // Special handling for permission errors
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error('You do not have permission to update store settings');
      } else {
        toast.error(errorMessage);
      }
      
      console.error('Update store settings error:', error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
