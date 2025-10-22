'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/libs/axios';
import api from '@/libs/endpoints';
import { UserProfile } from '@/hooks/queries/useUserProfile';
import toast from 'react-hot-toast';

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  image?: string;
  country?: string;
  dob?: string;
  notifications?: boolean;
}

/**
 * React Query mutation hook to update user profile
 * @returns Mutation function and state
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const response = await apiClient.put<UserProfile>(api.user.updateProfile, data);
      if (!response.data) {
        throw new Error('No data returned from server');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate user profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    },
  });
};
