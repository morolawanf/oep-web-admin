/**
 * Products Analytics Client Component
 *
 * Displays comprehensive product analytics including:
 * - Overview metrics (total products, stock status)
 * - Top products by revenue
 * - Category performance comparison
 * - Product performance table
 * - Most wishlisted and reviewed products
 */

'use client';

import { useState } from 'react';
import PageHeader from '@/app/shared/page-header';
import { DatePicker } from '@core/ui/datepicker';
import { Text } from 'rizzui';
import {
  useProductsOverview,
  useTopProductsRevenue,
  useCategoriesPerformance,
  useProductPerformance,
  useMostWishlistedProducts,
  useMostReviewedProducts,
} from '@/hooks/queries/analytics';
import ProductsOverviewCards from './components/products-overview-cards';
import TopProductsRevenueChart from './components/top-products-revenue-chart';
import CategoriesPerformanceChart from './components/categories-performance-chart';
import ProductPerformanceTable from './components/product-performance-table';
import WishlistedReviewedProducts from './components/wishlisted-reviewed-products';

const pageHeader = {
  title: 'Products Analytics',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/analytics',
      name: 'Analytics',
    },
    {
      name: 'Products',
    },
  ],
};

export default function ProductsAnalyticsClient() {
  // Date range state (default: last 30 days)
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Table pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');

  // Format dates for API
  const dateParams = {
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  };

  // Fetch data
  const { data: overview, isLoading: loadingOverview } =
    useProductsOverview(dateParams);
  const { data: topProducts, isLoading: loadingTopProducts } =
    useTopProductsRevenue({
      ...dateParams,
      limit: 10,
    });
  const { data: categories, isLoading: loadingCategories } =
    useCategoriesPerformance(dateParams);
  const { data: performance, isLoading: loadingPerformance } =
    useProductPerformance({
      page,
      limit,
      search,
    });
  const { data: wishlisted, isLoading: loadingWishlisted } =
    useMostWishlistedProducts({
      ...dateParams,
      limit: 10,
    });
  const { data: reviewed, isLoading: loadingReviewed } =
    useMostReviewedProducts({
      ...dateParams,
      limit: 10,
    });

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      {/* Overview Cards */}
      <div className="mb-6">
        <ProductsOverviewCards data={overview} isLoading={loadingOverview} />
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 flex items-center gap-4">
        <div>
          <Text className="mb-1 text-sm font-medium">From</Text>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => date && setStartDate(date)}
            placeholderText="Select start date"
            dateFormat="MMM dd, yyyy"
            className="w-full"
          />
        </div>
        <div>
          <Text className="mb-1 text-sm font-medium">To</Text>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => date && setEndDate(date)}
            placeholderText="Select end date"
            dateFormat="MMM dd, yyyy"
            minDate={startDate}
            className="w-full"
          />
        </div>
      </div>
      {/* Charts Section */}
      <div className="mb-6 grid grid-cols-1 gap-6 @container">
        <TopProductsRevenueChart
          data={topProducts || []}
          isLoading={loadingTopProducts}
        />
        <CategoriesPerformanceChart
          data={categories || []}
          isLoading={loadingCategories}
        />
      </div>

      {/* Wishlisted & Reviewed Products */}
      <div className="mb-6">
        <WishlistedReviewedProducts
          wishlistedData={wishlisted || []}
          reviewedData={reviewed || []}
          loadingWishlisted={loadingWishlisted}
          loadingReviewed={loadingReviewed}
        />
      </div>

      {/* Product Performance Table */}
      <ProductPerformanceTable
        data={performance}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onSearchChange={(newSearch: string) => {
          setSearch(newSearch);
          setPage(1); // Reset to first page on search
        }}
        isLoading={loadingPerformance}
      />
    </>
  );
}
