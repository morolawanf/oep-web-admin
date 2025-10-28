/**
 * Transactions Analytics Client Component
 * 
 * Displays comprehensive transaction analytics including:
 * - Overview metrics (total transactions, amounts, status breakdown)
 * - Transaction status distribution over time (bar chart)
 * - Transactions trend chart over time
 * - Payment methods distribution (pie chart)
 * - Detailed transactions table with filters
 */

'use client';

import { useState } from 'react';
import PageHeader from '@/app/shared/page-header';
import { DatePicker } from '@core/ui/datepicker';
import { Text } from 'rizzui';
import {
  useTransactionsOverview,
  useTransactionsTrend,
  useTransactionStatusDistribution,
  usePaymentMethods,
  useTransactionsTable,
} from '@/hooks/queries/analytics';
import TransactionsOverviewCards from './components/transactions-overview-cards';
import TransactionsTrendChart from './components/transactions-trend-chart';
import TransactionStatusBarChart from './components/transaction-status-bar-chart';
import PaymentMethodsPieChart from './components/payment-methods-pie-chart';
import TransactionsDataTable from './components/transactions-data-table';

const pageHeader = {
  title: 'Transactions Analytics',
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
      name: 'Transactions',
    },
  ],
};

export default function TransactionsAnalyticsClient() {
  // Date range state (default: last 30 days)
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [trendGroupBy, setTrendGroupBy] = useState<'days' | 'months' | 'years'>('days');
  const [statusGroupBy, setStatusGroupBy] = useState<'days' | 'months' | 'years'>('months');

  // Table pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // Format dates for API
  const dateParams = {
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  };

  // Fetch overview data
  const { data: overview, isLoading: loadingOverview } = useTransactionsOverview(dateParams);

  // Fetch trend data
  const { data: trendData, isLoading: loadingTrend } = useTransactionsTrend({
    ...dateParams,
    groupBy: trendGroupBy,
  });

  // Fetch transaction status distribution (time-series)
  const { data: statusData, isLoading: loadingStatus } = useTransactionStatusDistribution({
    ...dateParams,
    groupBy: statusGroupBy,
  });

  // Fetch payment methods distribution
  const { data: paymentData, isLoading: loadingPayment } = usePaymentMethods(dateParams);

  // Fetch transactions table data
  const { data: transactionsData, isLoading: loadingTransactions } = useTransactionsTable({
    ...dateParams,
    page,
    limit,
    status: statusFilter === 'all' ? undefined : statusFilter,
    method: methodFilter === 'all' ? undefined : methodFilter,
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
        <TransactionsOverviewCards data={overview} isLoading={loadingOverview} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-6 @container">
        {/* Transaction Status Distribution - Full Width */}
        <TransactionStatusBarChart
          data={statusData || []}
          isLoading={loadingStatus}
          groupBy={statusGroupBy}
          onGroupByChange={setStatusGroupBy}
        />

        {/* Transactions Trend and Payment Methods - Side by Side */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TransactionsTrendChart
            data={trendData || []}
            isLoading={loadingTrend}
            groupBy={trendGroupBy}
            onGroupByChange={setTrendGroupBy}
          />
          <PaymentMethodsPieChart data={paymentData || []} isLoading={loadingPayment} />
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsDataTable
        data={transactionsData}
        onPageChange={setPage}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onStatusFilter={(status: string) => {
          setStatusFilter(status);
          setPage(1);
        }}
        onMethodFilter={(method: string) => {
          setMethodFilter(method);
          setPage(1);
        }}
        selectedStatus={statusFilter}
        selectedMethod={methodFilter}
        isLoading={loadingTransactions}
      />
    </>
  );
}
