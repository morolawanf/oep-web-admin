/**
 * Legacy Analytics Client Component
 * 
 * Demonstrates usage of legacy analytics hooks with TimeSeriesChart component.
 * Shows:
 * - Standalone endpoints (Seller Statistics, Total Sales, Order vs Returns)
 * - Time-series charts with groupBy toggle (Wishlist Frequency, Revenue, Orders)
 * - Dynamic date range selection
 */

'use client';

import { useState } from 'react';
import PageHeader from '@/app/shared/page-header';
import { DatePicker } from '@core/ui/datepicker';
import { Text, Title } from 'rizzui';
import WidgetCard from '@core/components/cards/widget-card';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import {
  useSellerStatistics,
  useTotalSales,
  useOrderVsReturns,
  useWishlistFrequency,
  useRevenueTimeSeries,
  useOrdersTimeSeries,
  useUserJoiningRate,
  useCouponRedemptionTimeSeries,
} from '@/hooks/queries/analytics';
import { formatNumber } from '@core/utils/format-number';

type GroupByPeriod = 'days' | 'weeks' | 'months' | 'years';

const pageHeader = {
  title: 'Legacy Analytics',
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
      name: 'Legacy',
    },
  ],
};

export default function LegacyAnalyticsClient() {
  // Date range state (default: last 30 days)
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  // GroupBy states for each time-series chart
  const [wishlistGroupBy, setWishlistGroupBy] = useState<GroupByPeriod>('months');
  const [revenueGroupBy, setRevenueGroupBy] = useState<GroupByPeriod>('months');
  const [ordersGroupBy, setOrdersGroupBy] = useState<GroupByPeriod>('months');
  const [usersGroupBy, setUsersGroupBy] = useState<GroupByPeriod>('months');
  const [couponsGroupBy, setCouponsGroupBy] = useState<GroupByPeriod>('months');

  // Format dates for API
  const dateParams = {
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  };

  // Standalone endpoints hooks
  const { data: sellerStats, isLoading: loadingSellerStats } = useSellerStatistics(dateParams);
  const { data: totalSales, isLoading: loadingTotalSales } = useTotalSales(dateParams);
  const { data: orderVsReturns, isLoading: loadingOrderVsReturns } = useOrderVsReturns(dateParams);

  // Time-series hooks
  const { data: wishlistData, isLoading: loadingWishlist } = useWishlistFrequency({
    ...dateParams,
    groupBy: wishlistGroupBy,
  });
  const { data: revenueData, isLoading: loadingRevenue } = useRevenueTimeSeries({
    ...dateParams,
    groupBy: revenueGroupBy,
  });
  const { data: ordersData, isLoading: loadingOrders } = useOrdersTimeSeries({
    ...dateParams,
    groupBy: ordersGroupBy,
  });
  const { data: usersData, isLoading: loadingUsers } = useUserJoiningRate({
    ...dateParams,
    groupBy: usersGroupBy,
  });
  const { data: couponsData, isLoading: loadingCoupons } = useCouponRedemptionTimeSeries({
    ...dateParams,
    groupBy: couponsGroupBy,
  });

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      {/* Date Range Selector */}
      <div className="mb-6 flex gap-4 items-center">
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

      {/* Standalone Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 @container md:grid-cols-2 lg:grid-cols-3">
        {/* Seller Statistics */}
        <WidgetCard title="Seller Statistics" className="@container">
          {loadingSellerStats ? (
            <div className="flex h-32 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : sellerStats ? (
            <div className="mt-4 space-y-3">
              <div>
                <Text className="text-sm text-gray-600">Revenue</Text>
                <Title className="text-2xl font-semibold text-green-600">
                  ₦{formatNumber(sellerStats.revenue)}
                </Title>
              </div>
              <div>
                <Text className="text-sm text-gray-600">Profit</Text>
                <Title className="text-2xl font-semibold text-blue-600">
                  ₦{formatNumber(sellerStats.profit)}
                </Title>
              </div>
              <div>
                <Text className="text-sm text-gray-600">Profit Margin</Text>
                <Title className="text-xl font-semibold">
                  {sellerStats.revenue > 0
                    ? ((sellerStats.profit / sellerStats.revenue) * 100).toFixed(2)
                    : 0}
                  %
                </Title>
              </div>
            </div>
          ) : (
            <Text className="text-gray-500">No data available</Text>
          )}
        </WidgetCard>

        {/* Total Sales */}
        <WidgetCard title="Total Sales" className="@container">
          {loadingTotalSales ? (
            <div className="flex h-32 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : totalSales ? (
            <div className="mt-4 space-y-3">
              <div>
                <Text className="text-sm text-gray-600">Revenue</Text>
                <Title className="text-2xl font-semibold text-green-600">
                  ₦{formatNumber(totalSales.revenue)}
                </Title>
              </div>
              <div>
                <Text className="text-sm text-gray-600">Profit</Text>
                <Title className="text-2xl font-semibold text-blue-600">
                  ₦{formatNumber(totalSales.profit)}
                </Title>
              </div>
              {totalSales.sales && (
                <div>
                  <Text className="text-sm text-gray-600">Sales Count</Text>
                  <Title className="text-xl font-semibold">
                    {formatNumber(totalSales.sales)}
                  </Title>
                </div>
              )}
            </div>
          ) : (
            <Text className="text-gray-500">No data available</Text>
          )}
        </WidgetCard>

        {/* Order vs Returns */}
        <WidgetCard title="Order vs Returns" className="@container">
          {loadingOrderVsReturns ? (
            <div className="flex h-32 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : orderVsReturns ? (
            <div className="mt-4 space-y-3">
              <div>
                <Text className="text-sm text-gray-600">Orders</Text>
                <Title className="text-2xl font-semibold text-green-600">
                  {formatNumber(orderVsReturns.orders)}
                </Title>
              </div>
              <div>
                <Text className="text-sm text-gray-600">Returns</Text>
                <Title className="text-2xl font-semibold text-red-600">
                  {formatNumber(orderVsReturns.returns)}
                </Title>
              </div>
              <div>
                <Text className="text-sm text-gray-600">Return Rate</Text>
                <Title className="text-xl font-semibold">
                  {orderVsReturns.returnRate.toFixed(2)}%
                </Title>
              </div>
            </div>
          ) : (
            <Text className="text-gray-500">No data available</Text>
          )}
        </WidgetCard>
      </div>

      {/* Time-Series Charts */}
      <div className="grid grid-cols-1 gap-6 @container">
        {/* Wishlist Frequency Chart */}
        <TimeSeriesChart
          title="Wishlist Frequency"
          description="Track product wishlist additions over time"
          data={wishlistData?.data || []}
          isLoading={loadingWishlist}
          groupBy={wishlistGroupBy}
          onGroupByChange={setWishlistGroupBy}
          dataKey="count"
          color="#ec4899"
          height={320}
        />

        {/* Revenue Chart */}
        <TimeSeriesChart
          title="Revenue Trend"
          description="Total revenue over time"
          data={revenueData?.data || []}
          isLoading={loadingRevenue}
          groupBy={revenueGroupBy}
          onGroupByChange={setRevenueGroupBy}
          dataKey="totalRevenue"
          yAxisFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
          tooltipFormatter={(value) => `₦${formatNumber(value)}`}
          color="#10b981"
          height={400}
        />

        {/* Orders Chart */}
        <TimeSeriesChart
          title="Orders Trend"
          description="Order volume over time"
          data={ordersData?.data || []}
          isLoading={loadingOrders}
          groupBy={ordersGroupBy}
          onGroupByChange={setOrdersGroupBy}
          dataKey="count"
          color="#3b82f6"
          height={320}
        />

        {/* User Joining Rate Chart */}
        <TimeSeriesChart
          title="User Acquisition"
          description="New user registrations over time"
          data={usersData?.data || []}
          isLoading={loadingUsers}
          groupBy={usersGroupBy}
          onGroupByChange={setUsersGroupBy}
          dataKey="count"
          color="#8b5cf6"
          height={320}
        />

        {/* Coupon Redemption Chart */}
        <TimeSeriesChart
          title="Coupon Redemptions"
          description="Coupon usage trend over time"
          data={couponsData?.data || []}
          isLoading={loadingCoupons}
          groupBy={couponsGroupBy}
          onGroupByChange={setCouponsGroupBy}
          dataKey="count"
          color="#f59e0b"
          height={320}
        />
      </div>
    </>
  );
}
