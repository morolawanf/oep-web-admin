/**
 * Analytics Overview Hooks (7 hooks)
 * 
 * React Query hooks for fetching analytics overview data.
 * Each hook returns summary metrics for a specific domain.
 */

'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/libs/axios';
import api from '@/libs/endpoints';
import type {
  SalesOverviewResponse,
  OrdersOverviewResponse,
  TransactionsOverviewResponse,
  UsersOverviewResponse,
  ProductsOverviewResponse,
  ReviewsOverviewResponse,
  CouponsOverviewResponse,
  DateRangeParams,
} from '@/types/analytics.types';

/**
 * Hook: useSalesOverview
 * Get sales overview metrics (total revenue, orders, AOV, period comparison)
 */
export const useSalesOverview = (
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<SalesOverviewResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SalesOverviewResponse, Error>({
    queryKey: ['analytics', 'sales-overview', params],
    queryFn: async () => {
      const response = await apiClient.get<SalesOverviewResponse>(
        `${api.analytics.salesOverview}?from=${params.from}&to=${params.to}`
      );
      if (!response.data) {
        throw new Error('No data returned from sales overview');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook: useOrdersOverview
 * Get orders overview metrics (total, by status)
 */
export const useOrdersOverview = (
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<OrdersOverviewResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<OrdersOverviewResponse, Error>({
    queryKey: ['analytics', 'orders-overview', params],
    queryFn: async () => {
      const response = await apiClient.get<OrdersOverviewResponse>(
        `${api.analytics.ordersOverview}?from=${params.from}&to=${params.to}`
      );
      if (!response.data) {
        throw new Error('No data returned from orders overview');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useTransactionsOverview
 * Get transactions overview metrics (total, by status, total amount)
 */
export const useTransactionsOverview = (
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<TransactionsOverviewResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TransactionsOverviewResponse, Error>({
    queryKey: ['analytics', 'transactions-overview', params],
    queryFn: async () => {
      const response = await apiClient.get<TransactionsOverviewResponse>(
        `${api.analytics.transactionsOverview}?from=${params.from}&to=${params.to}`
      );
      if (!response.data) {
        throw new Error('No data returned from transactions overview');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useUsersOverview
 * Get users overview metrics (total, new, active, inactive)
 */
export const useUsersOverview = (
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<UsersOverviewResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<UsersOverviewResponse, Error>({
    queryKey: ['analytics', 'users-overview', params],
    queryFn: async () => {
      const response = await apiClient.get<UsersOverviewResponse>(
        `${api.analytics.usersOverview}?from=${params.from}&to=${params.to}`
      );
      if (!response.data) {
        throw new Error('No data returned from users overview');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useProductsOverview
 * Get products overview metrics (total, in stock, out of stock, low stock)
 */
export const useProductsOverview = (
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<ProductsOverviewResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ProductsOverviewResponse, Error>({
    queryKey: ['analytics', 'products-overview', params],
    queryFn: async () => {
      const response = await apiClient.get<ProductsOverviewResponse>(
        `${api.analytics.productsOverview}?from=${params.from}&to=${params.to}`
      );
      if (!response.data) {
        throw new Error('No data returned from products overview');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useReviewsOverview
 * Get reviews overview metrics (total, average rating, positive/negative count)
 */
export const useReviewsOverview = (
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<ReviewsOverviewResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ReviewsOverviewResponse, Error>({
    queryKey: ['analytics', 'reviews-overview', params],
    queryFn: async () => {
      const response = await apiClient.get<ReviewsOverviewResponse>(
        `${api.analytics.reviewsOverview}?from=${params.from}&to=${params.to}`
      );
      if (!response.data) {
        throw new Error('No data returned from reviews overview');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useCouponsOverview
 * Get coupons overview metrics (total, active, expired, redemptions, discount given)
 */
export const useCouponsOverview = (
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<CouponsOverviewResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<CouponsOverviewResponse, Error>({
    queryKey: ['analytics', 'coupons-overview', params],
    queryFn: async () => {
      const response = await apiClient.get<CouponsOverviewResponse>(
        `${api.analytics.couponsOverview}?from=${params.from}&to=${params.to}`
      );
      if (!response.data) {
        throw new Error('No data returned from coupons overview');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
