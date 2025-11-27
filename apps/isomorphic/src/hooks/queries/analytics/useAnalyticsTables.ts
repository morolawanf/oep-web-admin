/**
 * Analytics Table Hooks (10 hooks)
 *
 * React Query hooks for fetching paginated table data.
 * All hooks return data with pagination metadata.
 */

'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/libs/axios';
import api from '@/libs/endpoints';
import type {
  SalesByCategoryResponse,
  TopSellingProductRow,
  OrdersTableResponse,
  TransactionsTableResponse,
  TopCustomersResponse,
  ProductPerformanceResponse,
  ReviewsTableResponse,
  TopCouponsResponse,
  MostWishlistedProductRow,
  MostReviewedProductRow,
  TableParams,
  OrdersTableParams,
  TransactionsTableParams,
  ReviewsTableParams,
  ProductPerformanceParams,
  TopItemsParams,
} from '@/types/analytics.types';

/**
 * Hook: useSalesByCategory
 * Get sales breakdown by category with pagination
 */
export const useSalesByCategory = (
  params: TableParams & { sortBy?: string; sortOrder?: 'asc' | 'desc' },
  options?: Omit<
    UseQueryOptions<SalesByCategoryResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<SalesByCategoryResponse, Error>({
    queryKey: ['analytics', 'sales-by-category', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        sortBy: params.sortBy || 'totalRevenue',
        sortOrder: params.sortOrder || 'desc',
      });
      const response = await apiClient.get<SalesByCategoryResponse>(
        `${api.analytics.salesByCategory}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes for table data
    ...options,
  });
};

/**
 * Hook: useTopSellingProducts
 * Get best-selling products by quantity
 */
export const useTopSellingProducts = (
  params: TopItemsParams,
  options?: Omit<
    UseQueryOptions<TopSellingProductRow[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TopSellingProductRow[], Error>({
    queryKey: ['analytics', 'top-selling-products', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        limit: (params.limit || 10).toString(),
      });
      const response = await apiClient.get<TopSellingProductRow[]>(
        `${api.analytics.topSellingProducts}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 3 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useOrdersTable
 * Get paginated orders list with filters
 */
export const useOrdersTable = (
  params: OrdersTableParams,
  options?: Omit<
    UseQueryOptions<OrdersTableResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<OrdersTableResponse, Error>({
    queryKey: ['analytics', 'orders-table', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
      });
      if (params.status) {
        queryParams.append('status', params.status);
      }
      const response = await apiClient.get<OrdersTableResponse>(
        `${api.analytics.ordersTable}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for real-time updates)
    ...options,
  });
};

/**
 * Hook: useTransactionsTable
 * Get paginated transactions list with filters
 */
export const useTransactionsTable = (
  params: TransactionsTableParams,
  options?: Omit<
    UseQueryOptions<TransactionsTableResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TransactionsTableResponse, Error>({
    queryKey: ['analytics', 'transactions-table', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
      });
      if (params.status) {
        queryParams.append('status', params.status);
      }
      if (params.method) {
        queryParams.append('method', params.method);
      }
      const response = await apiClient.get<TransactionsTableResponse>(
        `${api.analytics.transactionsTable}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useTopCustomers
 * Get customers ranked by total spend with pagination
 */
export const useTopCustomers = (
  params: TableParams,
  options?: Omit<
    UseQueryOptions<TopCustomersResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TopCustomersResponse, Error>({
    queryKey: ['analytics', 'top-customers', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
      });
      const response = await apiClient.get<TopCustomersResponse>(
        `${api.analytics.topCustomers}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 3 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useProductPerformance
 * Get product-level metrics (revenue, sales, ratings) with pagination
 */
export const useProductPerformance = (
  params: Partial<ProductPerformanceParams>,
  options?: Omit<
    UseQueryOptions<ProductPerformanceResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<ProductPerformanceResponse, Error>({
    queryKey: ['analytics', 'product-performance', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({});
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);
      queryParams.append('page', (params.page || 1).toString());
      queryParams.append('limit', (params.limit || 10).toString());
      queryParams.append('sortBy', params.sortBy || 'revenue');
      queryParams.append('sortOrder', params.sortOrder || 'desc');
      if (params.category) {
        queryParams.append('category', params.category);
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }
      const response = await apiClient.get<ProductPerformanceResponse>(
        `${api.analytics.productPerformance}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 3 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useReviewsTable
 * Get paginated reviews with filters (rating, status)
 */
export const useReviewsTable = (
  params: ReviewsTableParams,
  options?: Omit<
    UseQueryOptions<ReviewsTableResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<ReviewsTableResponse, Error>({
    queryKey: ['analytics', 'reviews-table', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        sortBy: params.sortBy || 'createdAt',
      });
      if (params.rating !== undefined) {
        queryParams.append('rating', params.rating.toString());
      }
      if (params.status) {
        queryParams.append('status', params.status);
      }
      const response = await apiClient.get<ReviewsTableResponse>(
        `${api.analytics.reviewsTable}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 3 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useTopCoupons
 * Get coupons ranked by redemption count with pagination
 */
export const useTopCoupons = (
  params: TableParams,
  options?: Omit<
    UseQueryOptions<TopCouponsResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TopCouponsResponse, Error>({
    queryKey: ['analytics', 'top-coupons', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
      });
      const response = await apiClient.get<TopCouponsResponse>(
        `${api.analytics.topCoupons}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 3 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useMostWishlistedProducts
 * Get products by wishlist frequency (no pagination, returns top N)
 */
export const useMostWishlistedProducts = (
  params: TopItemsParams,
  options?: Omit<
    UseQueryOptions<MostWishlistedProductRow[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<MostWishlistedProductRow[], Error>({
    queryKey: ['analytics', 'most-wishlisted-products', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        limit: (params.limit || 10).toString(),
      });
      const response = await apiClient.get<MostWishlistedProductRow[]>(
        `${api.analytics.mostWishlistedProducts}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook: useMostReviewedProducts
 * Get products by review count with average rating (no pagination, returns top N)
 */
export const useMostReviewedProducts = (
  params: TopItemsParams,
  options?: Omit<
    UseQueryOptions<MostReviewedProductRow[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<MostReviewedProductRow[], Error>({
    queryKey: ['analytics', 'most-reviewed-products', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        limit: (params.limit || 10).toString(),
      });
      const response = await apiClient.get<MostReviewedProductRow[]>(
        `${api.analytics.mostReviewedProducts}?${queryParams}`
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
