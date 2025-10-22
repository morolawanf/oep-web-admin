'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs/axios';
import api from '@/libs/endpoints';
import type {
  UserFilters,
  UserListResponse,
  UserDetailsResponse,
  StaffListResponse,
} from '@/types/user';

/**
 * Fetch all users with pagination and filters
 */
export const useUsers = (filters: UserFilters = {}) => {
  return useQuery<UserListResponse['data']>({
    queryKey: ['users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.sort) params.append('sort', filters.sort);

      const url = `${api.users.list}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<UserListResponse['data']>(url);
      
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
  });
};

/**
 * Fetch user details by ID with orders, reviews, and wishlist
 */
export const useUserById = (
  userId: string,
  options?: {
    orderPage?: number;
    orderLimit?: number;
    reviewPage?: number;
    reviewLimit?: number;
  }
) => {
  return useQuery<UserDetailsResponse['data']>({
    queryKey: ['user', userId, options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.orderPage) params.append('orderPage', options.orderPage.toString());
      if (options?.orderLimit) params.append('orderLimit', options.orderLimit.toString());
      if (options?.reviewPage) params.append('reviewPage', options.reviewPage.toString());
      if (options?.reviewLimit) params.append('reviewLimit', options.reviewLimit.toString());

      const url = `${api.users.byId(userId)}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<UserDetailsResponse['data']>(url);
      
      if (!response.data) {
        throw new Error('User not found');
      }
      return response.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Fetch staff members (employees and owners) with pagination and filters
 */
export const useStaff = (filters: UserFilters = {}) => {
  return useQuery<StaffListResponse['data']>({
    queryKey: ['staff', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.sort) params.append('sort', filters.sort);

      const url = `${api.users.staff}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<StaffListResponse['data']>(url);
      
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });
};
