/**
 * Coupons Analytics Client Component
 * 
 * Displays comprehensive coupon analytics including:
 * - Overview metrics (total coupons, active, redemptions, discounts)
 * - Coupon redemption trend over time
 * - Coupon type distribution (percentage vs fixed)
 * - Top performing coupons table
 */

'use client';

import { useState } from 'react';
import PageHeader from '@/app/shared/page-header';
import { DatePicker } from '@core/ui/datepicker';
import { Text } from 'rizzui';
import {
  useCouponsOverview,
  useCouponRedemptionTrend,
  useCouponTypeDistribution,
  useTopCoupons,
} from '@/hooks/queries/analytics';
import CouponsOverviewCards from './components/coupons-overview-cards';
import CouponRedemptionTrendChart from './components/coupon-redemption-trend-chart';
import CouponTypeDistributionChart from './components/coupon-type-distribution-chart';
import TopCouponsTable from './components/top-coupons-table';

const pageHeader = {
  title: 'Coupons Analytics',
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
      name: 'Coupons',
    },
  ],
};

export default function CouponsAnalyticsClient() {
  // Date range state (default: last 30 days)
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [groupBy, setGroupBy] = useState<'days' | 'months' | 'years'>('days');

  // Table pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Format dates for API
  const dateParams = {
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  };

  // Fetch data
  const { data: overview, isLoading: loadingOverview } = useCouponsOverview(dateParams);
  const { data: redemptionTrend, isLoading: loadingTrend } = useCouponRedemptionTrend({
    ...dateParams,
    groupBy,
  });
  const { data: typeDistribution, isLoading: loadingDistribution } = useCouponTypeDistribution(dateParams);
  const { data: topCoupons, isLoading: loadingTopCoupons } = useTopCoupons({
    ...dateParams,
    page,
    limit,
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

      {/* Overview Cards */}
      <div className="mb-6">
        <CouponsOverviewCards data={overview} isLoading={loadingOverview} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-6 @container lg:grid-cols-2">
        <CouponRedemptionTrendChart
          data={redemptionTrend || []}
          isLoading={loadingTrend}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
        />
        <CouponTypeDistributionChart
          data={typeDistribution || []}
          isLoading={loadingDistribution}
        />
      </div>

      {/* Top Coupons Table */}
      <TopCouponsTable
        data={topCoupons}
        onPageChange={setPage}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        isLoading={loadingTopCoupons}
      />
    </>
  );
}
