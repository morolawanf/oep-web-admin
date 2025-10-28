/**
 * Legacy Analytics React Query Hooks
 * 
 * Hooks for 66 legacy analytics endpoints with smart groupBy routing.
 * For time-series endpoints with ByDays/ByMonths/ByYears variants, 
 * a single hook accepts groupBy parameter and routes to appropriate endpoint.
 */

'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '@/libs/axios';
import api from '@/libs/endpoints';
import type {
  // Standalone types
  SellerStatisticsResponse,
  TotalSalesResponse,
  ChartDataResponse,
  ChartDataParams,
  OrderVsReturnsResponse,
  RangeCountResponse,
  PaginatedStatisticsResponse,
  PaginatedStatisticsParams,
  // Time-series types
  LegacyTimeSeriesResponse,
  LegacyTimeSeriesParams,
  DateRangeParams,
} from '@/types/analytics.types';

// ============================================
// STANDALONE LEGACY ENDPOINTS (5 hooks)
// ============================================

/**
 * Seller Statistics Hook
 * GET /admin/analytics/seller-statistics
 * Returns: revenue and profit for date range
 */
export const useSellerStatistics = (params: DateRangeParams) => {
  return useQuery<SellerStatisticsResponse>({
    queryKey: ['analytics', 'legacy', 'sellerStatistics', params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<SellerStatisticsResponse>(
        api.analytics.legacy.sellerStatistics,
        { params }
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Total Sales Hook
 * GET /admin/analytics/total-sales
 * Returns: total sales, revenue, and profit
 */
export const useTotalSales = (params: DateRangeParams) => {
  return useQuery<TotalSalesResponse>({
    queryKey: ['analytics', 'legacy', 'totalSales', params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<TotalSalesResponse>(
        api.analytics.legacy.totalSales,
        { params }
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Chart Data Hook (for custom metric charting)
 * GET /admin/analytics/chart-data
 * Returns: time-series data for specified metric
 */
export const useChartData = (params: ChartDataParams) => {
  return useQuery<ChartDataResponse>({
    queryKey: ['analytics', 'legacy', 'chartData', params.metric, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<ChartDataResponse>(
        api.analytics.legacy.chartData,
        { params }
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Order vs Returns Hook
 * GET /admin/analytics/order-vs-returns
 * Returns: comparison of orders and returns with rate
 */
export const useOrderVsReturns = (params: DateRangeParams) => {
  return useQuery<OrderVsReturnsResponse>({
    queryKey: ['analytics', 'legacy', 'orderVsReturns', params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<OrderVsReturnsResponse>(
        api.analytics.legacy.orderVsReturns,
        { params }
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Range Count Hook
 * GET /admin/analytics/range-count
 * Returns: total count for date range
 */
export const useRangeCount = (params: DateRangeParams) => {
  return useQuery<RangeCountResponse>({
    queryKey: ['analytics', 'legacy', 'rangeCount', params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<RangeCountResponse>(
        api.analytics.legacy.rangeCount,
        { params }
      );
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// PAGINATED STATISTICS (1 hook with groupBy routing)
// ============================================

/**
 * Paginated Statistics Hook
 * Routes to: /paginated-statistics-{days|weeks|months|years}
 * Returns: paginated statistics data grouped by time period
 */
export const usePaginatedStatistics = (params: PaginatedStatisticsParams) => {
  const endpoint =
    params.groupBy === 'days'
      ? api.analytics.legacy.paginatedStatistics.byDays
      : params.groupBy === 'weeks'
      ? api.analytics.legacy.paginatedStatistics.byWeeks
      : params.groupBy === 'months'
      ? api.analytics.legacy.paginatedStatistics.byMonths
      : api.analytics.legacy.paginatedStatistics.byYears;

  return useQuery<PaginatedStatisticsResponse>({
    queryKey: ['analytics', 'legacy', 'paginatedStatistics', params.groupBy, params.from, params.to, params.page, params.limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedStatisticsResponse>(endpoint, {
        params: {
          from: params.from,
          to: params.to,
          page: params.page,
          limit: params.limit,
        },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// TIME-SERIES METRICS (19 hooks with groupBy routing)
// ============================================

/**
 * Helper function to get endpoint based on groupBy and endpoint group
 * @param endpointGroup - The nested endpoint object (e.g., api.analytics.legacy.wishlistFrequency)
 * @param groupBy - The time period grouping
 */
const getTimeSeriesEndpoint = (
  endpointGroup: { byDays: string; byMonths: string; byYears: string },
  groupBy: 'days' | 'weeks' | 'months' | 'years'
): string => {
  // Note: 'weeks' isn't directly supported by most legacy endpoints, default to 'days'
  if (groupBy === 'days' || groupBy === 'weeks') {
    return endpointGroup.byDays;
  } else if (groupBy === 'months') {
    return endpointGroup.byMonths;
  } else {
    return endpointGroup.byYears;
  }
};

/**
 * Wishlist Frequency Hook
 * Routes to: /wishlist-frequency-{days|months|years}
 */
export const useWishlistFrequency = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.wishlistFrequency, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'wishlistFrequency', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Orders Time-Series Hook
 * Routes to: /orders-{days|months|years}
 */
export const useOrdersTimeSeries = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.orders, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'ordersTimeSeries', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Orders Cancelled Time-Series Hook
 * Routes to: /order-cancelled-{days|months|years}
 */
export const useOrdersCancelled = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.ordersCancelled, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'ordersCancelled', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Shipments Delivered Time-Series Hook
 * Routes to: /shipments-delivered-{days|months|years}
 */
export const useShipmentsDelivered = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.shipmentsDelivered, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'shipmentsDelivered', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Orders Returned Time-Series Hook
 * Routes to: /order-returned-{days|months|years}
 */
export const useOrdersReturned = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.ordersReturned, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'ordersReturned', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Orders Failed Time-Series Hook
 * Routes to: /order-failed-{days|months|years}
 */
export const useOrdersFailed = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.ordersFailed, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'ordersFailed', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Shipments In Warehouse Time-Series Hook
 * Routes to: /shipments-in-warehouse-{days|months|years}
 */
export const useShipmentsInWarehouse = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.shipmentsInWarehouse, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'shipmentsInWarehouse', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Transactions Time-Series Hook
 * Routes to: /transactions-{days|months|years}
 */
export const useTransactionsTimeSeries = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.transactions, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'transactionsTimeSeries', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Total Transactions Time-Series Hook
 * Routes to: /total-transactions-{days|months|years}
 */
export const useTotalTransactionsTimeSeries = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.totalTransactions, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'totalTransactionsTimeSeries', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * User Joining Rate Time-Series Hook
 * Routes to: /user-joining-rate-{days|months|years}
 */
export const useUserJoiningRate = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.userJoiningRate, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'userJoiningRate', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Coupon Redemption Time-Series Hook
 * Routes to: /coupon-redemption-{days|months|years}
 */
export const useCouponRedemptionTimeSeries = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.couponRedemption, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'couponRedemptionTimeSeries', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Reviews Time-Series Hook
 * Routes to: /reviews-{days|months|years}
 */
export const useReviewsTimeSeries = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.reviews, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'reviewsTimeSeries', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Review Rate Time-Series Hook
 * Routes to: /review-rate-{days|months|years}
 */
export const useReviewRate = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.reviewRate, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'reviewRate', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Review Mood Time-Series Hook
 * Routes to: /review-mood-{days|months|years}
 */
export const useReviewMood = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.reviewMood, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'reviewMood', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Revenue Time-Series Hook
 * Routes to: /revenue-{days|months|years}
 */
export const useRevenueTimeSeries = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.revenue, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'revenueTimeSeries', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Products Added Time-Series Hook
 * Routes to: /products-added-{days|months|years}
 */
export const useProductsAdded = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.productsAdded, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'productsAdded', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Current Carts Time-Series Hook
 * Routes to: /current-carts-{days|months|years}
 */
export const useCurrentCarts = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.currentCarts, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'currentCarts', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Sales Time-Series Hook
 * Routes to: /sales-{days|months|years}
 */
export const useSalesTimeSeries = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.sales, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'salesTimeSeries', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Sales Discount Total Time-Series Hook
 * Routes to: /sales-discount-total-{days|months|years}
 */
export const useSalesDiscountTotal = (params: LegacyTimeSeriesParams) => {
  const endpoint = getTimeSeriesEndpoint(api.analytics.legacy.salesDiscountTotal, params.groupBy);

  return useQuery<LegacyTimeSeriesResponse>({
    queryKey: ['analytics', 'legacy', 'salesDiscountTotal', params.groupBy, params.from, params.to],
    queryFn: async () => {
      const response = await apiClient.get<LegacyTimeSeriesResponse>(endpoint, {
        params: { from: params.from, to: params.to },
      });
      if (!response.data) {
        throw new Error('No data returned');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
