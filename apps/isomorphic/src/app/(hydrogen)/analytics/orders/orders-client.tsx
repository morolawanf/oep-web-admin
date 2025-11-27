/**
 * Orders Analytics Client Component
 *
 * Displays comprehensive order analytics including:
 * - Overview metrics (total orders, statuses breakdown)
 * - Orders trend chart over time
 * - Order status distribution (pie chart)
 * - Detailed orders table with filters
 */

'use client';

import { useState } from 'react';
import PageHeader from '@/app/shared/page-header';
import { DatePicker } from '@core/ui/datepicker';
import { Text } from 'rizzui';
import {
  useOrdersOverview,
  useOrdersTrend,
  useOrderStatusDistribution,
  useOrdersTable,
} from '@/hooks/queries/analytics';
import OrdersOverviewCards from './components/orders-overview-cards';
import OrdersTrendChart from './components/orders-trend-chart';
import OrderStatusPieChart from './components/order-status-pie-chart';
import OrdersDataTable from './components/orders-data-table';

const pageHeader = {
  title: 'Orders Analytics',
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
      name: 'Orders',
    },
  ],
};

export default function OrdersAnalyticsClient() {
  // Date range state (default: last 30 days)
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [groupBy, setGroupBy] = useState<'days' | 'months' | 'years'>('days');

  // Table pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>('');

  // Format dates for API
  const dateParams = {
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  };

  // Fetch overview data
  const { data: overview, isLoading: loadingOverview } =
    useOrdersOverview(dateParams);

  // Fetch trend data
  const { data: trendData, isLoading: loadingTrend } = useOrdersTrend({
    ...dateParams,
    groupBy,
  });

  // Fetch status distribution
  const { data: statusData, isLoading: loadingStatus } =
    useOrderStatusDistribution(dateParams);

  // Fetch orders table data
  const { data: ordersData, isLoading: loadingOrders } = useOrdersTable({
    ...dateParams,
    page,
    limit,
    status: statusFilter === '' ? 'all' : statusFilter,
  });

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

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

      {/* Overview Cards */}
      <div className="mb-6">
        <OrdersOverviewCards data={overview} isLoading={loadingOverview} />
      </div>

      {/* Charts Section */}
      <div className="mb-6 grid grid-cols-1 gap-6 @container lg:grid-cols-2">
        <OrdersTrendChart
          data={trendData || []}
          isLoading={loadingTrend}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
        />
        <OrderStatusPieChart
          data={statusData || []}
          isLoading={loadingStatus}
        />
      </div>

      {/* Orders Table */}
      <OrdersDataTable
        data={ordersData}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1); // Reset to first page when changing limit
        }}
        onStatusFilter={(status?: string) => {
          setStatusFilter(status);
          setPage(1); // Reset to first page when filtering
        }}
        selectedStatus={statusFilter}
        isLoading={loadingOrders}
      />
    </>
  );
}
