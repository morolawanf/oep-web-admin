'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs/axios';
import api from '@/libs/endpoints';

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  country?: string;
  dob?: string;
  notifications?: boolean;
}

/**
 * React Query hook to fetch user profile data
 * @returns Query result with user profile data
 */
export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await apiClient.get<UserProfile>(api.user.profile);
      if (!response.data) {
        throw new Error('No data returned from server');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
  });
};
