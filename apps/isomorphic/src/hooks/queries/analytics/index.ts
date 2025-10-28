/**
 * Analytics Hooks Barrel Export
 * 
 * Centralized export for all analytics-related React Query hooks and types.
 * Import from this file for convenient access to analytics hooks.
 * 
 * @example
 * import { useSalesOverview, useRevenueExpenseChart } from '@/hooks/queries/analytics';
 */

// Overview hooks (7)
export {
  useSalesOverview,
  useOrdersOverview,
  useTransactionsOverview,
  useUsersOverview,
  useProductsOverview,
  useReviewsOverview,
  useCouponsOverview,
} from './useAnalyticsOverview';

// Chart hooks (14)
export {
  useRevenueExpenseChart,
  useOrdersTrend,
  useTransactionsTrend,
  useCustomerAcquisition,
  useOrderStatusDistribution,
  useTransactionStatusDistribution,
  useRatingDistribution,
  useReviewSentiment,
  useCouponRedemptionTrend,
  usePaymentMethods,
  useTopProductsRevenue,
  useCategoriesPerformance,
  useUserDemographics,
  useCouponTypeDistribution,
} from './useAnalyticsCharts';

// Table hooks (10)
export {
  useSalesByCategory,
  useTopSellingProducts,
  useOrdersTable,
  useTransactionsTable,
  useTopCustomers,
  useProductPerformance,
  useReviewsTable,
  useTopCoupons,
  useMostWishlistedProducts,
  useMostReviewedProducts,
} from './useAnalyticsTables';

// Legacy Analytics hooks (25 total: 5 standalone + 1 paginated + 19 time-series)
export {
  // Standalone hooks (5)
  useSellerStatistics,
  useTotalSales,
  useChartData,
  useOrderVsReturns,
  useRangeCount,
  // Paginated statistics (1)
  usePaginatedStatistics,
  // Time-series hooks (19)
  useWishlistFrequency,
  useOrdersTimeSeries,
  useOrdersCancelled,
  useShipmentsDelivered,
  useOrdersReturned,
  useOrdersFailed,
  useShipmentsInWarehouse,
  useTransactionsTimeSeries,
  useTotalTransactionsTimeSeries,
  useUserJoiningRate,
  useCouponRedemptionTimeSeries,
  useReviewsTimeSeries,
  useReviewRate,
  useReviewMood,
  useRevenueTimeSeries,
  useProductsAdded,
  useCurrentCarts,
  useSalesTimeSeries,
  useSalesDiscountTotal,
} from './useAnalyticsLegacy';

// Type exports
export type {
  // Overview types
  SalesOverviewResponse,
  OrdersOverviewResponse,
  TransactionsOverviewResponse,
  UsersOverviewResponse,
  ProductsOverviewResponse,
  ReviewsOverviewResponse,
  CouponsOverviewResponse,
  // Chart types
  RevenueExpenseChartData,
  OrdersTrendData,
  TransactionsTrendData,
  CustomerAcquisitionData,
  OrderStatusDistributionData,
  TransactionStatusDistributionData,
  RatingDistributionData,
  ReviewSentimentData,
  CouponRedemptionTrendData,
  PaymentMethodsData,
  TopProductsRevenueData,
  CategoriesPerformanceData,
  UserDemographicsData,
  CouponTypeDistributionData,
  // Table types
  SalesByCategoryRow,
  SalesByCategoryResponse,
  TopSellingProductRow,
  OrderTableRow,
  OrdersTableResponse,
  TransactionTableRow,
  TransactionsTableResponse,
  TopCustomerRow,
  TopCustomersResponse,
  ProductPerformanceRow,
  ProductPerformanceResponse,
  ReviewTableRow,
  ReviewsTableResponse,
  TopCouponRow,
  TopCouponsResponse,
  MostWishlistedProductRow,
  MostReviewedProductRow,
  // Parameter types
  DateRangeParams,
  ChartParams,
  TableParams,
  OrdersTableParams,
  TransactionsTableParams,
  ReviewsTableParams,
  ProductPerformanceParams,
  TopItemsParams,
  PaginationMeta,
  // Legacy types
  SellerStatisticsResponse,
  TotalSalesResponse,
  ChartDataResponse,
  ChartDataParams,
  OrderVsReturnsResponse,
  RangeCountResponse,
  PaginatedStatisticsResponse,
  PaginatedStatisticsParams,
  LegacyTimeSeriesResponse,
  LegacyTimeSeriesParams,
  LegacyTimeSeriesDataPoint,
} from '@/types/analytics.types';
