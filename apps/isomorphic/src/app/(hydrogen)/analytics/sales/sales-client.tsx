'use client';

import { useState } from 'react';
import cn from '@core/utils/class-names';
import { DatePicker } from '@core/ui/datepicker';
import { Title } from 'rizzui';
import {
  useSalesOverview,
  useRevenueExpenseChart,
  useSalesByCategory,
  useTopProductsRevenue,
} from '@/hooks/queries/analytics';
import SalesOverviewCards from './components/sales-overview-cards';
import RevenueExpenseChart from './components/revenue-expense-chart';
import SalesByCategoryTable from './components/sales-by-category-table';
import TopProductsChart from './components/top-products-chart';

export default function SalesAnalytics({ className }: { className?: string }) {
  // Date range state (default: last 30 days)
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Convert dates to ISO strings for API
  const dateParams = {
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  };

  // Fetch data using React Query hooks
  const { data: overview, isLoading: overviewLoading } =
    useSalesOverview(dateParams);
  const { data: revenueExpenseData, isLoading: chartLoading } =
    useRevenueExpenseChart({
      ...dateParams,
      groupBy: 'months',
    });
  const { data: salesByCategory, isLoading: categoryLoading } =
    useSalesByCategory({
      ...dateParams,
      page: 1,
      limit: 10,
    });
  const { data: topProducts, isLoading: productsLoading } =
    useTopProductsRevenue({
      ...dateParams,
      limit: 10,
    });

  return (
    <div
      className={cn(
        'flex flex-col gap-5 @container 2xl:gap-x-6 2xl:gap-y-7 3xl:gap-8',
        className
      )}
    >
      {/* Page Header with Date Range Filter */}
      <div className="flex flex-col gap-4 @xl:flex-row @xl:items-center @xl:justify-between">
        <div>
          <Title as="h3" className="text-xl font-semibold">
            Sales Analytics
          </Title>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive sales performance metrics and insights
          </p>
        </div>

        <div className="flex gap-3">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => date && setStartDate(date)}
            placeholderText="Start Date"
            inputProps={{
              clearable: true,
              placeholder: 'Start Date',
            }}
            maxDate={endDate}
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => date && setEndDate(date)}
            placeholderText="End Date"
            inputProps={{
              clearable: true,
              placeholder: 'End Date',
            }}
            minDate={startDate}
            maxDate={new Date()}
          />
        </div>
      </div>

      {/* Sales Overview Cards */}
      <SalesOverviewCards data={overview} isLoading={overviewLoading} />

      {/* Revenue vs Expense Chart */}
      <RevenueExpenseChart
        data={revenueExpenseData || []}
        isLoading={chartLoading}
      />

      {/* Two-Column Grid: Sales by Category Table + Top Products Chart */}
      <div className="grid grid-cols-1 gap-5">
        <SalesByCategoryTable
          data={salesByCategory}
          isLoading={categoryLoading}
        />
        <TopProductsChart
          data={topProducts || []}
          isLoading={productsLoading}
        />
      </div>
    </div>
  );
}
